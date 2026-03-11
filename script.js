let audioContext = new AudioContext();
let tempo = 60.0;
/* Not needed for now, maybe in the future

var buffer = audioContext.createBuffer(1, 1, 22050);
var node = audioContext.createBufferSource();
node.buffer = buffer;
node.start(0);*/


const playButton = document.getElementById("playButton");
//Funtion to Start the metronome
playButton.addEventListener("click", () =>{

    //Sine Oscilator
    var osc = audioContext.createOscillator();
    osc.connect( audioContext.destination );
    osc.frequency.value = 880.0;
    osc.start(audioContext.currentTime);
    const noteLength = 0.05;
    osc.stop(audioContext.currentTime+noteLength);


}); 

const submitTempoBtn = document.getElementById("submitTempo");
submitTempoBtn.addEventListener("click", () => {
    const inputTempo = document.getElementById("inputTempo");
    tempo = inputTempo.value;
    inputTempo.value = "";
});