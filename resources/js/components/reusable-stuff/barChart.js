import React from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

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