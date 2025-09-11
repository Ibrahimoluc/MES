import React, { useEffect, useState } from "react";
import api from "../../api";

const MpsPanel = () => {
  const [users, setUsers] = useState([]);
  const [workstations, setWorkstations] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const [usersRes, workstationsRes] = await Promise.all([
        //  //api.get("/users"),
        //    api.get("http://localhost:5031/api/workstations/1"),
          //]);
          const workstationsRes = await api.get("http://localhost:5031/api/workstations/1");
        //setUsers(usersRes.data);
        setWorkstations(workstationsRes.data);
      } catch (err) {
        setError("Veriler yüklenirken bir hata oluştu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto font-sans">
      <h2 className="text-3xl font-bold mb-6">📋 MPS Panel</h2>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-medium text-sm ${
            activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 rounded font-medium text-sm ${
            activeTab === "workstations" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("workstations")}
        >
          Workstations
        </button>
      </div>

      {activeTab === "users" && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">👤 User List</h3>
          {users.length === 0 ? (
            <p>Kullanıcı bulunamadı.</p>
          ) : (
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="text-center">
                    <td className="p-2 border">{u.id}</td>
                    <td className="p-2 border">{u.name}</td>
                    <td className="p-2 border">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "workstations" && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">🏭 Workstation List</h3>
          {workstations.length === 0 ? (
            <p>İş istasyonu bulunamadı.</p>
          ) : (
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Serial Number</th>
                </tr>
              </thead>
              <tbody>
                {workstations.map((w) => (
                  <tr key={w.id} className="text-center">
                    <td className="p-2 border">{w.id}</td>
                    <td className="p-2 border">{w.name}</td>
                    <td className="p-2 border">{w.serialNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default MpsPanel;
