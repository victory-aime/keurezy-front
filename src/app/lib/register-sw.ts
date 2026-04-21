export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered', registration);
      } catch (err) {
        console.error('SW registration failed', err);
      }
    });
  }
}
