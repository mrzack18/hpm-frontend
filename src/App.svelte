<!-- src\App.svelte -->
<script>
  import { Router, Route } from 'svelte-routing';
  import Navbar from './components/Navbar.svelte';
  import Footer from './components/Footer.svelte';
  import Home from './pages/Home.svelte';
  import Login from './pages/Login.svelte';
  import Register from './pages/Register.svelte';
  import Dashboard from './pages/Dashboard.svelte';
  import Projects from './pages/Projects.svelte';
  import ProjectDetail from './pages/ProjectDetail.svelte';
  import Users from './pages/Users.svelte';

  // Check authentication status
  let isAuthenticated = false;
  let userRole = null;
  
  // Check if user is authenticated on app load
  $: {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      isAuthenticated = true;
      userRole = JSON.parse(user).role;
    }
  }
</script>

<div class="app">
  <Router>
    <Navbar {isAuthenticated} {userRole} />

    <main class="main-content">
      <Route path="/" exact component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/users" component={Users} />
    </main>

    <Footer />
  </Router>
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .main-content {
    flex: 1;
    padding: 20px;
    margin-top: 60px;
    margin-bottom: 60px;
  }
</style>