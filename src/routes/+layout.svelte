<script>
  import ThemeToggle from '$lib/ThemeToggle.svelte';
  import { onMount } from 'svelte';
  import { initClarity } from '$lib/utils/clarity';
  
  // State for mobile menu
  let isMenuOpen = false;
  
  // Toggle mobile menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  // Close menu when clicking on a link (for mobile)
  function closeMenu() {
    isMenuOpen = false;
  }
  
  // Close menu when window is resized to desktop size
  onMount(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        isMenuOpen = false;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initialize Microsoft Clarity if project ID is available
    const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
    if (projectId) {
      // Pass true as the second parameter to enable Clarity in development mode
      initClarity(projectId, true);
    } else {
      return
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<div class="layout">
  <header>
    <div class="container header-content">
      <div class="logo">
        <a href="/">MINASE</a>
      </div>
      
      <!-- Hamburger menu button for mobile -->
      <button class="menu-toggle" aria-label="Toggle menu" on:click={toggleMenu}>
        <span class="hamburger-icon" class:open={isMenuOpen}>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </span>
      </button>
      
      <div class="nav-and-theme">
        <!-- Navigation menu -->
        <nav class:open={isMenuOpen}>
          <ul>
            <li><a href="/resume" class="nav-special" on:click={closeMenu}>Resume</a></li>
            <li><a href="/blogs" class="nav-special" on:click={closeMenu}>Blogs</a></li>
          </ul>
        </nav>
        
        <div class="theme-toggle-container">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>

  <main>
    <div class="container">
      <slot />
    </div>
  </main>

  <footer>
    <div class="container">
      <p>&copy; {new Date().getFullYear()}</p>
    </div>
  </footer>
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  header {
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    background-color: var(--bg-color);
    z-index: 1000;
    transition: background-color 0.3s;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo a {
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
    color: var(--text-color);
  }
  
  .nav-and-theme {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  nav ul {
    display: flex;
    list-style: none;
    gap: 1.5rem;
    margin: 0;
    padding: 0;
  }

  nav a {
    text-decoration: none;
    color: var(--text-color);
    transition: color 0.3s;
  }

  nav a:hover {
    color: var(--accent-color);
  }
  
  .nav-special {
    position: relative;
    padding: 0.5rem 0.75rem;
    border-radius: 0.25rem;
    font-weight: 600;
    transition: all 0.3s;
    background-color: var(--secondary-bg);
    border: 1px solid var(--border-color);
  }
  
  .nav-special:hover {
    background-color: var(--accent-color-light);
    transform: translateY(-2px);
  }

  /* Hamburger menu styles */
  .menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 1001;
  }

  .hamburger-icon {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 25px;
    height: 20px;
    transition: transform 0.3s;
  }

  .hamburger-icon .bar {
    width: 100%;
    height: 2px;
    background-color: var(--text-color);
    transition: all 0.3s;
  }

  .hamburger-icon.open .bar:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
  }

  .hamburger-icon.open .bar:nth-child(2) {
    opacity: 0;
  }

  .hamburger-icon.open .bar:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
  }

  main {
    flex: 1;
    padding: 2rem 0;
  }

  footer {
    padding: 1.5rem 0;
    border-top: 1px solid var(--border-color);
    text-align: center;
    font-size: 0.9rem;
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .header-content {
      position: relative;
    }
    
    .menu-toggle {
      display: block;
      order: 3;
    }
    
    .nav-and-theme {
      width: 100%;
      justify-content: flex-end;
    }
    
    nav {
      position: fixed;
      top: 0;
      right: -100%;
      width: 70%;
      max-width: 300px;
      height: 100vh;
      background-color: var(--bg-color);
      box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
      transition: right 0.3s ease;
      z-index: 1000;
      padding: 5rem 2rem 2rem;
    }
    
    nav.open {
      right: 0;
    }
    
    nav ul {
      flex-direction: column;
      gap: 1.5rem;
    }
    
    nav a {
      font-size: 1.2rem;
    }
  }
  
  @media (max-width: 480px) {
    .container {
      width: 95%;
      padding: 0 0.5rem;
    }
    
    .logo a {
      font-size: 1.2rem;
    }
  }
</style>
