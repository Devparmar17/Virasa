// Screen logic, ported from the design prototype.
export function renderVals(state, setState) {
    const st = state || {};
    const sw = st.sw || { auto: true, desc: false, steps: true };
    const tog = {}; const swS = {};
    ['auto', 'desc', 'steps'].forEach((k) => {
      swS[k] = sw[k] ? { track: '#2F7A4A', pos: 'flex-end' } : { track: '#CDBFAE', pos: 'flex-start' };
      tog[k] = () => { const next = Object.assign({}, sw); next[k] = !sw[k]; setState({ sw: next }); };
    });
    return { sw, swS, tog };
}
