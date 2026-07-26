'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function LandingExperience({ children }: Readonly<{ children: ReactNode }>) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const heroItems = gsap.utils.toArray<HTMLElement>('[data-hero-enter]');
    gsap.from(heroItems, { autoAlpha: 0, y: 30, duration: 0.9, stagger: 0.11, ease: 'power3.out' });

    gsap.utils.toArray<HTMLElement>('[data-stack-reveal]').forEach((element) => {
      gsap.from(element, {
        autoAlpha: 0,
        y: 42,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 84%', toggleActions: 'play none none reverse' },
      });
    });

    const evidence = scope.current?.querySelector<HTMLElement>('[data-evidence-stack]');
    const evidenceMedia = scope.current?.querySelector<HTMLElement>('[data-evidence-media]');
    if (evidence && evidenceMedia && window.matchMedia('(min-width: 960px)').matches) {
      ScrollTrigger.create({ trigger: evidence, start: 'top top', end: 'bottom bottom', pin: evidenceMedia, pinSpacing: false });
    }
  }, { scope });

  return <div ref={scope}>{children}</div>;
}
