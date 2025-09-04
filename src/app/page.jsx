"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { motion, useInView } from "framer-motion";


// --- Global Styles for custom effects ---
const GlobalStyles = () => (
  <style jsx="true" global="true">{`
    /* --- General Styles --- */
    body, html {
      cursor: none; /* Hide the default cursor */
    }
    .soft-glow {
      transition: all 0.3s ease;
    }
    .soft-glow:hover {
      transform: translateY(-5px);
      box-shadow: 0 0 20px rgba(0, 170, 255, 0.6);
    }
    .glass-card {
      background: rgba(20, 20, 40, 0.6);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(0, 170, 255, 0.2);
    }
    
    /* --- Custom Cursor Styles --- */
    .custom-cursor-dot {
      position: fixed;
      top: 0;
      left: 0;
      width: 8px;
      height: 8px;
      background-color: #00aaff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
    }
    .custom-cursor-outline {
      position: fixed;
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      border: 2px solid #00aaff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: width 0.3s, height 0.3s;
    }
    .custom-cursor-outline.hovered {
        width: 60px;
        height: 60px;
        background-color: rgba(0, 170, 255, 0.1);
    }

    /* --- Timeline Styles --- */
    .timeline {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
    }
    .timeline::after {
      content: '';
      position: absolute;
      width: 4px;
      background-color: rgba(0, 170, 255, 0.2);
      top: 0;
      bottom: 0;
      left: 50%;
      margin-left: -2px;
      border-radius: 2px;
    }
    .timeline-container {
      padding: 10px 40px;
      position: relative;
      background-color: inherit;
      width: 50%;
    }
    .timeline-container.left { left: 0; }
    .timeline-container.right { left: 50%; }
    .timeline-container::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      right: -17px;
      background-color: #0f172a;
      border: 4px solid #00aaff;
      top: 25px;
      border-radius: 50%;
      z-index: 1;
      transition: all 0.3s ease;
    }
    .timeline-container:hover::after {
        transform: scale(1.2);
        box-shadow: 0 0 10px #00aaff;
    }
    .timeline-container.right::after { left: -16px; }
    .timeline-content {
      padding: 20px 30px;
      position: relative;
      border-radius: 0.75rem;
    }
    .secure-iframe-container {
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    @media screen and (max-width: 768px) {
      .timeline::after { left: 31px; }
      .timeline-container { width: 100%; padding-left: 70px; padding-right: 25px; }
      .timeline-container.right { left: 0%; }
      .timeline-container.left::after, .timeline-container.right::after { left: 15px; }
    }
    
    /* --- TrueFocus Component Styles --- */
    .focus-container {
      position: relative;
      display: flex;
      gap: 0.5em;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }
    .focus-word {
      position: relative;
      font-size: 1.25rem;
      font-weight: 600;
      color: #22d3ee;
      cursor: none;
      transition:
        filter 0.3s ease,
        color 0.3s ease;
    }
    @media (min-width: 640px) {
      .focus-word {
        font-size: 1.5rem;
      }
    }
    .focus-word.active {
      filter: blur(0);
    }
    .focus-frame {
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      box-sizing: content-box;
      border: none;
    }
    .corner {
      position: absolute;
      width: 0.75rem;
      height: 0.75rem;
      border: 2px solid var(--border-color, #fff);
      filter: drop-shadow(0px 0px 4px var(--glow-color, #fff));
      border-radius: 3px;
      transition: none;
    }
    .top-left { top: -8px; left: -8px; border-right: none; border-bottom: none; }
    .top-right { top: -8px; right: -8px; border-left: none; border-bottom: none; }
    .bottom-left { bottom: -8px; left: -8px; border-right: none; border-top: none; }
    .bottom-right { bottom: -8px; right: -8px; border-left: none; border-top: none; }

    /* --- ShinyText Component Styles --- */
    .shiny-text-wrapper {
      position: relative;
      display: inline-block;
      color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
      background-image: linear-gradient(90deg, #a7a7a7, #fff, #a7a7a7);
      animation: shiny-text-animation 3s linear infinite;
      background-size: 200% 100%;
    }

    @keyframes shiny-text-animation {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `}</style>
);


