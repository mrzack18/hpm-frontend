<script>
  import { Link } from "svelte-routing";
</script>

<div
  class="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-12 font-mono text-white"
>
  <div class="max-w-6xl w-full">
    <div class="text-center my-20">
      <h1
        class="text-7xl md:text-8xl font-extrabold mb-4 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-400"
        style="text-shadow: 0 0 10px rgba(251, 191, 36, 0.5), 0 0 20px rgba(251, 191, 36, 0.3);"
      >
        HIMATIF PM
      </h1>
      <p class="text-xl text-gray-400 mb-12 font-semibold">
        Project Management: Built for Performance.
      </p>

      <div class="flex justify-center gap-8 flex-wrap">
        <Link
          to="/login"
          class="px-10 py-4 bg-orange-500 text-gray-900 text-xl font-bold rounded-sm shadow-2xl shadow-orange-500/50 hover:bg-orange-400 transition duration-150 transform hover:-translate-y-1"
        >
          ACCESS DASHBOARD
        </Link>
        <Link
          to="/register"
          class="px-10 py-4 border-2 border-white text-white text-xl font-bold rounded-sm hover:border-orange-500 hover:text-orange-500 transition duration-150 transform hover:-translate-y-1"
        >
          JOIN NOW
        </Link>
      </div>
    </div>

    <div
      class="w-full h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent my-20"
    ></div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
      <div
        class="p-6 bg-gray-800 border border-gray-700 hover:border-orange-500 transition duration-200 group"
      >
        <span class="text-3xl font-extrabold text-orange-500 block mb-3"
          >01.</span
        >
        <h3
          class="text-2xl font-bold text-white mb-3 group-hover:text-orange-500 transition duration-200"
        >
          Project Management
        </h3>
        <p class="text-gray-400">
          Arsitektur proyek yang skalabel. Tentukan target, alokasi sumber daya,
          dan batasan waktu dengan presisi.
        </p>
      </div>

      <div
        class="p-6 bg-gray-800 border border-gray-700 hover:border-orange-500 transition duration-200 group"
      >
        <span class="text-3xl font-extrabold text-orange-500 block mb-3"
          >02.</span
        >
        <h3
          class="text-2xl font-bold text-white mb-3 group-hover:text-orange-500 transition duration-200"
        >
          Task Tracking
        </h3>
        <p class="text-gray-400">
          Visibilitas tugas 100%. Lacak status real-time, identifikasi hambatan,
          dan dorong penyelesaian cepat.
        </p>
      </div>

      <div
        class="p-6 bg-gray-800 border border-gray-700 hover:border-orange-500 transition duration-200 group"
      >
        <span class="text-3xl font-extrabold text-orange-500 block mb-3"
          >03.</span
        >
        <h3
          class="text-2xl font-bold text-white mb-3 group-hover:text-orange-500 transition duration-200"
        >
          Team Collaboration
        </h3>
        <p class="text-gray-400">
          Komunikasi terpusat dan alokasi tugas instan untuk memaksimalkan
          sinergi tim dan output kerja.
        </p>
      </div>
    </div>
  </div>
</div>
