// map.js

// Set up the canvas and context
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

var geojson;
var path;
var currentlyHovered;

var country_chart_download = null;
var country_chart_upload = null;

const country_chart_ctx_download = document.getElementById('download_chart').getContext('2d');
const country_chart_ctx_upload = document.getElementById('upload_chart').getContext('2d');

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

var countryNameToColorMap = {}
const right_sidebar = document.getElementById("sidebar-right");

var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors

// Reverse the mapping
const reversedMapping = {};
for (const [code, name] of Object.entries(countryMapping)) {
    reversedMapping[name] = code;
}

const countryOptions = [
    { code: 'ZA', name: 'Country A' },
    { code: 'US', name: 'Country B' },
    { code: 'GB', name: 'Country C' }
    // Add more countries as needed
];

// 

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
    const sidebar = document.getElementById('sidebar')
    if( sidebar.className != 'sidebar-show'){
        sidebar.className = 'sidebar-show'
    }

    if (currentlyHovered) {
        hovered = currentlyHovered+"";
        fetch(`https://cadesayner.pythonanywhere.com/getCountryData?country=${reversedMapping[currentlyHovered]}`)
        .then(response => response.json())
        .then(data => {
            populateGraphs(data, hovered)
        })
        // Create a new search bar
        createCountryEntry(currentlyHovered)
    }

}

results = 1;

function createCountryEntry(countryName){
    var input_id = `input-box-${results}`
    var result_id = `result-box-${results}`
    results += 1;
    var content = `<div class="sidebar-item-right">
    <h3>${countryName}</h3>
    <p>Filter By:<p>
    <div class="search-box">
        <div class="row">
            <input type="text" id="${input_id}" placeholder="Enter ISP Name" onkeydown="handleKeyDown(event)" autocomplete="off">
            <button> Add ISP </button>
        </div>
        <div class="result-box" id="${result_id}">
        </div>
    </div>
</div>`

    right_sidebar.insertAdjacentHTML('beforeend', content)
}

function handleKeyDown(event){
    id = event.target.id.split("-")[2];
    resultBox = document.getElementById(`result-box-${id}`)
    inputBox = document.getElementById(`input-box-${id}`)
    result = ["Afrihost", "Comcast", "UCT Network"]
    const content = result.map((list)=>{
        return "<li onclick=handleSearchResultClick(event,this)>" + list+ "</li>"
    })
    resultBox.innerHTML = "<ul>" + content.join('') + "</ul>"

    // Send api request to get api names and then update the result box accordingly
}

