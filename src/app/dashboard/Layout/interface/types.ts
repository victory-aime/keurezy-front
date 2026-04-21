interface ITourStep {
  target: string;
  title: string;
  description: string;
  position: 'bottom' | 'right' | 'left' | 'top' | 'center';
}

interface IGuidedTourProps {
  onComplete: () => void;
  tourStep: ITourStep[];
}

export type { IGuidedTourProps, ITourStep };
