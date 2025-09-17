import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import PerfLogGraph from "../../components/PerfLogGraph";
import { foo } from "../../components/commonFunctions";

//Example data for graphics
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

foo();

const DATA = [];
const base = 20;
const end = new Date().getTime();
for (let i = 0; i < 10; i++) {
    DATA.push(
        {
            "recordedAt": new Date(end - i * base * 1000),
            "oee": getRndInteger(40, 60),
            "availability": getRndInteger(40, 60),
            "performance": getRndInteger(40, 60),
            "quality": getRndInteger(40, 60)
        }
    ); 
}

const colors = { oee: "#1f77b4", availability: "#ff7f0e", performance: "#2ca02c", quality: "#d62728" };
const lines = [];
for (const [key, label] of Object.entries({ oee: "OEE", availability: "Availability", performance: "Performance", quality: "Quality" })) {
    lines.push({ key, label, color: colors[key] });
}

//DATA.forEach(x => console.log(x));
//lines.forEach(x => console.log(x));


const ManagerHomePage = () => {
    const [workstations, setWorkstations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkstations = async () => {
            try {
                //const res = await api.get("http://localhost:5031/api/workstations/summary");
                const res = await api.get("http://localhost:5031/api/manager/workstation/active/perflogs/summary");
                setWorkstations(res.data);
                
            } catch (err) {
                setError("Workstation verileri yüklenirken bir hata oluştu.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkstations();
    }, []);

    if (loading) {
        return <div className="p-6">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

  
    return (
        <div className="p-6 max-w-screen-xl mx-auto font-sans">
            <h2 className="text-3xl font-bold mb-6">📋 Manager Panel</h2>


            {/* Workstation Listesi */}
            <div className="bg-white p-4 rounded shadow m-4">
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
                                    <td className="p-2 border">{w.workstationId}</td>
                                    <td className="p-2 border">{w.workstationName}</td>
                                    <td className="p-2 border">{w.serialNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/*Grafikler*/}
            <h3 className="text-lg font-semibold mb-4">Active Workstations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workstations.map((w) => (
                    <div key={w.id} className="bg-white p-4 rounded shadow">
                        <h3 className="text-lg font-semibold mb-4">{w.workstationName}</h3>
                        <div className="h-[360px]">
                            <PerfLogGraph data={w.performanceRecords} lines={lines} />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ManagerHomePage;