import { ReactNode } from 'react';
import './CRTEffect.css';

interface CRTEffectProps {
  children: ReactNode;
}

export function CRTEffect({ children }: CRTEffectProps) {
  return (
    <div className="crt-screen crt-scanlines crt-flicker">
      <div className="crt-content">
        {children}
      </div>
    </div>
  );
}
