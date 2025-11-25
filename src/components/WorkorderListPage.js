import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function WorkorderListPage() {
    const [list, setList] = useState([]);
    const navigate = useNavigate();

    const sCodeToStatusName = (sCode) => {
        switch (sCode) {
            case 33:
                return "Production";
            case 42:
                return "UnPlannedDowntime";
            case 21:
                return "PlannedDowntime";
            case 10:
                return "StartupDowntime";
            case 50:
                return "NotStarted";
            case 60:
                return "Completed"
            case 70:
                return "Suspended"
            default:
                alert("The status code is not valid");
        }
    }

    useEffect(() => {
        const fetchAllWorkordersSummary = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/manager/workorders/summary`
                );
                const orderedList = res.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
                setList(orderedList);
            } catch (err) {
                console.error("Failed to load workorders list:", err);
            }
        };

        fetchAllWorkordersSummary();
    }, []);

    console.log(list);

    return (
        <>
            {/* Workstation Listesi */}
            <div className="bg-white p-4 rounded shadow m-4">
                <h3 className="text-lg font-semibold mb-4">Workorders List</h3>
                {list.length === 0 ? (
                    <p>  Emir bulunamadý .</p>
                ) : (
                    <table className="w-full text-sm border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">ID</th>
                                <th className="p-2 border">WorkstationId</th>
                                <th className="p-2 border">IsActive</th>
                                <th className="p-2 border">StartDate</th>
                                <th className="p-2 border">FinishDate</th>
                                <th className="p-2 border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                                {list.map((w) => (
                                    <tr key={w.workorderId} className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                        onClick={() => navigate(`/operator/workorders/${w.workorderId}`)}>
                                        <td className="p-2 border">{w.workorderId}</td>
                                        <td className="p-2 border">{w.workstationId}</td>
                                        <td className="p-2 border">{(w.isActive) ? "true" : "false"}</td>
                                        <td className="p-2 border">{new Date(w.startDate).toLocaleString()}</td>
                                        <td className="p-2 border">{new Date(w.finishDate).toLocaleString()}</td>
                                        <td className="p-2 border">{sCodeToStatusName(w.currentScodeValue)}</td>
                                    </tr>
                              ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
}