let lastVoiceTime = 0;

let lastVoiceMessage = "";

/* --------------------------
   Speak Function
---------------------------*/

function speak(text){

    const now = Date.now();

    /* Prevent Spam */

    if(
        text === lastVoiceMessage &&
        now - lastVoiceTime < 4000
    ){
        return;
    }

    lastVoiceMessage = text;

    lastVoiceTime = now;

    /* Stop Previous */

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(
            text
        );

    speech.lang = "en-US";

    speech.volume = 1;

    speech.rate = 1;

    speech.pitch = 1;

    /* Best Voice */

    const voices =
        window.speechSynthesis.getVoices();

    const preferredVoice =
        voices.find(
            voice =>
                voice.name.includes("Google")
        ) ||

        voices.find(
            voice =>
                voice.lang === "en-US"
        );

    if(preferredVoice){

        speech.voice = preferredVoice;

    }

    window.speechSynthesis.speak(
        speech
    );

}

/* --------------------------
   Direction Voice
---------------------------*/

function voiceDirection(angle){

    if(angle >= 330 || angle <= 30){

        speak("Move Forward");

    }

    else if(angle > 30 && angle <= 100){

        speak("Turn Right");

    }

    else if(angle > 100 && angle <= 170){

        speak("Move Back");

    }

    else if(angle > 170 && angle <= 260){

        speak("Turn Left");

    }

    else{

        speak("Adjust Direction");

    }

}

/* --------------------------
   Auto Direction Guidance
---------------------------*/

setInterval(() => {

    if(
        currentLat === null ||
        currentLng === null ||
        targetLat === null ||
        targetLng === null
    ){
        return;
    }

    const heading =
        calculateBearing(
            currentLat,
            currentLng,
            targetLat,
            targetLng
        );

    voiceDirection(
        heading
    );

}, 12000);

/* --------------------------
   Welcome Voice
---------------------------*/

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            speak(
                "Coordinate Navigator Ready"
            );

        },3000);

    }
);