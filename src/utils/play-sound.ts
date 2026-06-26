let audio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio('/assets/audio/message.mp3');
    audio.volume = 0.5;
  }
  return audio;
}

export function playNotificationSound(): void {
  try {
    const sound = getAudio();
    sound.currentTime = 0; // permet de rejouer même si déjà en cours
    sound.play().catch(() => {
      // Les navigateurs bloquent l'autoplay sans interaction préalable
      // C'est silencieux par design — pas d'erreur visible à l'user
    });
  } catch {
    // Audio non supporté — fail silently
  }
}
