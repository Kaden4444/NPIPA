// Sample data for demonstration purposes
const labels = ['2018', '2019', '2020', '2021', '2022'];
const downloadSpeeds = [5.1, 6.2, 7.8, 9.3, 10.5];
const uploadSpeeds = [2.0, 2.5, 3.0, 3.5, 4.0];

const ctx = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Average Download Speed (Mbps)',
                data: downloadSpeeds,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Average Upload Speed (Mbps)',
                data: uploadSpeeds,
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Year'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Speed (Mbps)'
                },
                beginAtZero: true
            }
        }
    }
});
