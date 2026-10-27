import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Mathematically generated 12-peak wavy ring path for SVG viewBox 0 0 100 100
const { WAVY_PATH, TOTAL_LENGTH } = (() => {
  const points = 360;
  const r0 = 38;
  const amplitude = 3;
  const wavesCount = 12;
  const pathParts = [];
  let length = 0;
  let prevX = 0;
  let prevY = 0;

  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * Math.PI * 2;
    const r = r0 + amplitude * Math.cos(wavesCount * theta);
    const x = 50 + r * Math.cos(theta);
    const y = 50 + r * Math.sin(theta);

    pathParts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(3)} ${y.toFixed(3)}`);

    if (i > 0) {
      const dx = x - prevX;
      const dy = y - prevY;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    prevX = x;
    prevY = y;
  }
  return {
    WAVY_PATH: pathParts.join(' ') + ' Z',
    TOTAL_LENGTH: length,
  };
})();

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  subMessage?: string;
  progress?: number;
  fullScreen?: boolean;
  className?: string;
  color?: string;
}

export function Loader({
  size = 'lg',
  message = 'Loading...',
  subMessage,
  progress,
  fullScreen = false,
  className = '',
  color,
}: LoaderProps) {
  const sizeMap = {
    sm: { box: 40, stroke: 4 },
    md: { box: 56, stroke: 6 },
    lg: { box: 72, stroke: 8 },
    xl: { box: 96, stroke: 9 },
  };

  const { box, stroke } = sizeMap[size];
  const strokeColor = color || 'var(--color-primary, #7C3AED)';

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes wavy-flow-dash {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -${TOTAL_LENGTH.toFixed(3)}; }
        }
      `,
        }}
      />
      <div
        className="relative flex items-center justify-center"
        style={{ width: box, height: box }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <path
            d={WAVY_PATH}
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: `${(TOTAL_LENGTH * 0.78).toFixed(2)} ${(TOTAL_LENGTH * 0.22).toFixed(2)}`,
              animation: 'wavy-flow-dash 4.5s linear infinite',
            }}
          />
        </svg>
      </div>

      {message && <p className="text-sm font-medium text-foreground">{message}</p>}
      {subMessage && <p className="text-xs text-muted-foreground">{subMessage}</p>}
      {typeof progress === 'number' && (
        <div className="w-48 h-1.5 bg-surface-muted rounded-full overflow-hidden mt-1">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

export function PageLoader({ color }: { color?: string }) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setFading(false);
    setVisible(true);

    const fadeTimer = setTimeout(() => {
      setFading(true);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        setFading(false);
      }, 300);

      timerRef.current = hideTimer;
    }, 450);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTimeout(fadeTimer);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-[1px] transition-opacity duration-300 pointer-events-none"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <Loader size="lg" color={color} message="" />
    </div>
  );
}
