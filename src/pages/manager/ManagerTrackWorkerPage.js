//import React, { useEffect, useState } from "react";
//import axios from "axios";

//const ManagerTrackWorkerPage = () => {
//  const [workstations, setWorkstations] = useState([]);
//  const [stateLogs, setStateLogs] = useState([]);
//  const [loading, setLoading] = useState(true);
//  const [error, setError] = useState(null);

//  useEffect(() => {
//    const fetchData = async () => {
//      try {
//        // 1. Tüm istasyonları çek
//        const wsResponse = await axios.get("/api/workstations/summary");
//        const stations = wsResponse.data;
//        setWorkstations(stations);

//        // 2. Her istasyon için state-log çek
//        const logsPromises = stations.map((ws) =>
//          axios.get(`/api/workstations/${ws.id}/state-logs`)
//        );

//        const logsResponses = await Promise.all(logsPromises);
//        const mergedLogs = logsResponses.flatMap((res, index) =>
//          res.data.map((log) => ({
//            ...log,
//            workstationName: stations[index].name,
//          }))
//        );

//        setStateLogs(mergedLogs);
//      } catch (err) {
//        console.error("Error fetching worker activity:", err);
//        setError("Failed to load worker activity data.");
//      } finally {
//        setLoading(false);
//      }
//    };

//    fetchData();
//  }, []);

//  return (
//    <div className="p-6 max-w-screen-xl mx-auto font-sans">
//      <h2 className="text-3xl font-bold mb-6">👷 Worker Activity Tracking</h2>

//      {loading ? (
//        <p>Loading...</p>
//      ) : error ? (
//        <p className="text-red-600">{error}</p>
//      ) : (
//        <div className="overflow-x-auto">
//          <table className="min-w-full border-collapse bg-white rounded shadow-sm">
//            <thead className="bg-gray-100 text-gray-700 text-sm">
//              <tr>
//                <th className="text-left px-4 py-3 border-b">📟 Station</th>
//                <th className="text-center px-4 py-3 border-b">⚙️ SCODE</th>
//                <th className="text-center px-4 py-3 border-b">📄 Workorder</th>
//                <th className="text-center px-4 py-3 border-b">🔄 Changed By</th>
//                <th className="text-center px-4 py-3 border-b">🕒 Time</th>
//              </tr>
//            </thead>
//            <tbody>
//              {stateLogs.map((log, idx) => (
//                <tr
//                  key={log.logId + "-" + idx}
//                  className={`text-sm transition-colors duration-200 ${
//                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
//                  } hover:bg-blue-50`}
//                >
//                  <td className="text-left px-4 py-3 border-b font-medium text-gray-800">
//                    {log.workstationName}
//                  </td>
//                  <td className="text-center px-4 py-3 border-b">
//                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
//                      {log.newScodeId}
//                    </span>
//                  </td>
//                  <td className="text-center px-4 py-3 border-b">{log.workorderId}</td>
//                  <td className="text-center px-4 py-3 border-b">{log.changedByOperatorId}</td>
//                  <td className="text-center px-4 py-3 border-b">
//                    {new Date(log.changedAt).toLocaleString()}
//                  </td>
//                </tr>
//              ))}
//            </tbody>
//          </table>
//        </div>
//      )}
//    </div>
//  );
//};

//export default ManagerTrackWorkerPage;