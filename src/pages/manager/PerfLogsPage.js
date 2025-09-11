import React, { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { RefreshCw } from "lucide-react";
import api from "../../api"; // axios instance

export default function PerfLogsPage() {
    const [workorderId, setWorkorderId] = useState(() => localStorage.getItem("workorderId") || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rawData, setRawData] = useState([]);

    const [selectedMetrics, setSelectedMetrics] = useState({
        oee: true,
        availability: true,
        performance: false,
        quality: false,
    });

    const [scale, setScale] = useState(1); // 1x=5sn, 2x=10sn, 4x=20sn

    useEffect(() => {
        if (workorderId) fetchData(workorderId);
    }, []);

    async function fetchData(id) {
        setLoading(true);
        setError("");
        try {
            const res = await api.get(`http://localhost:5031/api/manager/workorder/perflogs/${id}`);
            setRawData(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setError("Veriler yüklenirken bir hata oluştu.");
            setRawData([]);
        } finally {
            setLoading(false);
        }
    }

    const aggregated = useMemo(() => {
        if (!rawData?.length) return [];

        const baseSeconds = 5;
        const windowSec = baseSeconds * (Number(scale) || 1);

        const withTs = rawData
            .map(d => ({ ...d, ts: new Date(d.recordedAt).getTime() }))
            .sort((a, b) => a.ts - b.ts);

        const startTs = withTs[0].ts;
        const bucketMap = new Map();

        for (const item of withTs) {
            const idx = Math.floor((item.ts - startTs) / (windowSec * 1000));
            if (!bucketMap.has(idx)) bucketMap.set(idx, []);
            bucketMap.get(idx).push(item);
        }

        return Array.from(bucketMap.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([idx, items]) => {
                const avg = key => items.reduce((sum, it) => sum + (Number(it[key]) || 0), 0) / items.length;
                const meanTs = items.reduce((sum, it) => sum + it.ts, 0) / items.length;

                return {
                    recordedAt: new Date(meanTs).toISOString(),
                    oee: round2(avg("oee")),
                    availability: round2(avg("availability")),
                    performance: round2(avg("performance")),
                    quality: round2(avg("quality")),
                };
            });
    }, [rawData, scale]);

    function round2(n) {
        return Math.round((Number(n) || 0) * 100) / 100;
    }

    const formatTime = iso => {
        try {
            const d = new Date(iso);
            return d.toLocaleTimeString([], { hour12: false });
        } catch {
            return iso;
        }
    };

    const lines = useMemo(() => {
        const colors = { oee: "#1f77b4", availability: "#ff7f0e", performance: "#2ca02c", quality: "#d62728" };
        const out = [];
        for (const [key, label] of Object.entries({ oee: "OEE", availability: "Availability", performance: "Performance", quality: "Quality" })) {
            if (selectedMetrics[key]) out.push({ key, label, color: colors[key] });
        }
        return out;
    }, [selectedMetrics]);

    return (
        <div className="p-6 max-w-screen-xl mx-auto font-sans">
            <h2 className="text-3xl font-bold mb-6">📊 Workorder Performance Logs</h2>

            <div className="bg-white p-4 rounded shadow mb-6 grid gap-4 md:grid-cols-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Workorder ID</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            className="border rounded p-2 w-full"
                            value={workorderId}
                            onChange={e => setWorkorderId(e.target.value)}
                            placeholder="ör. 7"
                        />
                        <button
                            onClick={() => {
                                if (workorderId) {
                                    localStorage.setItem("workorderId", workorderId);
                                    fetchData(workorderId);
                                }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                        >
                            <RefreshCw size={16} /> Yükle
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Zaman Ölçeği</label>
                    <select
                        className="border rounded p-2 w-full"
                        value={scale}
                        onChange={e => setScale(parseInt(e.target.value, 10))}
                    >
                        <option value={1}>1x (5 sn)</option>
                        <option value={2}>2x (10 sn)</option>
                        <option value={4}>4x (20 sn)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Metrikler</label>
                    <div className="flex flex-wrap gap-3 items-center">
                        {["oee", "availability", "performance", "quality"].map(key => (
                            <label key={key} className="inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={!!selectedMetrics[key]}
                                    onChange={e => setSelectedMetrics(prev => ({ ...prev, [key]: e.target.checked }))}
                                />
                                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {loading && <div className="p-4">Yükleniyor...</div>}
            {error && <div className="p-4 text-red-600">{error}</div>}

            <div className="bg-white p-4 rounded shadow overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Zaman Serisi Grafiği</h3>
                <div className="w-full h-[360px] min-w-[800px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={aggregated} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="recordedAt"
                                tickFormatter={formatTime}
                                tick={{ fontSize: 10, angle: -45, textAnchor: "end" }}
                                interval={0}
                            />
                            <YAxis domain={[0, 200]} />
                            <Tooltip labelFormatter={label => new Date(label).toLocaleString()} />
                            <Legend />
                            {lines.map(ln => (
                                <Line key={ln.key} type="monotone" dataKey={ln.key} name={ln.label} dot={false} stroke={ln.color} strokeWidth={2} isAnimationActive={false} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {summaryCards(aggregated).map(c => (
                    <div key={c.label} className="bg-white rounded p-4 shadow text-center">
                        <div className="text-sm text-gray-500">{c.label}</div>
                        <div className="text-2xl font-bold">{c.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function summaryCards(data) {
    if (!data?.length) {
        return [
            { label: "Veri Sayısı", value: 0 },
            { label: "Başlangıç", value: "-" },
            { label: "Bitiş", value: "-" },
            { label: "Aralık", value: "-" },
        ];
    }
    const first = new Date(data[0].recordedAt);
    const last = new Date(data[data.length - 1].recordedAt);
    const minutes = Math.max(0, Math.round((last - first) / 60000));
    return [
        { label: "Veri Sayısı", value: data.length },
        { label: "Başlangıç", value: first.toLocaleString() },
        { label: "Bitiş", value: last.toLocaleString() },
        { label: "Aralık", value: `${minutes} dk` },
    ];
}
