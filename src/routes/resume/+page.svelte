<script>
  import { onMount } from 'svelte';
  let iframeHeight = '100vh';

  onMount(() => {
    // Adjust iframe height based on window size
    const updateHeight = () => {
      // Account for header and some padding
      iframeHeight = `${window.innerHeight - 100}px`;
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  });
</script>

<svelte:head>
  <title>Manasseh Fikadu - Resume</title>
  <meta name="description" content="View Manasseh Fikadu's professional resume" />
</svelte:head>

<div class="resume-page">
  <div class="back-button-container">
    <a href="/" class="back-button btn secondary">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5"></path>
        <path d="M12 19l-7-7 7-7"></path>
      </svg>
      Back to Home
    </a>
  </div>
  
  <div class="resume-container">
    <iframe 
      src="/assets/resume.pdf" 
      title="Manasseh Fikadu's Resume" 
      style="height: {iframeHeight};"
    ></iframe>
  </div>
</div>

<style>
  .resume-page {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .back-button-container {
    width: 100%;
    max-width: 850px;
    padding: 1rem 0;
  }
  
  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--text-color);
    color: var(--text-color);
    text-decoration: none;
    border-radius: 0.25rem;
    font-weight: 500;
    transition: all 0.3s;
    font-family: Consolas, 'Courier New', monospace;
  }
  
  .back-button:hover {
    background-color: var(--text-color);
    color: var(--bg-color);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .resume-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0 0 1rem 0;
  }
  
  iframe {
    width: 100%;
    max-width: 850px;
    border: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
  }
  
  /* For dark mode compatibility */
  @media (prefers-color-scheme: dark) {
    iframe {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
  }
</style>
