import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
} from "recharts";

export default function WorkstationPerfLogsPage() {
    const [workstations, setWorkstations] = useState([]);
    const [workstationId, setWorkstationId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [finishDate, setFinishDate] = useState("");
    const [perfLogs, setPerfLogs] = useState({ logs: [], gaps: [] });
    const [error, setError] = useState("");

    // Workstations çek
    useEffect(() => {
        axios
            .get("http://localhost:5031/api/workstations/summary")
            .then((res) => setWorkstations(res.data))
            .catch((err) => console.error("Workstation fetch error:", err));
    }, []);

    // Performans loglarýný çek
    const fetchPerfLogs = () => {
        if (!workstationId || !startDate || !finishDate) {
            setError("Lütfen workstation ve tarih aralýðý seçiniz.");
            return;
        }

        setError("");

        axios
            .get(
                `http://localhost:5031/api/manager/workstation/perflogs/${workstationId}?start=${encodeURIComponent(
                    startDate
                )}&finish=${encodeURIComponent(finishDate)}`
            )
            .then((res) => {
                const data = res.data;

                if (data.length > 50) {
                    setError("Verilen tarih aralýðý için çok fazla veri bulunmaktadýr.");
                    return;
                }

                const baseInterval = 5000; // 5 sn
                const processed = data.map((d) => ({
                    ...d,
                    recordedAt: new Date(d.recordedAt).getTime(), // timestamp
                }));

                // Boþluk indexlerini bul
                const gapIndexes = [];
                for (let i = 1; i < processed.length; i++) {
                    if (processed[i].recordedAt - processed[i - 1].recordedAt > 2 * baseInterval) {
                        gapIndexes.push(i);
                    }
                }

                setPerfLogs({ logs: processed, gaps: gapIndexes });
            })
            .catch((err) => console.error("PerfLogs fetch error:", err));
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold">Workstation Performans Loglarý</h1>

            {/* Filtre Alaný */}
            <div className="flex space-x-4 items-center">
                <select
                    value={workstationId}
                    onChange={(e) => setWorkstationId(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Workstation Seçiniz</option>
                    {workstations.map((w) => (
                        <option key={w.id} value={w.id}>
                            {w.name} ({w.serialNumber})
                        </option>
                    ))}
                </select>

                <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border p-2 rounded"
                />

                <input
                    type="datetime-local"
                    value={finishDate}
                    onChange={(e) => setFinishDate(e.target.value)}
                    className="border p-2 rounded"
                />

                <button
                    onClick={fetchPerfLogs}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Getir
                </button>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            {/* Grafik */}
            {perfLogs.logs.length > 0 && (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={perfLogs.logs}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="recordedAt"
                            type="number"
                            domain={["dataMin", "dataMax"]}
                            scale="time"
                            tickFormatter={(time) =>
                                new Date(time).toLocaleTimeString("tr-TR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })
                            }
                            angle={-30}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis domain={[0, 200]} />
                        <Tooltip
                            labelFormatter={(time) =>
                                new Date(time).toLocaleString("tr-TR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })
                            }
                        />

                        <Legend />

                        <Line type="monotone" dataKey="oee" stroke="#8884d8" dot={false} name="OEE" />
                        <Line type="monotone" dataKey="performance" stroke="#82ca9d" dot={false} name="Performance" />
                        <Line type="monotone" dataKey="quality" stroke="#ffc658" dot={false} name="Quality" />
                        <Line type="monotone" dataKey="availability" stroke="#ff7300" dot={false} name="Availability" />

                        {/* Boþluk çizgileri */}
                        {perfLogs.gaps.map((i) => (
                            <ReferenceLine
                                key={`gap-${i}`}
                                x={perfLogs.logs[i].recordedAt}
                                stroke="red"
                                strokeDasharray="3 3"
                            />
                        ))}

                        {/* Workorder baþlýklarý */}
                        {perfLogs.gaps.map((i, idx) => (
                            <ReferenceLine
                                key={`label-${idx}`}
                                x={perfLogs.logs[i].recordedAt}
                                label={{
                                    value: `Workorder ${perfLogs.logs[i].workorderId}`,
                                    position: "top",
                                    fill: "red",
                                    fontSize: 12,
                                }}
                                stroke="transparent"
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
