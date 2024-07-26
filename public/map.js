// map.js

// Set up the canvas and context
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
var geojson;
var path;
var currentlyHovered;

const countryMapping = {
    AO: "Angola",
    BF: "Burkina Faso",
    BI: "Burundi",
    BJ: "Benin",
    BW: "Botswana",
    CD: "Democratic Republic of the Congo",
    CF: "Central African Republic",
    CG: "Republic of the Congo",
    CI: "Côte d'Ivoire",
    CM: "Cameroon",
    CV: "Cape Verde",
    DJ: "Djibouti",
    DZ: "Algeria",
    EG: "Egypt",
    EH: "Western Sahara",
    ER: "Eritrea",
    ET: "Ethiopia",
    GA: "Gabon",
    GH: "Ghana",
    GM: "Gambia",
    GN: "Guinea",
    GQ: "Equatorial Guinea",
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
    SO: "Somalia",
    SS: "South Sudan",
    ST: "São Tomé and Príncipe",
    SZ: "Eswatini (Swaziland)",
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
    "0-5": "#FF0000",       // Red for very slow speeds
    "5-10": "#FFA500",      // Orange for slow speeds
    "10-20": "#FFFF00",     // Yellow for moderate speeds
    "20-50": "#90EE90",     // Light green for fast speeds
    "50-100": "#008000",    // Green for very fast speeds
    "100+": "#0000FF"       // Blue for extremely fast speeds
};

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
        for (var countryCode in data){
            // Change colour according to internet speed
            changeColor(getHexColorForSpeed(data[countryCode].average_download), countryMapping[countryCode])
        }
        drawGeoJSON(geojson);
        canvas.addEventListener('mousemove', handleMouseMove);
    })
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
    // if(!onContinent){
    //   if(currentlyHovered){
    //     console.log("working sometimes")
    //     console.log(currentlyHovered);
    //     changeColor("#FFFFFF", currentlyHovered)
    //     drawGeoJSON(geojson)
    //     currentlyHovered = null;
    //   }
    //   return;
    // }

    if (!onContinent){
        hideCard();
    }

    if (hoveredFeature) {
        // if(!currentlyHovered){
        //   currentlyHovered = hoveredFeature;
        //   changeColor('#0000FF', hoveredFeature)
        //   drawGeoJSON(geojson);
        //   return;
        // }
        
        // if(currentlyHovered == hoveredFeature){
        //    return; 
        // }

        // changeColor('#FFFFFF', currentlyHovered)
        // changeColor('#0000FF', hoveredFeature)
        // currentlyHovered = hoveredFeature;
        // drawGeoJSON(geojson);
        if(card.style.display === "none" || currentlyHovered != hoveredFeature){
            showCard(hoveredFeature, event)
            currentlyHovered = hoveredFeature;
        }
        else{
            card.style.left = `${event.pageX + 10}px`;
            card.style.top = `${event.pageY + 10}px`;
        }
    }
} 

function showCard(countryName, event) {
    card.innerHTML = `<h2>${countryName}</h2><p>AVG Download Speed: ${geoSpatialData[reversedMapping[countryName]].average_download} mbps</p?`;
    card.style.display = "block";
    console.log(event.pageX);
    console.log(event.pageY)
    card.style.left = `${event.pageX + 10}px`; // Adjust position
    card.style.top = `${event.pageY + 10}px`; // Adjust position
    
}

// Function to hide the card
function hideCard() {
    card.style.display = "none";
}
