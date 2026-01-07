import React, { useState, useEffect } from "react";
import api from "../../api"; // senin axios instance

const CreateProductPage = () => {
    const [name, setName] = useState("");
    const [stockUnit, setStockUnit] = useState("");
    const [stations, setStations] = useState([]);
    const [stationTimes, setStationTimes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Workstation listesini backendden al
    useEffect(() => {
        const fetchStations = async () => {
            try {
                const res = await api.get(`${process.env.REACT_APP_API_URL}/api/workstations/summary`);
                setStations(res.data);
            } catch (err) {
                setError("İstasyonlar yüklenirken hata oluştu");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStations();
    }, []);

    const handleStationTimeChange = (stationId, value) => {
        setStationTimes((prev) => ({
            ...prev,
            [stationId]: value ? parseInt(value, 10) : 0,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const payload = {
            name,
            stockUnit,
            stationIdsAndTaktTimes: stationTimes,
        };

        try {
            await api.post(`${process.env.REACT_APP_API_URL}/api/mps/create-product`, payload);
            setSuccess("Ürün başarıyla oluşturuldu!");
            setName("");
            setStockUnit("");
            setStationTimes({});
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;

                // Mesaj listesi oluştur
                let errorMessage = data.message || "Bir hata oluştu.";

                if (Array.isArray(data.errors) && data.errors.length > 0) {
                    const detailedErrors = data.errors
                        .map(e => `${e.field}: ${e.error}`)
                        .join("\n");
                    errorMessage += "\n" + detailedErrors;
                }

                setError(errorMessage);
            } else {
                setError("Sunucuyla iletişim kurulamadı.");
            }

            console.error(err);
        }

    };

    if (loading) {
        return <div className="p-6">Yükleniyor...</div>;
    }

    return (
        <div className="p-6 max-w-screen-md mx-auto font-sans">
            <h2 className="text-3xl font-bold mb-6">📦 Yeni Ürün Oluştur</h2>

            {error && <div className="mb-4 text-red-500">{error}</div>}
            {success && <div className="mb-4 text-green-600">{success}</div>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
                <div>
                    <label className="block font-medium mb-1">Ürün Adı</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Stok Birimi</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={stockUnit}
                        onChange={(e) => setStockUnit(e.target.value)}
                        placeholder="ör. adet, kg"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">İstasyonlar ve Takt Time</label>
                    <table className="w-full text-sm border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">ID</th>
                                <th className="p-2 border">İsim</th>
                                <th className="p-2 border">Takt Time (sn)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stations.map((station) => (
                                <tr key={station.id} className="text-center">
                                    <td className="p-2 border">{station.id}</td>
                                    <td className="p-2 border">{station.name}</td>
                                    <td className="p-2 border">
                                        <input
                                            type="number"
                                            className="w-20 border rounded p-1 text-center"
                                            value={stationTimes[station.id] ?? ""}
                                            onChange={(e) =>
                                                handleStationTimeChange(station.id, e.target.value)
                                            }
                                            //min="0" // 0 o makinada çalışcak ama taktTime bilinmeyen icin girilen degerdir. 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded font-medium"
                >
                    Kaydet
                </button>
            </form>
        </div>
    );
};

export default CreateProductPage;
