// map.js

// Set up the canvas and context
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
var geojson;
var path;
var currentlyHovered;
var country_chart = null;
const country_chart_ctx = document.getElementById('myLineChart').getContext('2d');

const countryMapping = {
    AO: "Angola",
    BF: "Burkina Faso",
    BI: "Burundi",
    BJ: "Benin",
    BW: "Botswana",
    CD: "Dem. Rep. Congo",
    CF: "Central African Rep.",
    CG: "Congo",
    CI: "Côte d'Ivoire",
    CM: "Cameroon",
    CV: "Cape Verde",
    DJ: "Djibouti",
    DZ: "Algeria",
    EG: "Egypt",
    EH: "W. Sahara",
    ER: "Eritrea",
    ET: "Ethiopia",
    GA: "Gabon",
    GH: "Ghana",
    GM: "Gambia",
    GN: "Guinea",
    GQ: "Eq. Guinea",
    GW: "Guinea-Bissau",
    KE: "Kenya",
    KM: "Comoros",
    LR: "Liberia",
    LS: "Lesotho",
    LY: "Libya",
    MA: "Morocco",
    MG: "Madagascar",
    ML: "Mali",
    MR: "Mauritania",
    MU: "Mauritius",
    MW: "Malawi",
    MZ: "Mozambique",
    NA: "Namibia",
    NE: "Niger",
    NG: "Nigeria",
    RE: "Réunion",
    RW: "Rwanda",
    SC: "Seychelles",
    SD: "Sudan",
    SH: "Saint Helena",
    SL: "Sierra Leone",
    SN: "Senegal",
    SO: "Somaliland",
    SOM: "Somalia",
    SS: "S. Sudan",
    ST: "São Tomé and Príncipe",
    SZ: "Swaziland",
    TD: "Chad",
    TG: "Togo",
    TN: "Tunisia",
    TZ: "Tanzania",
    UG: "Uganda",
    YT: "Mayotte",
    ZA: "South Africa",
    ZM: "Zambia",
    ZW: "Zimbabwe"
};

// Reverse the mapping
const reversedMapping = {};
for (const [code, name] of Object.entries(countryMapping)) {
    reversedMapping[name] = code;
}

const downloadSpeedToHexColor = {
    "0-5": "#FF9AA2",       // Slightly more saturated Pastel Red
    "5-10": "#FFDAC1",      // Slightly more saturated Peach Puff
    "10-20": "#FFFFB5",     // Slightly more saturated Light Yellow
    "20-50": "#B9FBC0",     // Slightly more saturated Pastel Green
    "50-100": "#A1F7A1",    // Slightly more saturated Pale Green
    "100+": "#B3E5FC"       // Slightly more saturated Light Blue
};

const colorToSelectionColorMapping = {
    "#FF9AA2": "#FF6F6F",  // Pastel Red to Coral Red
    "#FFDAC1": "#FFB07C",  // Peach Puff to Light Salmon
    "#FFFFB5": "#FFFF99",  // Light Yellow to Lemon Yellow
    "#B9FBC0": "#A2F8B0",  // Pastel Green to Light Green
    "#A1F7A1": "#8DFF8F",  // Pale Green to Light Lime Green
    "#B3E5FC": "#81D4FA"   // Light Blue to Sky Blue
};



const selectionColorToColorMap = {};
for (const [color, s_color] of Object.entries(colorToSelectionColorMapping)) {
    selectionColorToColorMap[s_color] = color;
}

const card = document.getElementById("card");

var geoSpatialData;

// Load GeoJSON data
fetch('africa.json')
    .then(response => response.json())
    .then(data => {
        geojson = data;
        initialiseMap(geojson)
    })
    .catch(error => {
        console.error('Error loading GeoJSON data:', error);
    });

function initialiseMap(geojson){
    fetch('https://cadesayner.pythonanywhere.com/getGeoData')
    .then(response => response.json())
    .then(data => {
        // geojson.features.forEach(feature => {
        //     feature.properties.color = '#FFFFFF'
        // });
        geoSpatialData = data;
        geoSpatialData["SOM"] = geoSpatialData["SO"]
        for (var countryCode in data){
            // Change colour according to internet speed
            changeColor(getHexColorForSpeed( (geoSpatialData[countryCode].average_download + geoSpatialData[countryCode].average_download)/2), countryMapping[countryCode])
        }
        drawGeoJSON(geojson);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleClick);
    })
}


