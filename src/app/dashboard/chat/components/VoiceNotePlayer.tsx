'use client';

import { MouseEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Avatar } from '_components/ui/avatar';
import { Icons } from '_components/custom';
import { formatDuration, voiceWaveform } from '../utils/chat';

const BAR_COUNT = 30;
const WAVE_HEIGHT = 28;
const THUMB_SIZE = 12;

interface VoiceNotePlayerProps {
  url: string;
  /** Identifiant stable : l'onde reste la même d'un affichage à l'autre (et sur le mobile) */
  seed: string;
  durationMs: number | null;
  /** Couleur du curseur et du micro */
  accent: string;
  senderName?: string;
  /** Heure et statut du message, alignés à droite sous l'onde */
  footer?: ReactNode;
}

/**
 * Note vocale : lecture, onde (avec curseur, cliquable pour se déplacer), avatar de
 * l'expéditeur marqué d'un micro, puis durée et heure d'envoi sur la même ligne.
 */
export function VoiceNotePlayer({
  url,
  seed,
  durationMs,
  accent,
  senderName,
  footer,
}: VoiceNotePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);
  const bars = useMemo(() => voiceWaveform(seed, BAR_COUNT), [seed]);

  // Le m4a peut annoncer une durée infinie avant lecture : la durée enregistrée prime alors
  const total =
    Number.isFinite(mediaDuration) && mediaDuration > 0 ? mediaDuration * 1000 : (durationMs ?? 0);
  const progress = total ? Math.min(1, elapsed / total) : 0;
  const playedBars = Math.round(progress * BAR_COUNT);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setElapsed(audio.currentTime * 1000);
    const onMeta = () => setMediaDuration(audio.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    // Fin de lecture : retour au début pour une nouvelle écoute
    const onEnded = () => {
      audio.currentTime = 0;
      setElapsed(0);
      setPlaying(false);
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('durationchange', onMeta);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('durationchange', onMeta);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  };

  const seek = (event: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !total) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    audio.currentTime = (ratio * total) / 1000;
    setElapsed(ratio * total);
  };

  return (
    <Flex align="center" gap={3} w="280px" maxW="100%">
      <audio ref={audioRef} src={url} preload="metadata">
        <track kind="captions" />
      </audio>

      <Box
        as="button"
        onClick={toggle}
        aria-label={playing ? 'Mettre en pause' : 'Écouter la note vocale'}
        cursor="pointer"
        flexShrink={0}
      >
        {playing ? <Icons.VoicePause size={15} /> : <Icons.VoicePlay size={15} />}
      </Box>

      <Flex direction="column" flex={1} minW={0} gap={0.5}>
        <Flex
          role="slider"
          aria-label="Position de lecture"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          onClick={seek}
          position="relative"
          h={`${WAVE_HEIGHT}px`}
          align="center"
          justify="space-between"
          cursor="pointer"
        >
          {bars.map((level, index) => (
            <Box
              key={index}
              w="3px"
              h={`${Math.max(3, level * WAVE_HEIGHT)}px`}
              borderRadius="full"
              bg="currentColor"
              opacity={index < playedBars ? 1 : 0.4}
            />
          ))}
          <Box
            position="absolute"
            pointerEvents="none"
            left={`calc(${progress * 100}% - ${THUMB_SIZE / 2}px)`}
            w={`${THUMB_SIZE}px`}
            h={`${THUMB_SIZE}px`}
            borderRadius="full"
            bg={accent}
          />
        </Flex>

        <Flex align="center" justify="space-between">
          <Text
            fontSize="x-small"
            fontWeight="medium"
            opacity={0.75}
            fontVariantNumeric="tabular-nums"
          >
            {formatDuration(playing || elapsed > 0 ? elapsed : total)}
          </Text>
          {footer}
        </Flex>
      </Flex>

      <Box position="relative" flexShrink={0}>
        <Avatar name={senderName} size="lg" />
        <Box position="absolute" bottom="-2px" left="-8px" color={accent}>
          <Icons.Mic size={18} />
        </Box>
      </Box>
    </Flex>
  );
}
