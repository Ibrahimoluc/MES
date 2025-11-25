function LogSummaryCard(props) {
    let list = [
        { label: "Veri Sayısı", value: 0 },
        { label: "Başlangıç", value: "-" },
        { label: "Bitiş", value: "-" },
        { label: "Aralık", value: "-" }];
    
    if (props.data?.length) {
        const data = props.data;
        const first = new Date(data[0].recordedAt);
        const last = new Date(data[data.length - 1].recordedAt);
        const minutes = Math.max(0, Math.round((last - first) / 60000));
        list = [
            { label: "Veri Sayısı", value: data.length },
            { label: "Başlangıç", value: first.toLocaleString() },
            { label: "Bitiş", value: last.toLocaleString() },
            { label: "Aralık", value: `${minutes} dk` },
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