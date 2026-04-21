'use client';

import dynamic from 'next/dynamic';
import {
  ConfirmCommand,
  NoDataFoundLottie,
  LoaderAnimation,
  DeleteAnimation,
  TrashAnimation,
  TrashAnimationV2,
  ThinkingAnimation,
} from '_lottie/json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const LottieAnimation = () => {
  return <Lottie animationData={ConfirmCommand} />;
};

const NoDataFoundLottieAnimation = () => {
  return <Lottie animationData={NoDataFoundLottie} />;
};

const LoaderLottie = () => {
  return <Lottie animationData={LoaderAnimation} />;
};

const DeleteLottie = () => {
  return <Lottie animationData={DeleteAnimation} />;
};

const TrashLottieAnimation = () => {
  return <Lottie animationData={TrashAnimation} />;
};

const TrashLottieAnimationV2 = () => {
  return <Lottie animationData={TrashAnimationV2} />;
};

const ThinkingLottieAnimation = () => {
  return <Lottie animationData={ThinkingAnimation} />;
};

export {
  LottieAnimation,
  NoDataFoundLottieAnimation,
  LoaderLottie,
  DeleteLottie,
  TrashLottieAnimation,
  TrashLottieAnimationV2,
  ThinkingLottieAnimation,
};
