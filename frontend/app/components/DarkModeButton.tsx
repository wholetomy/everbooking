"use client";

import { Dispatch, SetStateAction } from "react";

type DarkModeButtonProps = {
    isDarkMode: boolean;
    setIsDarkMode: Dispatch<SetStateAction<boolean>>;
};

export default function DarkModeButton({
    isDarkMode,
    setIsDarkMode,
}: DarkModeButtonProps) {
    return (
        <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            className={`
                relative
                w-13
                h-7
                rounded-full
                cursor-pointer
                transition-colors
                duration-300
                ease-in-out
                ${isDarkMode
                    ? "bg-[#656395]"
                    : "bg-[#C39951]"
                }
            `}
        >
            <div
                className={`
                    absolute
                    top-0.5
                    left-0.5
                    flex
                    items-center
                    justify-center
                    w-6
                    h-6
                    rounded-full
                    bg-white
                    shadow-md
                    transition-transform
                    duration-300
                    ease-in-out
                    ${isDarkMode ? "translate-x-6" : ""}
                `}
            >
                {isDarkMode ? "🌙" : "☀️"}
            </div>
        </button>
    );
}