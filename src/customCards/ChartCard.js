import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Button, Box } from '@radix-ui/themes';
import { FaExpandArrowsAlt, FaCross } from "react-icons/fa";
import { Cross1Icon } from '@radix-ui/react-icons';
import * as Dialog from '@radix-ui/react-dialog';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler
);

function ChartCard({ chartTitle, chartData, labels }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData({
      labels: labels,
      datasets: chartData
    });
    console.log("trying to update graphs");
  }, [chartData, labels]);

  const options = {
    animation: {
      duration: 500,
      easing: 'linear',
    },
    spanGaps: true,
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
          label: (tooltipItem) => `Speed: ${tooltipItem.raw} Mbps`
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
          callback: (value) => `${value} Mbps`
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
          <Button size={1} style={{ position: "absolute", margin: '10px' }}>
            <FaExpandArrowsAlt />
          </Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
          <Dialog.Content style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90vh', height: "70vh", backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <ExpandedCard expandedTitle={chartTitle} expandedData={chartData} expandedLabels={labels} />
            <Dialog.Close asChild>
              <Button size={1} style={{ position: "absolute", top: '10px', right: '10px' }}>
                <Cross1Icon />
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
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

function ExpandedCard({ expandedTitle, expandedData, expandedLabels }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData({
      labels: expandedLabels,
      datasets: expandedData
    });
    console.log("trying to update graphs");
  }, [expandedData, expandedLabels]);

  const options = {
    animation: {
      duration: 500,
      easing: 'linear',
    },
    spanGaps: true,
    plugins: {
      title: {
        display: true,
        text: expandedTitle,
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
          label: (tooltipItem) => `Speed: ${tooltipItem.raw} Mbps`
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
          callback: (value) => `${value} Mbps`
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  const hasData = data && data.datasets && data.datasets[0] && data.datasets[0].data && data.datasets[0].data.length > 0;

  return (
    <Box width={"80vh"} height={"65vh"}>
      {hasData ? (
        <Line data={data} options={options} />
      ) : (
        <div style={{ textAlign: 'center', height:'70vh', marginTop: '10px', paddingTop: '100px', color: '#999' }}>
          No data available
        </div>
      )}
    </Box>
  );
}

export default ChartCard;