// --- SVG Icons ---
const GithubIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>);
const LinkedinIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>);
const MailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const UsersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const AwardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>);
const TrophyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>);
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>);
const PresentationIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-presentation"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>);
const PaperPlaneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal ml-2"><path d="m3 3 3 9-3 9 19-9Z"/><path d="M6 12h16"/></svg>);
const TerminalIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-terminal"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>);
const BrainCircuitIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.993.129M12 5a3 3 0 1 1 5.993.129M12 5a3 3 0 1 1-5.993-.129M12 5a3 3 0 1 0 5.993-.129M12 19a3 3 0 1 0-5.993-.129M12 19a3 3 0 1 1 5.993-.129M12 19a3 3 0 1 1-5.993.129M12 19a3 3 0 1 0 5.993.129M17 12a3 3 0 1 0-5.993.129M17 12a3 3 0 1 1 5.993.129M17 12a3 3 0 1 1-5.993-.129M17 12a3 3 0 1 0 5.993-.129M7 12a3 3 0 1 0-5.993.129M7 12a3 3 0 1 1 5.993.129M7 12a3 3 0 1 1-5.993-.129M7 12a3 3 0 1 0 5.993-.129M12 5a3 3 0 1 0-5.993.129M12 5a3 3 0 1 1 5.993.129M12 5a3 3 0 1 1-5.993-.129M12 5a3 3 0 1 0 5.993-.129M12 19a3 3 0 1 0-5.993-.129M12 19a3 3 0 1 1 5.993-.129M12 19a3 3 0 1 1-5.993.129M12 19a3 3 0 1 0 5.993.129M17 12a3 3 0 1 0-5.993.129M17 12a3 3 0 1 1 5.993.129M17 12a3 3 0 1 1-5.993-.129M17 12a3 3 0 1 0 5.993-.129M7 12a3 3 0 1 0-5.993.129M7 12a3 3 0 1 1 5.993.129M7 12a3 3 0 1 1-5.993-.129M7 12a3 3 0 1 0 5.993-.129m-5-7 1.146.128a1 1 0 0 0 .854-.854L5 3m14 9-1.146-.128a1 1 0 0 0-.854.854L19 13m-5 6 1.146.128a1 1 0 0 0 .854-.854L16 19m-9-2 1.146.128a1 1 0 0 0 .854-.854L8 16m-3-4 .128 1.146a1 1 0 0 0 .854.854L7 14M12 5V3m5 9h2m-7 7v2m-7-7H3"/></svg>);

// --- Custom Components ---

