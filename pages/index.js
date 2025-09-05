import { useState, useEffect } from "react";

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = localStorage.getItem("theme") || "dark";
      setIsDark(currentTheme === "dark");
    };

    window.addEventListener("theme-changed", updateTheme);
    updateTheme();

    return () => window.removeEventListener("theme-changed", updateTheme);
  }, []);

  const containerStyles = `min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray'}`;
  const headingStyles = `text-2xl font-bold text-center ${isDark ? 'text-gray-100' : 'text-gray-600'} mb-4`;
  const subheadingStyles = `text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'} mb-2`;
  const cardStyles = `${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md`;
  const cardTitleStyles = `text-lg font-semibold ${isDark ? 'text-blue-300' : 'text-[#2c5282]'} mb-2`;
  const cardTextStyles = `${isDark ? 'text-gray-400' : 'text-[#4a5568]'} text-sm`;
  const buttonStyles = `${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#1a365d] hover:bg-[#2c5282]'} 
    text-white px-5 py-2 rounded-full transition-colors text-sm`;

  const features = [
    {
      title: "Track Expenses",
      description: "Easily log and categorize your daily expenses in one place"
    },
    {
      title: "Visual Reports",
      description: "View detailed charts and analytics of your spending patterns"
    },
    {
      title: "Budget Smart",
      description: "Set budgets and get notifications to stay on track"
    }
  ];

  return (
    <div className={containerStyles}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className={headingStyles}>
          Welcome to Smart Expense Tracker
        </h1>
        
        <div className="text-center mb-8">
          <p className={subheadingStyles}>
            Take control of your finances with our intuitive expense tracking solution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 mb-8">
          {features.map((feature, index) => (
            <div key={index} className={cardStyles}>
              <h3 className={cardTitleStyles}>{feature.title}</h3>
              <p className={cardTextStyles}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
