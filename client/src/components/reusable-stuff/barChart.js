import React, { useSyncExternalStore } from "react";
import { Bar } from 'react-chartjs-2';
import Chart from "chart.js/auto/auto.mjs"

export default function BarChart({chartData}) {
    return <Bar data={chartData} options={ {
        indexAxis: 'y',
        elements: {
            bar: {
              width: 2,
            }
        },
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            }
        }
    }
}/>
}