import React from "react";
import { Line } from 'react-chartjs-2';
import Chart from "chart.js/auto/auto.mjs"

export default function LineChart({chartData}) {
    return <Line data={chartData} options={ {
        plugins: {
            legend: {
                display: false,
            }
        }
    }
}/>
}