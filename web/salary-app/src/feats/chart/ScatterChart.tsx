import { useEffect, useRef } from "react";
import PlotlyJS from "plotly.js-dist-min";

export const ScatterChart = ({
  chartData,
}: {
  chartData: PlotlyJS.ScatterData[];
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }
    PlotlyJS.react(
      chartRef.current,
      chartData,
      {
        yaxis: {},
        xaxis: {
          autorange: true,
          tickangle: 90,
          title: {
            position: "bottom center",
            standoff: 200,
          },
        },
        showlegend: false,
      },
      { responsive: true }
    );
  }, [chartRef.current, chartData]);

  return <div ref={chartRef}></div>;
};
