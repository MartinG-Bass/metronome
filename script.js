//Global Variables and Constants
const noteLength = 0.05;
const lookAheadTime = 0.25;
let audioContext = new AudioContext();
let tempo = 120.0;
let playing = false;
let nextBeatTime = 0;
let playMetronome = null;
let beatCounter = 1;
let accentedBeats = [];
let tempoPrograming = false;
let initialTempo = tempo;
let finalTempo = tempo;
let numberOfMeasures = 0;
let measure = 4;
/* Not needed for now, maybe in the future

var buffer = audioContext.createBuffer(1, 1, 22050);
var node = audioContext.createBufferSource();
node.buffer = buffer;
node.start(0);*/

//Function to Start/Stop the metronome
const playButton = document.getElementById("playButton");
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
        resetBeats();
    }


}); 

function init(){
    redoAccentedBeats();
    redoSkippedBeats();
    resetAccentedBeats();
    drawBeats();
}

function scheduler(){
    while(nextBeatTime < audioContext.currentTime + lookAheadTime){
        scheduleBeat();
        setNextBeat();
    }
}

/*Tag for accented beats:
    0 - Skipped (Not Sounding) 
    1 - Normal Beat
    2 - Accented Beat
    3 - High Pitch Beat (Only for the 1 by now)
*/
function scheduleBeat(){
    const beatTag = accentedBeats[beatCounter-1];
    
    updateBeat();

    if(beatTag === 0){//Skipped Beat
        return;
    }

    //Create the note
    const osc = audioContext.createOscillator();
    osc.connect(audioContext.destination);
    if(beatTag === 1){
        //Normal Beat
        osc.frequency.value = 440.0;
    } else if(beatTag === 2){ 
        //Accented Beat
        osc.frequency.value = 660.0;
    } else if(beatTag === 3){
        //High pitch beat
        osc.frequency.value = 880.0;
    }
    osc.start(nextBeatTime);
    osc.stop(nextBeatTime+noteLength);
}

function setNextBeat(){
    if(tempoPrograming){
        updateTempo();
    }
    nextBeatTime += 60/tempo;
    beatCounter++;
    if(beatCounter >  measure){
        beatCounter = 1;
    }

}

//We are gonna update the tempo every beat
function updateTempo(){
    const numberOfBeats = numberOfMeasures * measure;
    const step = (finalTempo - initialTempo)/numberOfBeats;
    tempo += step;
    tempoInput.value = tempo;
    tempoShown.textContent = Math.floor(tempo);
    if(initialTempo<finalTempo && tempo>=finalTempo){
        tempoPrograming = false;
    } else if(initialTempo>finalTempo && tempo<=finalTempo){
        tempoPrograming = false;
    }
}

function resetBeats(){
    beatCounter = 1;
    lastBeatAccented = 0;
    nextBeatTime = audioContext.currentTime + 0.1;
    drawBeats();
}

function resetAccentedBeats(){
    //Clear previous array
    accentedBeats.splice(0, accentedBeats.length);

    //Create a new array
    accentedBeats.push(3);
    for(i=2;i<=measure;i++){
        accentedBeats.push(1);
    }
    console.log(accentedBeats);
}

const accentForm = document.getElementById("accents");
function redoAccentedBeats(){
    while(accentForm.lastChild){
        accentForm.removeChild(accentForm.lastChild);
    }
    for(let i=1; i<=measure;i++){
        const accentInput = document.createElement("input");
        const accentLabel = document.createElement("label");

        accentInput.type = "checkbox";
        accentInput.value = i;
        accentInput.name = "accentedBeats";
        accentLabel.textContent = i;

        if(i===1){
            accentInput.checked = true;
        }

        accentForm.appendChild(accentInput);
        accentForm.appendChild(accentLabel);
    }
    const checkboxesAccentedBeats = document.querySelectorAll('input[name=accentedBeats]');
    checkboxesAccentedBeats.forEach((cb) => {
        cb.addEventListener("change", () => {
            const beatNumber = Number(cb.value);
            if(beatNumber === 1 && cb.checked === true){//First Beat
                accentedBeats[beatNumber-1] = 3;  
            } else if(cb.checked){
                accentedBeats[beatNumber-1] = 2;
            } else if(!cb.checked){
                accentedBeats[beatNumber-1] = 1;
            }

            console.log(accentedBeats);
    })});
}

