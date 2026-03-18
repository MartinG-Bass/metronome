//Global Variables and Constants
const noteLength = 0.05;
const lookAheadTime = 0.25;
let audioContext = new AudioContext();
let tempo = 120.0;
let playing = false;
let nextBeatTime = 0;
let playMetronome = null;
let beatCounter = 0;
let accentEveryBeat = 1;
/* Not needed for now, maybe in the future

var buffer = audioContext.createBuffer(1, 1, 22050);
var node = audioContext.createBufferSource();
node.buffer = buffer;
node.start(0);*/

//Function to Start/Stop the metronome

playButton.addEventListener("click", () => {
    //On/Off
    playing = !playing;
    
    //On
    if(playing){
        playButton.textContent = "Stop";
        nextBeatTime = audioContext.currentTime + 0.1;
        playMetronome = setInterval(scheduler, 100);
    } else{ //Off
        playButton.textContent = "Start";
        clearInterval(playMetronome);
        playMetronome = null;
    }


}); 

function scheduler(){
    while(nextBeatTime < audioContext.currentTime + lookAheadTime){
        scheduleBeat();
        setNextBeat();
    }
}

function scheduleBeat(){
    const osc = audioContext.createOscillator();
    osc.connect(audioContext.destination);
    if(accentBeat()){
        osc.frequency.value = 880.0;
    } else{
        osc.frequency.value = 440.0;
    }
    osc.start(nextBeatTime);
    osc.stop(nextBeatTime+noteLength);
}

function setNextBeat(){
    nextBeatTime += 60/tempo;
    beatCounter++;
    if(beatCounter >=  accentEveryBeat){
        beatCounter = 0;
    }
}

function accentBeat(){
    if(beatCounter%accentEveryBeat == 0){
        return true;
    } else{
        return false;
    }

    
}

const submitTempoBtn = document.getElementById("submitTempo");
submitTempoBtn.addEventListener("click", () => {
    const inputTempo = document.getElementById("inputTempo");
    tempo = inputTempo.value;
    inputTempo.value = "";
});

document.querySelectorAll('input[name="accentBeat"]').forEach(radio => {
  radio.addEventListener('change', () => {
    accentEveryBeat = Number(radio.value);
    console.log('accentEveryBeat:', accentEveryBeat);
  });
});   