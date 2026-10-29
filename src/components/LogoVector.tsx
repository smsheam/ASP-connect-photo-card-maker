import React from 'react';
import { LogoVariant } from '../types/card';

interface LogoVectorProps {
  variant?: LogoVariant;
  className?: string;
  size?: number; // scale multiplier
}

export const LogoVector: React.FC<LogoVectorProps> = ({
  variant = 'white-red',
  className = '',
  size = 1,
}) => {
  let aspColor = '#FFFFFF';
  let connectColor = '#E11D48';

  if (variant === 'mono-white') {
    aspColor = '#FFFFFF';
    connectColor = '#FFFFFF';
  } else if (variant === 'mono-black') {
    aspColor = '#0F172A';
    connectColor = '#E11D48';
  } else if (variant === 'gold-edition') {
    aspColor = '#FBBF24';
    connectColor = '#F59E0B';
  } else {
    // white-red
    aspColor = '#FFFFFF';
    connectColor = '#E11D48';
  }

  const baseWidth = 240 * size;
  const baseHeight = 56 * size;

  return (
    <div
      className={`inline-flex items-center select-none font-bold tracking-tight ${className}`}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
      }}
    >
      <svg
        viewBox="0 0 240 56"
        width={baseWidth}
        height={baseHeight}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* ASP text in condensed serif bold */}
        <text
          x="4"
          y="42"
          fill={aspColor}
          fontFamily="system-ui, -apple-system, 'Merriweather', 'Georgia', serif"
          fontSize="44"
          fontWeight="900"
          letterSpacing="1"
        >
          ASP
        </text>

        {/* Bengali 'কানেক্ট' with top connecting bar */}
        <text
          x="94"
          y="41"
          fill={connectColor}
          fontFamily="'Hind Siliguri', 'Noto Sans Bengali', sans-serif"
          fontSize="40"
          fontWeight="800"
          letterSpacing="-0.5"
        >
          কানেক্ট
        </text>
      </svg>
    </div>
  );
};

/**
 * Draws the ASP কানেক্ট logo directly onto HTML5 Canvas
 */
export function drawCanvasLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  variant: LogoVariant = 'white-red'
) {
  let aspColor = '#FFFFFF';
  let connectColor = '#E11D48';

  if (variant === 'mono-white') {
    aspColor = '#FFFFFF';
    connectColor = '#FFFFFF';
  } else if (variant === 'mono-black') {
    aspColor = '#0F172A';
    connectColor = '#E11D48';
  } else if (variant === 'gold-edition') {
    aspColor = '#FBBF24';
    connectColor = '#F59E0B';
  }

  ctx.save();
  ctx.translate(x, y);

  // Soft contrast shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 12 * scale;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4 * scale;

  // Draw "ASP"
  ctx.fillStyle = aspColor;
  ctx.font = `900 ${Math.round(44 * scale)}px 'Merriweather', 'Georgia', serif`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('ASP', 0, 0);

  // Measure ASP to place কানেক্ট
  const aspWidth = ctx.measureText('ASP').width;

  // Draw "কানেক্ট" in Bengali font
  ctx.fillStyle = connectColor;
  ctx.font = `800 ${Math.round(41 * scale)}px 'Hind Siliguri', 'Noto Sans Bengali', sans-serif`;
  ctx.fillText('কানেক্ট', aspWidth + 12 * scale, 0);

  ctx.restore();
}
