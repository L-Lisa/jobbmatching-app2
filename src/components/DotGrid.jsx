import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

const DotGrid = ({
  dotSize = 3,
  dotColor = '#4169E1',
  dotOpacity = 0.3,
  dotSpacing = 28,
  shockRadius = 150,
  shockStrength = 8,
  resistance = 600,
  returnDuration = 1.2,
}) => {
  const containerRef = useRef(null);
  const dotsRef = useRef([]);
  const mousePos = useRef({ x: -1000, y: -1000 });

  const throttle = useCallback((func, limit) => {
    let lastCall = 0;
    return function (...args) {
      const now = performance.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const cols = Math.ceil(rect.width / dotSpacing);
    const rows = Math.ceil(rect.height / dotSpacing);

    // Clear existing dots
    container.innerHTML = '';
    dotsRef.current = [];

    // Create dots
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const dot = document.createElement('div');
        const x = col * dotSpacing + dotSpacing / 2;
        const y = row * dotSpacing + dotSpacing / 2;

        dot.style.cssText = `
          position: absolute;
          width: ${dotSize}px;
          height: ${dotSize}px;
          background-color: ${dotColor};
          opacity: ${dotOpacity};
          border-radius: 50%;
          left: ${x}px;
          top: ${y}px;
          transform: translate(-50%, -50%);
          pointer-events: none;
          transition: opacity 0.3s ease;
        `;

        dot.dataset.originX = x;
        dot.dataset.originY = y;

        container.appendChild(dot);
        dotsRef.current.push(dot);
      }
    }

    const handleMouseMove = throttle((e) => {
      const containerRect = container.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - containerRect.left,
        y: e.clientY - containerRect.top,
      };

      dotsRef.current.forEach((dot) => {
        const originX = parseFloat(dot.dataset.originX);
        const originY = parseFloat(dot.dataset.originY);

        const dx = mousePos.current.x - originX;
        const dy = mousePos.current.y - originY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < shockRadius) {
          const force = (1 - distance / shockRadius) * shockStrength;
          const angle = Math.atan2(dy, dx);
          const offsetX = -Math.cos(angle) * force * 3;
          const offsetY = -Math.sin(angle) * force * 3;

          gsap.to(dot, {
            x: offsetX,
            y: offsetY,
            opacity: Math.min(dotOpacity + 0.4, 1),
            duration: 0.2,
            ease: 'power2.out',
          });
        } else {
          gsap.to(dot, {
            x: 0,
            y: 0,
            opacity: dotOpacity,
            duration: returnDuration,
            ease: 'elastic.out(1, 0.5)',
          });
        }
      });
    }, 16);

    const handleMouseLeave = () => {
      dotsRef.current.forEach((dot) => {
        gsap.to(dot, {
          x: 0,
          y: 0,
          opacity: dotOpacity,
          duration: returnDuration,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [dotSize, dotColor, dotOpacity, dotSpacing, shockRadius, shockStrength, resistance, returnDuration, throttle]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    />
  );
};

export default DotGrid;
