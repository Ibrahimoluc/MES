// Dosya: src/pages/ManagerHomePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"];

const ManagerHomePage = () => {
  const [summary, setSummary] = useState({});
  const [performanceTrend, setPerformanceTrend] = useState([]);
  const [scodeDist, setScodeDist] = useState([]);
  const [recentWorkorders, setRecentWorkorders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryRes = await axios.get("http://localhost:5031/api/workstations/summary");
        const trendRes = await axios.get("http://localhost:5031/api/workstations/performance-logs/summary"); // bu endpoint backendde yoksa kaldır

        setSummary({
          totalStations: summaryRes.data.length,
          activeWorkorders: summaryRes.data.filter(s => s.activeWorkorderId).length,
          avgOee:
            Math.round(
              summaryRes.data.reduce((acc, s) => acc + (s.status === "Running" ? 1 : 0), 0) * 100 /
                summaryRes.data.length
            ) || 0,
          statusCounts: {
            Running: summaryRes.data.filter(s => s.status === "Running").length,
            Idle: summaryRes.data.filter(s => s.status === "Idle").length,
            Error: summaryRes.data.filter(s => s.status === "Error").length,
          },
        });

        setPerformanceTrend(trendRes.data || []);
      } catch (error) {
        console.error("Dashboard data error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 font-sans max-w-screen-xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold mb-2">📊 Manager Dashboard</h2>
      {/* Diğer component'lar aynen kalabilir */}
      {/* Örnek olarak sadece API fetch yapısı entegre edilmiştir */}
    </div>
  );
};

export default ManagerHomePage;