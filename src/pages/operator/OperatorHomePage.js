// ✅ OperatorHomePage.js (axios version)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const MetricCard = ({ label, value }) => (
    <div className="bg-gray-50 rounded-md border px-3 py-4">
        <div className="text-xs text-gray-500 mb-1">{label}</div>
        <div className="text-lg font-bold text-blue-900">
            {value !== null && value !== undefined ? value.toFixed(1) : "—"}
        </div>
    </div>
);

const OperatorHomePage = () => {
    const [workstations, setWorkstations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkstations = async () => {
            try {
                const res = await axios.get("http://localhost:5031/api/workstations/details");
                setWorkstations(res.data);
            } catch (error) {
                console.error("Error fetching workstations:", error);
            }
        };
        fetchWorkstations();
    }, []);

    const getStatusDot = (oee) => {
        if (oee >= 85) return "bg-green-500";
        if (oee >= 70) return "bg-yellow-400";
        if (oee !== null) return "bg-red-400";
        return "bg-gray-300";
    };

    const getStatusLabel = (active) =>
        active ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 text-xs rounded-full">Active</span>
        ) : (
            <span className="bg-gray-100 text-gray-600 px-3 py-1 text-xs rounded-full">Passive</span>
        );

    const getWorkorders = (workstationId) => {
        console.log("called goToworkorders for workstation " + workstationId);
        localStorage.setItem("workstationId", workstationId);
        navigate("/operator/workorders");
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-4">
            {(workstations.length == 0) ? <p>Workstation bulunamadı.</p> :
                (workstations.map((ws, idx) => (
                    <div
                        key={idx}
                        className={`bg-white rounded-lg shadow-md border p-6 relative hover:shadow-xl transition-transform duration-200 hover:-translate-y-1 ${!ws.activeWorkorderId ? "opacity-70" : ""
                            }`}
                        onClick={() => getWorkorders(ws.workstationId)}
                    >

                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${getStatusDot(ws.oee)}`}></span>
                                <h2 className="text-xl font-semibold text-gray-800">{ws.workstationName}</h2>
                            </div>
                            {getStatusLabel(!!ws.activeWorkorderId)}
                        </div>

                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                            <p>
                                <span className="font-medium text-gray-800">Serial No:</span> {ws.serialNumber}
                            </p>
                            <p>
                                <span className="font-medium text-gray-800">Active Workorder:</span>{" "}
                                {ws.activeWorkorderId ?? "No active workorder"}
                            </p>
                            <p>
                                <span className="font-medium text-gray-800">SCODE:</span>{" "}
                                {ws.activeScode ?? "—"}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-center">
                            <MetricCard label="OEE" value={ws.oee} />
                            <MetricCard label="Quality" value={ws.quality} />
                            <MetricCard label="Performance" value={ws.performance} />
                            <MetricCard label="Availability" value={ws.availability} />
                        </div>
                    </div>
                )))
            }
        </div>
    );
};

export default OperatorHomePage;
