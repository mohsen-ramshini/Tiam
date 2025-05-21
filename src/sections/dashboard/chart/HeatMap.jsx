import React, { useRef, useState, useEffect } from "react";
import HeatMap from "react-heatmap-grid";

// لیبل‌های سراسری
const xLabels = ["tehran", "mashhad", "shiraz", "tabriz"];
const allYLabels = ["10:00", "11:00", "12:00", "13:00", "14:00"];
const hosts = ["host1", "host2", "host3"];
const timeOptions = [
  { label: "1 ساعت اخیر", value: 1 },
  { label: "2 ساعت اخیر", value: 2 },
  { label: "3 ساعت اخیر", value: 3 },
  { label: "4 ساعت اخیر", value: 4 },
  { label: "5 ساعت اخیر", value: 5 },
];

// داده‌ها
const metrics = {
  latency: {
    host1: [
      [140, 95, 110, 130],
      [130, 100, 150, 120],
      [160, 90, 120, 110],
      [150, 110, 130, 140],
      [140, 105, 125, 135],
    ],
    host2: [
      [120, 80, 100, 115],
      [125, 95, 140, 110],
      [150, 85, 110, 105],
      [145, 100, 120, 130],
      [135, 100, 120, 125],
    ],
    host3: [
      [100, 70, 90, 105],
      [115, 85, 130, 100],
      [140, 75, 100, 95],
      [135, 90, 110, 120],
      [125, 95, 115, 115],
    ],
  },
  ping: {
    host1: [
      [40, 35, 50, 45],
      [42, 32, 38, 48],
      [39, 30, 37, 36],
      [41, 34, 42, 40],
      [43, 36, 39, 41],
    ],
    host2: [
      [38, 34, 47, 44],
      [40, 30, 35, 46],
      [36, 28, 33, 34],
      [39, 31, 40, 38],
      [41, 34, 37, 39],
    ],
    host3: [
      [36, 32, 45, 42],
      [38, 28, 32, 44],
      [34, 26, 30, 32],
      [37, 29, 38, 36],
      [39, 32, 35, 37],
    ],
  },
};

export default function WrappedHeatmap() {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [metric, setMetric] = useState("latency");
  const [host, setHost] = useState("host1");
  const [timeRange, setTimeRange] = useState(5); // پیش‌فرض: 5 بازه زمانی اخیر

  const fullData = metrics[metric][host];
  const data = fullData.slice(-timeRange);
  const yLabels = allYLabels.slice(-timeRange);
  const maxVal = Math.max(...data.flat());

  const getColor = (value) => {
    const red = Math.floor((value / maxVal) * 255);
    const blue = 255 - red;
    return `rgb(${red}, 100, ${blue})`;
  };

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const cellWidth = dimensions.width
    ? Math.max(dimensions.width / xLabels.length - 10, 50)
    : 60;
  const cellHeight = dimensions.height
    ? Math.max(dimensions.height / yLabels.length - 10, 30)
    : 36;

  return (
    <>
      <link
        href="//fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700"
        rel="stylesheet"
      />
      <div
        ref={containerRef}
        style={{
          fontFamily: "'Roboto Condensed', sans-serif",
          fontWeight: 300,
          fontSize: 14,
          color: "#444",
          padding: 20,
          width: "100%",
          height: "100%",
          borderRadius: 10,
          boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
          background: "#f8f9fa",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ margin: 0, color: "#333" }}>
            {metric === "latency" ? "Latency Heatmap (ms)" : "Ping Heatmap (ms)"} - {host}
          </h2>

          <div style={{ display: "flex", gap: 10 }}>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              style={{
                padding: "6px 12px",
                fontSize: 14,
                borderRadius: 6,
                border: "1px solid #ccc",
                background: "#fff",
              }}
            >
              <option value="latency">Latency</option>
              <option value="ping">Ping</option>
            </select>
            <select
              value={host}
              onChange={(e) => setHost(e.target.value)}
              style={{
                padding: "6px 12px",
                fontSize: 14,
                borderRadius: 6,
                border: "1px solid #ccc",
                background: "#fff",
              }}
            >
              {hosts.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ marginRight: 10, fontWeight: "bold", color: "#333" }}>
            بازه زمانی:
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            style={{ width: 200 }}
          />
          <span style={{ marginRight: 12 }}>
            {timeOptions.find((t) => t.value === timeRange)?.label}
          </span>
        </div>

        <div style={{ flexGrow: 1, overflow: "auto" }}>
          <HeatMap
            xLabels={xLabels}
            yLabels={yLabels}
            data={data}
            squares={false}
            height={cellHeight}
            width={cellWidth}
            cellStyle={(background, value) => ({
              backgroundColor: getColor(value),
              color: value > maxVal / 2 ? "#fff" : "#222",
              fontWeight: "600",
              borderRadius: 6,
              boxShadow: "0 0 5px rgba(0,0,0,0.15)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 14,
              cursor: "default",
              transition: "background-color 0.3s",
            })}
            cellRender={(value) => <span>{value} ms</span>}
            xLabelsStyle={() => ({
              color: "#666",
              fontWeight: "700",
              fontSize: 14,
              marginBottom: 8,
              userSelect: "none",
            })}
            yLabelsStyle={() => ({
              color: "#666",
              fontWeight: "700",
              fontSize: 14,
              marginRight: 10,
              userSelect: "none",
            })}
            style={{ userSelect: "none" }}
          />
        </div>
      </div>
    </>
  );
}
