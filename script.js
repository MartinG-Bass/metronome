let audioContext = new AudioContext();
let tempo = 120.0;
const noteLength = 0.05;
const lookAheadTime = 0.1;
let playing = false;
let nextBeatTime = 0;
/* Not needed for now, maybe in the future

var buffer = audioContext.createBuffer(1, 1, 22050);
var node = audioContext.createBufferSource();
node.buffer = buffer;
node.start(0);*/


const playButton = document.getElementById("playButton");
//Funtion to Start the metronome
playButton.addEventListener("click", () => {
    //On/Off
    playing = !playing;
    
    //On
    if(playing){
        nextBeatTime = audioContext.currentTime;
        let i=0;
        while (i<1000){
            scheduleBeat();
            setNextBeat();
            i++;
        }
    }


}); 

function scheduleBeat(){
    
    const osc = audioContext.createOscillator();
    osc.connect( audioContext.destination );
    osc.frequency.value = 880.0;
    osc.start(nextBeatTime);
    osc.stop(nextBeatTime+noteLength);
}

function setNextBeat(){
    nextBeatTime += 60/tempo;
}

const submitTempoBtn = document.getElementById("submitTempo");
submitTempoBtn.addEventListener("click", () => {
    const inputTempo = document.getElementById("inputTempo");
    tempo = inputTempo.value;
    inputTempo.value = "";
});