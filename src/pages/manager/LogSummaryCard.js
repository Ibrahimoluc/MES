function LogSummaryCard(props) {
    let list = [
        { label: "Veri Sayýsý", value: 0 },
        { label: "Baþlangýç", value: "-" },
        { label: "Bitiþ", value: "-" },
        { label: "Aralýk", value: "-" }];
    
    if (props.data?.length) {
        const data = props.data;
        const first = new Date(data[0].recordedAt);
        const last = new Date(data[data.length - 1].recordedAt);
        const minutes = Math.max(0, Math.round((last - first) / 60000));
        list = [
            { label: "Veri Sayýsý", value: data.length },
            { label: "Baþlangýç", value: first.toLocaleString() },
            { label: "Bitiþ", value: last.toLocaleString() },
            { label: "Aralýk", value: `${minutes} dk` },
        ];
    }


    return (
        <>
            {list.map(c => (
                <div key={c.label} className="bg-white rounded p-4 shadow text-center">
                    <div className="text-sm text-gray-500">{c.label}</div>
                    <div className="text-2xl font-bold">{c.value}</div>
                </div>
            ))}
        </>
    )
}

//
export default LogSummaryCard;