<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { projectService, listService, api } from "../api";

  export let id;

  let project = null;
  let loading = true;
  let error = null;
  let user = null;
  let showAddListForm = false;
  let newList = {
    title: "",
    status: "todo",
    upload_lampiran: null,
  };
  let showInviteForm = false;
  let inviteEmail = "";
  let inviteError = "";

  let showEditForm = false;
  let editProjectData = {
    name: "",
    description: "",
    deadline: "",
  };
  let editError = ""; // Store lists dengan detail lengkap dari getListById

  let listsDetail = [];

  onMount(async () => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    user = JSON.parse(userData);

    await fetchProject();
  });

  async function fetchProject() {
    try {
      const response = await projectService.getProjectById(id);

      if (response.data.success) {
        project = response.data.data; // Fetch detail setiap list menggunakan getListById

        await fetchAllListsDetail();
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      error = err.response?.data?.message || "Failed to fetch project";
    } finally {
      loading = false;
    }
  } // Function untuk fetch semua list detail

  async function fetchAllListsDetail() {
    if (!project?.lists || project.lists.length === 0) {
      listsDetail = [];
      return;
    }

    try {
      // Fetch semua list secara parallel
      const listPromises = project.lists.map((list) =>
        listService.getListById(list.id)
      );

      const responses = await Promise.all(listPromises);

      listsDetail = responses
        .filter((res) => res.data.success)
        .map((res) => res.data.data)
        .sort((a, b) => a.id - b.id); // Sorting by id for stable view
    } catch (err) {
      console.error("Error fetching lists detail:", err); // Fallback ke data dari project jika gagal
      listsDetail = project.lists || [];
    }
  } // Menggunakan listService.createList

  async function createList() {
    if (!newList.title) return;

    try {
      const formData = new FormData();
      formData.append("title", newList.title);
      formData.append("status", newList.status);
      if (newList.upload_lampiran) {
        formData.append("upload_lampiran", newList.upload_lampiran);
      }

      const response = await listService.createList(id, formData);

      if (response.data.success) {
        showAddListForm = false;
        newList = { title: "", status: "todo" };
        await fetchProject(); // Refresh the project data
      }
    } catch (err) {
      console.error("Error creating list:", err);
      error = err.response?.data?.message || "Failed to create list";
    }
  } // Menggunakan listService.inviteUserToProject

  async function inviteUser() {
    inviteError = "";
    if (!inviteEmail) return;

    try {
      // First, find the user by email (asumsi: endpoint /users ada)
      const usersResponse = await api.get("/users");

      const userToInvite = usersResponse.data.data.find(
        (u) => u.email === inviteEmail
      );
      if (!userToInvite) {
        inviteError = "User with this email does not exist";
        return;
      } // Menggunakan listService.inviteUserToProject

      const response = await listService.inviteUserToProject(id, {
        userId: userToInvite.id,
      });

      if (response.data.success) {
        showInviteForm = false;
        inviteEmail = "";
        await fetchProject(); // Refresh the project data
      }
    } catch (err) {
      console.error("Error inviting user:", err);
      inviteError = err.response?.data?.message || "Failed to invite user";
    }
  } // Menggunakan listService.removeUserFromProject

  async function removeUser(userId) {
    if (userId === project.created_by) {
      alert("Project creator cannot be removed.");
      return;
    }
    try {
      const res = await listService.removeUserFromProject(id, userId);

      if (res.data.success) {
        await fetchProject(); // refresh list
      }
    } catch (err) {
      console.error(err);
      error = err.response?.data?.message || "Failed to remove user";
    }
  }

  function formatDate(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    try {
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch (e) {
      return "N/A";
    }
  }

  function openEditForm() {
    editError = "";
    if (!project) return;
    editProjectData = {
      name: project.name,
      description: project.description,
      deadline: project.deadline?.split("T")[0] || "",
    };
    showEditForm = true;
  } // Menggunakan projectService.updateProject

  async function updateProject() {
    editError = "";
    try {
      const response = await projectService.updateProject(id, {
        name: editProjectData.name,
        description: editProjectData.description,
        deadline: editProjectData.deadline,
      });

      if (response.data.success) {
        showEditForm = false;
        await fetchProject(); // refresh
      }
    } catch (err) {
      console.error("Error updating project:", err);
      editError = err.response?.data?.message || "Failed to update project";
    }
  } // Menggunakan listService.claimList
  async function claimList(listId) {
    try {
      const response = await listService.claimList(listId);

      if (response.data.success) {
        await fetchProject(); // Refresh the project data
      }
    } catch (err) {
      console.error("Error claiming list:", err);
      error = err.response?.data?.message || "Failed to claim task";
    }
  } // Menggunakan listService.updateListStatus

  async function updateListStatus(listId, status) {
    try {
      const response = await listService.updateListStatus(listId, {
        status,
      });

      if (response.data.success) {
        await fetchProject(); // Refresh the project data
      }
    } catch (err) {
      console.error("Error updating list status:", err);
      error = err.response?.data?.message || "Failed to update task status";
    }
  }
</script>

<!-- Main container: Dark Mode background, Monospace font, Padding top/bottom disesuaikan dengan Navbar dan Footer -->
<div
  class="min-h-screen bg-gray-900 text-white font-mono pt-20 pb-16 px-4 sm:px-8 lg:px-12"
>
  {#if loading}
    <div class="text-center py-20 text-gray-400 text-xl">
      LOADING PROJECT DATA...
    </div>
  {:else if error}
    <div
      class="text-center py-16 bg-red-800 border-2 border-red-500 text-white shadow-xl mx-auto max-w-lg mt-10"
    >
      <p class="font-bold uppercase mb-2">ERROR RETRIEVING PROJECT</p>
      <p class="text-sm">{error}</p>
    </div>
  {:else if project}
    <div class="max-w-7xl mx-auto">
      <!-- Project Header -->
      <div
        class="flex justify-between items-start mb-6 pt-4 border-b border-gray-700 pb-3"
      >
        <div class="max-w-4xl">
          <h2
            class="text-4xl font-extrabold text-white mb-1 uppercase tracking-widest border-l-4 border-orange-500 pl-4"
          >
            {project.name}
          </h2>
          <p class="text-gray-400 text-sm pl-5">{project.description}</p>
        </div>
        <div class="flex gap-3 mt-1">
          {#if user?.role === "admin" || project.created_by == user?.id}
            <button
              class="px-4 py-2 text-xs font-bold uppercase bg-gray-700 text-gray-300 hover:bg-gray-600 transition duration-150"
              on:click={openEditForm}
            >
              EDIT PROJECT
            </button>
          {/if}
          <button
            class="px-4 py-2 text-xs font-bold uppercase border border-white text-white hover:border-orange-500 hover:text-orange-500 transition duration-150"
            on:click={() => navigate("/projects")}
          >
            BACK TO INDEX
          </button>
        </div>
      </div>

      <!-- Project Info & Edit Form Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Project Info Card (1/3 width on large screens) -->
        <div
          class="lg:col-span-1 p-5 bg-gray-800 border-t-2 border-orange-500 shadow-xl"
        >
          <h3 class="text-xl font-bold mb-3 uppercase text-orange-500">
            Metadata
          </h3>
          <div class="text-sm text-gray-400 space-y-2">
            <div class="flex justify-between border-b border-gray-700 pb-1">
              <strong>DEADLINE:</strong>
              <span class="text-white">{formatDate(project.deadline)}</span>
            </div>
            <div class="flex justify-between">
              <strong>CREATED BY:</strong>
              <span class="text-white">
                {project.members.find((m) => m.id === project.created_by)
                  ?.name || "SYSTEM"}
              </span>
            </div>
          </div>
        </div>

        <!-- Edit Project Form (2/3 width on large screens) -->
        {#if showEditForm}
          <div
            class="lg:col-span-2 p-5 bg-gray-800 border-t-2 border-white shadow-xl"
          >
            <h3 class="text-xl font-bold mb-4 uppercase text-white">
              UPDATE PROJECT DETAILS
            </h3>

            {#if editError}
              <div
                class="bg-red-700 text-white p-2 mb-4 text-center text-sm border-2 border-red-500 shadow-lg"
              >
                {editError}
              </div>
            {/if}
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <input
                type="text"
                bind:value={editProjectData.name}
                placeholder="Project Name"
                class="col-span-2 p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150"
              />
              <input
                type="date"
                bind:value={editProjectData.deadline}
                class="p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150"
              />
              <button
                class="p-3 text-sm font-bold uppercase bg-orange-600 text-gray-900 hover:bg-orange-500 transition duration-150"
                on:click={updateProject}>SAVE CHANGES</button
              >
            </div>
            <textarea
              bind:value={editProjectData.description}
              placeholder="Project description"
              rows="2"
              class="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150 resize-y"
            ></textarea>
            <button
              class="mt-3 px-4 py-2 text-xs font-bold uppercase border border-gray-500 text-gray-400 hover:bg-gray-700 transition duration-150"
              on:click={() => (showEditForm = false)}
            >
              DISMISS
            </button>
          </div>
        {/if}
      </div>

      <!-- Members Section -->
      <div class="p-5 bg-gray-800 border-t-4 border-white shadow-xl mb-8">
        <h3 class="text-xl font-bold mb-4 uppercase text-white">
          Project Members <span class="text-orange-500"
            >[{project.members.length}]</span
          >
        </h3>
        <div class="flex flex-wrap items-center gap-3 mb-4">
          {#each project.members as member (member.id)}
            <div
              class="flex items-center bg-gray-700 px-3 py-1 text-sm text-gray-300 border border-gray-600"
            >
              <span class="mr-2"
                >{member.name}
                <span class="text-xs text-orange-500"
                  >({member.role.toUpperCase()})</span
                >
              </span>
              {#if (user?.role === "admin" || project.created_by == user?.id) && member.id !== project.created_by}
                <button
                  class="ml-2 text-red-500 hover:text-red-400 font-bold transition duration-150 text-xs"
                  on:click={() => removeUser(member.id)}
                >
                  [X]
                </button>
              {/if}
            </div>
          {/each}
        </div>

        {#if user?.role === "admin" || project.created_by == user?.id}
          {#if !showInviteForm}
            <button
              class="px-4 py-2 text-xs font-bold uppercase border border-orange-500 text-orange-500 hover:bg-orange-900 transition duration-150"
              on:click={() => (showInviteForm = true)}
            >
              INVITE MEMBER
            </button>
          {:else}
            <div
              class="flex gap-3 items-center mt-3 p-3 bg-gray-700 border border-gray-600"
            >
              <input
                type="email"
                bind:value={inviteEmail}
                placeholder="Enter member's email"
                class="flex-1 p-2 bg-gray-600 border border-gray-500 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150"
              />
              <button
                class="px-4 py-2 text-xs font-bold uppercase bg-orange-600 text-gray-900 hover:bg-orange-500 transition duration-150"
                on:click={inviteUser}>INVITE</button
              >
              <button
                class="px-4 py-2 text-xs font-bold uppercase bg-gray-600 text-gray-300 hover:bg-gray-500 transition duration-150"
                on:click={() => {
                  showInviteForm = false;
                  inviteError = "";
                }}>CANCEL</button
              >
            </div>
            {#if inviteError}
              <p class="text-red-500 text-sm mt-2">{inviteError}</p>
            {/if}
          {/if}
        {/if}
      </div>

      <!-- Tasks / Lists Section (Kanban Style) -->
      <div class="p-5 bg-gray-900 shadow-inner">
        <div
          class="flex justify-between items-center mb-6 border-b border-gray-700 pb-3"
        >
          <h3 class="text-2xl font-bold uppercase text-white">Project Tasks</h3>

          {#if user?.role === "admin" || project.created_by == user?.id}
            <button
              class="px-4 py-2 text-xs font-bold uppercase transition duration-150 {showAddListForm
                ? 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600'
                : 'bg-orange-600 text-gray-900 hover:bg-orange-500 shadow-md shadow-orange-500/20'}"
              on:click={() => (showAddListForm = !showAddListForm)}
            >
              {showAddListForm ? "CANCEL TASK INPUT" : "ADD NEW TASK"}
            </button>
          {/if}
        </div>

        <!-- Add List Form -->
        {#if showAddListForm}
          <div class="flex gap-3 mb-6 p-4 bg-gray-800 border-l-4 border-white">
            <input
              type="text"
              bind:value={newList.title}
              placeholder="Task title"
              class="flex-1 p-2 bg-gray-700 border border-gray-600 text-white"
            />

            <input
              type="file"
              on:change={(e) => (newList.upload_lampiran = e.target.files[0])}
              class="p-2 bg-gray-700 border border-gray-600 text-white w-52"
            />

            <select
              bind:value={newList.status}
              class="p-2 bg-gray-700 border border-gray-600 text-white"
            >
              <option value="todo">TO DO</option>
              <option value="in-progress">IN PROGRESS</option>
              <option value="done">DONE</option>
            </select>

            <button
              class="px-4 py-2 text-sm font-bold uppercase bg-orange-600 text-gray-900"
              on:click={createList}>CREATE</button
            >
          </div>
        {/if}

        <!-- Kanban Columns -->
        {#if listsDetail && listsDetail.length > 0}
          <div class="flex gap-4 overflow-x-auto pb-2">
            <!-- Column TO DO -->
            <div
              class="flex-shrink-0 w-80 bg-gray-800 border-t-2 border-gray-500 p-4"
            >
              <h4
                class="text-lg font-bold uppercase mb-4 text-gray-300 border-b border-gray-700 pb-2 flex justify-between items-center"
              >
                TO DO <span
                  class="bg-gray-700 text-orange-500 px-2 rounded text-sm"
                >
                  {listsDetail.filter((l) => l.status === "todo").length}
                </span>
              </h4>
              {#each listsDetail.filter((l) => l.status === "todo") as list (list.id)}
                <div
                  class="bg-gray-700 p-3 mb-3 border-l-4 border-gray-500 shadow-md"
                >
                  <h5 class="text-white font-semibold mb-2">{list.title}</h5>
                  <div class="text-xs text-gray-400 mb-3">
                    ASSIGNED TO: <span class="text-orange-500 font-bold">
                      {list.assigned_to?.name || "UNASSIGNED"}
                    </span>
                  </div>
                  <div class="flex gap-2">
                    {#if !list.assigned_to || !list.assigned_to.id}
                      <button
                        class="px-2 py-1 text-xs uppercase font-bold bg-orange-600 text-gray-900 hover:bg-orange-500 transition duration-150"
                        on:click={() => claimList(list.id)}
                      >
                        CLAIM
                      </button>
                    {/if}

                    {#if list.assigned_to?.id === user?.id || user?.role === "admin"}
                      <button
                        class="px-2 py-1 text-xs uppercase font-bold bg-yellow-600 text-gray-900 hover:bg-yellow-500 transition duration-150"
                        on:click={() =>
                          updateListStatus(list.id, "in-progress")}
                      >
                        START
                      </button>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>

            <!-- Column IN PROGRESS -->
            <div
              class="flex-shrink-0 w-80 bg-gray-800 border-t-2 border-yellow-500 p-4"
            >
              <h4
                class="text-lg font-bold uppercase mb-4 text-yellow-500 border-b border-gray-700 pb-2 flex justify-between items-center"
              >
                IN PROGRESS <span
                  class="bg-gray-700 text-yellow-500 px-2 rounded text-sm"
                >
                  {listsDetail.filter((l) => l.status === "in-progress").length}
                </span>
              </h4>
              {#each listsDetail.filter((l) => l.status === "in-progress") as list (list.id)}
                <div
                  class="bg-gray-700 p-3 mb-3 border-l-4 border-yellow-500 shadow-md"
                >
                  <h5>{list.title}</h5>
                  <div class="text-xs text-gray-400 mb-3">
                    ASSIGNED TO: <span class="text-orange-500 font-bold">
                      {list.assigned_to?.name || "UNASSIGNED"}
                    </span>
                  </div>
                  <div class="flex gap-2">
                    {#if list.assigned_to?.id === user?.id || user?.role === "admin"}
                      <button
                        class="px-2 py-1 text-xs uppercase font-bold bg-green-600 text-gray-900 hover:bg-green-500 transition duration-150"
                        on:click={() => updateListStatus(list.id, "done")}
                      >
                        MARK DONE
                      </button>
                      <button
                        class="px-2 py-1 text-xs uppercase font-bold border border-gray-500 text-gray-400 hover:bg-gray-600 transition duration-150"
                        on:click={() => updateListStatus(list.id, "todo")}
                      >
                        REVERT
                      </button>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>

            <!-- Column DONE -->
            <div
              class="flex-shrink-0 w-80 bg-gray-800 border-t-2 border-green-500 p-4"
            >
              <h4
                class="text-lg font-bold uppercase mb-4 text-green-500 border-b border-gray-700 pb-2 flex justify-between items-center"
              >
                DONE <span
                  class="bg-gray-700 text-green-500 px-2 rounded text-sm"
                >
                  {listsDetail.filter((l) => l.status === "done").length}
                </span>
              </h4>
              {#each listsDetail.filter((l) => l.status === "done") as list (list.id)}
                <div
                  class="bg-gray-700 p-3 mb-3 border-l-4 border-green-500 shadow-md"
                >
                  <h5 class="text-white font-semibold mb-2 line-through">
                    {list.title}
                  </h5>
                  <div class="text-xs text-gray-400 mb-3">
                    ASSIGNED TO: <span class="text-orange-500 font-bold">
                      {list.assigned_to?.name || "SYSTEM"}
                    </span>
                  </div>
                  <div class="list-actions">
                    {#if list.assigned_to?.id === user?.id || user?.role === "admin"}
                      <button
                        class="px-2 py-1 text-xs uppercase font-bold bg-yellow-600 text-gray-900 hover:bg-yellow-500 transition duration-150"
                        on:click={() =>
                          updateListStatus(list.id, "in-progress")}
                      >
                        REOPEN
                      </button>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {:else}
          <div class="p-4 bg-gray-800 text-center border border-gray-700">
            <p class="text-gray-400">NO TASKS IN THIS PROJECT YET.</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
