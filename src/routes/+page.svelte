<script>
  import { onMount } from 'svelte';
  // Import projects from the store
  import { projects } from './projectsStore.js';

  // Skills
  const skills = [
    'TypeScript', 'React', 'Node.js', 'Python',
    'SQL', 'Git', 'Docker', 'Svelte', 'Golang', "Django"
  ];
  
  // For image slideshows
  let slideshowIntervals = {};
  let currentImageIndices = {};
  
  // Initialize current image index for each project
  projects.forEach(project => {
    currentImageIndices[project.id] = 0;
  });
  
  // Create a combined array of mainImage and images for each project
  const getProjectImages = (project) => {
    if (!project) return [];
    return project.mainImage 
      ? [project.mainImage, ...(project.images || [])]
      : (project.images || []);
  };
  
  // Functions for slideshow navigation
  function nextImage(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const images = getProjectImages(project);
    if (images.length <= 1) return;
    
    currentImageIndices[projectId] = (currentImageIndices[projectId] + 1) % images.length;
  }
  
  function prevImage(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const images = getProjectImages(project);
    if (images.length <= 1) return;
    
    currentImageIndices[projectId] = (currentImageIndices[projectId] - 1 + images.length) % images.length;
  }
  
  // Set up automatic slideshow for each project
  onMount(() => {
    projects.forEach(project => {
      const images = getProjectImages(project);
      if (images.length > 1) {
        slideshowIntervals[project.id] = setInterval(() => nextImage(project.id), 5000);
      }
    });
    
    return () => {
      // Clean up intervals on component unmount
      Object.values(slideshowIntervals).forEach(interval => {
        clearInterval(interval);
      });
    };
  });
</script>

<svelte:head>
  <title>Developer Portfolio</title>
  <meta name="description" content="A minimalist developer portfolio showcasing projects and skills" />
</svelte:head>

<section id="hero" class="section">
  <div class="hero-content">
    <h1 class="hero-title">Hello, I'm <span class="highlight">Minase Fikadu</span></h1>
    <p class="hero-subtitle">Building clean, efficient, and user-friendly applications</p>
    <div class="cta-buttons">
      <a href="#projects" class="btn primary">View Projects</a>
      <a href="#contact" class="btn secondary">Contact Me</a>
    </div>
  </div>
</section>