function handleSearchResultClick(event,list){
    var id = event.target.parentElement.parentElement.id
    var inputBoxId = "input-box-" + id.split("-")[2]
    document.getElementById(inputBoxId).value = list.innerHTML;
    document.getElementById(id).innerHTML = ''
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

function getRandomColor() {
    // Generate random values for R, G, B
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Return the RGB string
    return `rgb(${r}, ${g}, ${b})`;
}

function createDownloadChart(data, countryName){
    return new Chart(country_chart_ctx_download, {
        type: 'line', // Specify the type of chart
        data: {
            labels: getYears(data), // X-axis labels
            datasets: [{
                label: countryName, // Label for the dataset
                data: getDownloadData(data), // Data points
                fill: false, // No fill under the line
                borderColor: 'rgb(75, 192, 192)', // Line color
                tension: 0.1 // Line smoothness
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: 'white' // X-axis labels color
                    }
                },
                y: {
                    ticks: {
                        color: 'white' // Y-axis labels color
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false, // Allows the chart to use all available space
        
            plugins: {
              legend: {
                labels: {
                    color: 'white',   // Change the legend text color
                    font: {
                        size: 14,    // Set the font size (optional)
                        style: 'italic' // Set the font style (optional)
                    }
                },
                position: 'top',
              },
              title: {
                display: true,
                color: 'white',
                font: {
                    size: 18,    // Set the font size (optional)
                    style: 'italic' // Set the font style (optional)
                },
                text: 'Download Speed'
              }
            }
        }
    });
}

function createUploadChart(data, countryName){
    return new Chart(country_chart_ctx_upload, {
        type: 'line', // Specify the type of chart
        data: {
            labels: getYears(data), // X-axis labels
            datasets: [{
                label: countryName, // Label for the dataset
                data: getUploadData(data), // Data points
                fill: false, // No fill under the line
                borderColor: 'rgb(75, 192, 192)', // Line color
                tension: 0.1 // Line smoothness
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: 'white' // X-axis labels color
                    }
                },
                y: {
                    ticks: {
                        color: 'white' // Y-axis labels color
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false, // Allows the chart to use all available space
        
            plugins: {
              legend: {
                labels: {
                    color: 'white',   // Change the legend text color
                    font: {
                        size: 14,    // Set the font size (optional)
                        style: 'italic' // Set the font style (optional)
                    }
                },
                position: 'top',
              },
              title: {
                display: true,
                color: 'white',
                font: {
                    size: 14,    // Set the font size (optional)
                    style: 'bold' // Set the font style (optional)
                },
                text: 'Upload Speed'
              }
            }
        }
    });
}


function populateGraphs(data, countryName){
    if(!country_chart_download && !country_chart_upload){
        // Neither chart has been initalised with a country choice yet
        // Create a new Chart instance
        country_chart_download = createDownloadChart(data,countryName)
        country_chart_upload = createUploadChart(data, countryName)
    }
    else{
        updateDownloadChart(data, countryName);
        updateUploadChart(data, countryName);
    }
}
function updateDownloadChart(data, countryName){
    country_chart_download.data.datasets[0].data = getDownloadData(data)
    country_chart_download.data.labels = getYears(data)
    country_chart_download.data.datasets[0].label = countryName
    country_chart_download.update();
}

function updateUploadChart(data, countryName){
    country_chart_upload.data.datasets[0].data = getUploadData(data)
    country_chart_upload.data.labels = getYears(data)
    country_chart_upload.data.datasets[0].label = countryName
    country_chart_upload.update();
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
    countryNameToColorMap[countryName] = color
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
        // ctx.fillStyle = feature.properties.color; // Color based on country name
        ctx.fillStyle = countryNameToColorMap[feature.properties.name]
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
            changeColor(selectionColorToColorMap[prevCurrColor], currentlyHovered);
            currentlyHovered = null
            drawGeoJSON(geojson)
        }
    }

    if (hoveredFeature) {
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
    return countryNameToColorMap[countryName]
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


// function populateGraphCompare(data, country){
    //    console.log(data)
    //    let compare_dataset = {
    //         label: country, // Label for the dataset
    //         data: getDownloadData(data), // Data points
    //         fill: false, // No fill under the line
    //         borderColor: getRandomColor(), // Line color
    //         tension: 0.1 // Line smoothness
    //     }
    //     if(country_chart_download){
    //         country_chart_download.data.datasets.push(compare_dataset)
    //         country_chart_download.update()
    //     }
    // }


   // function handleSelectionChange(event) {
        //     // Get the selected value
        //     const selectedValue = event.target.value;
        
        //     // Get the selected option text
        //     const selectedText = event.target.options[event.target.selectedIndex].text;
        //     console.log(selectedValue)
        //     fetch(`https://cadesayner.pythonanywhere.com/getCountryData?country=${selectedValue}`)
        //         .then(response => response.json())
        //         .then(data => {
        //             populateGraphCompare(data, selectedText)
        //     })
        // }

//result box logic

// const resultBox = document.getElementById("result-box");
// const inputBox = document.getElementById("input-box")

// inputBox.onkeyup = function(){
//     result = ["hello"]
//     display(result, inputBox)
// }

// function display(result){
//     const content = result.map((list)=>{
//         return "<li>" + list + "</li"
//     })
//     resultBoxinnerHTML = "<ul>" + content + "</ul>"
//}

