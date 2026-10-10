// cfop/pll-data.js
// Files Connected: [index.html, cfop/cfop-data.js, cfop/cfop-drawer.js, cfop/pll-renderer.js]
// Code: JavaScript | Exports: [window.PLL_DATA]
// Work: Master PLL Algorithm Dataset, sourced and verified against the official 21-case PLL reference table.
// Grouping: Edge Permutations Only -> Diagonal Corner Swap -> Adjacent Corner Swap (21 cases total).
// Last Edit Time: 2026-10-10

'use strict';

window.PLL_DATA = {
  label: 'PLL',
  badge: 21,
  color: 'var(--face-l, #ff9f43)',
  subcats: [
    {
      id: 'pll-edges-only',
      label: 'Edge Permutations Only',
      cases: [
        { id: 'pll-h', name: 'H perm', alg: "M2 U M2 U2 M2 U M2", setup: "M2 U' M2 U2 M2 U' M2", desc: 'Opposite edges swap on all four sides.' },
        { id: 'pll-ua', name: 'Ua perm', alg: "M2 U M U2 M' U M2", setup: "M2 U' M U2 M' U' M2", desc: '3 edges cycle clockwise, one side stays solved.' },
        { id: 'pll-ub', name: 'Ub perm', alg: "M2 U' M U2 M' U' M2", setup: "M2 U M U2 M' U M2", desc: '3 edges cycle counter-clockwise, one side stays solved.' },
        { id: 'pll-z', name: 'Z perm', alg: "M' U M2 U M2 U M' U2 M2", setup: "M2 U2 M U' M2 U' M2 U' M", desc: 'Two pairs of adjacent edges swap.' }
      ]
    },
    {
      id: 'pll-diagonal-corners',
      label: 'Diagonal Corner Swap',
      cases: [
        { id: 'pll-e', name: 'E perm', alg: "x' L' U L D' L' U' L D L' U' L D' L' U L D", setup: "D' L' U' L D L' U L D' L' U L D L' U' L x", desc: 'Both pairs of diagonal corners swap, no edges move.' },
        { id: 'pll-na', name: 'Na perm', alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", setup: "R U R' U2 R U R2 F' R U R U' R' F R U' R' U' R U' R'", desc: 'Diagonal corners and opposite edges swap.' },
        { id: 'pll-nb', name: 'Nb perm', alg: "R' U R U' R' F' U' F R U R' F R' F' R U' R", setup: "R' U R' F R F' R U' R' F' U F R U R' U' R", desc: 'Diagonal corners and opposite edges swap, mirrored.' },
        { id: 'pll-v', name: 'V perm', alg: "R' U R' U' y R' F' R2 U' R' U R' F R F", setup: "F' R' F' R U' R U R2 F R y' U R U' R", desc: 'Diagonal corner swap with an adjacent edge swap.' },
        { id: 'pll-y', name: 'Y perm', alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'", setup: "F R' F' R U R U' R' F R U' R' U R U R' F'", desc: 'Diagonal corner swap with an adjacent edge swap, mirrored.' }
      ]
    },
    {
      id: 'pll-adjacent-corners',
      label: 'Adjacent Corner Swap',
      cases: [
        { id: 'pll-aa', name: 'Aa perm', alg: "x L2 D2 L' U' L D2 L' U L'", setup: "L U' L D2 L' U L D2 L2 x'", desc: '3 corners cycle counter-clockwise, no edges move.' },
        { id: 'pll-ab', name: 'Ab perm', alg: "x' L2 D2 L U L' D2 L U' L", setup: "L' U L' D2 L U' L' D2 L2 x", desc: '3 corners cycle clockwise, no edges move.' },
        { id: 'pll-f', name: 'F perm', alg: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", setup: "R' U' R U' R' U R U R2 F' R U R U' R' F U R", desc: 'Adjacent corners and adjacent edges swap.' },
        { id: 'pll-ga', name: 'Ga perm', alg: "R2 U R' U R' U' R U' R2 U' D R' U R D'", setup: "D R' U' R D' U R2 U R' U R U' R U' R2", desc: 'Double corner-edge cycle, variant A.' },
        { id: 'pll-gb', name: 'Gb perm', alg: "R' U' R U D' R2 U R' U R U' R U' R2 D", setup: "D' R2 U R' U R' U' R U' R2 D U' R' U R", desc: 'Double corner-edge cycle, variant B.' },
        { id: 'pll-gc', name: 'Gc perm', alg: "R2 U' R U' R U R' U R2 U D' R U' R' D", setup: "D' R U R' D U' R2 U' R U' R' U R' U R2", desc: 'Double corner-edge cycle, variant C.' },
        { id: 'pll-gd', name: 'Gd perm', alg: "R U R' U' D R2 U' R U' R' U R' U R2 D'", setup: "D R2 U' R U' R U R' U R2 D' U R U' R'", desc: 'Double corner-edge cycle, variant D.' },
        { id: 'pll-ja', name: 'Ja perm', alg: "x R2 F R F' R U2 r' U r U2", setup: "U2 r' U' r U2 R' F R' F' R2 x'", desc: 'Adjacent corners and edges swap toward the left.' },
        { id: 'pll-jb', name: 'Jb perm', alg: "R U R' F' R U R' U' R' F R2 U' R'", setup: "R U R2 F' R U R U' R' F R U' R'", desc: 'Adjacent corners and edges swap toward the right.' },
        { id: 'pll-ra', name: 'Ra perm', alg: "R U' R' U' R U R D R' U' R D' R' U2 R'", setup: "R U2 R D R' U R D' R' U' R' U R U R'", desc: 'Adjacent corner and edge swap, variant A.' },
        { id: 'pll-rb', name: 'Rb perm', alg: "R2 F R U R U' R' F' R U2 R' U2 R", setup: "R' U2 R U2 R' F R U R' U' R' F' R2", desc: 'Adjacent corner and edge swap, variant B.' },
        { id: 'pll-t', name: 'T perm', alg: "R U R' U' R' F R2 U' R' U' R U R' F'", setup: "F R U' R' U R U R2 F' R U R U' R'", desc: 'Adjacent corners swap with adjacent edges, the classic T shape.' }
      ]
    }
  ]
};

// Integration Hook: Append PLL automatically into master CFOP_DATA if loaded
if (window.CFOP_DATA) {
  window.CFOP_DATA.pll = window.PLL_DATA;
}