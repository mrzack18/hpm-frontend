<script>
  import { Link, navigate } from "svelte-routing";
  import { onMount } from "svelte";

  export let isAuthenticated = false;
  export let userRole = null;

  let user = null;
  let showDropdown = false; // state dropdown

  onMount(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      user = JSON.parse(userData);
      if (user && !userRole) {
        userRole = user.role || null;
      }
    }
  });

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  }
</script>

<nav
  class="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-xl z-50 border-b border-gray-700 font-mono"
>
  <div class="nav-brand">
    <Link to="/">
      <h2
        class="text-2xl font-extrabold uppercase tracking-wider text-orange-500 hover:text-orange-400 transition duration-150"
      >
        Himatif Project Management
      </h2>
    </Link>
  </div>

  {#if isAuthenticated}
    <div class="flex items-center gap-6">
      <Link
        to="/dashboard"
        class="text-gray-300 hover:text-orange-500 transition duration-150 text-sm uppercase"
        >Dashboard</Link
      >
      <Link
        to="/projects"
        class="text-gray-300 hover:text-orange-500 transition duration-150 text-sm uppercase"
        >Projects</Link
      >
      {#if userRole === "admin" || userRole === "manager"}
        <Link
          to="/users"
          class="text-gray-300 hover:text-orange-500 transition duration-150 text-sm uppercase"
          >Users</Link
        >
      {/if}

      <div class="relative">
        <span
          class="cursor-pointer flex items-center gap-2 px-3 py-1 bg-gray-800 border border-gray-700 text-sm font-medium hover:bg-gray-700 transition duration-150"
          on:click={toggleDropdown}
        >
          {user?.name}
          <span class="text-orange-500">({userRole})</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 ml-1 transform transition duration-300"
            class:rotate-180={showDropdown}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>

        {#if showDropdown}
          <div
            class="absolute right-0 mt-3 w-40 bg-gray-800 border border-gray-700 shadow-xl z-10"
          >
            <button
              on:click={logout}
              class="w-full text-left px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-bold transition duration-150"
            >
              Logout
            </button>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div class="flex items-center gap-4">
      <Link
        to="/login"
        class="px-4 py-2 text-sm font-bold uppercase bg-orange-500 text-gray-900 hover:bg-orange-400 transition duration-150"
        >Login</Link
      >
      <Link
        to="/register"
        class="px-4 py-2 text-sm font-bold uppercase border border-white text-white hover:border-orange-500 hover:text-orange-500 transition duration-150"
        >Register</Link
      >
    </div>
  {/if}
</nav>