function handleClick(event) {
    if (currentlyHovered) {
        fetch(`https://cadesayner.pythonanywhere.com/getCountryData?country=${reversedMapping[currentlyHovered]}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            populateGraph(data, currentlyHovered)
        })
    }
}
function getYears(data){
    var out = []
    data.forEach(element => {
        out.push(element.year)
    });
    return out;
}

function getUploadData(data){
    var out = []
    data.forEach(element => {
        out.push(element.average_upload)
    });
    return out;
}

function getDownloadData(data){
    var out = []
    data.forEach(element => {
        out.push(element.average_download)
    });
    return out;
}
function populateGraph(data, countryName){
    if(!country_chart){
        // Create a new Chart instance
        country_chart = new Chart(country_chart_ctx, {
        type: 'line', // Specify the type of chart
        data: {
            labels: getYears(data), // X-axis labels
            datasets: [{
                label: currentlyHovered, // Label for the dataset
                data: getDownloadData(data), // Data points
                fill: false, // No fill under the line
                borderColor: 'rgb(75, 192, 192)', // Line color
                tension: 0.1 // Line smoothness
            }]
        },
        options: {
            responsive: true, // Make the chart responsive
            scales: {
                x: {
                    beginAtZero: true // Start X-axis at zero
                },
                y: {
                    beginAtZero: true // Start Y-axis at zero
                }
            },
            plugins: {
                legend: {
                    display: true, // Display the legend
                    position: 'top' // Position of the legend
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `Value: ${tooltipItem.raw}`;
                        }
                    }
                }
            }
        }
    });
    }
    else{
        console.log("trying to change the plot")
        country_chart.data.datasets[0].data = getDownloadData(data)
        country_chart.data.labels = getYears(data)
        country_chart.data.datasets[0].label = currentlyHovered
        country_chart.update();
    }
}

function getHexColorForSpeed(speed) {
    if (speed === null) return "#808080"; // Gray for missing data
    if (speed < 5) return downloadSpeedToHexColor["0-5"];
    if (speed < 10) return downloadSpeedToHexColor["5-10"];
    if (speed < 20) return downloadSpeedToHexColor["10-20"];
    if (speed < 50) return downloadSpeedToHexColor["20-50"];
    if (speed < 100) return downloadSpeedToHexColor["50-100"];
    return downloadSpeedToHexColor["100+"];
}

function changeColor(color, countryName){
    console.log("trying to change color of", countryName)
    geojson.features.forEach(feature => {
        if(feature.properties.name === countryName){
            console.log("tried to change color of", countryName)
            feature.properties.color = color;
            return;
        }
    });
}
// Define a function to draw GeoJSON data
function drawGeoJSON(geojson) {
    // Set up projection and transformation
    const projection = d3.geoMercator().fitSize([canvas.width, canvas.height], geojson);
    path = d3.geoPath().projection(projection);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw each feature
    geojson.features.forEach(feature => {
        const geoPath = path(feature);
        // Draw the feature on the canvas
        ctx.beginPath();
        const pathData = new Path2D(geoPath);
        ctx.strokeStyle = '#000'; // Border color
        ctx.lineWidth = 3;
        ctx.stroke(pathData);
        ctx.fillStyle = feature.properties.color; // Color based on country name
        ctx.fill(pathData);
    });
}

// Handle mouse move events
function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Determine which feature is under the cursor
    const mousePoint = [x, y];
    let hoveredFeature = null;
    var onContinent = false;
    var currentFeature;

    geojson.features.forEach(feature => {
        const geoPath = path(feature);
        if (ctx.isPointInPath(new Path2D(geoPath), x, y)) {
            hoveredFeature = feature.properties.name;
            currentFeature = feature;
            onContinent = true
        }
    });

    if (!onContinent){
        hideCard();
        if(currentlyHovered){
            prevCurrColor = getColor(currentlyHovered)
            console.log(prevCurrColor)
            console.log(selectionColorToColorMap[prevCurrColor])
            changeColor(selectionColorToColorMap[prevCurrColor], currentlyHovered);
            currentlyHovered = null
            drawGeoJSON(geojson)
        }
    }

    if (hoveredFeature) {
        console.log(hoveredFeature)
        if(card.style.display === "none" || currentlyHovered != hoveredFeature){
            showCard(hoveredFeature, event)
            if(currentlyHovered){
                prevCurrColor = getColor(currentlyHovered)
                changeColor(selectionColorToColorMap[prevCurrColor], currentlyHovered);
            }

            newCurrColor = getColor(hoveredFeature)
            changeColor(colorToSelectionColorMapping[newCurrColor], hoveredFeature);
            drawGeoJSON(geojson)

            currentlyHovered = hoveredFeature;
        }
        else{
            card.style.left = `${event.pageX + 10}px`;
            card.style.top = `${event.pageY + 10}px`;
        }
    }
} 

function getColor(countryName){
    color = null
    geojson.features.forEach(feature => {
        if(feature.properties.name === countryName){
            color = feature.properties.color
        }
    });
    return color
}

function showCard(countryName, event) {
    const countryData = geoSpatialData[reversedMapping[countryName]];
    card.innerHTML = `
    <h2>${countryName}</h2>
    <p><span class="label">AVG Download Speed:</span> ${countryData.average_download} Mbps</p>
    <p><span class="label">AVG Upload Speed:</span> ${countryData.average_upload} Mbps</p>
`;
    card.style.display = "block";
    card.style.left = `${event.pageX + 10}px`; 
    card.style.top = `${event.pageY + 10}px`; 
}

// Function to hide the card
function hideCard() {
    card.style.display = "none";
}
