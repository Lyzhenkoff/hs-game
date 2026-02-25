"use client";

import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type AnimatedSectionProps = {
    id?: string;
    children: ReactNode;
    className?: string;
};

/**
 * Safe on mobile:
 * - uses useInView
 * - has a fallback timer that forces visibility (prevents black screens)
 */
export default function AnimatedSection({
                                            id,
                                            children,
                                            className = "",
                                        }: AnimatedSectionProps) {
    const ref = useRef<HTMLElement | null>(null);
    const inView = useInView(ref, { amount: 0.15, once: true });

    // Fallback: if observer doesn't fire on some mobile browsers, still show content.
    const [forceVisible, setForceVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setForceVisible(true), 1200);
        return () => clearTimeout(t);
    }, []);

    const show = inView || forceVisible;

    return (
        <motion.section
            ref={ref as any}
            id={id}
            initial={false}
            animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 18, filter: "blur(6px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`border-t border-zinc-900/80 ${className}`}
            style={{ willChange: "opacity, transform, filter" }}
        >
            {children}
        </motion.section>
    );
}