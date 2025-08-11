import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../_app";
import ChangePassword from "@/components/login/ChangePassword";
import Cookies from "js-cookie";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState("");
    const [csrfToken, setCsrfToken] = useState("");

    useEffect(() => {
        const token = Cookies.get("token");
        const csrfToken = Cookies.get("XSRF-TOKEN");
        setCsrfToken(csrfToken);
        setToken(token);
        console.log("csrfToken:", csrfToken);
        console.log("token:", token); 

    }, []);

    useEffect(() => {    
        setMessage("");
        setError("");  
        if (!token) {
            setError("No token found");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/users`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-XSRF-TOKEN": csrfToken
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
    }, [process.env.NEXT_PUBLIC_SERVER_URI, token, csrfToken, error]);

    

    const handleDeleteUser = async () => {
        
        setMessage("");
        setError("");

        if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/users`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-XSRF-TOKEN": csrfToken
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

            {token && csrfToken &&
                <ChangePassword
                    csrfToken={csrfToken}
                    token={token}
                    setError={setError} 
                    setMessage={setMessage}
                />
            }

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
