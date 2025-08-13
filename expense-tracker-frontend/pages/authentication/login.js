import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
      const csrfToken = Cookies.get("XSRF-TOKEN");
      setCsrfToken(csrfToken);
      Cookies.set("csrfToken", csrfToken, {sameSite: "Strict",});
      console.log("csrfToken:", csrfToken);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/users/login`, {
        method: "POST",
        credentials: "include",   
        headers: { 
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data.access_token );
        console.log("access_token:", Cookies.get("access_token"));
        Cookies.set("token", data.access_token, {sameSite: "Strict",});

        router.push("/user/dashboard");
      } else {
        alert("Login Failed, please check your credentials.");
      } 
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in. Please try again.");
    } 

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full px-4 py-2 mb-4 border rounded"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full px-4 py-2 mb-4 border rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
