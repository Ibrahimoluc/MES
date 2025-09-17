import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const menu = {
    operator: [
      { label: "Home", to: "/operator" },
      /*{ label: "Workorders", to: "/operator/workorders" }*/,
      /*{ label: "SCADA", to: "/operator/scada" },*/
    ],
    manager: [
      { label: "Home", to: "/manager" },
      { label: "Track Workers", to: "/manager/workers" },
      /*{ label: "Workstation Details", to: "/manager/workstations" }*/,
      { label: "Workstation Details", to: "/manager/workstation/perflogs" },
      { label: "Workorder Details", to: "/manager/workorder/perflogs" }
    ],
    mps: [
      { label: "MPS Panel", to: "/mps" },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <img src="/unopro-logo.png" alt="Logo" className="h-8" />

        {menu[role]?.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="text-sm text-gray-600 flex items-center gap-4">
        <span>{new Date().toLocaleDateString("en-GB")}</span>
        {username && <span className="font-semibold text-gray-800">{username}</span>}
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
