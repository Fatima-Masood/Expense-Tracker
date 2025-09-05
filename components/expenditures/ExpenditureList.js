"use client";
import { useState, useEffect } from "react";

export default function ExpenditureList({ expenditures, token, refreshData, month, year }) {
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", amount: "" });
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

  const openAddForm = () => {
    const paddedMonth = String(month).padStart(2, "0");
    const yearMonth = `${year}-${paddedMonth}`;
    setEditingId(null);
    setFormData({ title: "", amount: "", yearMonth });
    setFormVisible(true);
  };

  const openEditForm = (exp) => {
    const paddedMonth = String(month).padStart(2, "0");
    const yearMonth = `${year}-${paddedMonth}`;
    setEditingId(exp.id);
    setFormData({ title: exp.title, amount: exp.amount, yearMonth: yearMonth });
    setFormVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    const url = editingId ? `/api/expenditures/${editingId}` : "/api/expenditures";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormVisible(false);
      setEditingId(null);
      setFormData({ title: "", amount: "" });
      refreshData();
    }
  };

  const deleteExpenditure = async (id) => {
    if (!confirm("Are you sure you want to delete this expenditure?")) return;
    const res = await fetch(`/api/expenditures/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) refreshData();
  };

  return (
    <div className={`p-8 rounded-xl shadow-xl ${isDark ? "bg-gray-800" : "bg-white"} mt-6 mx-auto max-w-4xl`}>
      <h2
        className={`text-xl font-bold mb-4 ${
          isDark ? "text-gray-200" : "text-gray-800"
        } border-b pb-2`}
      >
        Expenditures
      </h2>

      {month && year && (
        <button
          onClick={openAddForm}
          className={`${isDark ? "bg-blue-900 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"} 
          text-white font-medium px-3 py-1.25 rounded-lg transition-all duration-300 mb-4 shadow hover:shadow-md`}
        >
          + Add Expenditure
        </button>
      )}

      {formVisible && (
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col sm:flex-row gap-3 mb-4 p-4 ${
            isDark ? "bg-gray-700" : "bg-gray-100"
          } rounded-lg`}
        >
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`border ${isDark ? "bg-gray-600 border-gray-600 text-white" : "border-gray-300"} 
            p-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm`}
          />
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className={`border ${isDark ? "bg-gray-600 border-gray-600 text-white" : "border-gray-300"} 
            p-2 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm`}
          />
          <button
            type="submit"
            className={`${isDark ? "bg-blue-900 hover:bg-blue-800" : "bg-green-600 hover:bg-green-700"} 
            text-white font-medium px-3 py-1.5 rounded-md transition-all duration-300`}
          >
            {editingId ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={() => setFormVisible(false)}
            className={`${isDark ? "bg-gray-600 hover:bg-gray-500 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-700"} 
            font-medium px-3 py-1.5 rounded-md transition-all duration-300 text-sm`}
          >
            Cancel
          </button>
        </form>
      )}

      <ul className="space-y-2 mb-4 overflow-x-auto max-w-full text-sm">
  <div
    className={`hidden md:grid grid-cols-7 gap-4 p-2 rounded-lg ${
      isDark
        ? "bg-gray-700 text-gray-200 border-gray-600"
        : "bg-gray-100 text-gray-800 border-gray-300"
    } font-semibold border min-w-[600px]`}
  >
    <span className="col-span-2">Title</span>
    <span className="col-span-2">Amount (Rs.)</span>
    <span className="col-span-2">{month ? "Date Added" : "Month"}</span>
    <span>Actions</span>
  </div>

  {expenditures?.map((exp) => (
    <li
      key={exp.id}
      className={`p-3 rounded-lg border shadow-sm transition-all duration-300 ${
        isDark
          ? "bg-gray-800 hover:bg-gray-700 border-gray-600"
          : "bg-white hover:bg-gray-50 border-gray-200"
      }`}
    >
      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-7 gap-4 items-center min-w-[600px]">
        <span
          className={`col-span-2 cursor-pointer ${
            isDark ? "text-gray-200" : "text-gray-700"
          } hover:underline`}
          onClick={() => openEditForm(exp)}
        >
          {exp.title}
        </span>
        <span
          className={`col-span-2 cursor-pointer font-medium ${
            isDark ? "text-red-400" : "text-red-700"
          }`}
          onClick={() => openEditForm(exp)}
        >
          Rs. {exp.amount}
        </span>
        {month ? (
          <span
            className={`col-span-2 ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {exp.timestamp
              ? new Date(exp.timestamp).toLocaleDateString()
              : ""}
          </span>
        ) : (
          <span
            className={`col-span-2 ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {exp.yearMonth}
          </span>
        )}
        <button
          onClick={() => deleteExpenditure(exp.id)}
          className={`${
            isDark
              ? "bg-red-900 hover:bg-red-800 text-red-200"
              : "bg-red-50 hover:bg-red-100 text-red-700"
          } font-medium px-2 py-1 rounded-md transition-all duration-300 text-xs`}
        >
          Delete
        </button>
      </div>

      {/* Mobile stacked view */}
      <div className="flex flex-col gap-2 md:hidden">
        <div className="flex justify-between">
          <span className="font-semibold">Title:</span>
          <span
            className={`cursor-pointer ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
            onClick={() => openEditForm(exp)}
          >
            {exp.title}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Amount:</span>
          <span
            className={`cursor-pointer font-medium ${
              isDark ? "text-red-400" : "text-red-700"
            }`}
            onClick={() => openEditForm(exp)}
          >
            Rs. {exp.amount}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">{month ? "Date:" : "Month:"}</span>
          <span className={isDark ? "text-gray-200" : "text-gray-700"}>
            {month
              ? exp.timestamp
                ? new Date(exp.timestamp).toLocaleDateString()
                : ""
              : exp.yearMonth}
          </span>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => deleteExpenditure(exp.id)}
            className={`${
              isDark
                ? "bg-red-900 hover:bg-red-800 text-red-200"
                : "bg-red-50 hover:bg-red-100 text-red-700"
            } font-medium px-3 py-1 rounded-md transition-all duration-300 text-xs`}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
}
