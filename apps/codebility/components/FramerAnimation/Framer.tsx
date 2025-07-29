// Framer.tsx
export const box = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

export const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const fadeInOutRightToLeft = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,

    transition: {
      duration: 0.5,
    },
  },
};

export const fadeInOutLeftToRight = {
  hidden: { opacity: 0, x: "-25%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const fadeInOutUpToDown = {
  hidden: { opacity: 0, y: "-50%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const fadeInOutDownToUp = {
  hidden: { opacity: 0, y: "25%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const SocialContainer = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};
