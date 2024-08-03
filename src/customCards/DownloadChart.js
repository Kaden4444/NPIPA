import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function DownloadChart({ chartData }) {
  const chartRef = useRef(null);
  const data = {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: chartData
  };
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Download Speed',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#333'
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Speed: ${tooltipItem.raw} Mbps`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#333',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: '#e3e3e3'
        },
        ticks: {
          color: '#333',
          font: {
            size: 12
          },
          callback: function(value) {
            return `${value} Mbps`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' , borderRadius:7, backgroundColor: '#E1E5EA', marginBottom:'20px'}}>
      <Line data={data} options={options} />
    </div>
  );
}

export default DownloadChart;


