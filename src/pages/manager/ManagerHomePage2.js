import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const ManagerHomePage2 = () => {
    const [workstations, setWorkstations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkstations = async () => {
            try {
                const res = await api.get("http://localhost:5031/api/workstations/summary");
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
        </div>
    );
};

export default ManagerHomePage2;