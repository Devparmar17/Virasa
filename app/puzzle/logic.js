// Screen logic, ported from the design prototype.
export function renderVals(state, setState) {
    const START = [2, 1, 4, 3, 0, 8, 6, 7, 5];
    const st = state || {};
    const board = st.board || START;
    const moves = st.moves || 0;
    const nums = st.nums === undefined ? true : st.nums;
    const peek = !!st.peek;
    const blank = board.indexOf(8);
    const solved = board.every((v, i) => v === i);
    const br = Math.floor(blank / 3);
    const bc = blank % 3;
    const cells = board.map((id, pos) => {
      const r = Math.floor(pos / 3);
      const c = pos % 3;
      const empty = id === 8;
      const adj = !empty && (Math.abs(r - br) + Math.abs(c - bc) === 1);
      const canMove = adj && !solved;
      return {
        empty,
        num: empty ? '' : String(id + 1),
        ml: (-110 * (id % 3)) + 'px',
        mt: (-110 * Math.floor(id / 3)) + 'px',
        op: empty && !solved ? 0 : 1,
        numOp: nums && !empty && !solved ? 1 : 0,
        bg: empty && !solved ? 'rgba(251, 246, 238, 0.08)' : '#3A2618',
        ring: canMove ? '#F3D9A8' : 'transparent',
        cursor: canMove ? 'pointer' : 'default',
        label: empty ? 'Empty space' : 'Tile ' + (id + 1) + (canMove ? ', can slide' : ''),
        move: () => {
          if (!canMove) return;
          const nb = board.slice();
          nb[blank] = id;
          nb[pos] = 8;
          setState({ board: nb, moves: moves + 1 });
        }
      };
    });
    return {
      cells, moves, solved, unsolved: !solved, nums, peek,
      numsBg: nums ? '#2B1B10' : '#FFFFFF', numsFg: nums ? '#FFFFFF' : '#2B1B10', numsBd: nums ? '#2B1B10' : '#E2D3C1',
      peekBg: peek ? '#2B1B10' : '#FFFFFF', peekFg: peek ? '#FFFFFF' : '#2B1B10', peekBd: peek ? '#2B1B10' : '#E2D3C1',
      toggleNums: () => setState({ nums: !nums }),
      togglePeek: () => setState({ peek: !peek }),
      reset: () => setState({ board: START, moves: 0 })
    };
}
