"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function ChangePassword({ token, setError, setMessage, inputBg, inputText, isDark }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!token) {
    return (
      <p className="text-red-500 text-center mb-3 text-sm">
        Authentication token missing. Please log in again.
      </p>
    );
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch(`../api/users`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text);

      setMessage("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message || "Password update failed.");
    }
  };

  return (
    <form
      onSubmit={handlePasswordChange}
      className={`mb-5 p-5 rounded-lg shadow-md transition-colors duration-300 ${isDark ? "bg-[#2c3954]" : "bg-white"}`}
    >
      <h2 className={`text-lg font-semibold mb-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
        Change Password
      </h2>

      <input
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className={`w-full px-3 py-1.25 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} ${inputText}`}
        required
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className={`w-full px-3 py-1.25 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} ${inputText}`}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-1.5 text-sm rounded hover:bg-blue-700 transition"
      >
        Update Password
      </button>
    </form>
  );
}
