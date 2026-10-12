// Screen logic, ported from the design prototype.
export function renderVals(state, setState) {
    const st = state || {};
    const sel = st.sel || { arch: true, food: true, legend: true };
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
        ? { bg: '#9A4E36', bd: '#9A4E36', fg: '#FFFFFF' }
        : { bg: '#FFFFFF', bd: '#E2D3C1', fg: '#2B1B10' };
      tog[id] = () => {
        const next = Object.assign({}, sel);
        next[id] = !isOn;
        setState({ sel: next });
      };
    });
    const count = ids.filter((id) => sel[id]).length;
    const pick = (cur, k) => (cur === k
      ? { bg: '#2B1B10', bd: '#2B1B10', fg: '#FFFFFF', sub: '#E7D3B5' }
      : { bg: '#FFFFFF', bd: '#E2D3C1', fg: '#2B1B10', sub: '#6F5B4B' });
    const lens = ['quick', 'classic', 'deep'];
    const langs = ['en', 'hi', 'gu'];
    const lenS = {}; const lenOn = {}; const setLen = {};
    lens.forEach((k) => { lenS[k] = pick(len, k); lenOn[k] = len === k; setLen[k] = () => setState({ len: k }); });
    const langS = {}; const langOn = {}; const setLang = {};
    langs.forEach((k) => { langS[k] = pick(lang, k); langOn[k] = lang === k; setLang[k] = () => setState({ lang: k }); });
    return {
      s, tog, on, count,
      cta: count ? 'Continue · ' + count + ' selected' : 'Skip for now',
      lenS, lenOn, setLen, langS, langOn, setLang
    };
}
