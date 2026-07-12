'use client';

import { useState, useEffect } from 'react';

interface TypewriterLogoProps {
  className?: string;
}

export default function TypewriterLogo({ className = '' }: TypewriterLogoProps) {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'typing1' | 'deleting' | 'typing2' | 'done'>('typing1');

  const fullFirst = '<JaiCabDev';
  const fullSecond = '<JaiCabFullStack/>';

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (phase === 'typing1') {
      if (text.length < fullFirst.length) {
        timeout = setTimeout(() => setText(fullFirst.slice(0, text.length + 1)), 100);
      } else {
        timeout = setTimeout(() => setPhase('deleting'), 800);
      }
    } else if (phase === 'deleting') {
      if (text.length > '<JaiCab'.length) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), 60);
      } else {
        timeout = setTimeout(() => setPhase('typing2'), 300);
      }
    } else if (phase === 'typing2') {
      if (text.length < fullSecond.length) {
        timeout = setTimeout(() => setText(fullSecond.slice(0, text.length + 1)), 100);
      } else {
        setPhase('done');
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase]);

  return (
    <span className={`font-mono ${className}`}>
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
}
