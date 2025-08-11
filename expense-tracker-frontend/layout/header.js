import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "@/pages/_app";
import Cookies from "js-cookie";

export default function Header(props) {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const {theme, setTheme} = useContext(AppContext);
    const [darkMode, setDarkMode] = useState(theme === "dark");

    const [csrfToken, setCsrfToken] = useState(null);

    useEffect(() => {
        const newCsrfToken = Cookies.get("csrf_token");
        const newToken = Cookies.get("token");

        setCsrfToken(newCsrfToken);
        setToken(newToken);
    }, []);


    const toggleDarkMode = () => {
        setTheme(theme === "dark" ? "light" : "dark");
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.documentElement.classList.toggle("dark", newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
        window.dispatchEvent(new Event("theme-changed"));
    };

    const logout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/users/logout`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-XSRF-TOKEN": csrfToken,
                }
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
        
        setToken(null);
        setTimeout(() => {
            router.push("/authentication/login");
        }, 100);
    };
    
    
    const headerClass = `shadow-md px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 transition-colors duration-300 ${
        darkMode ? "bg-gray-800" : "bg-gray-100"
    }`;

    const navButtonClass =
        "px-4 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";

    const blueButton = `${navButtonClass} bg-blue-700 text-white hover:bg-blue-400`;
    const grayButton = `${navButtonClass} ${
        darkMode
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-gray-500 text-white hover:bg-gray-600"
    }`;
    const redButton = `${navButtonClass} bg-red-700 text-white hover:bg-red-600`;
    const toggleButton = `${navButtonClass} ${
        darkMode
            ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
    }`;



    return (
        <header className={headerClass}>
            <div className="flex items-center gap-2">
                <div className="bg-gradient-to-tr from-blue-400 via-blue-500 to-blue-700 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v8m0 0c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0 0v4m0-16v4"
                        />
                    </svg>
                </div>
                <Link
                    href={token ? "/user/dashboard" : "/authentication/login"}
                    className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent hover:underline"
                    style={{ letterSpacing: "0.08em" }}
                >
                    Expense Tracker
                </Link>
            </div>
            <nav>
                <ul className="flex flex-wrap justify-center gap-3 items-center">
                    {!token ? (
                        <>
                            <li>
                                <button
                                    className={blueButton}
                                    onClick={() => router.push("/authentication/signup")}
                                >
                                    Sign Up
                                </button>
                            </li>
                            <li>
                                <button
                                    className={grayButton}
                                    onClick={() => router.push("/authentication/login")}
                                >
                                    Log In
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <button
                                    className={blueButton}
                                    onClick={() => router.push("/user/dashboard")}
                                >
                                    Dashboard
                                </button>
                            </li>
                            <li>
                                <button
                                    className={blueButton}
                                    onClick={() => router.push("/user/monthly-expenditures")}
                                >
                                    Monthly
                                </button>
                            </li>
                            <li>
                                <button
                                    className={blueButton}
                                    onClick={() => router.push("/user/all-expenditures")}
                                >
                                    All Expenditures
                                </button>
                            </li>
                            <li>
                                <button className={redButton} onClick={logout}>
                                    Log Out
                                </button>
                            </li>
                        </>
                    )}
                    <li>
                        <label className="flex items-center cursor-pointer select-none">
                            <span
                                className={`mr-2 text-sm ${
                                    darkMode ? "text-gray-200" : "text-gray-700"
                                }`}
                            >
                                {darkMode ? "Dark" : "Light"}
                            </span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={toggleDarkMode}
                                    className="sr-only"
                                    aria-label="Toggle dark mode"
                                />
                                <div
                                    className={`block w-10 h-6 rounded-full transition-colors ${
                                        darkMode ? "bg-gray-700" : "bg-gray-300"
                                    }`}
                                ></div>
                                <div
                                    className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ${
                                        darkMode
                                            ? "translate-x-4 bg-blue-500"
                                            : "translate-x-0 bg-yellow-400"
                                    }`}
                                ></div>
                            </div>
                        </label>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