const CustomCursor = () => {
    const cursorDotRef = useRef(null);
    const cursorOutlineRef = useRef(null);

    useEffect(() => {
        const moveCursor = (e) => {
            const { clientX, clientY } = e;
            if (cursorDotRef.current && cursorOutlineRef.current) {
                cursorDotRef.current.style.left = `${clientX}px`;
                cursorDotRef.current.style.top = `${clientY}px`;
                cursorOutlineRef.current.animate({
                    left: `${clientX}px`,
                    top: `${clientY}px`
                }, { duration: 500, fill: "forwards" });
            }
        };

        const handleMouseOver = (e) => {
            if (e.target.closest('a, button')) {
                cursorOutlineRef.current?.classList.add('hovered');
            }
        };
        const handleMouseOut = (e) => {
             if (e.target.closest('a, button')) {
                cursorOutlineRef.current?.classList.remove('hovered');
            }
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <>
            <div ref={cursorDotRef} className="custom-cursor-dot"></div>
            <div ref={cursorOutlineRef} className="custom-cursor-outline"></div>
        </>
    );
};

const ScrollFloat = ({ children, animationDuration = 1, stagger = 0.03 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const text = typeof children === 'string' ? children : '';

    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: stagger,
            },
        },
    };

    const charVariants = {
        hidden: { y: "100%", opacity: 0 },
        visible: {
            y: "0%",
            opacity: 1,
            transition: {
                duration: animationDuration,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            aria-label={text}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ display: 'inline-block', overflow: 'hidden' }}
        >
            {text.split('').map((char, index) => (
                <motion.span key={index} variants={charVariants} style={{ display: 'inline-block' }}>
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </motion.div>
    );
};

const ShinyText = ({ text, speed = 3, className = '' }) => {
  const customClassName = `shiny-text-wrapper ${className}`;
  const animationStyle = {
    animationDuration: `${speed}s`,
  };
  return (
    <span className={customClassName} style={animationStyle}>
      {text}
    </span>
  );
};

const ScrollReveal = ({ children, baseOpacity = 0, enableBlur = true, blurStrength = 10, baseRotation = 5 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <motion.div
            ref={ref}
            initial={{ 
                opacity: baseOpacity, 
                filter: enableBlur ? `blur(${blurStrength}px)` : 'none', 
                transform: `rotate(${baseRotation}deg) scale(0.95)`
            }}
            animate={{ 
                opacity: isInView ? 1 : baseOpacity, 
                filter: isInView ? 'blur(0px)' : (enableBlur ? `blur(${blurStrength}px)` : 'none'), 
                transform: isInView ? 'rotate(0deg) scale(1)' : `rotate(${baseRotation}deg) scale(0.95)`
            }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
            {children}
        </motion.div>
    );
};

const FuzzyText = ({
  children,
  fontSize = 'clamp(2rem, 10vw, 10rem)',
  fontWeight = 900,
  fontFamily = 'inherit',
  color = '#fff',
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const init = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (isCancelled) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const computedFontFamily =
        fontFamily === 'inherit' ? window.getComputedStyle(canvas).fontFamily || 'sans-serif' : fontFamily;

      const fontSizeStr = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;
      let numericFontSize;
      if (typeof fontSize === 'number') {
        numericFontSize = fontSize;
      } else {
        const temp = document.createElement('span');
        temp.style.fontSize = fontSize;
        document.body.appendChild(temp);
        const computedSize = window.getComputedStyle(temp).fontSize;
        numericFontSize = parseFloat(computedSize);
        document.body.removeChild(temp);
      }

      const text = React.Children.toArray(children).join('');

      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = 'alphabetic';
      const metrics = offCtx.measureText(text);

      const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
      const actualRight = metrics.actualBoundingBoxRight ?? metrics.width;
      const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
      const actualDescent = metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;

      const textBoundingWidth = Math.ceil(actualLeft + actualRight);
      const tightHeight = Math.ceil(actualAscent + actualDescent);

      const extraWidthBuffer = 10;
      const offscreenWidth = textBoundingWidth + extraWidthBuffer;

      offscreen.width = offscreenWidth;
      offscreen.height = tightHeight;

      const xOffset = extraWidthBuffer / 2;
      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = 'alphabetic';
      offCtx.fillStyle = color;
      offCtx.fillText(text, xOffset - actualLeft, actualAscent);

      const horizontalMargin = 50;
      const verticalMargin = 0;
      canvas.width = offscreenWidth + horizontalMargin * 2;
      canvas.height = tightHeight + verticalMargin * 2;
      ctx.translate(horizontalMargin, verticalMargin);

      const interactiveLeft = horizontalMargin + xOffset;
      const interactiveTop = verticalMargin;
      const interactiveRight = interactiveLeft + textBoundingWidth;
      const interactiveBottom = interactiveTop + tightHeight;

      let isHovering = false;
      const fuzzRange = 30;

      const run = () => {
        if (isCancelled) return;
        ctx.clearRect(-fuzzRange, -fuzzRange, offscreenWidth + 2 * fuzzRange, tightHeight + 2 * fuzzRange);
        const intensity = isHovering ? hoverIntensity : baseIntensity;
        for (let j = 0; j < tightHeight; j++) {
          const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
          ctx.drawImage(offscreen, 0, j, offscreenWidth, 1, dx, j, offscreenWidth, 1);
        }
        animationFrameId = window.requestAnimationFrame(run);
      };

      run();

      const isInsideTextArea = (x, y) => {
        return x >= interactiveLeft && x <= interactiveRight && y >= interactiveTop && y <= interactiveBottom;
      };

      const handleMouseMove = e => {
        if (!enableHover) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        isHovering = isInsideTextArea(x, y);
      };

      const handleMouseLeave = () => {
        isHovering = false;
      };

      const handleTouchMove = e => {
        if (!enableHover) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        isHovering = isInsideTextArea(x, y);
      };

      const handleTouchEnd = () => {
        isHovering = false;
      };

      if (enableHover) {
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd);
      }

      const cleanup = () => {
        window.cancelAnimationFrame(animationFrameId);
        if (enableHover) {
          canvas.removeEventListener('mousemove', handleMouseMove);
          canvas.removeEventListener('mouseleave', handleMouseLeave);
          canvas.removeEventListener('touchmove', handleTouchMove);
          canvas.removeEventListener('touchend', handleTouchEnd);
        }
      };

      canvas.cleanupFuzzyText = cleanup;
    };

    init();

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(animationFrameId);
      if (canvas && canvas.cleanupFuzzyText) {
        canvas.cleanupFuzzyText();
      }
    };
  }, [children, fontSize, fontWeight, fontFamily, color, enableHover, baseIntensity, hoverIntensity]);

  return <canvas ref={canvasRef} />;
};

