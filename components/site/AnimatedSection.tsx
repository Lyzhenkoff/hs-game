"use client";

import { motion } from "framer-motion";

export default function AnimatedSection({
                                            id,
                                            children,
                                        }: {
    id?: string;
    children: React.ReactNode;
}) {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-zinc-900/80"
        >
            {children}
        </motion.section>
    );
}
