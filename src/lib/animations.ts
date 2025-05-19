
// Animation keyframes and utilities for the app

// Define keyframes without external dependencies
export const pulseKeyframes = {
  "0%": {
    opacity: "0.7",
    transform: "scale(0.98)"
  },
  "50%": {
    opacity: "1",
    transform: "scale(1.03)"
  },
  "100%": {
    opacity: "0.7",
    transform: "scale(0.98)"
  }
};

export const breatheKeyframes = {
  "0%": {
    transform: "scale(1)",
    opacity: "0.9"
  },
  "50%": {
    transform: "scale(1.1)",
    opacity: "1"
  },
  "100%": {
    transform: "scale(1)",
    opacity: "0.9"
  }
};

export const waveKeyframes = {
  "0%": {
    transform: "translateX(0) translateY(0)"
  },
  "25%": {
    transform: "translateX(2px) translateY(-2px)"
  },
  "50%": {
    transform: "translateX(0) translateY(0)"
  },
  "75%": {
    transform: "translateX(-2px) translateY(2px)"
  },
  "100%": {
    transform: "translateX(0) translateY(0)"
  }
};

export const floatKeyframes = {
  "0%": {
    transform: "translateY(0)"
  },
  "50%": {
    transform: "translateY(-8px)"
  },
  "100%": {
    transform: "translateY(0)"
  }
};

// New animations for sidebar and slider
export const slideInLeftKeyframes = {
  "0%": {
    opacity: "0",
    transform: "translateX(-20px)"
  },
  "100%": {
    opacity: "1",
    transform: "translateX(0)"
  }
};

export const glowPulseKeyframes = {
  "0%": {
    boxShadow: "0 0 0 0 rgba(155, 135, 245, 0.4)"
  },
  "70%": {
    boxShadow: "0 0 0 6px rgba(155, 135, 245, 0)"
  },
  "100%": {
    boxShadow: "0 0 0 0 rgba(155, 135, 245, 0)"
  }
};

export const iconPulseKeyframes = {
  "0%": {
    transform: "scale(1)"
  },
  "50%": {
    transform: "scale(1.15)"
  },
  "100%": {
    transform: "scale(1)"
  }
};
