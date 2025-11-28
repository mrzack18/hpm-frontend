<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { projectService } from "../api";

  let user = null;
  let projects = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    user = JSON.parse(userData);

    try {
      // Fetch user's projects
      const response = await projectService.getAllProjects();

      if (response.data.success) {
        // Filter projects for null or missing lists property before use
        projects = response.data.data.filter(
          (p) => p.lists && Array.isArray(p.lists)
        );
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      error = err.response?.data?.message || "Failed to fetch projects";
    } finally {
      loading = false;
    }
  });

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

<!-- Main container: Dark Mode background, Monospace font, Padding top/bottom disesuaikan dengan Navbar dan Footer -->
<div
  class="min-h-screen bg-gray-900 text-white font-mono pt-20 pb-16 px-4 sm:px-8 lg:px-12"
>
  <!-- Content Wrapper -->
  <div class="max-w-7xl mx-auto">
    <!-- Loading State -->
    {#if loading}
      <div class="text-center py-20 text-gray-400 text-xl">
        <svg
          class="animate-spin h-6 w-6 mr-3 inline-block text-orange-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span class="uppercase tracking-widest"
          >LOADING DASHBOARD ACCESS...</span
        >
      </div>

      <!-- Error State -->
    {:else if error}
      <div
        class="text-center py-16 bg-red-800 border-2 border-red-500 text-white shadow-xl mx-auto max-w-lg mt-10"
      >
        <p class="font-bold uppercase mb-2">ACCESS DENIED</p>
        <p class="text-sm">{error}</p>
      </div>

      <!-- Main Dashboard Content -->
    {:else}
      <div class="dashboard">
        <!-- Header Section -->
        <div class="mb-10 pt-4">
          <h2
            class="text-4xl font-extrabold text-white mb-2 uppercase tracking-widest border-l-4 border-orange-500 pl-4"
          >
            DASHBOARD
          </h2>
          <p class="text-gray-400 text-sm pl-5">
            Welcome back, <span class="text-orange-500 font-bold"
              >{user?.name || "User"}</span
            >. Current operational status overview.
          </p>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <!-- Stat Card: Total Projects -->
          <div
            class="p-6 bg-gray-800 border border-gray-700 shadow-md transition duration-200 text-center hover:border-orange-500"
          >
            <h3 class="text-4xl font-extrabold text-orange-500 mb-1">
              {projects.length}
            </h3>
            <p class="text-gray-400 uppercase text-sm tracking-wider">
              Total Projects
            </p>
          </div>

          <!-- Stat Card: Completed Projects -->
          <div
            class="p-6 bg-gray-800 border border-gray-700 shadow-md transition duration-200 text-center hover:border-green-500"
          >
            <h3 class="text-4xl font-extrabold text-green-500 mb-1">
              {projects.filter(
                (p) =>
                  p.lists &&
                  p.lists.length > 0 &&
                  p.lists.every((l) => l.status === "done")
              ).length}
            </h3>
            <p class="text-gray-400 uppercase text-sm tracking-wider">
              Fully Completed
            </p>
          </div>

          <!-- Stat Card: Active Projects -->
          <div
            class="p-6 bg-gray-800 border border-gray-700 shadow-md transition duration-200 text-center hover:border-yellow-500"
          >
            <h3 class="text-4xl font-extrabold text-yellow-500 mb-1">
              {projects.filter(
                (p) =>
                  p.lists &&
                  p.lists.some(
                    (l) => l.status === "in-progress" || l.status === "todo"
                  ) &&
                  p.lists.some((l) => l.status !== "done")
              ).length}
            </h3>
            <p class="text-gray-400 uppercase text-sm tracking-wider">
              Projects In Progress
            </p>
          </div>
        </div>

        <!-- Recent Projects Section -->
        <div class="mb-10">
          <h3 class="text-2xl font-bold text-white mb-6 uppercase">
            Active Projects Summary
          </h3>

          {#if projects.length > 0}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {#each projects as project (project.id)}
                <div
                  class="p-5 bg-gray-800 border border-gray-700 cursor-pointer transition duration-200 group hover:bg-gray-700 hover:shadow-xl hover:shadow-orange-500/10"
                  on:click={() => navigate(`/projects/${project.id}`)}
                >
                  <h4
                    class="text-xl font-bold mb-2 text-white group-hover:text-orange-500 transition duration-200 uppercase"
                  >
                    {project.name}
                  </h4>
                  <p
                    class="text-gray-400 text-sm mb-4 border-b border-gray-600 pb-2"
                  >
                    {project.description}
                  </p>

                  <!-- Meta Data -->
                  <div
                    class="flex justify-between font-mono text-xs text-gray-500 mb-4"
                  >
                    <span class="deadline">
                      DEADLINE: <span class="text-white"
                        >{formatDate(project.deadline)}</span
                      >
                    </span>
                    <span class="member-count text-orange-500">
                      {project.members.length} MEMBERS
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
                    </div>
                    <span class="text-sm font-bold text-orange-500">
                      {Math.round(calculateProgress(project.lists))}%
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="p-8 bg-gray-800 border border-orange-500 text-center">
              <p class="text-gray-400 mb-4">NO ACTIVE PROJECTS FOUND.</p>
              <button
                class="px-6 py-2 bg-orange-600 text-gray-900 font-bold uppercase hover:bg-orange-500 transition duration-150"
                on:click={() => navigate("/projects")}
              >
                VIEW ALL PROJECTS
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
