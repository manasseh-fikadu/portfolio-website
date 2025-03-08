<script>
  import { onMount } from 'svelte';
  
  // State for blog posts
  let posts = [];
  let loading = true;
  let error = null;
  
  // Your Medium username
  const mediumUsername = '@minasesotlg'; // Replace with your actual Medium username
  
  onMount(async () => {
    try {
      // Fetch your Medium RSS feed via a CORS proxy
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${mediumUsername}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Medium posts');
      }
      
      const data = await response.json();
      console.log('Medium API response:', data); // For debugging
      
      if (data.status === 'ok') {
        // Process the posts
        posts = data.items.map(item => {
          // Extract image from content if thumbnail is missing
          let thumbnail = item.thumbnail;
          
          if (!thumbnail || thumbnail === '') {
            // Try to extract the first image from the content
            const imgRegex = /<img[^>]+src="([^"]+)"/g;
            const match = imgRegex.exec(item.content);
            if (match && match[1]) {
              thumbnail = match[1];
            }
          }
          
          return {
            title: item.title,
            pubDate: new Date(item.pubDate),
            link: item.link,
            thumbnail: thumbnail,
            // Extract a clean excerpt from the description
            excerpt: item.description
              .replace(/<[^>]*>/g, '') // Remove HTML tags
              .substring(0, 150) + '...' // Limit to 150 chars
          };
        });
        
        console.log('Processed posts:', posts); // For debugging
      } else {
        throw new Error('Invalid RSS feed');
      }
    } catch (err) {
      console.error('Error fetching Medium posts:', err);
      error = err.message;
    } finally {
      loading = false;
    }
  });
  
  // Format date to a readable string
  function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
</script>

<svelte:head>
  <title>Manasseh Fikadu - Blogs</title>
  <meta name="description" content="Read Manasseh Fikadu's blog posts on technology, programming, and more." />
</svelte:head>

<div class="blogs-page">
  <div class="container">
    <div class="back-button-container">
      <a href="/" class="back-button btn secondary">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5"></path>
          <path d="M12 19l-7-7 7-7"></path>
        </svg>
        Back to Home
      </a>
    </div>
    
    <h1 class="section-title">My Blog Posts</h1>
    <p class="section-subtitle">Articles I've written on Medium</p>
    
    {#if loading}
      <div class="loading">
        <p>Loading blog posts...</p>
      </div>
    {:else if error}
      <div class="error">
        <p>Error loading blog posts: {error}</p>
        <p>Please check out my articles directly on <a href="https://medium.com/{mediumUsername}" target="_blank" rel="noopener noreferrer">Medium</a>.</p>
      </div>
    {:else if posts.length === 0}
      <div class="no-posts">
        <p>No blog posts found. Please check out my articles directly on <a href="https://medium.com/{mediumUsername}" target="_blank" rel="noopener noreferrer">Medium</a>.</p>
      </div>
    {:else}
      <div class="blog-grid">
        {#each posts as post}
          <a href={post.link} target="_blank" rel="noopener noreferrer" class="blog-card">
            {#if post.thumbnail && post.thumbnail !== ''}
              <div class="blog-image" style="background-image: url('{post.thumbnail}')"></div>
            {:else}
              <div class="blog-image blog-image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
            {/if}
            <div class="blog-content">
              <h2 class="blog-title">{post.title}</h2>
              <p class="blog-date">{formatDate(post.pubDate)}</p>
              <p class="blog-excerpt">{post.excerpt}</p>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .blogs-page {
    padding: 2rem 0;
  }
  
  .container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .back-button-container {
    margin-bottom: 2rem;
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
  
  .section-title {
    font-size: 2rem;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .section-subtitle {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--text-secondary);
  }
  
  .loading, .error, .no-posts {
    text-align: center;
    padding: 2rem;
    background-color: var(--secondary-bg);
    border-radius: 0.5rem;
    margin: 2rem 0;
  }
  
  .blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .blog-card {
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    text-decoration: none;
    color: var(--text-color);
    background-color: var(--secondary-bg);
    height: 100%;
  }
  
  .blog-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
  
  .blog-image {
    height: 180px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  
  .blog-image-placeholder {
    background-color: var(--accent-color-light);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
  }
  
  .blog-content {
    padding: 1.5rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .blog-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  
  .blog-date {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }
  
  .blog-excerpt {
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--text-secondary);
    flex-grow: 1;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .blog-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
