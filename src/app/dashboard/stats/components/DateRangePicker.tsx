'use client';

import { HStack, Input, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { BaseButton, Icons } from '_components/custom';

type DateRangePickerProps = {
  startDate?: string;
  endDate?: string;
  onChange: (range: { startDate: string; endDate: string }) => void;
  label?: string;
};

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  label = 'Période',
}: DateRangePickerProps) {
  const [start, setStart] = useState(startDate ?? '');
  const [end, setEnd] = useState(endDate ?? '');

  useEffect(() => {
    if (startDate) setStart(startDate);
    if (endDate) setEnd(endDate);
  }, [startDate, endDate]);

  const handleApply = () => {
    onChange({ startDate: start, endDate: end });
  };

  return (
    <HStack gap={3} alignItems="flex-end" width="full">
      <Text minW="110px" fontWeight="semibold">
        {label}
      </Text>
      <Input
        type="date"
        value={start}
        onChange={(event) => setStart(event.target.value)}
        max={end || undefined}
      />
      <Input
        type="date"
        value={end}
        onChange={(event) => setEnd(event.target.value)}
        min={start || undefined}
      />
      <BaseButton onClick={handleApply}>Appliquer</BaseButton>
    </HStack>
  );
}
