<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { projectService } from "../api";

  let projects = [];
  let loading = true;
  let error = null;
  let user = null;
  let showCreateForm = false;
  let newProject = {
    name: "",
    description: "",
    deadline: "",
  };
  let formError = ""; // State untuk modal konfirmasi
  let showModal = false;
  let projectToDeleteId = null;

  onMount(async () => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    user = JSON.parse(userData);

    await fetchProjects();
  });

  async function fetchProjects() {
    try {
      const response = await projectService.getAllProjects();

      if (response.data.success) {
        projects = response.data.data;
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      error = err.response?.data?.message || "Failed to fetch projects";
    } finally {
      loading = false;
    }
  }

  async function createProject() {
    formError = "";
    if (!newProject.name) {
      formError = "Project Name is required.";
      return;
    }

    try {
      // FIX: kirim YYYY-MM-DD saja (bukan ISO full)
      const payload = {
        name: newProject.name,
        description: newProject.description, // Pastikan deadline dikirim sebagai string YYYY-MM-DD atau null
        deadline: newProject.deadline || null,
      };

      const res = await projectService.createProject(payload);

      if (res.data.success) {
        showCreateForm = false;
        formError = "";

        newProject = {
          name: "",
          description: "",
          deadline: "",
        };

        await fetchProjects();
      }
    } catch (err) {
      console.error("Error creating project:", err);
      formError = err.response?.data?.message || "Failed to create project";
    }
  } // Mengganti konfirmasi default dengan logic modal custom
  function initiateDelete(id, event) {
    event.stopPropagation();
    projectToDeleteId = id;
    showModal = true;
  }

  async function confirmDelete() {
    if (!projectToDeleteId) return;
    try {
      const res = await projectService.deleteProject(projectToDeleteId);

      if (res.data.success) {
        fetchProjects(); // refresh
        showModal = false;
        projectToDeleteId = null;
      }
    } catch (err) {
      console.error("Delete project error:", err);
      error = err.response?.data?.message || "Gagal menghapus project";
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

  function calculateProgress(lists) {
    if (!lists || lists.length === 0) return 0;

    const doneCount = lists.filter((l) => l.status === "done").length;
    return (doneCount / lists.length) * 100;
  }
</script>

<!-- Mengganti fungsi deleteProject lama yang menggunakan 'confirm' -->
<!-- NOTE: Fungsi deleteProject lama diubah namanya menjadi initiateDelete untuk menggunakan modal. -->

<!-- Main container: Dark Mode background, Monospace font, Padding top/bottom disesuaikan dengan Navbar dan Footer -->
<div
  class="min-h-screen bg-gray-900 text-white font-mono pt-20 pb-16 px-4 sm:px-8 lg:px-12"
>
  <div class="max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-10 pt-4">
      <h2
        class="text-4xl font-extrabold text-white uppercase tracking-widest border-l-4 border-orange-500 pl-4"
      >
        PROJECTS INDEX
      </h2>

      {#if user?.role === "admin" || user?.role === "manager"}
        <button
          class="px-6 py-2 text-sm font-bold uppercase transition duration-150 {showCreateForm
            ? 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600'
            : 'bg-orange-600 text-gray-900 hover:bg-orange-500 shadow-md shadow-orange-500/20'}"
          on:click={() => (showCreateForm = !showCreateForm)}
        >
          {showCreateForm ? "CANCEL INPUT" : "CREATE PROJECT"}
        </button>
      {/if}
    </div>

    <!-- Create Project Form -->
    {#if showCreateForm}
      <div class="p-6 mb-8 bg-gray-800 border-t-4 border-orange-500 shadow-xl">
        <h3 class="text-xl font-bold mb-4 uppercase text-orange-500">
          Initialize New Project
        </h3>

        {#if formError}
          <div
            class="bg-red-700 text-white p-2 mb-4 text-center text-sm border-2 border-red-500 shadow-lg"
          >
            {formError}
          </div>
        {/if}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Input Name -->
          <div class="col-span-1">
            <input
              type="text"
              bind:value={newProject.name}
              placeholder="Project Name (Required)"
              class="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150 placeholder-gray-500"
            />
          </div>

          <!-- Input Deadline -->
          <div class="col-span-1">
            <input
              type="date"
              bind:value={newProject.deadline}
              class="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150"
            />
          </div>

          <!-- Actions (Create Button) -->
          <div class="col-span-1">
            <button
              class="w-full p-3 text-sm font-bold uppercase bg-orange-600 text-gray-900 hover:bg-orange-500 transition duration-150"
              on:click={createProject}
            >
              CREATE PROJECT
            </button>
          </div>
        </div>

        <!-- Input Description (Full width) -->
        <div class="mt-4">
          <textarea
            bind:value={newProject.description}
            placeholder="Project Description (Optional)"
            rows="3"
            class="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150 resize-y placeholder-gray-500"
          ></textarea>
        </div>
      </div>
    {/if}

    <!-- Loading/Error/No Projects -->
    {#if loading}
      <div class="text-center py-20 text-gray-400 text-xl">
        LOADING PROJECTS INDEX...
      </div>
    {:else if error}
      <div
        class="text-center py-16 bg-red-800 border-2 border-red-500 text-white shadow-xl mx-auto max-w-lg mt-10"
      >
        <p class="font-bold uppercase mb-2">ACCESS DENIED</p>
        <p class="text-sm">{error}</p>
      </div>
    {:else if projects.length > 0}
      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each projects as project (project.id)}
          <div
            class="relative p-5 bg-gray-800 border border-gray-700 cursor-pointer transition duration-200 group hover:bg-gray-700 hover:shadow-xl hover:shadow-orange-500/10"
            on:click={() => navigate(`/projects/${project.id}`)}
          >
            <!-- Delete Button (Hanya jika Admin/Manager) -->
            {#if user?.role === "admin" || user?.role === "manager"}
              <button
                class="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs font-bold transition duration-150 opacity-0 group-hover:opacity-100 hover:bg-red-700"
                on:click={(e) => initiateDelete(project.id, e)}
              >
                ✕
              </button>
            {/if}
            <h3
              class="text-xl font-bold mb-1 text-white group-hover:text-orange-500 transition duration-200 uppercase"
            >
              {project.name}
            </h3>
            <p class="text-gray-400 text-sm mb-4">{project.description}</p>

            <!-- Meta Data -->
            <div
              class="flex justify-between font-mono text-xs text-gray-500 mb-4 border-t border-gray-700 pt-3"
            >
              <span>
                DEADLINE: <span class="text-white"
                  >{formatDate(project.deadline)}</span
                >
              </span>
              <span class="text-orange-500">
                {project.members.length} MEMBER{project.members.length !== 1
                  ? "S"
                  : ""}
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="flex items-center gap-3">
              <div
                class="flex-1 h-2 bg-gray-700 rounded-sm overflow-hidden border border-gray-600"
              >
                <div
                  class="h-full bg-orange-500 transition-all duration-500"
                  style="width: {calculateProgress(project.lists)}%"
                ></div>
              </div><span class="text-sm font-bold text-orange-500">
                {Math.round(calculateProgress(project.lists))}%
              </span>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <!-- No Projects State -->
      <div class="p-8 bg-gray-800 border border-orange-500 text-center mt-10">
        <p class="text-gray-400 mb-4">NO PROJECTS FOUND IN INDEX.</p>
        {#if user?.role === "admin" || user?.role === "manager"}
          <button
            class="px-6 py-2 bg-orange-600 text-gray-900 font-bold uppercase hover:bg-orange-500 transition duration-150"
            on:click={() => (showCreateForm = true)}
          >
            INITIALIZE FIRST PROJECT
          </button>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Custom Confirmation Modal (Menggantikan window.confirm()) -->
  {#if showModal}
    <div
      class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[1001]"
    >
      <div
        class="bg-gray-800 p-6 w-96 border-t-4 border-red-600 shadow-2xl shadow-red-500/10 font-mono"
      >
        <h4 class="text-xl font-bold uppercase text-red-500 mb-4">
          CONFIRM DELETION
        </h4>
        <p class="text-gray-300 mb-6">
          Are you sure you want to delete this project? This action cannot be
          undone.
        </p>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 text-sm uppercase font-bold bg-gray-700 text-gray-300 hover:bg-gray-600 transition duration-150"
            on:click={() => (showModal = false)}
          >
            CANCEL
          </button>
          <button
            class="px-4 py-2 text-sm uppercase font-bold bg-red-600 text-white hover:bg-red-700 transition duration-150"
            on:click={confirmDelete}
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
