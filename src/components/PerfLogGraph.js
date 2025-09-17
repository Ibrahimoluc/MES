import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { aggregate } from "../components/commonFunctions";

const formatTime = iso => {
    try {
        const d = new Date(iso);
        return d.toLocaleTimeString([], { hour12: false });
    } catch {
        return iso;
    }
};



function PerfLogGraph(props) {
    return (
        <>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aggregate(props.data, props.scale)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                    {props.lines.map(ln => (
                        <Line key={ln.key} type="monotone" dataKey={ln.key} name={ln.label} dot={false} stroke={ln.color} strokeWidth={2} isAnimationActive={false} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}

export default PerfLogGraph;