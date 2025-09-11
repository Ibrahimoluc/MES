// ✅ OperatorScadaPage.js - backend uyumlu hale getirildi
import React, { useEffect, useState } from "react";
import { FaPause, FaCheck } from "react-icons/fa";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const OperatorScadaPage2 = () => {
    //const [scodeGroups, setScodeGroups] = useState({});
    const [selectedScode, setSelectedScode] = useState(localStorage.getItem("initialSCode")); // default: startup downtime
    const [reason, setReason] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedNewWorkorder, setSelectedNewWorkorder] = useState("");
    const [runningWorkorders, setRunningWorkorders] = useState([]);
    const [summary, setSummary] = useState({});
    const navigate = useNavigate();


    //sonradan eklediklerim
    const [connection, setConnection] = useState(null);
    const [workorderDetails, setWorkorderDetails] = useState({});
    const scodeGroups = {
        "STARTUP DOWNTIME": [
            { id: 10, description: "MATERIAL AND EQUIPMENT PREPARATION"},
            { id: 11, description: "SETUP"},
        ],
        "PLANNED DOWNTIME": [
            { id: 21, description: "MAINTENANCE"},
            { id: 22, description: "MEAL BREAK"},
            { id: 23, description: "EDUCATION"},
        ],
        "UNPLANNED DOWNTIME": [
            { id: 42, description: "MACHINE FAILURE"},
            { id: 43, description: "LACK OF STAFF"},
        ],
        PRODUCTION: [
            { id: 33, description: "PRODUCTION" },
        ]
    }
    //console.log(scodeGroups);
    //OperatorWorkorderPage den buraya navigate edilirken naviagete icinden alinan parametre
    const initialSCode = localStorage.getItem("initialSCode");
    console.log("route parameter:" + initialSCode);
    console.log("init Selected SCode:" + selectedScode);

    //scodeEnum, dictionary şeklinde yap
    const sCodeEnum = {
        33: "Production",
        42: "Unplanned Downtime",
        21: "Planned Downtime",
        10: "Startup Downtime"
    };

    //const workstationId = 4; //örnek sabit, ileride asagidaki gibi alınabilir.
    const workstationId = parseInt(localStorage.getItem("workstationId"));
    console.log("WorkstationId get from localstorage:" + workstationId);
    const operatorId = 1; // örnek sabit, ileride login sonrası alınabilir

    console.log("selamlar page2 den");

    useEffect(() => {
        //const workorderData = axios.get(`http://localhost:5031/api/workstations/${workstationId}/workorders`)
        //    .then(() => console.log("workorderData is fetched:" + workorderData))
        //    .catch(err => console.error("fetching WorkorderData failed:", err));


        console.log("SignalR connection creating...");
        const signalR = require('@microsoft/signalr');
        const workorderId = localStorage.getItem("workorderId");
        const urlString = "http://localhost:5031/myHub?workorderId=" + workorderId;
        console.log(urlString)

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(urlString)
            .build();

        if (newConnection) {
            //----------SignalR client functions----------------
            //function Greetings, deneme icin
            newConnection.on("Greetings", data => {
                //setSummary(data);
                console.log("Someone called Greetings, data:" + data);
            });


            //Asıl fonksiyonumuz, surekli performanceLog verisi ceken
            newConnection.on("GetLogOfWorkorderSummary", data => {
                console.log("Someone called GetLogOfWorkorderSummary, data:");
                console.log(data);

                const workorder = JSON.parse(data);

                if (workorder) {
                    console.log("workorder is decoded");
                }
                console.log(workorder.WorkorderId);
                console.log(workorder.Performance);
                console.log(workorder.TotalTime);

                //Ekranda görmek istediğim her şeyi burada koyuyorum.
                setSummary({
                    planned: workorder.PlannedAmount, //-
                    taktTime: workorder.TaktTime,
                    produced: workorder.GoodQuantity + workorder.BadQuantity,
                    scrap: workorder.BadQuantity,
                    cycleTime: workorder.CycleTime,
                    oee: workorder.Oee,
                    performance: workorder.Performance,
                    quality: workorder.Quality,
                    availability: workorder.Availability,
                    totalTime: workorder.TotalTime,
                    startupDowntime: workorder.total_startup_downtime,
                    plannedDowntime: workorder.total_planned_downtime,
                    unplannedDowntime: workorder.total_unplanned_downtime,
                    netAvailableTime: workorder.total_net_available_time,
                    totalNetOperationTime: workorder.total_net_operation_time,
                    currentEvent: workorder.CurrentScodeValue
                });

            });
            //-----------------------------------------------------


            newConnection.start()
                .then(() => console.log("Connected"))
                .catch(err => console.error("Connection failed:", err));
            console.log("connection started");
        }
        else {
            console.log("connection is null");
        }

        setConnection(newConnection);


        //Temizlik (component unmount olunca bağlantıyı kapat)
        return () => {
            newConnection.stop().then(() => {
                console.log("SignalR bağlantısı durduruldu");
            });
        };

    }, []);


    const eventIdToSCode = (eventId) => {
        const temp = Math.floor(eventId / 10);
        switch (temp) {
            case 1:
                return 10;
            case 2:
                return 21;
            case 4:
                return 42;
            case 3:
                return 33;
        }
    } 

    const handleChangeEvent = async () => {
        if (!reason.trim()) {
            alert("Please enter a reason.");
            return;
        }

        console.log(eventIdToSCode(selectedScode));
        try {
            await axios.post(`http://localhost:5031/api/operator/${workstationId}/change-scode`, {
                workstationId,
                newScode: eventIdToSCode(selectedScode),
                reason,
                operatorId,
            },
                {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });
            alert("Event updated successfully.");
        } catch (err) {
            console.error("SCODE update failed:", err);
            alert("Failed to update event.");
        }
    };

    const handleSuspendWorkorder = () => {
        setShowModal(true);
    };

    const handleStartNewWorkorder = async () => {
        if (!selectedNewWorkorder || !selectedScode) {
            alert("Please select workorder and SCODE.");
            return;
        }

        try {
            await axios.post(
                `http://localhost:5031/api/operator/${workstationId}/activate-workorder`,
                {
                    workstationId,
                    workorderId: parseInt(selectedNewWorkorder),
                    initialScode: selectedScode,
                    operatorId,
                    reason,
                }
            );
            alert("New workorder started successfully.");
            setShowModal(false);
        } catch (err) {
            console.error("Activate workorder error:", err);
            alert("Failed to activate new workorder.");
        }
    };

    const handleFinishWorkorder = async () => {
        try {
            // Backend'e API çağrısı
            await axios.post(`http://localhost:5031/api/operator/${workstationId}/finish-workorder`,
                {
                    workstationId,
                    operatorId,
                    reason
                });

            alert("Workorder finished!");

            // Sayfa değiştir → component unmount olur, useEffect cleanup çalışır
            navigate("/operator/workorders/" + localStorage.getItem("workorderId"));
        } catch (error) {
            console.error("Workorder bitirme işlemi başarısız:", error);
        }
    };


    return (
        <div className="p-6 font-sans grid grid-cols-12 gap-6">
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-xl w-[90%] md:w-[500px]">
                        <h2 className="text-xl font-bold mb-4">Suspend Current Workorder</h2>
                        <label className="block text-sm font-medium mb-1">New Workorder</label>
                        <select
                            value={selectedNewWorkorder}
                            onChange={(e) => setSelectedNewWorkorder(e.target.value)}
                            className="w-full border rounded p-2 mb-4"
                        >
                            <option value="">Select a workorder</option>
                            {runningWorkorders.map(({ workorderId }) => (
                                <option key={workorderId} value={workorderId}>
                                    #{workorderId}
                                </option>
                            ))}
                        </select>

                        <label className="block text-sm font-medium mb-1">Starting Event</label>
                        <select
                            value={selectedScode}
                            onChange={(e) => setSelectedScode(parseInt(e.target.value))}
                            className="w-full border rounded p-2 mb-4"
                        >
                            {Object.entries(scodeGroups).map(([group, items]) => (
                                <optgroup key={group} label={group}>
                                    {items.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.description}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>

                        <div className="flex justify-end space-x-3 mt-2">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                                Cancel
                            </button>
                            <button onClick={handleStartNewWorkorder} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                Start Workorder
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="col-span-3 bg-white p-6 rounded shadow space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">🔧 Change Event</h3>
                <label className="text-sm font-medium">Event Type</label>
                <select
                    value={selectedScode}
                    onChange={(e) => setSelectedScode(parseInt(e.target.value))}
                    className="w-full border p-2 rounded"
                >
                    {Object.entries(scodeGroups).map(([group, items]) => (
                        <optgroup key={group} label={group}>
                            {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.description}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>

                <label className="text-sm font-medium">Reason</label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="Enter reason for the event change..."
                    className="w-full border p-2 rounded"
                />

                <button onClick={handleChangeEvent} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Change Event
                </button>
            </div>

            <div className="col-span-9 space-y-6">
                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleSuspendWorkorder}
                        className="flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50"
                    >
                        <FaPause /> Suspend Workorder
                    </button>
                    <button
                        onClick={handleFinishWorkorder}
                        className="flex items-center gap-2 border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-50"
                    >
                        <FaCheck /> Finish Workorder
                    </button>
                </div>

                {/*<div className="grid grid-cols-2 md:grid-cols-3 gap-4">*/}
                {/*    {["Total", "Startup Downtime", "Planned Downtime", "Unplanned Downtime", "Net Available", "Net Operation"].map(*/}
                {/*        (label, i) => (*/}
                {/*            <div key={i} className="bg-gray-900 text-white text-center rounded p-4">*/}
                {/*                <h4 className="text-sm font-medium">⏱ {label.toUpperCase()}</h4>*/}
                {/*                <p className="text-xl font-bold mt-1">{summary.totalTime}</p>*/}
                {/*            </div>*/}
                {/*        )*/}
                {/*    )}*/}
                {/*</div>*/}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-900 text-white text-center rounded p-4">
                        <h4 className="text-sm font-medium">⏱ TOTAL TIME</h4>
                        <p className="text-xl font-bold mt-1">{summary.totalTime}</p>
                    </div>

                    <div className="bg-gray-900 text-white text-center rounded p-4">
                        <h4 className="text-sm font-medium">⏱ STARTUP DOWNTTIME</h4>
                        <p className="text-xl font-bold mt-1">{summary.startupDowntime}</p>
                    </div>

                    <div className="bg-gray-900 text-white text-center rounded p-4">
                        <h4 className="text-sm font-medium">⏱ PLANNED DOWNTIME</h4>
                        <p className="text-xl font-bold mt-1">{summary.plannedDowntime}</p>
                    </div>

                    <div className="bg-gray-900 text-white text-center rounded p-4">
                        <h4 className="text-sm font-medium">⏱ UNPLANNED DOWNTIME</h4>
                        <p className="text-xl font-bold mt-1">{summary.unplannedDowntime}</p>
                    </div>

                    <div className="bg-gray-900 text-white text-center rounded p-4">
                        <h4 className="text-sm font-medium">⏱ AVAILABLE TIME</h4>
                        <p className="text-xl font-bold mt-1">{summary.netAvailableTime}</p>
                    </div>

                    <div className="bg-gray-900 text-white text-center rounded p-4">
                        <h4 className="text-sm font-medium">⏱ OPERATION TIME</h4>
                        <p className="text-xl font-bold mt-1">{summary.totalNetOperationTime}</p>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Production Metrics</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                            className="bg-black h-2.5 rounded-full"
                            style={{ width: `${(summary.produced / summary.planned) * 100}%` }}
                        ></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <MetricBox label="Planned Quantity" value={summary.planned} />
                        <MetricBox label="Takt Time" value={`${summary.taktTime} s`} />
                        <MetricBox label="Produced" value={summary.produced} />
                        <MetricBox label="Scrap" value={summary.scrap} />
                        <MetricBox label="Cycle Time" value={`${summary.cycleTime} s`} />
                        <MetricBox label="Current Event" value={`${sCodeEnum[summary.currentEvent]}`} />
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Performance Indicators</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Availability", value: summary.availability, color: "bg-yellow-500" },
                            { label: "Performance", value: summary.performance, color: "bg-blue-500" },
                            { label: "Quality", value: summary.quality, color: "bg-green-500" },
                            { label: "OEE", value: summary.oee, color: "bg-red-500" },
                        ].map((item, i) => (
                            <div key={i} className={`${item.color} text-white text-center rounded p-4`}>
                                <h4 className="text-sm font-semibold">{item.label}</h4>
                                <p className="text-2xl font-bold">{item.value}%</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricBox = ({ label, value }) => (
    <div className="bg-white rounded p-4 shadow">
        <h4 className="text-sm font-semibold text-gray-500">{label}</h4>
        <p className="text-xl font-bold">{value}</p>
    </div>
);

export default OperatorScadaPage2;