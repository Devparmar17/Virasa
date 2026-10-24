// Screen logic, ported from the design prototype.
export function renderVals(state, setState) {
    const st = state || {};
    const sel = st.sel || {};
    const len = st.len || 'classic';
    const lang = st.lang || 'en';
    const ids = ['arch', 'well', 'food', 'craft', 'legend', 'spirit', 'fest', 'photo'];
    const s = {};
    const tog = {};
    const on = {};
    ids.forEach((id) => {
      const isOn = !!sel[id];
      on[id] = isOn;
      s[id] = isOn
        ? { bg: '#FBEDE6', bd: '#9A4E36', fg: '#7E3D29' }
        : { bg: '#FFFFFF', bd: '#E8DCCD', fg: '#2B1B10' };
      tog[id] = () => {
        const next = Object.assign({}, sel);
        next[id] = !isOn;
        setState({ sel: next });
      };
    });
    const count = ids.filter((id) => sel[id]).length;
    // Segmented control: the chosen option is a raised white thumb on a sand track.
    const pick = (cur, k) => (cur === k
      ? { bg: '#FFFFFF', bd: 'transparent', fg: '#2B1B10', sub: '#9A4E36', sh: '0 2px 8px rgba(60, 36, 20, 0.14)' }
      : { bg: 'transparent', bd: 'transparent', fg: '#5A4434', sub: '#6F5B4B', sh: 'none' });
    const lens = ['quick', 'classic', 'deep'];
    const langs = ['en', 'hi', 'gu'];
    const lenS = {}; const lenOn = {}; const setLen = {};
    lens.forEach((k) => { lenS[k] = pick(len, k); lenOn[k] = len === k; setLen[k] = () => setState({ len: k }); });
    const langS = {}; const langOn = {}; const setLang = {};
    langs.forEach((k) => { langS[k] = pick(lang, k); langOn[k] = lang === k; setLang[k] = () => setState({ lang: k }); });
    return {
      s, tog, on, count,
      cta: count ? 'Continue' : 'Skip for now',
      lenS, lenOn, setLen, langS, langOn, setLang
    };
}
