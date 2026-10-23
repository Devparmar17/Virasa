// Screen logic, ported from the design prototype.
export function renderVals(state, setState) {
    const QS = [
      { q: 'When was Sidi Saiyyed Mosque built?', options: ['1411', '1573', '1857'], answer: 1,
        why: 'It was completed in 1573, the last year of the Gujarat Sultanate.' },
      { q: 'What is a jali?', options: ['A stone screen carved into a lattice', 'A stepped water tank', 'A temple bell'], answer: 0,
        why: 'Jalis let in light and breeze while keeping rooms cool and private.' },
      { q: "Which institute's logo was inspired by the Tree of Life jali?", options: ['IIM Ahmedabad', 'ISRO', 'IIT Bombay'], answer: 0,
        why: "IIM Ahmedabad's logo is based on the jali's intertwined trees." }
    ];
    const st = state || {};
    const qi = st.qi || 0;
    const pick = st.pick === undefined ? null : st.pick;
    const score = st.score || 0;
    const done = !!st.done;
    const Q = QS[qi];
    const picked = pick !== null;
    const letters = ['A', 'B', 'C'];
    const opts = Q.options.map((label, i) => {
      const isAns = i === Q.answer;
      const isPick = i === pick;
      let sty = { bg: '#FFFFFF', bd: '#E2D3C1', fg: '#2B1B10', lbg: '#F6EEE4', lfg: '#6E4E1E' };
      if (picked && isAns) sty = { bg: '#E3F1E7', bd: '#2F7A4A', fg: '#2B1B10', lbg: '#2F7A4A', lfg: '#FFFFFF' };
      else if (picked && isPick) sty = { bg: '#FBE4DE', bd: '#B3402A', fg: '#2B1B10', lbg: '#B3402A', lfg: '#FFFFFF' };
      else if (picked) sty = { bg: '#FFFFFF', bd: '#EFE6DA', fg: '#6F5B4B', lbg: '#F3EEE7', lfg: '#6F5B4B' };
      return Object.assign({}, sty, {
        label, letter: letters[i], chosen: isPick,
        showCheck: picked && isAns, showX: picked && isPick && !isAns,
        pick: () => { if (picked) return; setState({ pick: i, score: score + (isAns ? 1 : 0) }); }
      });
    });
    const right = picked && pick === Q.answer;
    const last = qi === QS.length - 1;
    const titles = ['Keep exploring!', 'Good start!', 'Nearly there!', 'Heritage expert!'];
    return {
      playing: !done, done, picked, notPicked: !picked,
      stepLabel: done ? 'Quiz complete' : 'Question ' + (qi + 1) + ' of ' + QS.length,
      pct: done ? 100 : Math.round(((qi + (picked ? 1 : 0)) / QS.length) * 100),
      score, question: Q.q, opts,
      fbTitle: right ? 'Correct! +10 pts' : 'Not quite',
      fbText: Q.why,
      fbBg: right ? '#E3F1E7' : '#FBE4DE',
      fbBd: right ? '#2F7A4A' : '#B3402A',
      fbFg: right ? '#1F5C36' : '#8A2E1C',
      nextLabel: last ? 'See results' : 'Next question',
      next: () => { if (last) setState({ done: true }); else setState({ qi: qi + 1, pick: null }); },
      resultTitle: titles[score],
      points: score * 10,
      reset: () => setState({ qi: 0, pick: null, score: 0, done: false })
    };
}