const skipForm = document.getElementById("skips");
function redoSkippedBeats(){
    while(skipForm.lastChild){
        skipForm.removeChild(skipForm.lastChild);
    }
    for(let i=1; i<=measure; i++){
        
        const skipInput = document.createElement("input");
        const skipLabel = document.createElement("label");

        skipInput.type = "checkbox";
        skipInput.value = i;
        skipInput.name = "skippedBeats";
        skipLabel.textContent = i;

        skipForm.appendChild(skipInput);
        skipForm.appendChild(skipLabel);
    }
    
    const checkboxesSkippedBeats = document.querySelectorAll('input[name=skippedBeats]');
    checkboxesSkippedBeats.forEach((cb) => {
        cb.addEventListener("change", () => {
            const beatNumber = Number(cb.value);
            if(cb.checked === true){
                accentedBeats[beatNumber-1] = 0;  
            } else if(!cb.checked){
                accentedBeats[beatNumber-1] = 1;
            }

            console.log(accentedBeats);
    })});
}

const tempoShown = document.getElementById("tempoOutput");
const tempoInput = document.getElementById("tempoInput");
//Defalut tempo at 120 BPM

tempoInput.value = tempo;
tempoShown.textContent = tempo;

tempoInput.addEventListener("input", (e) => {
    tempoShown.textContent = e.target.value;
    tempo = e.target.value;
});

const measureInput = document.getElementById("measure");
measureInput.addEventListener("change", ()=>{
    measure = Number(measureInput.value);

    redoAccentedBeats();
    redoSkippedBeats();
    resetAccentedBeats();
    drawBeats();
});

const tempoProgramingCheckBox = document.getElementById("tempoPrograming");
tempoProgramingCheckBox.addEventListener("change", ()=>{
    const tempoProgramingContainer = document.getElementById("tempoProgramingContainer");

    if(tempoProgramingCheckBox.checked){
        //Form
        const tempoForm = document.createElement("form");
        //Inputs
        const initialTempoInput = document.createElement("input");
        const finalTempoInput = document.createElement("input");
        const numberOfMeasuresInput = document.createElement("input");
        //Labels
        const initialTempoLabel = document.createElement("label");
        const finalTempoLabel = document.createElement("label");
        const numberOfMeasuresLabel= document.createElement("label");
        //Button
        const submitBtn = document.createElement("button");
        const resetBtn = document.createElement("button");
        //Text Content
        initialTempoLabel.textContent = "Initial Tempo";
        finalTempoLabel.textContent = "Final Tempo";
        numberOfMeasuresLabel.textContent = "Number of Measures";
        submitBtn.textContent = "Submit";
        submitBtn.type="button";
        resetBtn.textContent = "Clear";
        resetBtn.type = "reset";
;
        tempoForm.appendChild(initialTempoLabel);
        tempoForm.appendChild(initialTempoInput);
        tempoForm.appendChild(finalTempoLabel);
        tempoForm.appendChild(finalTempoInput);
        tempoForm.appendChild(numberOfMeasuresLabel);
        tempoForm.appendChild(numberOfMeasuresInput);
        tempoForm.appendChild(submitBtn);
        tempoForm.appendChild(resetBtn);

        tempoProgramingContainer.appendChild(tempoForm);

        submitBtn.addEventListener("click", ()=>{
            initialTempo = Number(initialTempoInput.value);
            finalTempo = Number(finalTempoInput.value);
            numberOfMeasures = Number(numberOfMeasuresInput.value);
            
            tempo = initialTempo;
            tempoPrograming = true;
            console.log(initialTempo,finalTempo, numberOfMeasures);
        });
    } else{
        tempoProgramingContainer.removeChild(tempoProgramingContainer.lastChild);
    }
});

const beatContainer = document.getElementById("beatContainer");
function drawBeats(){
    //Reset the drawing
    while(beatContainer.lastChild){
        beatContainer.removeChild(beatContainer.lastChild);
    }
    for(let i=1; i<=measure; i++){
        const beatDiv = document.createElement("div");
        beatDiv.classList.add("beat",i);
        beatContainer.appendChild(beatDiv);
    }
    updateBeat();
}

function updateBeat(){
    const drawedBeats = document.querySelectorAll(".beat");
    if(beatCounter === 1){
        drawedBeats[beatCounter-1].style.backgroundColor = "red";
        drawedBeats[measure-1].style.backgroundColor = "black";
    } else{
        drawedBeats[beatCounter-1].style.backgroundColor = "blue";
        drawedBeats[beatCounter-2].style.backgroundColor = "black";
    }
}

window.addEventListener("load", init );