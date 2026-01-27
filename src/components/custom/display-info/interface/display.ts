interface InfoItem {
  label: string | React.ReactNode;
  value: any;
}

interface BaseDisplayInfoByColumnsProps {
  leftItems: InfoItem[];
  rightItems: InfoItem[];
  title?: string;
  isLoading?: boolean;
  gap?: number;
}

export type { BaseDisplayInfoByColumnsProps, InfoItem };
