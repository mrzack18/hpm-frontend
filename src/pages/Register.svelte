<script>
  import { navigate } from "svelte-routing";
  import { authService } from '../api';

  let name = "";
  let email = "";
  let password = "";
  let role = "member";
  let errorMessage = "";
  let loading = false;

  async function handleRegister() {
    if (!name || !email || !password) {
      errorMessage = "Please fill in all required fields";
      return;
    }

    if (password.length < 6) {
      errorMessage = "Password must be at least 6 characters";
      return;
    }

    loading = true;
    errorMessage = "";

    try {
      const response = await authService.register({
        name,
        email,
        password,
        role,
      });

      if (response.data.success) {
        // Store tokens and user data
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));

        // Redirect to login
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
    } finally {
      loading = false;
    }
  }
</script>

<!-- Mengatur container untuk Dark Mode, diposisikan di tengah layar -->
<div
  class="flex justify-center items-center min-h-screen pt-20 pb-16 bg-gray-900 font-mono"
>
  <div
    class="w-full max-w-sm p-8 bg-gray-800 border-t-4 border-orange-500 shadow-2xl shadow-orange-500/10 text-white"
  >
    <!-- Judul Form -->
    <h2
      class="text-3xl font-extrabold text-center mb-6 uppercase tracking-wider text-orange-500"
    >
      Create Account
    </h2>

    <!-- Pesan Error -->
    {#if errorMessage}
      <div
        class="bg-red-700 text-white p-3 mb-4 text-center text-sm border-2 border-red-500 shadow-lg"
      >
        {errorMessage}
      </div>
    {/if}

    <!-- Form Input -->
    <form on:submit|preventDefault={handleRegister}>
      <!-- Name Group -->
      <div class="mb-4">
        <label for="name" class="block text-gray-400 text-sm mb-2 uppercase"
          >Full Name</label
        >
        <input
          id="name"
          type="text"
          bind:value={name}
          placeholder="John Doe"
          disabled={loading}
          class="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150 disabled:opacity-50"
        />
      </div>

      <!-- Email Group -->
      <div class="mb-4">
        <label for="email" class="block text-gray-400 text-sm mb-2 uppercase"
          >Email</label
        >
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="user@hpm.com"
          disabled={loading}
          class="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150 disabled:opacity-50"
        />
      </div>

      <!-- Password Group -->
      <div class="mb-4">
        <label for="password" class="block text-gray-400 text-sm mb-2 uppercase"
          >Password</label
        >
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="min 6 characters"
          disabled={loading}
          class="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150 disabled:opacity-50"
        />
      </div>

      <!-- Role Group -->
      <div class="mb-6">
        <label for="role" class="block text-gray-400 text-sm mb-2 uppercase"
          >Role</label
        >
        <select
          id="role"
          bind:value={role}
          disabled={loading}
          class="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150 disabled:opacity-50"
        >
          <!-- Opsi diubah agar kontras di dark mode -->
          <option class="bg-gray-700" value="member">Member</option>
          <option class="bg-gray-700" value="manager">Manager</option>
        </select>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full p-3 text-lg font-bold uppercase bg-orange-600 text-gray-900 shadow-lg shadow-orange-500/30 hover:bg-orange-500 transition duration-150 disabled:bg-gray-700 disabled:text-gray-500 disabled:shadow-none"
        disabled={loading}
      >
        {#if loading}
          REGISTERING...
        {:else}
          CREATE ACCOUNT
        {/if}
      </button>
    </form>

    <!-- Login Link -->
    <p class="text-center mt-6 text-gray-400 text-sm">
      Already have an account?
      <a
        href="/login"
        class="text-orange-500 hover:text-orange-400 font-bold transition duration-150"
      >
        Login here
      </a>
    </p>
  </div>
</div>
