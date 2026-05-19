let currentLat = null;
let currentLng = null;

let lastHeading = 0;

/* --------------------------
   Start GPS
---------------------------*/

function startGPS(){

    if(!navigator.geolocation){

        alert("GPS Not Supported");

        return;
    }

    statusText.innerText = "SEARCHING GPS";

    watchId = navigator.geolocation.watchPosition(

        position => {

            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;

            const accuracy =
                position.coords.accuracy;

            gpsAccuracy.innerText =
                "Accuracy: " +
                accuracy.toFixed(1) +
                "m";

            updateMap(
                currentLat,
                currentLng
            );

            updateNavigation(
                currentLat,
                currentLng
            );

            updateDirection(
                currentLat,
                currentLng
            );

        },

        error => {

            console.error(error);

            alert(
                "Unable To Access GPS"
            );

        },

        {
            enableHighAccuracy:true,
            maximumAge:0,
            timeout:10000
        }

    );

}

/* --------------------------
   Compass Direction
---------------------------*/

function updateDirection(
    userLat,
    userLng
){

    const heading =
        calculateBearing(
            userLat,
            userLng,
            targetLat,
            targetLng
        );

    lastHeading = heading;

    const compass =
        document.getElementById(
            "compassArrow"
        );

    compass.style.transform =
        `rotate(${heading}deg)`;

}

/* --------------------------
   Bearing Formula
---------------------------*/

function calculateBearing(
    lat1,
    lon1,
    lat2,
    lon2
){

    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;

    const λ1 = lon1 * Math.PI/180;
    const λ2 = lon2 * Math.PI/180;

    const y =
        Math.sin(λ2 - λ1) *
        Math.cos(φ2);

    const x =
        Math.cos(φ1) *
        Math.sin(φ2) -

        Math.sin(φ1) *
        Math.cos(φ2) *
        Math.cos(λ2 - λ1);

    let θ =
        Math.atan2(y,x);

    θ = θ * 180/Math.PI;

    return (θ + 360) % 360;

}

/* --------------------------
   Device Orientation
---------------------------*/

window.addEventListener(
    "deviceorientationabsolute",
    handleOrientation,
    true
);

window.addEventListener(
    "deviceorientation",
    handleOrientation,
    true
);

function handleOrientation(event){

    let alpha = event.alpha;

    if(alpha === null){

        return;
    }

    const compass =
        document.getElementById(
            "compassArrow"
        );

    const finalRotation =
        lastHeading - alpha;

    compass.style.transform =
        `rotate(${finalRotation}deg)`;

}

/* --------------------------
   UTM 36N Conversion
---------------------------*/

function utmToLatLng(
    easting,
    northing
){

    const zoneNumber = 36;

    const northernHemisphere = true;

    const a = 6378137.0;
    const e = 0.081819191;
    const e1sq = 0.006739497;
    const k0 = 0.9996;

    const arc =
        northing / k0;

    const mu =
        arc /
        (
            a *
            (
                1 -
                Math.pow(e,2)/4 -
                3*Math.pow(e,4)/64 -
                5*Math.pow(e,6)/256
            )
        );

    const ei =
        (
            1 -
            Math.sqrt(1 - e*e)
        ) /
        (
            1 +
            Math.sqrt(1 - e*e)
        );

    const ca =
        3*ei/2 -
        27*Math.pow(ei,3)/32;

    const cb =
        21*Math.pow(ei,2)/16 -
        55*Math.pow(ei,4)/32;

    const cc =
        151*Math.pow(ei,3)/96;

    const cd =
        1097*Math.pow(ei,4)/512;

    const phi1 =
        mu +
        ca*Math.sin(2*mu) +
        cb*Math.sin(4*mu) +
        cc*Math.sin(6*mu) +
        cd*Math.sin(8*mu);

    const n0 =
        a /
        Math.sqrt(
            1 -
            Math.pow(
                e*Math.sin(phi1),
                2
            )
        );

    const r0 =
        a *
        (
            1 - e*e
        ) /
        Math.pow(
            1 -
            Math.pow(
                e*Math.sin(phi1),
                2
            ),
            1.5
        );

    const fact1 =
        n0 *
        Math.tan(phi1) /
        r0;

    const _a1 =
        500000 - easting;

    const dd0 =
        _a1 /
        (
            n0*k0
        );

    const fact2 =
        dd0*dd0/2;

    const t0 =
        Math.pow(
            Math.tan(phi1),
            2
        );

    const Q0 =
        e1sq *
        Math.pow(
            Math.cos(phi1),
            2
        );

    const fact3 =
        (
            5 +
            3*t0 +
            10*Q0 -
            4*Q0*Q0 -
            9*e1sq
        ) *
        Math.pow(dd0,4) /
        24;

    const fact4 =
        (
            61 +
            90*t0 +
            298*Q0 +
            45*t0*t0 -
            252*e1sq -
            3*Q0*Q0
        ) *
        Math.pow(dd0,6) /
        720;

    const lof1 =
        dd0;

    const lof2 =
        (
            1 +
            2*t0 +
            Q0
        ) *
        Math.pow(dd0,3) /
        6;

    const lof3 =
        (
            5 -
            2*Q0 +
            28*t0 -
            3*Q0*Q0 +
            8*e1sq +
            24*t0*t0
        ) *
        Math.pow(dd0,5) /
        120;

    const _a2 =
        (
            lof1 -
            lof2 +
            lof3
        ) /
        Math.cos(phi1);

    const _a3 =
        _a2 *
        180/Math.PI;

    const latitude =
        (
            phi1 -
            fact1 *
            (
                fact2 +
                fact3 +
                fact4
            )
        ) *
        180/Math.PI;

    const longitude =
        (
            (
                zoneNumber > 0
                    ? 6*zoneNumber - 183
                    : 3
            ) -
            _a3
        );

    return {
        lat:latitude,
        lng:longitude
    };

}