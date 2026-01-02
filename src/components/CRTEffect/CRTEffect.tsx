/**
 * CRTEffect Component
 *
 * A wrapper component that applies psychedelic visual effects to its children.
 *
 * Design Choices:
 * - Wrapper pattern: Separates visual effects from business logic
 * - CSS-based effects: Hardware-accelerated, no JavaScript animation overhead
 * - Layered pseudo-elements: Scanlines, vignette, and glow are separate layers
 *   that can be independently styled and animated
 * - Fixed positioning for effects: Ensures effects cover entire viewport
 *   regardless of content scroll position
 *
 * Visual Effects Applied:
 * 1. Cosmic gradient background with animated position
 * 2. Rotating fractal conic-gradient overlay
 * 3. Scanline effect via repeating linear gradient
 * 4. Vignette darkening at screen edges
 * 5. Subtle flicker animation for authenticity
 * 6. Floating colored orbs (via CRTEffect.css pseudo-elements)
 */

import { ReactNode } from 'react';
import './CRTEffect.css';

interface CRTEffectProps {
  children: ReactNode;
}

export function CRTEffect({ children }: CRTEffectProps) {
  return (
    /**
     * Multiple CSS classes enable layered effects:
     * - crt-screen: Base container with gradient background
     * - crt-scanlines: Adds scanline overlay via ::after pseudo-element
     * - crt-flicker: Applies subtle opacity animation
     *
     * Each class is defined in crt-effects.css with its own keyframe
     * animations and pseudo-element layers.
     */
    <div className="crt-screen crt-scanlines crt-flicker">
      {/*
        Content wrapper ensures children render above the effect layers.
        z-index in CSS places this above the background effects but
        below the scanline overlay for proper visual stacking.
      */}
      <div className="crt-content">
        {children}
      </div>
    </div>
  );
}
