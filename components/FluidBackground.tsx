/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const StarField = () => {
  // Reduced star count for performance
  const stars = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.7 + 0.3
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white will-change-[opacity,transform]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            transform: 'translateZ(0)'
          }}
          initial={{ opacity: star.opacity, scale: 1 }}
          animate={{
            opacity: [star.opacity, 1, star.opacity],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration * 2, // Slower animation
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#f1f5f9]">
      
      <StarField />

      {/* Blob 1: Modern Royal Blue */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[90vw] h-[90vw] mix-blend-multiply will-change-transform pointer-events-none"
        animate={{
          x: [0, 50, -25, 0],
          y: [0, -25, 25, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ 
          background: "radial-gradient(circle at center, rgba(37, 99, 235, 0.15) 0%, transparent 50%)",
          transform: 'translateZ(0)' 
        }}
      />

      {/* Blob 2: Light Sky Blue */}
      <motion.div
        className="absolute top-[20%] right-[-20%] w-[100vw] h-[80vw] mix-blend-multiply will-change-transform pointer-events-none"
        animate={{
          x: [0, -50, 25, 0],
          y: [0, 50, -25, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ 
          background: "radial-gradient(circle at center, rgba(56, 189, 248, 0.15) 0%, transparent 50%)",
          transform: 'translateZ(0)' 
        }}
      />

      {/* Blob 3: Deep Tech Blue */}
      <motion.div
        className="absolute bottom-[-20%] left-[20%] w-[80vw] h-[80vw] mix-blend-multiply will-change-transform pointer-events-none"
        animate={{
          x: [0, 75, -75, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ 
          background: "radial-gradient(circle at center, rgba(30, 58, 138, 0.1) 0%, transparent 50%)",
          transform: 'translateZ(0)' 
        }}
      />

      {/* Static Grain Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-multiply pointer-events-none"></div>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/30 to-white/80 pointer-events-none" />
    </div>
  );
};

export default FluidBackground;