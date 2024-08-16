import React, { useRef, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Button, Dialog } from '@radix-ui/themes';
import { FaExpandArrowsAlt } from "react-icons/fa";
import { DialogContent } from '@radix-ui/react-dialog';

function ChartCard({ chartTitle, chartData, labels }) {

  const [data, setData] = useState([]);
  useEffect(() => {
    setData({
      labels: labels,
      datasets: chartData
    });
    console.log("trying to update graphs")
  }, [chartData, labels]);
  
  const options = {
    animation: {
      duration: 500, // Animation duration in milliseconds
      easing: 'linear', // Animation easing function
    },
    spanGaps:true,
    plugins: {
      title: {
        display: true,
        text: chartTitle,
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

  const hasData = data && data.datasets && data.datasets[0] && data.datasets[0].data && data.datasets[0].data.length > 0;

  return (
    <div style={{ position: 'relative', height: '300px', width: '100%', borderRadius: 7, backgroundColor: '#E1E5EA' }}>
    <Dialog.Root>
        <Dialog.Trigger asChild>
            <Button size={1} style={{position: "absolute", margin: '10px'}}><FaExpandArrowsAlt /></Button>
        </Dialog.Trigger>   
        <DialogContent>
          <div style={{ position: 'absolute', height: '70vh', width: '100%', borderRadius: 7, backgroundColor: 'brown' }}>

          </div>
        </DialogContent>   
    </Dialog.Root>

      {hasData ? (
        <Line data={data} options={options} />
      ) : (
        <div style={{ textAlign: 'center', marginTop: '10px', paddingTop: '100px', color: '#999' }}>
          No data available
        </div>
      )}
      
    </div>
  );
}

export default ChartCard;


