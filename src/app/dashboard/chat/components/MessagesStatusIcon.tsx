'use client';

import { Icons } from '_components/custom';
import { VariablesColors } from '_theme/variables';

type MessageStatus = 'sending' | 'failed' | 'SENT' | 'DELIVERED' | 'READ';

interface MessageStatusIconProps {
  status?: MessageStatus;
}

export function MessageStatusIcon({ status }: MessageStatusIconProps) {
  if (!status || status === 'failed') return null;

  if (status === 'sending') {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="3" fill="var(--chakra-colors-fg-subtle)" opacity="0.5" />
      </svg>
    );
  }

  if (status === 'SENT') {
    return <Icons.Check size={14} color={VariablesColors.grayScale} />;
  }

  if (status === 'DELIVERED') {
    return <Icons.DoubleCheck size={14} color={VariablesColors.grayScale} />;
  }

  if (status === 'READ') {
    return <Icons.DoubleCheck size={14} color={VariablesColors.blue} />;
  }

  return null;
}
