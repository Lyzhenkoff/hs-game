import React from "react";

type DividerProps = {
    className?: string;
};

export default function Divider({ className = "" }: DividerProps) {
    return (
        <div className={`h-px w-full bg-zinc-900 ${className}`} />
    );
}