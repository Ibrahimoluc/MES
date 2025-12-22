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
        const res = await api.post(`${process.env.REACT_APP_API_URL}/Authenticate/login`, {
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
          navigate("/operator");
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
    } catch (error) {
        let errorMessage = "Bilinmeyen Hata";

        if (error.response) {
            // Sunucu cevap verdi ama hata kodu döndü (404, 500, 401 vs.)
            // CORS hatası olsa bile bazen buraya düşmez, network error'a düşer.
            errorMessage = `Server Error!\nStatus: ${error.response.status}\nData: ${JSON.stringify(error.response.data)}`;
        } else if (error.request) {
            // İstek atıldı ama sunucudan hiç cevap gelmedi
            // CORS, Mixed Content, Private Network Access veya SSL hataları GENELLİKLE BURAYA DÜŞER.
            errorMessage = `Network Error! (Sunucuya ulaşılamadı)\n${error.message}`;
        } else {
            // İstek oluşturulurken hata çıktı
            errorMessage = `Request Error: ${error.message}`;
        }

        // Telefonda görebileceğin şekilde ekrana bas
        alert(errorMessage);

        // Konsola da basalım ki vConsole varsa orada da görünsün
        console.error("Login Hatası Detayı:", error);
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
