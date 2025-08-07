import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("SERVER_URI:", process.env.SERVER_URI);
      const res = await fetch(`${process.env.SERVER_URI}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      let data;
      try {
        if (!res.ok) {
          const text = await res.text();
          alert(`Login failed: ${res.status} - ${text}`);
        }
        data = await res.json();
        console.log("Response data:", data);
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        alert("Invalid server response: " + err.message);
        return;
      }

      if (res.ok) {
        router.push("/user/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error("Login error:", err);
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
