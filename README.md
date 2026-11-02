# Signal School

An interactive synthesizer tutorial for Windows. Learn how sound is made, play four synth engines, and shape your own patches with a mouse, computer keyboard, or MIDI controller.

## Launch on Windows

**Requirements:** Windows with Windows PowerShell and Microsoft Edge or Google Chrome installed. A MIDI controller is optional. No Node.js, Python, npm, or build step is needed to run the app.

1. Get the project:
   - On [GitHub](https://github.com/zachwil/signal-school), choose **Code → Download ZIP**, then right-click the downloaded ZIP and choose **Extract All**.
   - Or clone it with Git:
     ```powershell
     git clone https://github.com/zachwil/signal-school.git
     ```
2. Open the extracted or cloned folder. Keep its files and the `patches` folder together.
3. Double-click **Launch Signal School.cmd**.
4. In the app, click **Enable sound** in the top-right corner, then play a piano key.

If you already have the project folder, start at step 3. Launch from the extracted folder, rather than from inside the ZIP.

The launcher starts a local server in the background and opens a standalone app window using Edge, with Chrome as a fallback. A command window may flash briefly. After downloading, the app works offline.

### Close and reopen

Close the app window when finished. The local server stays running so you can reopen quickly with **Launch Signal School.cmd**. To stop the server too, double-click **Stop Signal School.cmd**.

### Launch from PowerShell

Open PowerShell in the project folder and run:

```powershell
& '.\Launch Signal School.cmd'
```

While the server is running, you can also open <http://localhost:8765/> in Edge or Chrome. Use the launcher to get the standalone window.

## Start playing

- Click or touch the on-screen piano, or play with **A W S E D F T G Y H U J K** on your computer keyboard.
- Use the **− / +** octave buttons to shift the on-screen and computer keyboards.
- Follow the numbered lesson prompts. Each **Show** button highlights and focuses the control to change.
- Resize or maximize the app window for larger text and controls.
- Click **All notes off** to stop sounding notes.

Start with a comfortable speaker volume. Sound begins after you click **Enable sound**.

## What you can learn

Nine lessons introduce oscillators, filters, envelopes, modulation, MIDI, and sound design. Four playable engines let you compare different ways of creating sound:

| Engine | How it makes sound |
| --- | --- |
| Subtractive | Starts with two detuned oscillators, then removes brightness with a filter. |
| FM | Uses one oscillator to modulate another at audio rates. |
| Additive | Builds a tone by combining harmonic partials. |
| Wavetable | Blends between harmonic spectra to change the tone's character. |

All engines share a low-pass filter and amplitude envelope. The oscilloscope shows the actual output, and the envelope view illustrates how a note develops over time. These are introductory engines, rather than emulations of specific hardware synths.

### Final experiment: Sound Lab

Choose **09 / Final sound lab** to replace the lesson panel with sound-building recipes.

1. Choose warm bass, a slow pad, an FM bell, an additive organ, or a wavetable pad.
2. Select a construction stage: **Raw source**, **Add filter**, **Add envelope**, or **Full patch + motion**.
3. Click **Load & audition** to hear a synthesized phrase or chord.
4. Use **Construction** for the explanation and challenge, or **All parameters** to compare your current settings with the finished recipe.

Loading an example replaces the current patch, so export any sound you want to keep first. All five finished recipes are also available as JSON files in [`patches/`](patches/) for importing.

## Connect and map a MIDI controller

Standard MIDI 1.0 controllers are supported, including the Akai MPK mini mk2. The app displays the selected input's reported name and manufacturer and updates its setup and lesson text for that input.

1. Connect your controller to Windows.
2. Click **Connect MIDI** in the app and allow MIDI access when prompted.
3. If you have multiple inputs, select the controller you want to use.
4. Play its keys or note-mode pads to play the synth.
5. To assign a knob or fader, click **LEARN** beside a synth parameter, then move that hardware control. Use **Map controls** for a guided sequence of up to eight assignments; cancel when you have assigned enough.

Use absolute **0–127 CC** mode for knobs and faders. Mappings are saved separately for each MIDI device ID and channel. Changing USB ports or browsers may change the device ID and require mapping again. The app observes incoming messages; it does not infer the controller's physical layout or reprogram its hardware.

Velocity, sustain (CC64), pitch bend (±2 semitones), and modulation (CC1) are supported. A learned CC1 assignment overrides its default vibrato function. CC64 and all-notes-off CC120/123 are reserved. Relative encoders, MIDI 2.0 UMP, per-note MPE expression, and MIDI clock output are not implemented.

## Save your sounds

- **Save / Load** keeps one patch in the current browser profile.
- **Export / Import** saves and opens portable JSON patch files.
- Lesson progress and MIDI mappings are stored separately from patches.

Local saves depend on the browser profile and the app address, `http://localhost:8765/`. Clearing browser site data resets them. To move a patch between browsers or computers, export it and import it in the other app.

## Troubleshooting

| Problem | What to try |
| --- | --- |
| No sound | Click **Enable sound**, check the app and Windows output volume, then play an on-screen key. For MIDI, also check the selected input and MIDI monitor. |
| Controller is missing | Reconnect USB, close other music apps that may hold the MIDI port, and click **Refresh MIDI**. Check that Windows recognizes the device. |
| Notes keep sounding | Click **All notes off**. Switching lessons or engines, changing tabs, and losing window focus also stop notes. |
| App window will not open | Make sure Edge or Chrome is installed and that all project files have been extracted together. |
| Server cannot start | Another app may be using port **8765**. Stop that app or a previous Signal School server, then launch again. |
| Text or controls are too small | Enlarge or maximize the app window; the workspace scales with its size. |
| Stop command does not stop an older server | An older version may lack shutdown support. Close its server console or restart Windows once. |

## Development

Signal School uses HTML, CSS, JavaScript, Web Audio, Web MIDI, and a Windows PowerShell server bound to localhost. There are no external runtime dependencies or analytics. Polyphony is limited to 24 voices.

Node.js is needed only for the development checks:

```powershell
node --check app.js
node tests.cjs
```

GitHub Actions also runs these checks and parses the Windows PowerShell scripts on a Windows runner.