<section id="about" class="section">
  <h2 class="section-title">About Me</h2>
  <p class="section-subtitle">A passionate developer focused on creating elegant solutions</p>
  <div class="about-content">
    <div class="about-text">
      <p>
        I'm a passionate developer focused on creating elegant solutions to complex problems.
        With a strong foundation in both frontend, backend, and machine learning, I strive to build
        applications that are not only functional but also intuitive and accessible.
      </p>
      <p>
        My approach to development emphasizes clean code, thoughtful architecture, and attention
        to detail. I believe in continuous learning and staying updated with the latest industry trends.
      </p>
    </div>
    <div class="skills">
      <h3>Skills</h3>
      <ul class="skill-list">
        {#each skills as skill}
          <li class="skill-tag">{skill}</li>
        {/each}
      </ul>
    </div>
  </div>
</section>

<section id="projects" class="section">
  <h2 class="section-title">Projects</h2>
  <p class="section-subtitle">A showcase of my recent projects.</p>
  <div class="projects-grid">
    {#each projects as project}
      <div class="project-card">
        {#if getProjectImages(project).length > 0}
          <div class="project-image">
            <img src={getProjectImages(project)[currentImageIndices[project.id]]} alt={project.title} />
            
            {#if getProjectImages(project).length > 1}
              <div class="image-controls">
                <button class="nav-btn prev-btn" on:click|preventDefault|stopPropagation={() => prevImage(project.id)} aria-label="Previous image">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button class="nav-btn next-btn" on:click|preventDefault|stopPropagation={() => nextImage(project.id)} aria-label="Next image">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
              
              <div class="image-indicators">
                {#each getProjectImages(project) as _, index}
                  <button 
                    class="indicator {index === currentImageIndices[project.id] ? 'active' : ''}" 
                    on:click|preventDefault|stopPropagation={() => currentImageIndices[project.id] = index}
                    aria-label={`View image ${index + 1}`}
                  ></button>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
        <div class="project-content">
          <h3 class="project-title">{project.title}</h3>
          <p class="project-description">{project.description}</p>
          <div class="project-tags">
            {#each project.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
          <div class="project-links">
            {#if project.githubUrl}
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" class="project-link">
                <span class="link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </span>
                GitHub
              </a>
            {/if}
            {#if project.liveUrl}
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" class="project-link">
                <span class="link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </span>
                Live Demo
              </a>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>

<section id="contact" class="section">
  <h2 class="section-title">Contact</h2>
  <p class="section-subtitle">Get in touch with me through these platforms</p>
  
  <div class="contact-grid">
    <a href="mailto:minaseyob@gmail.com" class="contact-item">
      <div class="contact-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      </div>
      <span class="contact-label">Email</span>
    </a>
    
    <a href="https://github.com/manasseh-fikadu" target="_blank" rel="noopener noreferrer" class="contact-item">
      <div class="contact-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      </div>
      <span class="contact-label">GitHub</span>
    </a>
    
    <a href="https://www.linkedin.com/in/minase-fikadu/" target="_blank" rel="noopener noreferrer" class="contact-item">
      <div class="contact-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      </div>
      <span class="contact-label">LinkedIn</span>
    </a>
    
    <a href="https://www.upwork.com/freelancers/~01a70ca745aea3a1da" target="_blank" rel="noopener noreferrer" class="contact-item">
      <div class="contact-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
        </svg>
      </div>
      <span class="contact-label">Upwork</span>
    </a>
  </div>
</section>

<style>
  .section {
    padding: 4rem 0;
  }

  .section-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .section-subtitle {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--text-secondary);
  }

  /* Hero Section */
  .hero-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    color: var(--text-secondary);
  }

  .highlight {
    color: var(--accent-color);
  }

  .cta-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 0.25rem;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
  }

  .btn.primary {
    background-color: var(--text-color);
    color: var(--bg-color);
  }

  .btn.primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  .btn.secondary {
    border: 1px solid var(--text-color);
    color: var(--text-color);
  }

  .btn.secondary:hover {
    background-color: var(--text-color);
    color: var(--bg-color);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  /* About Section Styling */
  .about-content {
    display: flex;
    gap: 3rem;
    margin-top: 1.5rem;
  }

  .about-text {
    flex: 1;
    line-height: 1.6;
  }

  .about-text p {
    margin-bottom: 1rem;
  }

  .skills {
    flex: 1;
  }

  .skills h3 {
    margin-bottom: 1rem;
  }

  .skill-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    list-style: none;
    padding: 0;
  }

  .skill-tag {
    background-color: var(--tag-bg);
    color: var(--tag-text);
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-size: 0.9rem;
  }

  /* Projects Section */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }

  .project-card {
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .project-image {
    position: relative;
    height: 200px;
    overflow: hidden;
  }

  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }

  .project-card:hover .project-image img {
    transform: scale(1.05);
  }

  .project-content {
    padding: 1.5rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .project-title {
    margin: 0 0 0.75rem;
    font-size: 1.25rem;
  }

  .project-description {
    margin: 0 0 1rem;
    color: var(--text-secondary);
    flex-grow: 1;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .tag {
    background-color: var(--tag-bg);
    color: var(--tag-text);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }

  .project-links {
    display: flex;
    gap: 1rem;
  }

  .project-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: var(--text-color);
    transition: color 0.3s;
  }

  .project-link:hover {
    color: var(--accent-color);
  }

  .image-controls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none; /* This allows clicks to pass through to the image */
  }

  .project-image:hover .image-controls {
    opacity: 1;
  }

  .nav-btn {
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 0 10px;
    pointer-events: auto; /* Re-enable pointer events for buttons */
    z-index: 2;
  }

  .nav-btn:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .nav-btn svg {
    width: 20px;
    height: 20px;
  }

  .prev-btn {
    margin-left: 10px;
  }

  .next-btn {
    margin-right: 10px;
  }

  .image-indicators {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
    pointer-events: none;
  }

  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    border: none;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    pointer-events: auto;
  }

  .indicator:hover {
    transform: scale(1.2);
  }

  .indicator.active {
    background-color: white;
    transform: scale(1.2);
  }

  /* Contact Section Styling */
  #contact {
    text-align: center;
  }
  
  .contact-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-top: 2rem;
  }
  
  .contact-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--text-color);
    padding: 1.5rem;
    border-radius: 0.5rem;
    transition: all 0.3s;
    border: 1px solid var(--border-color);
  }
  
  .contact-item:hover {
    transform: translateY(-5px);
    color: var(--accent-color);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .contact-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: var(--secondary-bg);
    transition: background-color 0.3s;
  }
  
  .contact-item:hover .contact-icon {
    background-color: var(--accent-color-light);
  }
  
  .contact-label {
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    .about-content {
      flex-direction: column;
      gap: 2rem;
    }
    
    .about-text, .skills {
      width: 100%;
    }
    
    .contact-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    
    .projects-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    
    .section-title {
      font-size: 1.75rem;
    }
    
    .section-subtitle {
      font-size: 1rem;
    }
    
    .hero-title {
      font-size: 2rem;
    }
    
    .hero-subtitle {
      font-size: 1.1rem;
    }
    
    .btn {
      padding: 0.6rem 1.2rem;
    }
  }
  
  @media (max-width: 480px) {
    .projects-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .project-image {
      height: 180px;
    }
    
    .project-content {
      padding: 1rem;
    }
    
    .project-title {
      font-size: 1.1rem;
    }
    
    .project-tags {
      margin-bottom: 1rem;
    }
    
    .section {
      padding: 2rem 0;
    }
    
    .section-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .hero-title {
      font-size: 1.75rem;
    }
    
    .hero-subtitle {
      font-size: 1rem;
    }
    
    .contact-grid {
      grid-template-columns: 1fr;
    }
    
    .contact-item {
      padding: 1.25rem;
    }
    
    .cta-buttons {
      flex-direction: column;
      gap: 0.75rem;
    }
  }
</style>