const TrueFocus = ({
  sentence = 'True Focus',
  manualMode = false,
  blurAmount = 5,
  borderColor = 'green',
  glowColor = 'rgba(0, 255, 0, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1
}) => {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex(prev => (prev + 1) % words.length);
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      );

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;

    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex].getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = index => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex);
    }
  };

  return (
    <div className="focus-container" ref={containerRef}>
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={el => (wordRefs.current[index] = el)}
            className={`focus-word ${manualMode ? 'manual' : ''} ${isActive && !manualMode ? 'active' : ''}`}
            style={{
              filter: manualMode
                ? isActive
                  ? `blur(0px)`
                  : `blur(${blurAmount}px)`
                : isActive
                  ? `blur(0px)`
                  : `blur(${blurAmount}px)`,
              '--border-color': borderColor,
              '--glow-color': glowColor,
              transition: `filter ${animationDuration}s ease`
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="focus-frame"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0
        }}
        transition={{
          duration: animationDuration
        }}
        style={{
          '--border-color': borderColor,
          '--glow-color': glowColor
        }}
      >
        <span className="corner top-left"></span>
        <span className="corner top-right"></span>
        <span className="corner bottom-left"></span>
        <span className="corner bottom-right"></span>
      </motion.div>
    </div>
  );
};


const useScrollAnimate = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observer = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleElements(prev => new Set(prev).add(entry.target.id));
        }
      });
    }, { threshold: 0.1 });

    return () => observer.current?.disconnect();
  }, []);

  const observe = (element) => {
    if (element && observer.current) {
      observer.current.observe(element);
    }
  };

  return { observe, isVisible: (id) => visibleElements.has(id) };
};


const Header = ({ onMenuToggle }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ["about", "experience", "projects", "skills", "leadership", "contact"];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/80 backdrop-blur-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="text-2xl font-bold text-cyan-400 transition hover:text-cyan-300 neon-text">MD</a>
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <a key={link} href={link === 'contact' ? '/contact' : `#${link}`} className="text-lg capitalize text-slate-300 hover:text-cyan-400 transition-colors duration-300">{link}</a>
            ))}
          </nav>
            <a href="/contact" className="hidden md:inline-block px-5 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-all duration-300 text-white font-semibold">
              Contact
            </a>
          <button onClick={onMenuToggle} className="md:hidden text-slate-300">
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
};


const MobileMenu = ({ isOpen, onMenuToggle }) => {
    const navLinks = ["about", "experience", "projects", "skills", "leadership", "contact"];
    return (
        <div className={`fixed inset-0 bg-slate-900/95 backdrop-blur-lg z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
            <div className="flex justify-end p-6">
                <button onClick={onMenuToggle} className="text-slate-300">
                    <XIcon />
                </button>
            </div>
            <nav className="flex flex-col items-center justify-center h-full -mt-16 space-y-8">
                {navLinks.map(link => (
                  <a key={link} href={link === 'contact' ? '/contact' : `#${link}`} onClick={onMenuToggle} className="text-3xl capitalize text-slate-300 hover:text-cyan-400 transition-colors duration-300">{link}</a>
                ))}
                  <a href="/contact" onClick={onMenuToggle} className="mt-4 inline-block px-8 py-3 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 font-semibold">
                    Contact
                  </a>
            </nav>
        </div>
    );
};


