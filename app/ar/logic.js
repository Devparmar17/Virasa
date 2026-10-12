// Screen logic, ported from the design prototype.
export function renderVals(state, setState) {
    const st = state || {};
    const playing = st.playing === undefined ? true : st.playing;
    return {
      playing,
      paused: !playing,
      playLabel: playing ? 'Pause narration' : 'Play narration',
      togglePlay: () => setState({ playing: !playing })
    };
}
