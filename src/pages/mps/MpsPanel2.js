// src/pages/MpsPanel.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const MpsPanel2 = () => {
    const [workstations, setWorkstations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkstations = async () => {
            try {
                const res = await api.get(`${process.env.REACT_APP_API_URL}/api/workstations/summary`);
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
            <h2 className="text-3xl font-bold mb-6">📋 MPS Panel</h2>

            {/* Butonlar */}
            <div className="flex gap-4 mb-6">
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => navigate("/mps/createProduct")}
                >
                    ➕ Create Product
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => navigate("/mps/createWorkorder")}
                >
                    🛠 Create Workorder
                </button>
                <button
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    onClick={() => navigate("/mps/createWorkstation")}
                >
                    🏭 Create Workstation
                </button>
            </div>

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

export default MpsPanel2;
