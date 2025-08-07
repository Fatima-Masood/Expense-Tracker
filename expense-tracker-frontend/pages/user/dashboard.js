import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };

        const tok = getCookie("access_token");
        setToken(tok);
        console.log("Token from cookie:", tok);
    });       

    useEffect(() => {          
        if (!token) {
            setError("No token found");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch(`${process.env.SERVER_URI}/api/users`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    const text = await res.text();
                    setError(`Failed to load user details: ${res.status} - ${text}`);
                }

                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        fetchUser();
    }, [token, process.env.SERVER_URI]);


    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await fetch(`${process.env.SERVER_URI}/api/users`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
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

    const handleDeleteUser = async () => {
        setMessage("");
        setError("");

        if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

        try {
            const res = await fetch(`${process.env.SERVER_URI}/api/users`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const text = await res.text();
            if (!res.ok) throw new Error(text);

            setMessage("Account deleted. Redirecting...");
            setTimeout(() => {
                signOut({ callbackUrl: "/" });
            }, 2000);
        } catch (err) {
            setError(err.message || "Failed to delete account.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {message && <p className="text-green-600 mb-4">{message}</p>}

            {user && (
                <div className="mb-8 bg-white shadow rounded p-4">
                    <h2 className="text-xl font-semibold mb-2">Your Details</h2>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            )}

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

            <div className="bg-white shadow rounded p-4">
                <button
                    onClick={handleDeleteUser}
                    className="w-full bg-gray-600 text-white py-2 rounded hover:bg-red-700 transition"
                >
                    Delete My Account
                </button>
            </div>
        </div>
    );
}
