// _utils/clientNavigate.ts

/**
 * Redirige via window.location uniquement côté client.
 * Évite les erreurs SSR "window is not defined".
 */
export const clientRedirect = (url: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = url;
  }
};

export const clientReload = () => {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

export const clientReplace = (url: string) => {
  if (typeof window !== 'undefined') {
    window.location.replace(url);
  }
};
