<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  // Import the projects data
  // In a real application, you would fetch this from an API or database
  import { projects } from '../../projectsStore.js';
  
  // Get the current project based on the ID parameter
  $: project = projects.find(p => p.id === $page.params.id);
  
  // Combine mainImage with images array for the gallery
  $: galleryImages = project ? 
    (project.mainImage ? [project.mainImage, ...project.images] : project.images) : 
    [];
  
  // For image gallery
  let currentImageIndex = 0;
  
  function nextImage() {
    if (galleryImages && galleryImages.length) {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    }
  }
  
  function prevImage() {
    if (galleryImages && galleryImages.length) {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    }
  }
  
  // Auto-rotate images every 5 seconds
  let imageInterval;
  
  onMount(() => {
    if (galleryImages && galleryImages.length > 1) {
      imageInterval = setInterval(nextImage, 5000);
    }
    
    return () => {
      if (imageInterval) clearInterval(imageInterval);
    };
  });
</script>

<svelte:head>
  <title>{project ? project.title : 'Project Not Found'} | Developer Portfolio</title>
</svelte:head>

{#if project}
  <div class="project-detail">
    <div class="back-link">
      <a href="/#projects">← Back to Projects</a>
    </div>
    
    <h1>{project.title}</h1>
    
    <div class="project-tags">
      {#each project.tags as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
    
    <div class="project-links">
      {#if project.githubUrl}
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" class="btn secondary">
          <span class="btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </span>
          View on GitHub
        </a>
      {/if}
      
      {#if project.liveUrl}
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" class="btn primary">
          <span class="btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </span>
          View Live Demo
        </a>
      {/if}
    </div>
    
    {#if galleryImages && galleryImages.length > 0}
      <div class="project-gallery">
        <div class="gallery-main">
          <button class="gallery-nav prev" on:click={prevImage} aria-label="Previous image">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <div class="gallery-image-container">
            <img src={galleryImages[currentImageIndex]} alt={`${project.title} screenshot ${currentImageIndex + 1}`} class="gallery-image" />
          </div>
          
          <button class="gallery-nav next" on:click={nextImage} aria-label="Next image">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        {#if galleryImages.length > 1}
          <div class="gallery-thumbnails">
            {#each galleryImages as image, index}
              <button 
                class="thumbnail-btn {index === currentImageIndex ? 'active' : ''}" 
                on:click={() => currentImageIndex = index}
                aria-label={`View image ${index + 1}`}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} class="thumbnail" />
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
    
    <div class="project-description">
      <h2>About this project</h2>
      <p>{project.longDescription}</p>
    </div>
    
    <!-- Additional sections could be added here -->
    <div class="project-sections">
      <section class="project-section">
        <h2>Features</h2>
        <ul>
          <li>Responsive design that works on all devices</li>
          <li>Modern, minimalist user interface</li>
          <li>Fast performance and optimized loading times</li>
          <li>Comprehensive documentation and clean code</li>
        </ul>
      </section>
      
      <section class="project-section">
        <h2>Technologies Used</h2>
        <div class="tech-stack">
          {#each project.tags as tech}
            <span class="tech-item">{tech}</span>
          {/each}
        </div>
      </section>
    </div>
    
  </div>
{:else}
  <div class="not-found">
    <h1>Project Not Found</h1>
    <p>Sorry, the project you're looking for doesn't exist.</p>
    <a href="/#projects" class="btn secondary">Back to Projects</a>
  </div>
{/if}

<style>
  .project-detail {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 0;
  }
  
  .back-link {
    margin-bottom: 2rem;
  }
  
  .back-link a {
    color: var(--text-color);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    transition: color 0.3s;
  }
  
  .back-link a:hover {
    color: var(--accent-color);
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: normal;
  }
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    font-weight: normal;
    position: relative;
    display: inline-block;
  }
  
  h2::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--accent-color);
  }
  
  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .tag {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    background-color: var(--secondary-bg);
    border-radius: 4px;
  }
  
  .project-links {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 1px solid var(--border-color);
    text-decoration: none;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .btn.primary {
    background-color: var(--text-color);
    color: var(--bg-color);
  }
  
  .btn.secondary {
    background-color: transparent;
    color: var(--text-color);
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Gallery styles */
  .project-gallery {
    margin: 2rem 0 3rem;
  }
  
  .gallery-main {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--secondary-bg);
  }
  
  .gallery-image-container {
    width: 100%;
    height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .gallery-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  .gallery-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s;
    z-index: 2;
  }
  
  .gallery-nav:hover {
    opacity: 1;
  }
  
  .gallery-nav.prev {
    left: 1rem;
  }
  
  .gallery-nav.next {
    right: 1rem;
  }
  
  .gallery-thumbnails {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .thumbnail-btn {
    width: 80px;
    height: 60px;
    padding: 0;
    border: 2px solid transparent;
    background: none;
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    transition: border-color 0.3s;
  }
  
  .thumbnail-btn.active {
    border-color: var(--accent-color);
  }
  
  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* Project description */
  .project-description {
    margin-bottom: 3rem;
    line-height: 1.6;
  }
  
  /* Project sections */
  .project-sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .project-section {
    margin-bottom: 2rem;
  }
  
  .project-section ul {
    padding-left: 1.5rem;
    line-height: 1.6;
  }
  
  .project-section li {
    margin-bottom: 0.5rem;
  }
  
  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .tech-item {
    padding: 0.5rem 1rem;
    background-color: var(--secondary-bg);
    border-radius: 4px;
  }
  
  /* Not found page */
  .not-found {
    text-align: center;
    padding: 4rem 0;
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .project-sections {
      grid-template-columns: 1fr;
    }
    
    .gallery-image-container {
      height: 300px;
    }
  }
</style>
