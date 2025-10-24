// src/pages/CreateWorkorderPage.js
import React, { useState } from "react";
import api from "../../api"; // axios instance

const CreateWorkstationPage = () => {
    const [name, setName] = useState("");
    const [serialNumber, setSerialNumber] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const payload = {
                Name: name,
                SerialNumber: serialNumber
            };

            await api.post(`${process.env.REACT_APP_API_URL}/api/mps/workstations`, payload);

            setMessage("✅ Workstation başarıyla oluşturuldu!");
            setName("");
            setSerialNumber("");
        } catch (err) {
            console.error(err);
            setMessage("❌ Workstation oluşturulamadı.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-screen-md mx-auto font-sans">
            <h2 className="text-3xl font-bold mb-6">🏭 Create Workstation</h2>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow space-y-4"
            >
                <div>
                    <label className="block font-medium mb-1">Workstation Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Serial Number</label>
                    <input
                        type="text"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>



                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded font-medium text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Creating..." : "Create Workstation"}
                </button>

                {message && <p className="mt-2">{message}</p>}
            </form>
        </div>
    );
};

export default CreateWorkstationPage;
