import { useRouter } from "next/router";

export default function LargeScreenView({darkMode, toggleDarkMode, logout, blueButton, grayButton, redButton, token}) {
    const router = useRouter();
    return (
        <nav className="hidden md:flex items-center gap-3">
        <ul className="flex gap-2 items-center">
            {!token ? (
            <>
                <li>
                <button
                    className={blueButton}
                    onClick={() => router.push("../authentication/signup")}
                >
                    Sign Up
                </button>
                </li>
                <li>
                <button
                    className={grayButton}
                    onClick={() => router.push("../authentication/login")}
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
                    onClick={() => router.push("../user/dashboard")}
                >
                    Dashboard
                </button>
                </li>
                <li>
                <button
                    className={blueButton}
                    onClick={() => router.push("../user/monthly-expenditures")}
                >
                    Monthly
                </button>
                </li>
                <li>
                <button
                    className={blueButton}
                    onClick={() => router.push("../user/all-expenditures")}
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
        </ul>

        <label className="flex items-center cursor-pointer select-none ml-4">
            <span className="mr-2 text-sm text-gray-400">{darkMode ? "Dark" : "Light"}</span>
            <div className="relative w-10 h-5">
            <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
                className="sr-only"
            />
            <div
                className={`block w-8 h-5 rounded-full transition-colors duration-200 ${
                darkMode ? "bg-gray-700" : "bg-gray-300"
                }`}
            ></div>
            <div
                className={`absolute top-1 left-1 w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${
                darkMode
                    ? "translate-x-3 bg-blue-500"
                    : "translate-x-0 bg-yellow-400"
                }`}
            ></div>
            </div>
        </label>
        </nav>
    )
}