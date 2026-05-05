import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Keurezy',
    short_name: 'IMMO',
    description:
      'Plateforme moderne de gestion immobilière. Gérez vos biens, locataires et demandes de location facilement depuis un tableau de bord centralisé.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#673ab6',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
