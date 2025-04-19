<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
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
  <title>Minase Fikadu - Portfolio</title>
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
    {#each projects as project, i}
      <div class="project-card" transition:fade={{ delay: 100 + i * 80, duration: 600 }}>
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
    
    <a href="https://www.upwork.com/freelancers/~012ac90b612e6f234d" target="_blank" rel="noopener noreferrer" class="contact-item">
      <div class="contact-icon">
        <svg viewBox="0 0 2500 2500" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m2315.4 0h-2130.7c-102 0-184.7 80.2-184.7 179.1v2141.7c0 99 82.7 179.2 184.7 179.2h2130.7c102 0 184.6-80.3 184.6-179.2v-2141.7c0-98.9-82.6-179.1-184.6-179.1z"/>
          <path d="m1834.6 1453.7c-98.4 0-190.5-41.7-274.3-109.6l20.4-95.8.9-3.5c18.2-102 75.8-273.3 253-273.3 132.9 0 241 108.3 241 241.3-.4 132.6-108.5 240.9-241 240.9zm0-726.7c-226.4 0-401.9 147.3-473.2 389.5-109-163.7-191.4-360.2-239.7-525.7h-243.6v634.8c0 125.1-101.9 227.1-226.9 227.1s-226.8-102-226.8-227.1v-634.8h-243.7v634.8c-.9 260 210.5 473.4 470.1 473.4s471-213.4 471-473.4v-106.5c47.4 98.9 105.4 198.7 175.9 287.5l-149.3 702.7h249.5l108.1-509.7c94.8 60.8 203.8 98.9 328.8 98.9 267.2 0 484.7-219.2 484.7-486.7-.2-267-217.7-484.8-484.9-484.8z" fill="#fff"/>
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
    position: relative;
    border: 1.5px solid transparent;
    border-radius: 1.25rem;
    overflow: hidden;
    background: rgba(255,255,255,0.13);
    box-shadow: 0 8px 32px 0 rgba(31,38,135,0.13), 0 1.5px 8px 0 rgba(0,0,0,0.07);
    backdrop-filter: blur(10px) saturate(120%);
    -webkit-backdrop-filter: blur(10px) saturate(120%);
    transition: 
      transform 0.35s cubic-bezier(.22,1,.36,1), 
      box-shadow 0.35s cubic-bezier(.22,1,.36,1),
      border-color 0.3s;
    height: 100%;
    display: flex;
    flex-direction: column;
    animation: card-fade-in 0.8s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes card-fade-in {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .project-card:hover {
    transform: translateY(-10px) scale(1.025) rotateZ(-0.5deg);
    box-shadow: 0 16px 40px 0 rgba(31,38,135,0.22), 0 2px 8px 0 rgba(0,0,0,0.10);
    border-color: rgba(0, 153, 255, 0.18); /* subtle blue accent, adjust as needed */
    z-index: 2;
  }

  .project-image {
    position: relative;
    height: 220px;
    overflow: hidden;
    background: linear-gradient(120deg, var(--accent-color-light) 0%, var(--secondary-bg) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: 
      transform 0.7s cubic-bezier(.22,1,.36,1),
      filter 0.4s;
    filter: brightness(0.96) saturate(1.1) contrast(1.05);
    will-change: transform, filter;
  }

  .project-card:hover .project-image img {
    transform: scale(1.09) rotateZ(-0.5deg);
    filter: brightness(1.05) saturate(1.2) contrast(1.08);
  }

  .project-image::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg,rgba(0,0,0,0.10) 60%,rgba(0,0,0,0.18) 100%);
    pointer-events: none;
    z-index: 1;
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
    background: rgba(255,255,255,0.22);
    color: var(--accent-color);
    padding: 0.32rem 0.95rem;
    border-radius: 1.1rem;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    box-shadow: 0 1px 4px 0 rgba(31,38,135,0.06);
    border: 1px solid rgba(0,0,0,0.04);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    margin-bottom: 2px;
    transition: 
      background 0.3s,
      color 0.3s,
      border 0.3s;
  }
  .tag:hover {
    background: var(--accent-color-light);
    color: var(--accent-color);
    border: 1px solid var(--accent-color);
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
