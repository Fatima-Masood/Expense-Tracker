
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../_app";
import ChangePassword from "@/components/login/ChangePassword";
import Cookies from "js-cookie";
import DeleteUser from "@/components/user/DeleteUser";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState("");
    const [csrfToken, setCsrfToken] = useState("");

    useEffect(() => {
        const token = Cookies.get("token");
        const csrfToken = Cookies.get("csrfToken");
        setCsrfToken(csrfToken);
        setToken(token);
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

                const data = await res.text();;
                setUser(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        fetchUser();
    }, [process.env.NEXT_PUBLIC_SERVER_URI, token, csrfToken, error]);

    return (
        <div className="flex justify-center items-center ">
            <div className="max-w-2xl w-full p-6">
                <h1 className="text-3xl font-bold mb-6 text-center">User Dashboard</h1>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                {message && <p className="text-green-600 mb-4 text-center">{message}</p>}

                {user && 
                    <h2 className="text-2xl font-semibold mb-2 text-center">{user}</h2>
                }

                {token && csrfToken &&
                    <ChangePassword
                        csrfToken={csrfToken}
                        token={token}
                        setError={setError} 
                        setMessage={setMessage}
                    />
                }

                {token && csrfToken &&
                    <DeleteUser
                        csrfToken={csrfToken}
                        token={token}
                        setError={setError}
                        setMessage={setMessage}
                    />
                }
            </div>
        </div>
    );
}
