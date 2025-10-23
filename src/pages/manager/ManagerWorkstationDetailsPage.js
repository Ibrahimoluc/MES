import React, { useEffect, useState } from "react";
import { FaMicrochip } from "react-icons/fa";
import axios from "axios";

//KULLANILMIYOR
const ManagerWorkstationDetailsPage = () => {
  const [workstations, setWorkstations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stateLogs, setStateLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkstations = async () => {
      try {
        const res = await axios.get("http://localhost:5143/api/workstations/summary");
        setWorkstations(res.data);
      } catch (err) {
        setError("Failed to fetch workstations");
      }
    };
    fetchWorkstations();
  }, []);

  const handleStationClick = async (ws) => {
    if (selectedStation?.id === ws.id) {
      setSelectedStation(null);
      setStateLogs([]);
      return;
    }

    setSelectedStation(ws);
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`http://localhost:5143/api/workstations/${ws.id}/state-logs`);
      setStateLogs(res.data);
    } catch (err) {
      setError("Failed to fetch workorder history.");
      setStateLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Running: "bg-green-100 text-green-700",
      Idle: "bg-yellow-100 text-yellow-700",
      Error: "bg-red-100 text-red-700",
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusClasses[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto font-sans">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaMicrochip className="text-indigo-600" /> Workstation Overview
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {workstations.map((ws) => (
          <div
            key={ws.id}
            onClick={() => handleStationClick(ws)}
            className={`cursor-pointer border p-5 rounded-xl transition duration-300 ease-in-out hover:shadow-md ${
              selectedStation?.id === ws.id ? "border-indigo-600 bg-indigo-50" : "bg-white"
            }`}
          >
            <h3 className="font-semibold text-lg mb-1 text-gray-800">{ws.name}</h3>
            <p className="text-sm text-gray-500 mb-1">Serial: {ws.serialNumber}</p>
            <p className="text-sm text-gray-500 mb-1">Status: {getStatusBadge(ws.status)}</p>
            <p className="text-sm text-gray-500 mb-1">
              Active Workorder: {ws.activeWorkorderId ?? "—"}
            </p>
          </div>
        ))}
      </div>

      {selectedStation && (
        <>
          <h3 className="text-xl font-bold mb-3 text-gray-800">
            📘 SCODE History for {selectedStation.name}
          </h3>

          {loading ? (
            <p className="text-gray-500">Loading workorder history...</p>
          ) : stateLogs.length === 0 ? (
            <p className="text-gray-500">No SCODE history found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border bg-white shadow-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 border">SCODE</th>
                    <th className="px-3 py-2 border">Operator</th>
                    <th className="px-3 py-2 border">Time</th>
                    <th className="px-3 py-2 border">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {stateLogs.map((log, i) => (
                    <tr key={i} className="text-center hover:bg-blue-50 transition">
                      <td className="px-3 py-2 border">{log.newScodeId}</td>
                      <td className="px-3 py-2 border">{log.changedByOperatorId}</td>
                      <td className="px-3 py-2 border">{new Date(log.changedAt).toLocaleString()}</td>
                      <td className="px-3 py-2 border">{log.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManagerWorkstationDetailsPage;