// Screen logic, ported from the design prototype.
export function renderVals(state, setState) {
    const st = state || {};
    const v = st.v === undefined ? 50 : st.v;
    const pos = 100 - v;
    const readout = v < 34 ? 'Mostly 1573' : (v > 66 ? 'Mostly today' : 'Half and half');
    return {
      v,
      pos,
      rightPct: v,
      readout,
      onV: (e) => setState({ v: Number(e.target.value) })
    };
}
