# Signal School

A local, playable synthesizer tutorial for Windows and standard MIDI controllers.

## Launch

Double-click **Launch Signal School.cmd**. It starts the local server in the background and opens Signal School in a standalone Windows app window, without browser tabs or an address bar. It uses installed Microsoft Edge (or Chrome as a fallback) in app mode. No Node, Python, npm, internet connection, or app installation is required. Keep all bundled files together. A command window may flash briefly at launch.

Close the app window when finished. The lightweight localhost server stays in the background for quick reopening. Double-click **Stop Signal School.cmd** to stop it; launch again to restart. Closing a browser tab does not stop the server. The fixed address is http://localhost:8765/; keeping the same address preserves browser-local progress, mappings, and your saved patch. The server listens on localhost only. If port 8765 is occupied by another Signal School instance, the launcher reuses its server and opens an app window; if another app occupies it, it reports the conflict.

## Play

Click **Enable sound**, then click/touch piano keys or use **A W S E D F T G Y H U J K**. The minus/plus buttons shift the on-screen and computer keyboard octaves. Controls support arrow keys after focusing them. Audio begins only after a user gesture. Start with a comfortable speaker volume.

Nine guided lessons cover oscillators, subtractive synthesis, ADSR envelopes, LFOs, FM, additive synthesis, wavetable synthesis, and MIDI. The workstation fits the browser viewport without page scrolling. Lessons, synth controls, piano, MIDI connection, and quiz remain on screen together; choose numbered step tabs to read each prompt. The workspace fills the entire app window and recalculates its layout whenever the window is resized. Individual controls, graphs, and the piano retain bounded sizes. It adapts to width and height and scales a readable 1440 × 960 workspace both up and down with the window. Text grows on large displays and gets smaller in small windows. Resize or maximize the browser for larger controls. Each lesson includes an experiment, a knowledge check, and numbered step tabs with Show buttons that highlight and focus the exact controls. Matching step labels highlight the relevant controls. A Show button restores the lesson's engine if you switched to a different one. The interface uses a dark synthwave palette with neon cyan and pink accents. Four independently implemented engines share a low-pass filter and amplitude envelope; the oscilloscope displays actual output. Source and filter controls update held notes; ADSR changes apply to the next note (Release applies on note-off). Engine and waveform changes stop existing notes.

## MIDI controllers

Connect any standard MIDI 1.0 controller exposed as a MIDI input by Windows. Click **Connect MIDI** and allow browser MIDI access. The app displays the selected input's reported name and manufacturer, updates lesson and setup text, and observes notes, CCs, pitch bend, and sustain as messages arrive. Select among multiple inputs using the dropdown; unplugged inputs disappear and the next available input is selected. Notes are stopped when the active input disappears or changes.

Keys, note-mode pads, sequencers, and other note sources play the synth. CC-only surfaces can control it while you play the on-screen keyboard. Use each parameter's **LEARN** button, then move an absolute CC knob or fader. **Map controls** guides up to eight assignments; cancel when you've assigned the controls you need. Mappings remain separate per MIDI device ID and channel, and explicit input selection is remembered. Device IDs can change between ports or browsers, requiring mapping again.

MIDI reports input names and manufacturer strings, not physical control layouts, knob counts, or reliable capability inventories. The displayed activity reflects messages actually received. No guessed factory mapping is applied, and the app does not reprogram hardware. Use absolute 0–127 CC mode; relative encoders, MIDI 2.0 UMP, and per-note MPE expression are not implemented. Sustain CC64, channel pitch bend ±2 semitones, velocity, and modulation CC1 are supported. Learned CC1 assignments override vibrato; CC64 and all-notes-off CC120/123 are reserved. Controller arpeggiators can send notes; no MIDI clock is sent.

If you hear nothing: enable sound, check output volume, verify the selected MIDI input, and check the MIDI monitor. If the device is missing, close any app that may hold it, reconnect USB, and refresh MIDI. Web MIDI requires a compatible browser and permission; localhost is a trusted context. Mouse/computer play works without MIDI. **All notes off**, switching lessons/engines, changing tabs, and losing window focus stop notes.

Save/Load stores one patch in this browser. Export/Import keeps portable JSON patch files. MIDI mappings and progress are separate from patch files. Clearing browser site data resets local saves. All assets are local and work offline.

## Implementation

Buildless HTML/CSS/JavaScript, Web Audio, Web MIDI, and an inbox Windows PowerShell HTTP server. No external dependencies or analytics. Polyphony is capped at 24 voices. Subtractive uses two detuned oscillators; FM uses a sine carrier and audio-rate sine modulator; additive sums up to 16 harmonic partials via a periodic wave; wavetable interpolates harmonic spectra between sine, saw-like, and square-like tables. These are introductory engines rather than emulations of specific hardware synths.

Reference: [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API).

The standalone window uses the same local address and default Edge profile as earlier launches, preserving that profile's saves and MIDI permissions. If you previously used another browser, export your patch there and import it in the app window. On the first upgrade, an older running server may not support Stop Signal School.cmd; stop the old server console or restart Windows once.

## Final experiment: Sound Lab

Choose lesson **09 / Final sound lab**. A docked recipe panel replaces the tutorial and quiz, leaving the instrument playable beside it. Use **Construction** for the sound-building explanation and **All parameters** for the live Current-versus-Recipe table. Five examples cover warm bass, a slow pad, an FM bell, an additive organ, and a wavetable pad. Select a construction stage (Raw source, Filter, Envelope, Full patch + motion) and click **Load & audition** to synthesize a phrase or chord. Each example includes a four-part construction explanation, a hands-on challenge, and a complete Current-versus-Recipe parameter table. Values that differ are highlighted; engine-inactive parameters are labeled.

Loading an example replaces the current patch, so export anything you want to keep first. The `patches` folder also contains all five finished recipes as JSON files for Import. The table describes the synth parameters; note pitch, velocity, and duration come from the audition or your performance. LFO modulation is pitch vibrato in this lab; wavetable position changes only when you move its control.
