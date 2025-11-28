<script>
  import { navigate } from "svelte-routing";
  import { authService } from "../api";

  let email = "";
  let password = "";
  let errorMessage = "";
  let loading = false;

  async function handleLogin() {
    if (!email || !password) {
      errorMessage = "Please fill in all fields";
      return;
    }

    loading = true;
    errorMessage = "";

    try {
      const response = await authService.login({
        email,
        password,
      });

      if (response.data.success) {
        // Store tokens and user data
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));

        // Redirect based on role
        const userRole = response.data.data.user.role;
        if (userRole === "admin" || userRole === "manager") {
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }

        // Refresh the page to update the app state
        window.location.reload();
      }
    } catch (error) {
      console.error("Login error:", error);
      errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
    } finally {
      loading = false;
    }
  }
</script>

<!-- Mengatur container untuk Dark Mode, diposisikan di tengah layar (mengabaikan navbar/footer) -->
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
      Login Access
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
    <form on:submit|preventDefault={handleLogin}>
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
      <div class="mb-6">
        <label for="password" class="block text-gray-400 text-sm mb-2 uppercase"
          >Password</label
        >
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="secure_password"
          disabled={loading}
          class="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition duration-150 disabled:opacity-50"
        />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full p-3 text-lg font-bold uppercase bg-orange-600 text-gray-900 shadow-lg shadow-orange-500/30 hover:bg-orange-500 transition duration-150 disabled:bg-gray-700 disabled:text-gray-500 disabled:shadow-none"
        disabled={loading}
      >
        {#if loading}
          PROCESSING...
        {:else}
          INITIATE LOGIN
        {/if}
      </button>
    </form>

    <!-- Register Link -->
    <p class="text-center mt-6 text-gray-400 text-sm">
      Don't have an account?
      <a
        href="/register"
        class="text-orange-500 hover:text-orange-400 font-bold transition duration-150"
      >
        Register here
      </a>
    </p>
  </div>
</div>
