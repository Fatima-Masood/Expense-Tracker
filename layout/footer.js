import React from 'react';
import { useEffect, useState } from "react";

const Footer = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const updateTheme = () => {
            const currentTheme = localStorage.getItem("theme") || "dark";
            setIsDark(currentTheme === "dark");
        };

        window.addEventListener("theme-changed", updateTheme);
        updateTheme();

        return () => {
            window.removeEventListener("theme-changed", updateTheme);
        };
    }, []);

    const responsiveFontSize = {
        fontSize: 'clamp(0.5rem, 2vw, 1rem)'
    };

    const footerClass = isDark
        ? "bg-gray-900 text-white text-center py-3 w-full fixed bottom-0 left-0 z-50"
        : "bg-gray-100 text-gray-900 text-center py-3 w-full fixed bottom-0 left-0 z-50";

    return (
        <footer className={footerClass}>
            <p className="m-0 tracking-wide text-gray-500" style={responsiveFontSize}>
                &copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
