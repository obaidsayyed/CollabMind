import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { darkMode } = useStore();
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.closest('button') || 
          target.closest('a') ||
          target.classList.contains('cursor-hover')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);
  
  return (
    <motion.div
      className={`fixed pointer-events-none z-[9999] rounded-full transition-all duration-150`}
      style={{
        left: position.x,
        top: position.y,
        border: `2px solid #F97316`,
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'normal'
      }}
      animate={{
        width: isHovering ? 48 : 20,
        height: isHovering ? 48 : 20,
        backgroundColor: isHovering ? 'rgba(249, 115, 22, 0.15)' : 'transparent'
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    />
  );
}
