import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function DownloadLatencyChart({ chartData, labels}) {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData({
      labels: labels,
      datasets: chartData
    });
  }, [chartData, labels]);

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Upload Latency',
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
            return `RTT: ${tooltipItem.raw} ms`;
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
            return `${value} ms`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };
  const hasData = data && data.datasets && data.datasets[0] && data.datasets[0].data && data.datasets[0].data.length > 0;
  return (
    <div style={{marginTop:'20px', position: 'relative', height: '300px', width: '100%', borderRadius: 7, backgroundColor: '#E1E5EA' }}>
      {hasData ? (
        <Line data={data} options={options} />
      ) : (
        <div style={{ textAlign: 'center',  paddingTop: '100px', color: '#999' }}>
          No data available
        </div>
      )}
    </div>
  );
}

export default DownloadLatencyChart;