const HeroSection = ({ onResumeView }) => {
    const [command, setCommand] = useState('');
    const [output, setOutput] = useState([]);
    const [showTerminal, setShowTerminal] = useState(false);
    const inputRef = useRef(null);
    const RESUME_COMMAND = 'view resume';

    const handleCommandSubmit = (e) => {
        e.preventDefault();
        const newOutput = [...output, { type: 'input', text: command }];
        
        if (command.trim().toLowerCase() === RESUME_COMMAND.toLowerCase()) {
            newOutput.push({ type: 'success', text: 'Success: Access granted. Opening resume...' });
            setOutput(newOutput);
            setCommand('');
            setTimeout(() => {
                onResumeView();
                setShowTerminal(false);
                setOutput([]);
            }, 1000);
        } else if (command.trim().toLowerCase() === 'help') {
             newOutput.push({ type: 'output', text: `Available commands: '${RESUME_COMMAND}', 'clear'` });
             setOutput(newOutput);
             setCommand('');
        }
         else if (command.trim().toLowerCase() === 'clear') {
            setOutput([]);
            setCommand('');
        }
        else {
            newOutput.push({ type: 'error', text: `bash: command not found: ${command}` });
            setOutput(newOutput);
            setCommand('');
        }
    };
    
    useEffect(() => {
        if(showTerminal && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showTerminal, output]);


    return (
        <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center">
            <div className="max-w-3xl">
                 <div className="pb-2 flex justify-center">
                    <FuzzyText
                        fontSize="clamp(3rem, 10vw, 4.5rem)"
                        fontWeight={700}
                        color="#E2E8F0"
                        baseIntensity={0.1}
                        hoverIntensity={0.35}
                    >
                        Mohammed Ayaan
                    </FuzzyText>
                </div>
                
                <div className="mt-4">
                  <TrueFocus
                    sentence="Innovate Integrate Inspire"
                    manualMode={false}
                    blurAmount={2}
                    borderColor="#22d3ee"
                    glowColor="rgba(34, 211, 238, 0.6)"
                    animationDuration={0.3}
                  />
                </div>

                <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto">
                I build intelligent systems with a security-first mindset, ranked in the Top 5% globally on TryHackMe.
                </p>
                <div className="mt-10 flex justify-center items-center gap-6">
                    <a href="https://github.com/Cybrian101" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"><GithubIcon /></a>
                    <a href="https://linkedin.com/in/md-ayaan" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"><LinkedinIcon /></a>
                    <a href="mailto:mohammedayaan14.2005@gmail.com" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"><MailIcon /></a>
                </div>
                
                <div className="mt-12">
                    {!showTerminal ? (
                        <button onClick={() => setShowTerminal(true)} className="px-6 py-3 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 font-semibold font-mono">
                            Get My Resume
                        </button>
                    ) : (
                        <div className="font-mono text-left max-w-xl mx-auto bg-black bg-opacity-50 rounded-lg border border-slate-700 p-4 text-sm glass-card">
                            <div className="text-slate-400 mb-2"># To view, type the command and press Enter:</div>
                            <div className="text-cyan-400 mb-2">&gt; {RESUME_COMMAND}</div>
                            <div className="h-24 overflow-y-auto pr-2">
                               {output.map((line, index) => (
                                    <div key={index}>
                                        {line.type === 'input' && <p><span className="text-cyan-400">$</span> {line.text}</p>}
                                        {line.type === 'output' && <p className="text-slate-300">{line.text}</p>}
                                        {line.type === 'error' && <p className="text-red-400">{line.text}</p>}
                                        {line.type === 'success' && <p className="text-green-400">{line.text}</p>}
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleCommandSubmit} className="flex items-center mt-2">
                                <span className="text-cyan-400 mr-2">$</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={command}
                                    onChange={(e) => setCommand(e.target.value)}
                                    className="bg-transparent border-none text-slate-300 w-full focus:ring-0 p-0"
                                    autoComplete="off"
                                />
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

const ResumeViewerModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    
    const resumeUrl = '/MdAyaan.pdf';
    
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[100] p-4" onClick={handleBackdropClick}>
            <div className="bg-slate-800 rounded-xl w-full h-full max-w-4xl max-h-[90vh] flex flex-col glass-card secure-iframe-container" onContextMenu={(e) => e.preventDefault()}>
                 <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h2 className="text-lg font-semibold text-white">My Resume</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>
                <div className="flex-grow">
                    <iframe src={resumeUrl} width="100%" height="100%" style={{ border: 'none' }} />
                </div>
            </div>
        </div>
    );
};


export default function PortfolioPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { observe, isVisible } = useScrollAnimate();
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    const particlesOptions = {
        background: {
            color: {
                value: 'transparent',
            },
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: 'grab',
                },
                resize: true,
            },
            modes: {
                grab: {
                    distance: 140,
                    links: {
                        opacity: 1,
                    },
                },
            },
        },
        particles: {
            color: {
                value: '#ffffff',
            },
            links: {
                color: '#ffffff',
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
            },
            collisions: {
                enable: true,
            },
            move: {
                direction: 'none',
                enable: true,
                outModes: {
                    default: 'bounce',
                },
                random: false,
                speed: 1,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 80,
            },
            opacity: {
                value: 0.2,
            },
            shape: {
                type: 'circle',
            },
            size: {
                value: { min: 1, max: 5 },
            },
        },
        detectRetina: true,
    };


  const sectionRefs = {
    about: useRef(null),
    experience: useRef(null),
    projects: useRef(null),
    skills: useRef(null),
    leadership: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
      Object.values(sectionRefs).forEach(ref => {
          if (ref.current) {
              observe(ref.current);
          }
      });
  }, [sectionRefs, observe]);

  const getSectionClass = (id) => `py-24 sm:py-32 transition-all duration-1000 ${isVisible(id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;

  // --- Data ---
  const experiences = [
    { side: 'left', date: 'Jun – Jul 2024', title: 'Project Intern', company: 'Indian Oil Corporation', description: 'Developed a role-based network monitoring tool and tackled IaaS proxy deployment challenges, gaining hands-on experience in corporate IT infrastructure.' },
    { side: 'right', date: 'Feb – May 2024', title: 'VAPT Intern', company: 'CyberWarriors', description: 'Conducted VAPT on web and network systems, authoring custom Python scripts to automate threat detection. It was like a puzzle, finding flaws to make things stronger.' },
    { side: 'left', date: 'Jan – Feb 2024', title: 'Frontend Developer Intern', company: 'Externsclub', description: 'Contributed to building dynamic websites, focusing on creating smooth user experiences. A great dive into the frontend world.' },
    { side: 'right', date: 'Dec 2023 – Jan 2024', title: 'Cyber Security Intern', company: 'YHills', description: 'My first professional dip into security. I supported internal audits and used scripting for analysis and pentesting tasks.' }
  ];

  const projects = [
    { title: 'Biomedical RAG Chatbot', description: 'This was a deep dive into the world of LLMs. I engineered a GenAI system that uses external knowledge to give trustworthy answers, fighting model hallucination head-on. Seeing it refuse to "make things up" for the first time was a huge win.', tags: ['GenAI', 'Python', 'LangChain', 'FastAPI'], link: 'https://github.com/Cybrian101/Chatbot-using-RAG' },
    { title: 'Social Media Data Extractor', description: 'As Project Lead for a Smart India Hackathon, I guided a team of six to build a Selenium-based tool. It was a masterclass in automation and leadership, and we managed to cut down manual data auditing by over 90%.', tags: ['Automation', 'Selenium', 'Python', 'Leadership'], link: 'https://github.com/Cybrian101/SIH-Project' },
    { title: 'DASHAI – AI Appointment Scheduler', description: 'Another hackathon project where we tackled a real-world problem. Our AI-powered scheduler successfully cut hospital wait times by half. It was rewarding to see code make a tangible difference.', tags: ['AI', 'Python', 'SQLite', 'Healthcare'], link: 'https://github.com/Cybrian101/DASHAI' }
  ];
  
    const skills = [
    { 
        category: "Languages & Frameworks",
        icons: [
            { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
            { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
            { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
            { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
            { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
            { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
            { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
            { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        ]
    },
    { 
        category: "AI & Cybersecurity", 
        icons: [
            { name: 'Generative AI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
            { name: 'LangChain', icon: 'https://avatars.githubusercontent.com/u/120268689?s=200&v=4' },
            { name: 'VAPT', icon: 'https://img.icons8.com/fluency/96/cyber-security.png' },
            { name: 'Secure Coding', icon: 'https://img.icons8.com/plasticine/100/lock.png' },
        ]
    },
    { 
        category: "Tools & Tech", 
        icons: [
            { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
            { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
            { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
            { name: 'Selenium', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg' },
            { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
            { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
        ]
    }
  ];


  const leadershipItems = [
      { icon: <UsersIcon />, title: 'IEEE Vice Chair', description: 'Leading the PECSB, fostering a community of student engineers.' },
      { icon: <TrophyIcon />, title: 'Top 6 Rank', description: 'Achieved 6th place among 1096 participants at PECTEAM 2K23.' },
      { icon: <PresentationIcon />, title: '100+ Events Organized', description: 'Led and organized workshops for over 1200 participants.'},
      { icon: <AwardIcon />, title: 'Crown Jewel of Excellence', description: 'Recognized as Best Performer at the IEEE Student Branch.'}
  ];

  const socialLinks = [
      { icon: <GithubIcon />, href: 'https://github.com/Cybrian101', name: 'GitHub' },
      { icon: <LinkedinIcon />, href: 'https://linkedin.com/in/md-ayaan', name: 'LinkedIn' },
      { icon: <TerminalIcon />, href: 'https://tryhackme.com/p/Cybrian', name: 'TryHackMe' }
  ];

  return (
    <div className="bg-slate-900 text-slate-300 leading-relaxed">
      <GlobalStyles />
      <CustomCursor />
        {isClient && <Particles
            id="tsparticles"
            init={particlesInit}
            options={particlesOptions}
            className="fixed inset-0 z-0"
        />}
      <div className="relative z-10">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <MobileMenu isOpen={isMenuOpen} onMenuToggle={() => setIsMenuOpen(false)} />
        <ResumeViewerModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <HeroSection onResumeView={() => setIsResumeOpen(true)} />

          {/* --- About Me --- */}
          <section ref={el => sectionRefs.about.current = el} id="about" className={getSectionClass("about")}>
             <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    <ScrollFloat>A Little About My Journey</ScrollFloat>
                </h2>
                <p className="mt-4 text-lg leading-8 text-slate-400">
                    <ShinyText text="Why I build, break, and build again." />
                </p>
            </div>
             <div className="mt-16 max-w-4xl mx-auto">
                <ScrollReveal>
                    <div className="glass-card soft-glow rounded-2xl p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                            <div className="flex-shrink-0 text-cyan-400 opacity-50">
                                <BrainCircuitIcon />
                            </div>
                            <div className="text-center md:text-left text-lg leading-7 text-slate-300 space-y-6">
                               <p>
                                My fascination with technology has always been a two-sided coin. On one side, there's the builder in me—the one who gets a thrill from architecting AI systems like my <strong className="font-semibold text-cyan-400">Generative AI chatbot</strong> and seeing them come to life. I love the logic, the creativity, and the challenge of making something truly intelligent.
                                </p>
                                <p>
                                But it's the other side of the coin that drives my precision: the breaker. As a <strong className="font-semibold text-cyan-400">Top 5% competitor on TryHackMe</strong>, I've learned to think like an attacker. Finding a vulnerability is like solving the ultimate puzzle. This offensive security mindset doesn't just stay in the terminal; it deeply informs how I code, pushing me to build more resilient, secure, and trustworthy applications. For me, the magic happens at the intersection of creation and security.
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
          </section>
          
          {/* --- Experience --- */}
          <section ref={el => sectionRefs.experience.current = el} id="experience" className={getSectionClass("experience")}>
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">My Professional Timeline</h2>
                <p className="mt-4 text-lg leading-8 text-slate-400">Where I've applied my skills.</p>
            </div>
            <div className="mt-20">
                <div className="timeline">
                    {experiences.map((exp, index) => (
                        <div key={index} id={`exp-${index}`} className={`timeline-container ${exp.side}`}>
                            <div className="timeline-content glass-card soft-glow">
                                <h3 className="text-xl font-bold text-cyan-400">{exp.title}</h3>
                                <p className="font-semibold text-slate-200 mt-1">{exp.company}</p>
                                <p className="text-sm text-slate-400 mb-2">{exp.date}</p>
                                <p className="text-slate-300">{exp.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </section>


          {/* --- Projects --- */}
          <section ref={el => sectionRefs.projects.current = el} id="projects" className={getSectionClass("projects")}>
             <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">My Digital Footprint</h2>
                <p className="mt-4 text-lg leading-8 text-slate-400">A few things I'm proud of.</p>
            </div>
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map(proj => (
                    <div key={proj.title} className="glass-card rounded-xl p-6 flex flex-col group soft-glow">
                        <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">{proj.title}</h3>
                        <p className="text-slate-400 mt-2 flex-grow">{proj.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {proj.tags.map(tag => <span key={tag} className="text-xs bg-slate-700 text-cyan-300 px-2 py-1 rounded-full">{tag}</span>)}
                        </div>
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 text-cyan-400 font-semibold group-hover:underline">View on GitHub &rarr;</a>
                    </div>
                ))}
            </div>
          </section>

          {/* --- Skills (Technical Arsenal) --- */}
            <section ref={el => sectionRefs.skills.current = el} id="skills" className={getSectionClass("skills")}>
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-white">Technical Arsenal</h2>
                    <div className="w-24 h-1 bg-cyan-500 mx-auto mt-2"></div>
                </div>
                <div className="mt-16 max-w-5xl mx-auto">
                    {skills.map((skillCat) => (
                        <div key={skillCat.category} className="mb-12">
                            <h3 className="text-2xl font-semibold text-cyan-400 mb-6 text-center">{skillCat.category}</h3>
                            <div className="flex flex-wrap justify-center gap-6">
                                {skillCat.icons.map(icon => (
                                    <div key={icon.name} className="group relative flex flex-col items-center">
                                        <img src={icon.icon} alt={icon.name} className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" />
                                        <span className="absolute -bottom-7 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-slate-300">{icon.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

          {/* --- Leadership & Community --- */}
            <section ref={el => sectionRefs.leadership.current = el} id="leadership" className={getSectionClass("leadership")}>
                 <div className="text-center">
                    <h2 className="text-4xl font-bold text-white">Leadership & Community</h2>
                    <div className="w-24 h-1 bg-cyan-500 mx-auto mt-2"></div>
                </div>
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {leadershipItems.map(item => (
                        <div key={item.title} className="glass-card rounded-xl p-6 soft-glow">
                            <div className="flex justify-center text-cyan-400 text-5xl mb-4">{item.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-300">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>

        {/* --- Contact & Footer --- */}
        <footer className="py-16">
            <section ref={el => sectionRefs.contact.current = el} id="contact" className={getSectionClass("contact")}>
                 <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-white">Get In Touch</h2>
                    <div className="w-24 h-1 bg-cyan-500 mx-auto mt-2"></div>
                    <p className="mt-6 text-lg max-w-2xl mx-auto text-slate-400">I'm always open to discussing new projects, creative ideas, or opportunities. Feel free to reach out!</p>
                    <a href="/contact" className="mt-8 inline-flex items-center bg-cyan-600 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-cyan-500 transition soft-glow">
                        Say Hello <PaperPlaneIcon />
                    </a>
                </div>
            </section>
            
            <div className="mt-16 container mx-auto px-6 text-center text-gray-500">
                <div className="mb-3 flex justify-center space-x-6">
                    {socialLinks.map(link => (
                         <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-cyan-400 transition">{link.icon}</a>
                    ))}
                </div>
                <p>&copy; {new Date().getFullYear()} Mohammed Ayaan. All rights reserved.</p>
            </div>
        </footer>
      </div>
    </div>
  );
}

