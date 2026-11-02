// Dependency-free checks for MIDI routing, voice lifetime, and portable patches.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const elements = new Map();
function element(selector) {
  if (!elements.has(selector)) elements.set(selector, { value:selector==='#volume'?'0.3':'', textContent:'', dataset:{}, style:{}, replaceChildren(){}, append(){}, setAttribute(){} });
  return elements.get(selector);
}
function parameter(value=0) { return { value, setTargetAtTime(v){this.value=v;}, setValueAtTime(v){this.value=v;}, linearRampToValueAtTime(v){this.value=v;}, cancelAndHoldAtTime(){}, cancelScheduledValues(){} }; }
function audioNode() { return { gain:parameter(),frequency:parameter(),detune:parameter(),Q:parameter(), connect(n){return n;},disconnect(){},start(){},stop(){this.stopped=true;},setPeriodicWave(w){this.wave=w;} }; }
const fakeAudio = {state:'running',currentTime:0,sampleRate:48000,createGain:audioNode,createBiquadFilter:audioNode,createOscillator:audioNode,createPeriodicWave:(real,imag)=>({real,imag})};
const sandbox={console,assert,fakeAudio,Map,Set,Float32Array,Math,Number,JSON,Blob,setTimeout:()=>1,clearTimeout(){},localStorage:{getItem(){return null;},setItem(){}},document:{querySelector:element,querySelectorAll:()=>[],createElement:()=>element('temporary')}};
vm.createContext(sandbox);
const source=fs.readFileSync('app.js','utf8').split("$('#audio-start').onclick=enableAudio;")[0];
vm.runInContext(source,sandbox);
vm.runInContext(`
ctx=fakeAudio; master=ctx.createGain(); selectedInput='test-mpk';
paintKeys=()=>{}; drawEnvelope=()=>{}; renderControls=()=>{}; toast=()=>{};
// A physical knob sends a stream of CCs. Only the first should advance learning.
learnTarget='cutoff';learnQueue=['resonance','attack'];learnLastKey=null;
handleMidi([176,20,10]);handleMidi([176,20,11]);handleMidi([176,20,12]);
assert.equal(maps['test-mpk']['0:20'],'cutoff');
assert.equal(learnTarget,'resonance');assert.equal(learnQueue.length,1);
handleMidi([176,21,64]);assert.equal(learnTarget,'attack');
handleMidi([176,22,64]);assert.equal(learnTarget,null);
handleMidi([176,20,127]);assert.equal(params.cutoff,definitions.cutoff.max);
handleMidi([177,20,0]);assert.equal(params.cutoff,definitions.cutoff.max,'Mapping must honor MIDI channel');
// Per-note velocity and zero-velocity note-on acting as note-off.
handleMidi([144,60,64]);let v=[...voices.values()][0];assert.equal(v.note,60);assert.equal(v.level,.14*64/127);
handleMidi([144,60,0]);assert.equal(v.released,true);
panic();handleMidi([144,60,100]);handleMidi([176,64,127]);handleMidi([128,60,0]);
v=[...voices.values()][0];assert.equal(v.sustained,true);assert.equal(v.released,false);
handleMidi([176,64,0]);assert.equal(v.released,true,'Pedal up must release deferred notes');
panic();handleMidi([144,64,100]);handleMidi([224,127,127]);
v=[...voices.values()][0];assert.ok(v.osc[0].detune.value>199);assert.ok(v.osc[0].detune.value<=200);
handleMidi([176,123,0]);assert.equal(voices.size,0);
// Each engine constructs a different source graph and can release cleanly.
for(const kind of Object.keys(engineInfo)){
  panic();engine=kind;startVoice('test',60,100);v=voices.get('test');assert.ok(v);
  assert.equal(v.osc.length,kind==='subtractive'||kind==='wavetable'?2:1);
  if(kind==='fm'){assert.ok(v.mod);assert.equal(v.modGain.gain.value,v.freq*params.fmRatio*params.fmIndex);}
  if(kind==='additive'||kind==='wavetable')assert.ok(v.osc[0].wave.imag.some(n=>n!==0));
  endVoice('test',true);assert.equal(voices.size,0);assert.ok(v.osc.every(o=>o.stopped));
}
engine='subtractive';for(let i=0;i<40;i++)startVoice('poly'+i,48+i,100);assert.equal(voices.size,24);panic();
// Patch imports reject malformed values and round-trip all parameters.
const saved=snapshot();params.cutoff=80;applyPatch(saved);assert.equal(params.cutoff,saved.params.cutoff);
assert.throws(()=>applyPatch({...saved,engine:'unknown'}));
assert.throws(()=>applyPatch({...saved,params:{...saved.params,cutoff:NaN}}));
for(const k of Object.keys(definitions))for(const fraction of [0,.25,.5,.75,1]){
  const d=definitions[k],value=denormalize(k,fraction);assert.ok(value>=d.min-1e-8&&value<=d.max+1e-8);
  if(!d.step)assert.ok(Math.abs(normalize(k,value)-fraction)<1e-9);
}

// No manufacturer bias: select remembered ports, preserve live selection, handle hot-unplug.
const firstDevice={id:'generic-keys',name:'Studio Keys',manufacturer:'Example',state:'connected'};
const secondDevice={id:'surface',name:'Fader Surface',manufacturer:'Other',state:'connected'};
midiAccess={inputs:new Map([[firstDevice.id,firstDevice],[secondDevice.id,secondDevice]])};
selectedInput='';preferredInput='surface';syncInputs();assert.equal(selectedInput,'surface');
assert.equal(controllerName(),'Fader Surface');assert.equal(controllerText('Play {controller}'),'Play Fader Surface');
learnTarget='cutoff';learnQueue=[];learnLastKey=null;handleMidi([176,30,64]);
assert.equal(maps.surface['0:30'],'cutoff');assert.equal(maps['generic-keys'],undefined);
handleMidi([144,60,100]);assert.equal(controllerActivity.get('surface').notes,true);
assert.equal(controllerActivity.get('surface').cc.has(30),true);
syncInputs();assert.equal(selectedInput,'surface','Adding another input must not steal the active selection');
secondDevice.state='disconnected';syncInputs();assert.equal(selectedInput,'generic-keys');assert.equal(voices.size,0);
assert.equal(maps.surface['0:30'],'cutoff','Disconnected input keeps its own mappings');
firstDevice.state='disconnected';syncInputs();assert.equal(selectedInput,'');
assert.equal(controllerName(),'Your MIDI controller');
secondDevice.state='connected';syncInputs();assert.equal(selectedInput,'surface');
console.log('PASS: controller identity, remembered selection, device mapping isolation, observed capabilities, unplug fallback, and reconnect.');
console.log('PASS: sequential MIDI learning, channel routing, velocity, sustain, pitch bend, all-notes-off, four engine graphs, polyphony, patch validation, and parameter scaling.');
`,sandbox);

