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
    Brush
} from "recharts";

export default function WorkstationPerfLogsPage() {
    const [workstations, setWorkstations] = useState([]);
    const [workstationId, setWorkstationId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [finishDate, setFinishDate] = useState("");
    // gaps yerine dayBoundaries kullanıyoruz artık
    const [perfLogs, setPerfLogs] = useState({ logs: [], dayBoundaries: [] });
    const [error, setError] = useState("");

    // Workstations çek
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/workstations/summary`)
            .then((res) => setWorkstations(res.data))
            .catch((err) => console.error("Workstation fetch error:", err));
    }, []);

    const fetchPerfLogs = () => {
        if (!workstationId || !startDate || !finishDate) {
            setError("Lütfen workstation ve tarih aralığı seçiniz.");
            return;
        }
        setError("");

        axios
            .get(
                `${process.env.REACT_APP_API_URL}/api/manager/workstation/perflogs/${workstationId}?start=${encodeURIComponent(
                    startDate
                )}&finish=${encodeURIComponent(finishDate)}`
            )
            .then((res) => {
                const data = res.data;

                // 1. Veriyi Timestamp formatına çevir
                let processed = data.map((d) => ({
                    ...d,
                    recordedAt: new Date(d.recordedAt).getTime(),
                }));

                const startTimestamp = new Date(startDate).getTime();
                const finishTimestamp = new Date(finishDate).getTime();

                // 2. GHOST DATA (Zoom'un düzgün çalışması için uçlara boş veri ekle)
                if (processed.length === 0 || processed[0].recordedAt > startTimestamp) {
                    processed.unshift({
                        recordedAt: startTimestamp,
                        oee: null, performance: null, quality: null, availability: null
                    });
                }
                if (processed.length === 0 || processed[processed.length - 1].recordedAt < finishTimestamp) {
                    processed.push({
                        recordedAt: finishTimestamp,
                        oee: null, performance: null, quality: null, availability: null
                    });
                }

                // 3. Sıralama (Ghost data ekledikten sonra garantiye almak için)
                processed.sort((a, b) => a.recordedAt - b.recordedAt);

                // 4. GÜN GEÇİŞLERİNİ TESPİT ETME
                const dayBoundaries = [];

                // İlk verinin gününü alarak başla
                if (processed.length > 0) {
                    let currentDayStr = new Date(processed[0].recordedAt).toLocaleDateString();

                    for (let i = 1; i < processed.length; i++) {
                        const rowDate = new Date(processed[i].recordedAt);
                        const rowDayStr = rowDate.toLocaleDateString();

                        // Eğer gün değiştiyse
                        if (rowDayStr !== currentDayStr) {
                            // Yeni günün başlangıcını (00:00:00) bul
                            const boundaryDate = new Date(rowDate);
                            boundaryDate.setHours(0, 0, 0, 0);

                            // Timestamp olarak kaydet
                            dayBoundaries.push(boundaryDate.getTime());

                            // Current day'i güncelle
                            currentDayStr = rowDayStr;
                        }
                    }
                }

                setPerfLogs({ logs: processed, dayBoundaries: dayBoundaries });
            })
            .catch((err) => console.error("PerfLogs fetch error:", err));
    };

    // Eksen formatlayıcı (Zoom seviyesine göre saat veya tarih gösterimi)
    const axisDateFormatter = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold">Workstation Performans Logları</h1>

            {/* Filtre Alanı */}
            <div className="flex space-x-4 items-center flex-wrap gap-y-2">
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
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Getir
                </button>
            </div>

            {error && <div className="text-red-500 font-semibold">{error}</div>}

            {/* Grafik Alanı */}
            {perfLogs.logs.length > 0 && (
                <div className="border p-4 rounded shadow bg-white">
                    {/* Bilgilendirme notu */}
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>* Kırmızı dikey çizgiler gün başlangıçlarını (00:00) gösterir.</span>
                        <span>* Detaylı incelemek için alttaki barı kaydırınız.</span>
                    </div>

                    <ResponsiveContainer width="100%" height={500}>
                        <LineChart
                            data={perfLogs.logs}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />

                            <XAxis
                                dataKey="recordedAt"
                                type="number"
                                scale="time"
                                domain={['dataMin', 'dataMax']} // Zoom için kritik
                                tickFormatter={axisDateFormatter}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                tick={{ fontSize: 12 }}
                                minTickGap={30}
                            />

                            <YAxis domain={[0, 110]} />

                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                labelFormatter={(time) =>
                                    new Date(time).toLocaleString("tr-TR", {
                                        day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit"
                                    })
                                }
                            />

                            <Legend verticalAlign="top" height={36} />

                            {/* Performans Çizgileri */}
                            <Line type="monotone" dataKey="oee" stroke="#8884d8" dot={false} strokeWidth={2} name="OEE" activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="performance" stroke="#82ca9d" dot={false} strokeWidth={2} name="Performans" />
                            <Line type="monotone" dataKey="quality" stroke="#ffc658" dot={false} strokeWidth={2} name="Kalite" />
                            <Line type="monotone" dataKey="availability" stroke="#ff7300" dot={false} strokeWidth={2} name="Kullanılabilirlik" />

                            {/* GÜN AYRAÇLARI (Dikey Kırmızı Çizgiler) */}
                            {perfLogs.dayBoundaries.map((timestamp, index) => (
                                <ReferenceLine
                                    key={`day-${index}`}
                                    x={timestamp}
                                    stroke="red"
                                    strokeDasharray="3 3"
                                    opacity={0.8}
                                    label={{
                                        position: 'insideTopLeft',
                                        value: new Date(timestamp).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short' }),
                                        fill: 'red',
                                        fontSize: 12,
                                        fontWeight: 'bold'
                                    }}
                                />
                            ))}

                            {/* Zoom Slider */}
                            <Brush
                                dataKey="recordedAt"
                                height={40}
                                stroke="#8884d8"
                                tickFormatter={axisDateFormatter}
                                startIndex={0}
                                endIndex={perfLogs.logs.length - 1}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}