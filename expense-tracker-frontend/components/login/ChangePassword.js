import { useState, useContext } from "react";

export default function ChangePassword({csrfToken, token, setError, setMessage}) {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    if (!token || !csrfToken) {
        setError("Authentication tokens missing. Please log in again.");
        return;
    }   

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/users`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,   
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": csrfToken
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                }),
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
        <form onSubmit={handlePasswordChange} className="mb-8 bg-white shadow rounded p-4">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Update Password
                </button>
            </form>
    );
}