let map = L.map('map').setView([28.1099, 30.7503], 8);

/* --------------------------
   Map Layer
---------------------------*/

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution:'© OpenStreetMap'
    }
).addTo(map);

/* --------------------------
   Custom Icons
---------------------------*/

const userIcon = L.divIcon({

    className:"custom-user-icon",

    html:`
        <div class="pulse-dot"></div>
    `,

    iconSize:[22,22],

    iconAnchor:[11,11]

});

const targetIcon = L.divIcon({

    className:"custom-target-icon",

    html:`
        <div class="target-dot"></div>
    `,

    iconSize:[28,28],

    iconAnchor:[14,14]

});

/* --------------------------
   Update Map
---------------------------*/

function updateMap(
    lat,
    lng
){

    /* User Marker */

    if(!userMarker){

        userMarker = L.marker(
            [lat,lng],
            {
                icon:userIcon
            }
        ).addTo(map);

    }else{

        userMarker.setLatLng(
            [lat,lng]
        );

    }

    /* Target Marker */

    if(!targetMarker){

        targetMarker = L.marker(
            [targetLat,targetLng],
            {
                icon:targetIcon
            }
        ).addTo(map);

    }else{

        targetMarker.setLatLng(
            [targetLat,targetLng]
        );

    }

    /* Remove Old Path */

    if(linePath){

        map.removeLayer(linePath);

    }

    /* Create New Path */

    linePath = L.polyline(

        [
            [lat,lng],
            [targetLat,targetLng]
        ],

        {
            color:'#00d9ff',
            weight:4,
            opacity:0.85,
            dashArray:'10,10'
        }

    ).addTo(map);

    /* First Load */

    if(!window.mapInitialized){

        const bounds = L.latLngBounds([
            [lat,lng],
            [targetLat,targetLng]
        ]);

        map.fitBounds(
            bounds,
            {
                padding:[50,50]
            }
        );

        window.mapInitialized = true;

    }else{

        map.setView(
            [lat,lng],
            map.getZoom(),
            {
                animate:true
            }
        );

    }

}

/* --------------------------
   Animated Icons Style
---------------------------*/

const style = document.createElement("style");

style.innerHTML = `

.custom-user-icon{
    background:transparent;
}

.pulse-dot{
    width:22px;
    height:22px;
    background:#00ffae;
    border-radius:50%;
    box-shadow:0 0 20px #00ffae;
    animation:pulse 1.5s infinite;
}

.custom-target-icon{
    background:transparent;
}

.target-dot{
    width:28px;
    height:28px;
    border-radius:50%;
    background:#ff3b3b;
    border:4px solid white;
    box-shadow:0 0 20px #ff3b3b;
}

@keyframes pulse{

    0%{
        transform:scale(1);
        opacity:1;
    }

    50%{
        transform:scale(1.5);
        opacity:0.5;
    }

    100%{
        transform:scale(1);
        opacity:1;
    }

}

`;

document.head.appendChild(style);

/* --------------------------
   Map Click Debug
---------------------------*/

map.on("click", function(e){

    const lat = e.latlng.lat.toFixed(6);

    const lng = e.latlng.lng.toFixed(6);

    console.log(
        "Map Position:",
        lat,
        lng
    );

});

/* --------------------------
   Dark Overlay
---------------------------*/

const darkOverlay = L.rectangle(

    [
        [-90,-180],
        [90,180]
    ],

    {
        color:"#000000",
        weight:0,
        fillOpacity:0.05
    }

);

darkOverlay.addTo(map);