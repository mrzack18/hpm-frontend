<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import axios from "axios";
  let users = [];
  let loading = true;
  let error = null;
  let user = null;
  let formError = "";
  let showCreateForm = false;
  let newUser = {
    name: "",
    email: "",
    password: "",
    role: "member",
  }; // State untuk modal konfirmasi delete
  let showDeleteModal = false;
  let userToDeleteId = null; // NOTE: API_BASE_URL harus tersedia di scope ini (atau diimpor dari file '../api')
  const API_BASE_URL = "http://localhost:5000/api";
  onMount(async () => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    user = JSON.parse(userData); // Only allow admin and manager to access this page
    if (user.role !== "admin" && user.role !== "manager") {
      navigate("/dashboard");
      return;
    }
    await fetchUsers();
  });
  async function fetchUsers() {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        users = response.data.data;
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      error = err.response?.data?.message || "Failed to fetch users";
    } finally {
      loading = false;
    }
  }
  async function createUser() {
    formError = "";
    if (!newUser.name || !newUser.email || !newUser.password) {
      formError = "Please fill in all required fields.";
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`${API_BASE_URL}/users`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        showCreateForm = false;
        formError = "";
        newUser = { name: "", email: "", password: "", role: "member" };
        await fetchUsers(); // Refresh the list
      }
    } catch (err) {
      console.error("Error creating user:", err);
      formError = err.response?.data?.message || "Failed to create user";
    }
  } // 1. Initiate delete process (show modal)
  function initiateDelete(userId) {
    userToDeleteId = userId;
    showDeleteModal = true;
  } // 2. Confirm delete process (actual API call)
  async function confirmDelete() {
    if (!userToDeleteId) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(
        `${API_BASE_URL}/users/${userToDeleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        await fetchUsers(); // Refresh the list
        showDeleteModal = false;
        userToDeleteId = null;
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      error = err.response?.data?.message || "Failed to delete user";
    }
  }
</script>

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
        USER MANAGEMENT
      </h2>

      {#if user?.role === "admin" || user?.role === "manager"}
        <button
          class="px-6 py-2 text-sm font-bold uppercase transition duration-150 {showCreateForm
            ? 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600'
            : 'bg-orange-600 text-gray-900 hover:bg-orange-500 shadow-md shadow-orange-500/20'}"
          on:click={() => {
            showCreateForm = !showCreateForm;
            formError = "";
            newUser = { name: "", email: "", password: "", role: "member" };
          }}
        >
          {showCreateForm ? "CANCEL INPUT" : "ADD NEW USER"}
        </button>
      {/if}
    </div>

    <!-- Create User Form -->
    {#if showCreateForm}
      <div class="p-6 mb-8 bg-gray-800 border-t-4 border-orange-500 shadow-xl">
        <h3 class="text-xl font-bold mb-4 uppercase text-orange-500">
          Add New System User
        </h3>

        {#if formError}
          <div
            class="bg-red-700 text-white p-2 mb-4 text-center text-sm border-2 border-red-500 shadow-lg"
          >
            {formError}
          </div>
        {/if}
        <form on:submit|preventDefault={createUser}>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Name -->
            <div>
              <input
                type="text"
                bind:value={newUser.name}
                placeholder="Full Name"
                class="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150 placeholder-gray-500"
              />
            </div>
            <!-- Email -->
            <div>
              <input
                type="email"
                bind:value={newUser.email}
                placeholder="Email"
                class="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150 placeholder-gray-500"
              />
            </div>
            <!-- Password -->
            <div>
              <input
                type="password"
                bind:value={newUser.password}
                placeholder="Password"
                class="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150 placeholder-gray-500"
              />
            </div>
            <!-- Role -->
            <div>
              <select
                bind:value={newUser.role}
                class="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150"
              >
                <option value="member" class="bg-gray-800">MEMBER</option>
                <option value="manager" class="bg-gray-800">MANAGER</option>
                {#if user?.role === "admin"}
                  <option value="admin" class="bg-gray-800">ADMIN</option>
                {/if}
              </select>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-3 mt-4">
            <button
              type="submit"
              class="px-6 py-2 text-sm font-bold uppercase bg-orange-600 text-gray-900 hover:bg-orange-500 transition duration-150"
            >
              CREATE
            </button>
            <button
              type="button"
              class="px-6 py-2 text-sm font-bold uppercase bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600 transition duration-150"
              on:click={() => (showCreateForm = false)}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    {/if}

    <!-- Loading/Error States -->
    {#if loading}
      <div class="text-center py-20 text-gray-400 text-xl">
        LOADING USER DATA...
      </div>
    {:else if error}
      <div
        class="text-center py-16 bg-red-800 border-2 border-red-500 text-white shadow-xl mx-auto max-w-lg mt-10"
      >
        <p class="font-bold uppercase mb-2">ACCESS DENIED</p>
        <p class="text-sm">{error}</p>
      </div>

      <!-- Users Table -->
    {:else}
      <div class="bg-gray-800 shadow-xl border border-gray-700 overflow-x-auto">
        {#if users.length > 0}
          <table class="w-full text-sm">
            <thead>
              <tr
                class="bg-gray-700 text-gray-300 uppercase tracking-widest text-xs"
              >
                <th class="p-4 font-bold">Name</th>
                <th class="p-4 font-bold">Email</th>
                <th class="p-4 font-bold">Role</th>
                <th class="p-4 font-bold">Created At</th>
                <th class="p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each users as userItem (userItem.id)}
                <tr
                  class="border-t border-gray-700 hover:bg-gray-700/50 transition duration-150"
                >
                  <td class="p-4 text-white">{userItem.name}</td>
                  <td class="p-4 text-gray-400">{userItem.email}</td>
                  <td class="p-4">
                    <span
                      class="px-3 py-1 text-xs font-bold uppercase
                      {userItem.role === 'admin'
                        ? 'bg-red-700 text-white'
                        : userItem.role === 'manager'
                          ? 'bg-orange-600 text-gray-900'
                          : 'bg-gray-600 text-gray-300'}
                   "
                    >
                      {userItem.role}
                    </span>
                  </td>
                  <td class="p-4 text-gray-500 text-xs"
                    >{new Date(userItem.created_at).toLocaleDateString()}</td
                  >
                  <td class="p-4">
                    {#if userItem.id !== user?.id}
                      <!-- Don't allow deleting current user -->
                      <button
                        class="px-3 py-1 text-xs font-bold uppercase bg-red-600 text-white hover:bg-red-700 transition duration-150"
                        on:click={() => initiateDelete(userItem.id)}
                      >
                        DELETE
                      </button>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        {:else}
          <div class="p-8 text-center text-gray-400">
            NO USERS FOUND IN SYSTEM.
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Custom Delete Confirmation Modal -->
  {#if showDeleteModal}
    <div
      class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[1001]"
    >
      <div
        class="bg-gray-800 p-6 w-96 border-t-4 border-red-600 shadow-2xl shadow-red-500/10 font-mono"
      >
        <h4 class="text-xl font-bold uppercase text-red-500 mb-4">
          CONFIRM USER DELETION
        </h4>
        <p class="text-gray-300 mb-6">
          Are you sure you want to permanently delete this user? This action
          cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 text-sm uppercase font-bold bg-gray-700 text-gray-300 hover:bg-gray-600 transition duration-150"
            on:click={() => (showDeleteModal = false)}
          >
            CANCEL
          </button>
          <button
            class="px-4 py-2 text-sm uppercase font-bold bg-red-600 text-white hover:bg-red-700 transition duration-150"
            on:click={confirmDelete}
          >
            DELETE USER
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
