import { useRouter } from "next/router";

export default function MobileView({darkMode, toggleDarkMode, logout, blueButton, grayButton, redButton, token, isMenuOpen, setIsMenuOpen}) {
    const router = useRouter();
    return (
        <div
        className={`fixed top-0 left-0 h-full w-64 text-white z-40 transform transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"} ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-600">
          <span className="font-bold">Menu</span>
          <button onClick={() => setIsMenuOpen(false)}>✕</button>
        </div>
        <ul className="flex flex-col gap-4 p-4">
          {!token ? (
            <>
              <li>
                <button
                  className={blueButton + " w-full"}
                  onClick={() => {
                    router.push("../authentication/signup");
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Up
                </button>
              </li>
              <li>
                <button
                  className={grayButton + " w-full"}
                  onClick={() => {
                    router.push("../authentication/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Log In
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  className={blueButton + " w-full"}
                  onClick={() => {
                    router.push("../user/dashboard");
                    setIsMenuOpen(false);
                  }}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className={blueButton + " w-full"}
                  onClick={() => {
                    router.push("../user/monthly-expenditures");
                    setIsMenuOpen(false);
                  }}
                >
                  Monthly
                </button>
              </li>
              <li>
                <button
                  className={blueButton + " w-full"}
                  onClick={() => {
                    router.push("../user/all-expenditures");
                    setIsMenuOpen(false);
                  }}
                >
                  All Expenditures
                </button>
              </li>
              <li>
                <button
                  className={redButton + " w-full"}
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Log Out
                </button>
              </li>
            </>
          )}
          <li className="mt-4">
            {/* Theme toggle */}
            <label className="flex items-center cursor-pointer select-none">
              <span className="mr-2 text-gray-400">{darkMode ? "Dark" : "Light"}</span>
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
          </li>
        </ul>
      </div>
    );
}