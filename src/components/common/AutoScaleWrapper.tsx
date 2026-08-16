import React from 'react';
import { useAutoScale } from '../../lib/autoScale';

interface AutoScaleWrapperProps {
  children: React.ReactNode;
  isWebMode?: boolean;
}

export const AutoScaleWrapper: React.FC<AutoScaleWrapperProps> = ({ children, isWebMode = true }) => {
  const { enabled, scaleRatio, scalePercent, windowSize } = useAutoScale();

  // If auto-scale is disabled or in device simulator frame mode (iOS/Android), let device simulator handle its own frame
  if (!enabled || !isWebMode || scaleRatio === 1.0) {
    return (
      <div className="w-full min-h-screen relative auto-scale-content-root">
        {children}
      </div>
    );
  }

  // Calculate inverse width so the container spans 100% of the visible viewport accurately
  const inverseWidthPercent = (100 / scaleRatio);

  return (
    <div
      className="w-full min-h-screen overflow-x-hidden relative auto-scale-viewport-wrapper bg-slate-950/20"
      style={{
        width: '100vw',
        maxWidth: '100%',
      }}
    >
      <div
        className="auto-scale-transform-container origin-top transition-transform duration-75 ease-out"
        style={{
          width: `${inverseWidthPercent}%`,
          transform: `scale(${scaleRatio})`,
          transformOrigin: 'top center',
          marginLeft: `${((100 - inverseWidthPercent) / 2)}%`,
        }}
      >
        <div className="w-full min-h-screen relative auto-scale-inner antialiased">
          {children}
        </div>
      </div>
    </div>
  );
};
