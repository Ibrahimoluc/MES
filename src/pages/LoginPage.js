import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // 🔁 api.js içinde baseURL ayarlanmış olmalı

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
        const res = await api.post("http://localhost:5031/Authenticate/login", {
        username,
        password,
        });
 
      const { token, role } = res.data;
        console.log("token:" + token);
        console.log("role:" + role);


      if (!role) {
        alert("Role info missing from response");
        return;
      }

      // Kaydet
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);


      // Yönlendir
      switch (role) {
        case "operator":
          navigate("/operator2");
          break;
        case "manager":
          navigate("/manager");
          break;
        case "mps":
          navigate("/mps");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="flex flex-col items-center mb-6">
        <img src="/unopro-logo.png" alt="UnoPro Logo" className="h-16 mb-2" />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md space-y-5">
        <h1 className="text-3xl font-bold text-center">Login</h1>

        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
