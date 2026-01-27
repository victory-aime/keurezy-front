export const keyframes = {
  // Fade Animation
  fade: {
    "0%": { opacity: "0" },
    "100%": { opacity: "1" },
  },

  // Dot Bounce Animation
  dotBounce: {
    "0%, '80%',100%": { transform: "scale(1)" },
    "40%": { transform: "scale(1.5)" },
  },

  // Bar Pulse Animation
  barPulse: {
    "0%": { transform: "scaleY(1)" },
    "50%": { transform: "scaleY(1.5)" },
    "100%": { transform: "scaleY(1)" },
  },

  // Slide Left Animation
  slideLeft: {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(0)" },
  },
  // Slide Right Animation
  slideRight: {
    "0%": { transform: "translateX(100%)" },
    "100%": { transform: "translateX(0)" },
  },

  slideIn: {
    "0%": { transform: "translateY(-10px)" },
    "100%": { transform: "translateY(0)" },
  },
  // Shake Animation
  shake: {
    "0%": { transform: "translateX(0)" },
    "20%": { transform: "translateX(-6px)" },
    "40%": { transform: "translateX(6px)" },
    "60%": { transform: "translateX(-4px)" },
    "80%": { transform: "translateX(4px)" },
    "100%": { transform: "translateX(0)" },
  },
  logo_animation: {
    "0%": {
      transform: "translateX(-300%) scale(1)",
      opacity: 0,
    },
    "25%": {
      transform: "translateX(0%) scale(1.5)",
      opacity: 1,
    },
    "50%": {
      transform: "translateX(0%) scale(2)",
      opacity: 1,
    },
    "75%": {
      transform: "translateX(0%) scale(1)",
      opacity: 1,
    },
    "100%": {
      transform: "translateX(300%) scale(1) rotate(360deg)",
      opacity: 0,
    },
  },
};

export const animations = {
  fade: { value: "fade 1s ease-in-out forwards" },
  dotBounce: { value: "dotBounce 0.6s ease-in-out infinite" },
  barPulse: { value: "barPulse 0.6s ease-in-out infinite" },
  slideLeft: { value: "slideLeft 0.6s ease-in-out forwards" },
  slideRight: { value: "slideRight 0.6s ease-in forwards" },
  slideIn: { value: "slideIn 0.3s ease-in-out" },
  shake: { value: "shake 0.5s ease-in-out" },
  logo_animation: { value: "logo_animation 3s infinite ease-in-out" },
};
