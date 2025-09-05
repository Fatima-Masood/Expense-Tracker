import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import LargeScreenView from "./largeScreenView";
import MobileView from "./mobileView";

export default function Header() {
  const router = useRouter();
  const { token, setToken, theme, setTheme } = useContext(AppContext);
  const [darkMode, setDarkMode] = useState(theme === "dark");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      await fetch("../api/users/logout", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setToken(null);
    router.push("../authentication/login");
  };

  const headerClass = `shadow-lg px-2 py-2 flex justify-between items-center fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
    darkMode ? "bg-gray-900" : "bg-gray-100"
  }`;

  const navButtonClass =
    "px-3 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none whitespace-nowrap text-[clamp(0.8rem,1.8vw,1rem)]";

  const blueButton = `${navButtonClass} bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105`;
  const grayButton = `${navButtonClass} ${
    darkMode
      ? "bg-gray-700 text-white hover:bg-gray-600"
      : "bg-gray-600 text-white hover:bg-gray-500"
  } transform hover:scale-105`;
  const redButton = `${navButtonClass} bg-red-700 text-white hover:bg-red-500 transform hover:scale-105`;

  return (
    <>
      <header className={headerClass}>
        {/* Left side logo */}
        <div className="flex items-center gap-2 min-w-fit">
          <div className="bg-gradient-to-tr from-blue-400 via-blue-500 to-blue-700 rounded-full w-8 h-6 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300">
            <svg
              className="w-6 h-4 text-white"
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
            href="/"
            className="font-extrabold tracking-wider bg-gradient-to-r from-gray-400 via-blue-400 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 min-w-fit"
            style={{
              letterSpacing: "0.05em",
              fontSize: "clamp(1rem, 2.5vw, 1.6rem)",
            }}
          >
            Expense Tracker
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke={darkMode ? "white" : "black"}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <LargeScreenView 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        logout={logout} 
        blueButton={blueButton} 
        grayButton={grayButton} 
        redButton={redButton} 
        token={token} />

        </header>

      <MobileView 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        logout={logout}
        blueButton={blueButton}
        grayButton={grayButton}
        redButton={redButton}
        token={token}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />  

      
    </>
  );
}
