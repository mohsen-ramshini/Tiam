import React, { useRef, useState, useEffect } from "react";
import HeatMap from "react-heatmap-grid";

// داده‌ها
const xLabels = ["tehran", "mashhad", "shiraz", "tabriz"];
const yLabels = ["10:00", "10:05", "10:10", "10:15", "10:20"];

const metrics = {
  latency: [
    [140, 95, 110, 130],
    [130, 100, 150, 120],
    [160, 90, 120, 110],
    [150, 110, 130, 140],
    [140, 105, 125, 135],
  ],
  ping: [
    [40, 35, 50, 45],
    [42, 32, 38, 48],
    [39, 30, 37, 36],
    [41, 34, 42, 40],
    [43, 36, 39, 41],
  ],
};

export default function WrappedHeatmap() {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [metric, setMetric] = useState("latency"); // متریک انتخاب‌شده

  const data = metrics[metric];
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#333" }}>
            {metric === "latency" ? "Latency Heatmap (ms)" : "Ping Heatmap (ms)"}
          </h2>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            style={{
              padding: "6px 12px",
              fontSize: 14,
              borderRadius: 6,
              border: "1px solid #ccc",
              background: "#fff",
              fontFamily: "'Roboto Condensed', sans-serif",
            }}
          >
            <option value="latency">Latency</option>
            <option value="ping">Ping</option>
          </select>
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
