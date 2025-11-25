export function foo() {
    console.log("foo is here...");
}

function round2(n) {
    return Math.round((Number(n) || 0) * 100) / 100;
}

export function aggregate(rawData, scale=2) {
    if (!rawData?.length) return [];

    const baseSeconds = 60;
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
    console.log(bucketMap);

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
}

export function arrangeLines(selectedMetrics) {
    const colors = { oee: "#1f77b4", availability: "#ff7f0e", performance: "#2ca02c", quality: "#d62728" };
    const out = [];
    for (const [key, label] of Object.entries({ oee: "OEE", availability: "Availability", performance: "Performance", quality: "Quality" })) {
        if (selectedMetrics[key]) out.push({ key, label, color: colors[key] });
    }
    return out;
}