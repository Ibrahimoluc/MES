// src/pages/CreateWorkorderPage.js
import React, { useState, useEffect } from "react";
import api from "../../api"; // axios instance

const CreateWorkorderPage = () => {
    const [quantity, setQuantity] = useState("");
    const [startDate, setStartDate] = useState("");
    const [finishDate, setFinishDate] = useState("");
    const [productId, setProductId] = useState("");
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get(`${process.env.REACT_APP_API_URL}/api/mps/products`);
                setProducts(res.data);
            } catch (err) {
                console.error("Ürünler alınamadı:", err);
            }
        };
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const payload = {
                quantity: parseInt(quantity, 10),
                startDate: startDate, // UTC format
                finishDate: finishDate ? new Date(finishDate).toISOString() : null,
                productId: parseInt(productId, 10)
            };

            await api.post(`${process.env.REACT_APP_API_URL}/api/mps/workorders`, payload);

            setMessage("✅ Workorder başarıyla oluşturuldu!");
            setQuantity("");
            setStartDate("");
            setFinishDate("");
            setProductId("");
        } catch (err) {
            console.error(err);
            setMessage("❌ Workorder oluşturulamadı.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-screen-md mx-auto font-sans">
            <h2 className="text-3xl font-bold mb-6">📦 Create Workorder</h2>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow space-y-4"
            >
                <div>
                    <label className="block font-medium mb-1">Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Start Date</label>
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Finish Date</label>
                    <input
                        type="datetime-local"
                        value={finishDate}
                        onChange={(e) => setFinishDate(e.target.value)}
                
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Product</label>
                    <select
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        required
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Select product</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded font-medium text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Creating..." : "Create Workorder"}
                </button>

                {message && <p className="mt-2">{message}</p>}
            </form>
        </div>
    );
};

export default CreateWorkorderPage;
