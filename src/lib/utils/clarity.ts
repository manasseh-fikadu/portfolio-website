/**
 * Microsoft Clarity analytics initialization
 * This utility initializes Clarity analytics in a way that:
 * 1. Keeps the project ID secure (loaded from environment variables)
 * 2. Only loads in production environments by default
 * 3. Follows best practices for performance
 */

// Extend the Window interface to include the clarity property
declare global {
  interface Window {
    clarity: {
      (method: string, ...args: any[]): void;
      q?: any[];
    };
  }
}

/**
 * Initialize Microsoft Clarity
 * @param projectId - The Clarity project ID
 * @param loadInDev - Whether to load Clarity in development
 */
export function initClarity(projectId: string, loadInDev = false): void {
  // Only run in browser environment
  if (typeof window === 'undefined') return;
  
  // Only load in production or if explicitly allowed in development
  if (import.meta.env.PROD || loadInDev) {
    if (!projectId) {
      return;
    }

    // Initialize Clarity using the same pattern as the official script
    window.clarity = window.clarity || function () { 
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${projectId}`;
    
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      return;
    }
  } else {
    return;
  }
}
