// cfop-data.js — Master algorithm library for the CFOP sidebar
// Organized by category → subcategory → cases

'use strict';

window.CFOP_DATA = {
  f2l: {
  label: 'F2L',
  badge: 41,
  color: 'var(--face-r)',
  subcats: [
    {
      id: 'f2l-basic',
      label: 'Basic Inserts',
      cases: [
        { id: 'f2l-1', name: 'F2L 1 (Basic Insert R)', alg: "U (R U' R')", setup: "R U R' U'", desc: 'Basic insertion for right-hand pair' },
        { id: 'f2l-2', name: 'F2L 2 (Basic Insert L)', alg: "y' (R' U' R)", setup: "R' U R y", desc: 'Basic insertion for left-hand pair' }
      ]
    },
    {
      id: 'f2l-case1',
      label: 'Corner & Edge in Top (Separated)',
      cases: [
        { id: 'f2l-3', name: 'F2L 3', alg: "U' (R U' R' U) y' (R' U' R)", setup: "R' U R y U' R U R' U", desc: 'Stickers match, split pair' },
        { id: 'f2l-4', name: 'F2L 4', alg: "y' U' (R' U R)", setup: "R' U' R U y", desc: 'Stickers match, opposite direction' },
        { id: 'f2l-5', name: 'F2L 5', alg: "(R U R')", setup: "R U' R'", desc: 'Direct 3-mover setup' },
        { id: 'f2l-6', name: 'F2L 6', alg: "U' (R U R' U) (R U R')", setup: "R U' R' U' R U' R' U", desc: 'Connected pair insertion' },
        { id: 'f2l-7', name: 'F2L 7', alg: "U' (R U' R' U) (R U R')", setup: "R U' R' U' R U R' U", desc: 'Split pair setup' }
      ]
    },
    {
      id: 'f2l-case2',
      label: 'Corner Facing Up',
      cases: [
        { id: 'f2l-8', name: 'F2L 8', alg: "y' (U R' U' R) U2' (R' U R)", setup: "R' U' R U2 R' U R U' y", desc: 'Corner facing up, edge misaligned' },
        { id: 'f2l-9', name: 'F2L 9', alg: "U (R U2 R') U (R U' R')", setup: "R U R' U' R U2' R' U'", desc: 'Corner facing up, paired edge' },
        { id: 'f2l-10', name: 'F2L 10', alg: "U2 (R U R' U) (R U' R')", setup: "R U R' U' R U' R' U2'", desc: 'Corner facing up, misaligned pair' },
        { id: 'f2l-11', name: 'F2L 11', alg: "y' U' (R' U2 R) U' (R' U R)", setup: "R' U' R U R' U2' R U y", desc: 'Corner facing up, mirror setup' }
      ]
    },
    {
      id: 'f2l-incorrect',
      label: 'Incorrectly Connected Pieces',
      cases: [
        { id: 'f2l-12', name: 'F2L 12', alg: "y' (R' U R) U2' y (R U R')", setup: "R U' R' y' U2 R' U' R y", desc: 'Misconnected pair in top layer' },
        { id: 'f2l-13', name: 'F2L 13', alg: "(R U R') U2 (R U' R' U) (R U' R')", setup: "R U R' U' R U R' U2' R U' R'", desc: 'Connected pair oriented wrong' },
        { id: 'f2l-14', name: 'F2L 14', alg: "(R U' R' U2) y' (R' U' R)", setup: "R' U R y U2' R U R'", desc: 'Connected pair with flipped edge' },
        { id: 'f2l-15', name: 'F2L 15', alg: "U F (R U R' U') F' (U R U' R')", setup: "R U R' U' F U R U' R' F' U'", desc: 'Trapped misconnected pair' },
        { id: 'f2l-16', name: 'F2L 16', alg: "(R U2 R') U' (R U R')", setup: "R U' R' U R U2' R'", desc: 'Opposite stickers connected' },
        { id: 'f2l-17', name: 'F2L 17', alg: "y' (R' U2 R) U (R' U' R)", setup: "R' U R U' R' U2' R y", desc: 'Opposite stickers connected mirror' },
        { id: 'f2l-18', name: 'F2L 18', alg: "U (R U' R' U') (R U' R' U) (R U' R')", setup: "R U R' U' R U R' U R U R' U'", desc: 'Connected edge trapped upside down' }
      ]
    },
    {
      id: 'f2l-corner-in-place',
      label: 'Corner in Place, Edge in Top',
      cases: [
        { id: 'f2l-19', name: 'F2L 19', alg: "U' F' (R U R' U') R' F R", setup: "R' F' R U R U' R' F U", desc: 'Corner solved, edge in U face' },
        { id: 'f2l-20', name: 'F2L 20', alg: "R' F' R U (R U' R') F", setup: "F' R U R' U' R' F R", desc: 'Corner solved, edge inverted in U face' },
        { id: 'f2l-21', name: 'F2L 21', alg: "(R U' R' U) (R U' R')", setup: "R U R' U' R U R'", desc: 'Corner twisted in slot, edge in top' },
        { id: 'f2l-22', name: 'F2L 22', alg: "y' (R' U' R U) (R' U' R)", setup: "R' U R U' R' U R y", desc: 'Corner twisted in slot mirror' },
        { id: 'f2l-23', name: 'F2L 23', alg: "(R' F R F') U (R U' R')", setup: "R U R' U' F R' F' R", desc: 'Sledgehammer extraction' }
      ]
    },
    {
      id: 'f2l-edge-in-place',
      label: 'Edge in Place, Corner in Top',
      cases: [
        { id: 'f2l-24', name: 'F2L 24', alg: "(R U' R' U) y' (R' U R)", setup: "R' U' R y U' R U R'", desc: 'Edge solved in slot, corner in U face' },
        { id: 'f2l-25', name: 'F2L 25', alg: "U' (R' F R F') (R U' R')", setup: "R U R' F R' F' R U", desc: 'Edge solved in slot, corner facing up' },
        { id: 'f2l-26', name: 'F2L 26', alg: "(U' R U' R') U2 (R U' R')", setup: "R U R' U2 R U R' U", desc: 'Flipped edge in slot, corner in top' },
        { id: 'f2l-27', name: 'F2L 27', alg: "(U' R U R') U y' (R' U' R)", setup: "R' U R y' U' R U' R' U", desc: 'Flipped edge in slot, corner mirror' }
      ]
    },
    {
      id: 'f2l-both-in-place',
      label: 'Both in Slot',
      cases: [
        { id: 'f2l-28', name: 'F2L 28', alg: "(R U' R' U') R U R' U2 (R U' R')", setup: "R U R' U2 R U' R' U R U R'", desc: 'Twisted corner & bad edge in slot' },
        { id: 'f2l-29', name: 'F2L 29', alg: "(R U R' U') R U2 R' U' (R U R')", setup: "R U' R' U R U2' R' U R U' R'", desc: 'Flipped pair inside slot' },
        { id: 'f2l-30', name: 'F2L 30', alg: "(F' U F) U2 (R U R' U) (R U' R')", setup: "R U R' U' R U' R' U2' F' U' F", desc: 'Both trapped, wrong orientations' },
        { id: 'f2l-31', name: 'F2L 31', alg: "(R U' R') F (R U R' U') F' (R U' R')", setup: "R U R' F U R U' R' F' R U R'", desc: 'Pair misconnected inside slot' },
        { id: 'f2l-32', name: 'F2L 32', alg: "U (R U' R') U' (F' U F)", setup: "F' U' F U R U R' U'", desc: 'F2L pair in wrong slot' },
        { id: 'f2l-33', name: 'F2L 33', alg: "U (R U' R') (F R' F' R)", setup: "R' F R F' R U R' U'", desc: 'Extract and insert variant' },
        { id: 'f2l-34', name: 'F2L 34', alg: "y' (R' U R U') (R' U R)", setup: "R' U' R U R' U' R y", desc: 'Corner twisted in place' },
        { id: 'f2l-35', name: 'F2L 35', alg: "(R U R' U') (R U R')", setup: "R U R' U R U' R'", desc: 'Easy extraction pair' },
        { id: 'f2l-36', name: 'F2L 36', alg: "(U R U' R') (U R U' R') (U R U' R')", setup: "R U R' U' R U R' U' R U R' U'", desc: '3x Sexy moves in slot' },
        { id: 'f2l-37', name: 'F2L 37', alg: "U (R U R') U2 (R U R')", setup: "R U' R' U2' R U' R' U'", desc: 'AUF extraction insertion' },
        { id: 'f2l-38', name: 'F2L 38', alg: "U (F' U' F) U' (R U R')", setup: "R U' R' U F' U F U'", desc: 'Reverse insert extraction' },
        { id: 'f2l-39', name: 'F2L 39', alg: "(R U' R') d (R' U2 R) U2' (R' U R)", setup: "R' U' R U2 R' U2' R d' R U R'", desc: 'Extracted pair swap variant 1' },
        { id: 'f2l-40', name: 'F2L 40', alg: "(R U' R' U) (R U2' R') U (R U' R')", setup: "R U R' U' R U2 R' U' R U R'", desc: 'Extracted pair swap variant 2' },
        { id: 'f2l-41', name: 'F2L 41', alg: "(R U R' U') (R U' R') U2 y' (R' U' R)", setup: "R' U R y U2' R U R' U R U' R'", desc: 'Extracted pair swap variant 3' }
      ]
    }
  ]
},
  
  oll: {
  label: 'OLL',
  badge: 57,
  color: 'var(--face-u)',
  subcats: [
    {
      id: 'oll-all-edges-oriented',
      label: 'All Edges Oriented Correctly',
      cases: [
        { id: 'oll-21', name: 'OLL 21 (H)', alg: "(R U2 R') (U' R U R') (U' R U' R')", setup: "R U R' U R U' R' U R U2' R'", desc: 'Cross made, 2 pairs of headlights' },
        { id: 'oll-22', name: 'OLL 22 (Pi)', alg: "R U2' R2' U' R2 U' R2' U2' R", setup: "R' U2 R2 U R2' U R2 U2 R'", desc: 'Cross made, 1 pair headlights, 2 side stickers' },
        { id: 'oll-23', name: 'OLL 23 (Headlights)', alg: "R2 D (R' U2 R) D' (R' U2 R')", setup: "R U2 R' D R' U2 R D' R2", desc: 'Cross made, 1 pair headlights' },
        { id: 'oll-24', name: 'OLL 24 (Chameleon)', alg: "(r U R' U') (r' F R F')", setup: "F R' F' r U R' U' r'", desc: 'Cross made, 2 facing corners' },
        { id: 'oll-25', name: 'OLL 25 (Bowtie)', alg: "F' (r U R' U') r' F R", setup: "R' F' r U R U' r' F", desc: 'Cross made, 2 diagonal corners' },
        { id: 'oll-26', name: 'OLL 26 (Antisune)', alg: "R U2 R' U' R U' R'", setup: "R U R' U R U2' R'", desc: 'Cross made, 1 corner facing up (CCW)' },
        { id: 'oll-27', name: 'OLL 27 (Sune)', alg: "R U R' U R U2' R'", setup: "R U2 R' U' R U' R'", desc: 'Cross made, 1 corner facing up (CW)' }
      ]
    },
    {
      id: 'oll-t-shapes',
      label: 'T-Shapes',
      cases: [
        { id: 'oll-33', name: 'OLL 33 (T1)', alg: "(R U R' U') (R' F R F')", setup: "F R' F' R U R U' R'", desc: 'T shape, headlights facing right' },
        { id: 'oll-45', name: 'OLL 45 (T2)', alg: "F (R U R' U') F'", setup: "F U R U' R' F'", desc: 'T shape, headlights facing front' }
      ]
    },
    {
      id: 'oll-squares',
      label: 'Squares',
      cases: [
        { id: 'oll-5', name: 'OLL 5 (S1)', alg: "(r' U2' R U R' U r)", setup: "r' U' R U' R' U2 r", desc: 'Left square shape' },
        { id: 'oll-6', name: 'OLL 6 (S2)', alg: "(r U2 R' U' R U' r')", setup: "r U R' U R U2' r'", desc: 'Right square shape' }
      ]
    },
    {
      id: 'oll-c-shapes',
      label: 'C-Shapes',
      cases: [
        { id: 'oll-34', name: 'OLL 34 (C1)', alg: "(R U R2' U') (R' F R U) R U' F'", setup: "F U R' U' R' F' R U R2 R' U'", desc: 'C shape, corner facing right' },
        { id: 'oll-46', name: 'OLL 46 (C2)', alg: "R' U' (R' F R F') U R", setup: "R' U' F R' F' R U R", desc: 'C shape, corner facing left' }
      ]
    },
    {
      id: 'oll-w-shapes',
      label: 'W-Shapes',
      cases: [
        { id: 'oll-36', name: 'OLL 36 (W1)', alg: "(R' U' R U') (R' U R U) (R' F R F')", setup: "F R' F' R' U' R U' R' U R U R'", desc: 'W shape 1' },
        { id: 'oll-38', name: 'OLL 38 (W2)', alg: "(R U R' U) (R U' R' U') (R' F R F')", setup: "F R' F' R U R' U R U' R' U' R'", desc: 'W shape 2' }
      ]
    },
    {
      id: 'oll-corners-correct',
      label: 'Corners Correct, Edges Flipped',
      cases: [
        { id: 'oll-28', name: 'OLL 28 (E1)', alg: "(r U R' U') M (U R U' R')", setup: "R U R' U' M' U R U' r'", desc: 'Stealth, opposite edges flipped' },
        { id: 'oll-57', name: 'OLL 57 (E2)', alg: "(R U R' U') M' (U R U' r')", setup: "r U R' U' M U R U' R'", desc: 'H, all 4 edges flipped' }
      ]
    },
    {
      id: 'oll-p-shapes',
      label: 'P-Shapes',
      cases: [
        { id: 'oll-31', name: 'OLL 31 (P1)', alg: "(R' U' F) (U R U' R') F' R", setup: "R' F R U R' U' F' U R", desc: 'P shape, right front bar' },
        { id: 'oll-32', name: 'OLL 32 (P2)', alg: "R U B' (U' R' U) (R B R')", setup: "R B' R' U' R U B R' U'", desc: 'P shape, right back bar' },
        { id: 'oll-43', name: 'OLL 43 (P3)', alg: "f (L' U' L U) f'", setup: "f' U' L' U L f", desc: 'P shape, left front bar' },
        { id: 'oll-44', name: 'OLL 44 (P4)', alg: "f (R U R' U') f'", setup: "f U R U' R' f'", desc: 'P shape, left back bar' }
      ]
    },
    {
      id: 'oll-i-shapes',
      label: 'I-Shapes',
      cases: [
        { id: 'oll-51', name: 'OLL 51 (I1)', alg: "f (R U R' U') (R U R' U') f'", setup: "f U R U' R' U R U' R' f'", desc: 'Vertical line, 4 corner stickers facing out' },
        { id: 'oll-52', name: 'OLL 52 (I2)', alg: "(R' U' R U' R' U) y' (R' U R) B", setup: "B' R' U R y U' R U R' U R", desc: 'I shape, headlights facing front' },
        { id: 'oll-55', name: 'OLL 55 (I3)', alg: "y (R' F R U) (R U' R2' F') R2 U' R'", setup: "R U R2' F R2 U R' U' R' F' R y'", desc: 'I shape, 2 corner stickers facing front' },
        { id: 'oll-56', name: 'OLL 56 (I4)', alg: "r' U' r (U' R' U R) (U' R' U R) r' U r", setup: "r' U' r R' U' R U R' U' R r' U r", desc: 'I shape, 2 corner stickers facing back' }
      ]
    },
    {
      id: 'oll-fish-shapes',
      label: 'Fish Shapes',
      cases: [
        { id: 'oll-9', name: 'OLL 9 (F1)', alg: "(R U R' U') R' F (R2 U R' U') F'", setup: "F U R U' R2' F' R U R U' R'", desc: 'Fish shape, corner facing right' },
        { id: 'oll-10', name: 'OLL 10 (F2)', alg: "(R U R' U) (R' F R F') (R U2' R')", setup: "R U2 R' F R' F' R U' R U' R'", desc: 'Fish shape, corner facing left' },
        { id: 'oll-35', name: 'OLL 35 (F3)', alg: "(R U2') (R2' F R F') (R U2' R')", setup: "R U2 R' F R' F' R2 U2' R'", desc: 'Fish shape, corner facing front' },
        { id: 'oll-37', name: 'OLL 37 (F4)', alg: "F (R U' R' U') (R U R' F')", setup: "F R U' R' U R U R' F'", desc: 'Fish shape, corner facing back' }
      ]
    },
    {
      id: 'oll-knight-move-shapes',
      label: 'Knight Move Shapes',
      cases: [
        { id: 'oll-13', name: 'OLL 13 (K1)', alg: "F U R U' R2' F' R U (R U' R')", setup: "R U R' U' R' F R2 U R' U' F'", desc: 'Knight move, right outer bar' },
        { id: 'oll-14', name: 'OLL 14 (K2)', alg: "(R' F R) (U R' F' R) (F U' F')", setup: "F U F' R' F R U' R' F' R", desc: 'Knight move, left outer bar' },
        { id: 'oll-15', name: 'OLL 15 (K3)', alg: "(r' U' r) (R' U' R U) (r' U r)", setup: "r' U' r U' R' U R r' U r", desc: 'Knight move, right inner bar' },
        { id: 'oll-16', name: 'OLL 16 (K4)', alg: "(r U r') (R U R' U') (r U' r')", setup: "r U r' U R U' R' r U' r'", desc: 'Knight move, left inner bar' }
      ]
    },
    {
      id: 'oll-awkward-shapes',
      label: 'Awkward Shapes',
      cases: [
        { id: 'oll-29', name: 'OLL 29 (A1)', alg: "M U (R U R' U') (R' F R F') M'", setup: "M F R' F' R U R U' R' U' M'", desc: 'Awkward shape, right hook' },
        { id: 'oll-30', name: 'OLL 30 (A2)', alg: "y' F U (R U2 R' U') (R U2 R' U') F'", setup: "F U R U2' R' U R U2' R' U' F' y", desc: 'Awkward shape, left hook' },
        { id: 'oll-41', name: 'OLL 41 (A3)', alg: "(R U R' U R U2' R') F (R U R' U') F'", setup: "F U R U' R' F' R U2 R' U' R U' R'", desc: 'Awkward shape, right bar' },
        { id: 'oll-42', name: 'OLL 42 (A4)', alg: "(R' U' R U' R' U2 R) F (R U R' U') F'", setup: "F U R U' R' F' R' U2' R U R' U R", desc: 'Awkward shape, left bar' }
      ]
    },
    {
      id: 'oll-l-shapes',
      label: 'L-Shapes',
      cases: [
        { id: 'oll-47', name: 'OLL 47 (L1)', alg: "F' (L' U' L U) (L' U' L U) F", setup: "F' U' L' U L U' L' U L F", desc: 'L shape 1, 4 corner stickers facing out' },
        { id: 'oll-48', name: 'OLL 48 (L2)', alg: "F (R U R' U') (R U R' U') F'", setup: "F U R U' R' U R U' R' F'", desc: 'L shape 2, headlights facing front' },
        { id: 'oll-49', name: 'OLL 49 (L3)', alg: "r U' r2 U r2 U r2 U' r", setup: "r' U r2' U' r2' U' r2' U r'", desc: 'L shape 3, wide move sequence' },
        { id: 'oll-50', name: 'OLL 50 (L4)', alg: "r' U r2 U' r2' U' r2 U r'", setup: "r U' r2' U r2 U r2' U' r", desc: 'L shape 4, wide move mirror' },
        { id: 'oll-53', name: 'OLL 53 (L5)', alg: "(r' U' R U') (R' U R U') R' U2 r", setup: "r' U2' R U R' U' R U R' U r", desc: 'L shape 5, right side' },
        { id: 'oll-54', name: 'OLL 54 (L6)', alg: "(r U R' U) (R U' R' U) R U2' r'", setup: "r U2 R' U' R U R' U' R U' r'", desc: 'L shape 6, left side' }
      ]
    },
    {
      id: 'oll-lightning-bolts',
      label: 'Lightning Bolts',
      cases: [
        { id: 'oll-7', name: 'OLL 7 (B1)', alg: "(r U R' U R U2' r')", setup: "r U2 R' U' R U' r'", desc: 'Small lightning bolt 1' },
        { id: 'oll-8', name: 'OLL 8 (B2)', alg: "(r' U' R U' R' U2 r)", setup: "r' U2' R U R' U r", desc: 'Small lightning bolt 2' },
        { id: 'oll-11', name: 'OLL 11 (B3)', alg: "r' (R2 U R' U R U2 R') U M'", setup: "M U' R U2' R' U' R U' R2' r", desc: 'Large lightning bolt 1' },
        { id: 'oll-12', name: 'OLL 12 (B4)', alg: "M' (R' U' R U' R' U2 R) U' M", setup: "M' U R' U2' R U R' U R M", desc: 'Large lightning bolt 2' },
        { id: 'oll-39', name: 'OLL 39 (B5)', alg: "(L F') (L' U' L U) F U' L'", setup: "L U F' U' L' U L F L'", desc: 'Right lightning bolt' },
        { id: 'oll-40', name: 'OLL 40 (B6)', alg: "(R' F) (R U R' U') F' U R", setup: "R' U' F U R U' R' F' R", desc: 'Left lightning bolt' }
      ]
    },
    {
      id: 'oll-no-edges-oriented',
      label: 'No Edges Flipped Correctly (Dot Shapes)',
      cases: [
        { id: 'oll-1', name: 'OLL 1 (O1)', alg: "(R U2') (R2' F R F') U2' (R' F R F')", setup: "F R' F' R U2 F R' F' R2 U2' R'", desc: 'Dot, 2 corner pairs facing out' },
        { id: 'oll-2', name: 'OLL 2 (O2)', alg: "F (R U R' U') F' f (R U R' U') f'", setup: "f U R U' R' f' F U R U' R' F'", desc: 'Dot, headlights front and back' },
        { id: 'oll-3', name: 'OLL 3 (O3)', alg: "f (R U R' U') f' U' F (R U R' U') F'", setup: "F U R U' R' F' U f U R U' R' f'", desc: 'Dot, headlights right and left' },
        { id: 'oll-4', name: 'OLL 4 (O4)', alg: "f (R U R' U') f' U F (R U R' U') F'", setup: "F U R U' R' F' U' f U R U' R' f'", desc: 'Dot, headlights front and right' },
        { id: 'oll-5', name: 'OLL 17 (O5)', alg: "(R U R' U) (R' F R F') U2' (R' F R F')", setup: "F R' F' R U2 F R' F' R U' R U' R'", desc: 'Diagonal dot shape 1' },
        { id: 'oll-18', name: 'OLL 18 (O6)', alg: "(r U R' U R U2 r') (r' U' R U' R' U2 r)", setup: "r' U2' R U R' U r r' U2 R' U' R U' r'", desc: 'Crown dot shape' },
        { id: 'oll-19', name: 'OLL 19 (O7)', alg: "M U (R U R' U') M' (R' F R F')", setup: "F R' F' R M U R U' R' U' M'", desc: 'X dot shape' },
        { id: 'oll-20', name: 'OLL 20 (O8)', alg: "M U (R U R' U') M2' (U R U' r')", setup: "r U R' U' M2 U R U' R' U' M'", desc: 'H dot shape' }
      ]
    }
  ]
},

  pll: {
  label: 'PLL',
  badge: 21,
  color: 'var(--face-f)',
  subcats: [
    {
      id: 'pll-edges-only',
      label: 'Permutations of Edges Only',
      cases: [
        { id: 'pll-ua', name: 'Ua Perm', alg: "(R U' R U) R U (R U' R' U') R2", setup: "R2 U R U R' U' R' U' R' U R'", desc: '3-cycle edges clockwise' },
        { id: 'pll-ub', name: 'Ub Perm', alg: "R2 U (R U R' U') R' U' (R' U R')", setup: "R U' R U R U R U' R' U' R2", desc: '3-cycle edges counter-clockwise' },
        { id: 'pll-z', name: 'Z Perm', alg: "(M2' U M2' U) (M' U2) (M2' U2 M')", setup: "M U2 M2' U2 M' U' M2' U' M2'", desc: 'Adjacent edges swap' },
        { id: 'pll-h', name: 'H Perm', alg: "(M2' U M2') U2 (M2' U M2')", setup: "M2' U' M2' U2' M2' U' M2'", desc: 'Opposite edges swap' }
      ]
    },
    {
      id: 'pll-corners-only',
      label: 'Permutations of Corners Only',
      cases: [
        { id: 'pll-aa', name: 'Aa Perm', alg: "x (R' U R') D2 (R U' R') D2 R2 x'", setup: "x R2 D2 (R U R') D2 (R U' R') x'", desc: '3-cycle corners counter-clockwise' },
        { id: 'pll-ab', name: 'Ab Perm', alg: "x R2' D2 (R U R') D2 (R U' R) x'", setup: "x (R' U R) D2 (R U' R') D2 R2 x'", desc: '3-cycle corners clockwise' },
        { id: 'pll-e', name: 'E Perm', alg: "x' (R U' R' D) (R U R' D') (R U R' D) (R U' R' D') x", setup: "x (D R U R') (D' R U' R') (D R U' R') (D' R U R') x'", desc: 'Diagonal corners swap' }
      ]
    },
    {
      id: 'pll-adjacent-corners',
      label: 'Swap One Set of Adjacent Corners',
      cases: [
        { id: 'pll-ra', name: 'Ra Perm', alg: "(R U' R' U') (R U R D) (R' U' R D') (R' U2 R')", setup: "R U2 R D R' U R D' R' U' R U R' U R'", desc: 'R-Perm variant A' },
        { id: 'pll-rb', name: 'Rb Perm', alg: "(R' U2 R U2') R' F (R U R' U') R' F' R2", setup: "R2' F R U R' U' R' F' R U2 R' U2' R", desc: 'R-Perm variant B' },
        { id: 'pll-ja', name: 'Ja Perm', alg: "(R' U L' U2) (R U' R' U2 R) L", setup: "L' R' U2 R U R' U2 L U' R", desc: 'J-Perm left variant' },
        { id: 'pll-jb', name: 'Jb Perm', alg: "(R U R' F') (R U R' U') R' F R2 U' R'", setup: "R U R2' F' R U R U' R' F R U' R'", desc: 'J-Perm right variant' },
        { id: 'pll-t', name: 'T Perm', alg: "(R U R' U') (R' F R2 U') R' U' (R U R' F')", setup: "F R U' R' U R U R2' F' R U R U' R'", desc: 'T-Shape permutation' },
        { id: 'pll-f', name: 'F Perm', alg: "(R' U' F') (R U R' U') (R' F R2 U') (R' U' R U) (R' U R)", setup: "R' U' R U' R' U R U R2' F' R U R U' R' F U R", desc: 'Headlights with edge swap' }
      ]
    },
    {
      id: 'pll-diagonal-corners',
      label: 'Swap One Set of Diagonal Corners',
      cases: [
        { id: 'pll-v', name: 'V Perm', alg: "(R' U R' U') y (R' F' R2 U') (R' U R' F) R F", setup: "F' R' F' R U' R U R2' F R y' U R U' R", desc: 'V-Shape diagonal swap' },
        { id: 'pll-y', name: 'Y Perm', alg: "F (R U' R' U') (R U R' F') (R U R' U') (R' F R F')", setup: "F R' F' R U R U' R' F R U' R' U R U R' F'", desc: 'Y-Shape diagonal swap' },
        { id: 'pll-na', name: 'Na Perm', alg: "(R U R' U) (R U R' F') (R U R' U') (R' F R2 U') R' U2 (R U' R')", setup: "R U R' U2 R U R2' F' R U R U' R' F R U' R' U' R U' R'", desc: 'N-Perm variant A' },
        { id: 'pll-nb', name: 'Nb Perm', alg: "(R' U L' U2 R U' L) (R' U L' U2 R U' L)", setup: "L' U R' U2 L U R' L' U R' U2 L U R'", desc: 'N-Perm variant B' }
      ]
    },
    {
      id: 'pll-g-permutations',
      label: 'G Permutations (Double cycles)',
      cases: [
        { id: 'pll-ga', name: 'Ga Perm', alg: "R2 U (R' U R' U') (R U' R2) D U' (R' U R D')", setup: "D R' U' R U D' R2 U R' U R U' R' U' R2", desc: 'G-Perm variant A' },
        { id: 'pll-gb', name: 'Gb Perm', alg: "(F' U' F) (R2 u R' U) (R U' R u') R2'", setup: "R2 u R U' R' U' R u' R2' F' U F", desc: 'G-Perm variant B' },
        { id: 'pll-gc', name: 'Gc Perm', alg: "R2 U' (R U' R U) (R' U R2 D') (U R U' R') D", setup: "D' R U R' U' D R2' U' R U' R' U R' U R2'", desc: 'G-Perm variant C' },
        { id: 'pll-gd', name: 'Gd Perm', alg: "D' (R U R' U') D (R2 U' R U') (R' U R' U) R2", setup: "R2' U' R U' R U R' U R2' D' U R U' R' D", desc: 'G-Perm variant D' }
      ]
    }
  ]
},


  coll: {
  label: 'COLL',
  badge: 42,
  color: 'var(--face-b)',
  subcats: [
    {
      id: 'coll-sune',
      label: 'Sune Cases',
      cases: [
        { id: 'coll-s1', name: 'Sune 1 (Pure)', alg: "R U R' U R U2' R'", setup: "R U2 R' U' R U' R'", desc: 'Pure Sune COLL' },
        { id: 'coll-s2', name: 'Sune 2 (Matching)', alg: "R U' L' U R' U' L", setup: "L' U R U' L U R'", desc: 'Sune with matching stickers' },
        { id: 'coll-s3', name: 'Sune 3', alg: "(L' U2 L U2') R (U' L' U L) R'", setup: "R (L' U' L U) R' (U2 L' U2' L)", desc: 'Sune variant 3' },
        { id: 'coll-s4', name: 'Sune 4', alg: "F' (R U2' R U2' R' U2) R' F2 (R U R U') R'", setup: "R (U R' U' R') F2 R (U2 R U2' R' U2') F", desc: 'Sune variant 4' },
        { id: 'coll-s5', name: 'Sune 5', alg: "L' (R U R' U') L (U2 R U2' R')", setup: "(R U2 R' U2') L' (U R U' R') L", desc: 'Sune variant 5' },
        { id: 'coll-s6', name: 'Sune 6', alg: "y R2' (R U R' U) (R U' R D) (R' U' R D')", setup: "D R' U R D' R' U R' U' R U' R' R2 y'", desc: 'Sune variant 6' }
      ]
    },
    {
      id: 'coll-antisune',
      label: 'Anti-Sune Cases',
      cases: [
        { id: 'coll-as1', name: 'Anti-Sune 1 (Pure)', alg: "y R U2' R' U' R U' R'", setup: "R U R' U R U2 R' y'", desc: 'Pure Anti-Sune COLL' },
        { id: 'coll-as2', name: 'Anti-Sune 2 (Matching)', alg: "y2 L' U R U' L U R'", setup: "R U' L' U R' U' L y2", desc: 'Anti-Sune with matching stickers' },
        { id: 'coll-as3', name: 'Anti-Sune 3', alg: "(R U' R' U2) (R U' R' U2) (R' D' R) l", setup: "l' (R' D R) (U2 R U R') (U2 R U R')", desc: 'Anti-Sune variant 3' },
        { id: 'coll-as4', name: 'Anti-Sune 4', alg: "y2 R (L' U' L U) R' (U2' L' U2 L)", setup: "(L' U2' L U2) R (U' L' U L) R' y2", desc: 'Anti-Sune variant 4' },
        { id: 'coll-as5', name: 'Anti-Sune 5', alg: "y2 (R U2 R' U2') L' (U R U' R') L", setup: "L' (R U R' U') L (U2 R U2' R') y2", desc: 'Anti-Sune variant 5' },
        { id: 'coll-as6', name: 'Anti-Sune 6', alg: "y R2 (R' U' R U') (R' U R' D') (R U R' D)", setup: "D' R U' R' D R U' R U R' U R R2' y'", desc: 'Anti-Sune variant 6' }
      ]
    },
    {
      id: 'coll-l',
      label: 'L Cases',
      cases: [
        { id: 'coll-l1', name: 'L 1', alg: "(R U R' U) (R U' R' U) (R U' R' U) y' r U2' (R2' F R F') R U2' r'", setup: "r U2 R' (F R' F' R2) U2' r' y (U' R U R') (U' R U R') (U' R U' R')", desc: 'L-shape COLL 1' },
        { id: 'coll-l2', name: 'L 2', alg: "R U2' R'", setup: "R U2 R'", desc: 'L-shape COLL 2' },
        { id: 'coll-l3', name: 'L 3', alg: "y' (R U2 R D) (R' U2 R D') R2'", setup: "R2 (D R' U2 R) (D' R' U2 R') y", desc: 'L-shape COLL 3' },
        { id: 'coll-l4', name: 'L 4', alg: "y2 (R' U2 R' D') (R U2 R' D) R2", setup: "R2' (D' R U2 R') (D R U2 R) y2", desc: 'L-shape COLL 4' },
        { id: 'coll-l5', name: 'L 5', alg: "y' (F R' F' r) (U R U' r')", setup: "r U R' U' r' F R F' y", desc: 'L-shape COLL 5' },
        { id: 'coll-l6', name: 'L 6', alg: "F' (r U R' U') (r' F R)", setup: "R' F' r (U R U' r') F", desc: 'L-shape COLL 6' }
      ]
    },
    {
      id: 'coll-t',
      label: 'T Cases',
      cases: [
        { id: 'coll-t1', name: 'T 1', alg: "(R U2' R' U' R U' R2') (U2' R U R' U R)", setup: "R' U' R U' R' U2 (R2 U R' U R U2 R')", desc: 'T-shape COLL 1' },
        { id: 'coll-t2', name: 'T 2', alg: "y2 F (R U R' U') (R U' R' U') (R U R' F')", setup: "F (R U' R') (U R U R') (U R U' R') F' y2", desc: 'T-shape COLL 2' },
        { id: 'coll-t3', name: 'T 3', alg: "(R' U R) U2' L' (R' U R U') L", setup: "L' (U R' U' R) L U2 R' U' R", desc: 'T-shape COLL 3' },
        { id: 'coll-t4', name: 'T 4', alg: "(R' U R2 D) (r' U2 r) (D' R2' U' R)", setup: "(R' U R2 D) (r' U2' r) (D' R2' U' R)", desc: 'T-shape COLL 4' },
        { id: 'coll-t5', name: 'T 5', alg: "y (l' U' L U) (R U' r' F)", setup: "F' r U R' (U' L' U l) y'", desc: 'T-shape COLL 5' },
        { id: 'coll-t6', name: 'T 6', alg: "y' (r U R' U') (r' F R F')", setup: "F R' F' r (U R U' r') y", desc: 'T-shape COLL 6' }
      ]
    },
    {
      id: 'coll-u',
      label: 'U Cases',
      cases: [
        { id: 'coll-u1', name: 'U 1', alg: "y2 (R U R' U R U2' R2') (U' R U' R' U2 R)", setup: "(R' U2 R U R' U) (R2 U2 R' U' R U' R') y2", desc: 'U-shape COLL 1' },
        { id: 'coll-u2', name: 'U 2', alg: "F (R U' R' U) (R U R' U) (R U' R' F')", setup: "F (R U R' U') (R U' R' U') (R U R' F')", desc: 'U-shape COLL 2' },
        { id: 'coll-u3', name: 'U 3', alg: "y2 R2 D (R' U2 R) D' (R' U2 R')", setup: "R2 U2 R D (R' U2 R) D' R2' y2", desc: 'U-shape COLL 3' },
        { id: 'coll-u4', name: 'U 4', alg: "R2' D' (R U2 R') D (R U2 R)", setup: "R' U2 R D' (R U2 R') D R2", desc: 'U-shape COLL 4' },
        { id: 'coll-u5', name: 'U 5', alg: "R' F (R U' R' U') (R U R' F') (R U R' U') (R' F R F' R)", setup: "(R' F R F' R) (U R U' R') (F R U' R') (U R U R') F' R", desc: 'U-shape COLL 5' },
        { id: 'coll-u6', name: 'U 6', alg: "(R' U2 R) F (U' R' U' R) U F'", setup: "F U' (R' U R U) F' (R' U2 R)", desc: 'U-shape COLL 6' }
      ]
    },
    {
      id: 'coll-pi',
      label: 'Pi Cases',
      cases: [
        { id: 'coll-p1', name: 'Pi 1', alg: "R U2' R2' U' R2 U' R2' U2' R", setup: "R' U2 R2 U R2' U R2 U2 R'", desc: 'Pi-shape COLL 1' },
        { id: 'coll-p2', name: 'Pi 2', alg: "(R U D') (R U R' D) (R2 U' R' U') R2' U2' R", setup: "R' U2 R2 (U R U R2') (D' R U' R') (D U' R')", desc: 'Pi-shape COLL 2' },
        { id: 'coll-p3', name: 'Pi 3', alg: "y F (U R U' R') (U R U' R2') F' R (U R U' R')", setup: "(R U R' U') R' F (R2 U R' U') (R U R' U') F' y'", desc: 'Pi-shape COLL 3' },
        { id: 'coll-p4', name: 'Pi 4', alg: "(R U R' U') R' F (R2 U R' U') (R U R' U') F'", setup: "F (R U R' U') (R U R' U2') F' R (U R U' R')", desc: 'Pi-shape COLL 4' },
        { id: 'coll-p5', name: 'Pi 5', alg: "y' (R U R' U) F' (R U2' R' U2') (R' F R)", setup: "(R' F' R) (U2 R U2 R') F (U' R U' R') y", desc: 'Pi-shape COLL 5' },
        { id: 'coll-p6', name: 'Pi 6', alg: "y F (U R U' R') (U R U2' R') (U' R U R') F'", setup: "F (R U' R' U) (R U2 R' U') (R U R' U') F' y'", desc: 'Pi-shape COLL 6' }
      ]
    },
    {
      id: 'coll-h',
      label: 'H Cases',
      cases: [
        { id: 'coll-h1', name: 'H 1', alg: "(R U R' U) (R U' R' U) R U2' R'", setup: "R U2 R' (U' R U R') (U' R U R')", desc: 'H-shape COLL 1' },
        { id: 'coll-h2', name: 'H 2', alg: "y F (R U R' U') (R U R' U') (R U R' U') F'", setup: "F (R U R' U') (R U R' U') (R U R' U') F' y'", desc: 'H-shape COLL 2' },
        { id: 'coll-h3', name: 'H 3', alg: "F (R U' R' U) (R U2 R' U') (R U R' U') F'", setup: "F (R U R' U') (R U2' R' U') (R U' R' U) F'", desc: 'H-shape COLL 3' },
        { id: 'coll-h4', name: 'H 4', alg: "(R U R' U) (R U L' U) R' U' L", setup: "L' U R (U' L U' R') (U' R U' R')", desc: 'H-shape COLL 4' }
      ]
    }
  ]
},

  wv: {
  label: 'WV',
  badge: 27,
  color: 'var(--face-l)',
  subcats: [
    {
      id: 'wv-3c',
      label: '3 Corners Misoriented (0 Corners Oriented)',
      cases: [
        { id: 'wv-1', name: 'WV 1', alg: "L' U2 (R U R') U2' L", setup: "L' U2 (R U' R') U2' L", desc: '3 corners misoriented, basic insert setup' },
        { id: 'wv-2', name: 'WV 2', alg: "U R' U' R2 U' R2' U2' R", setup: "R' U2 R2 U R2' U R U' R'", desc: '3 corners misoriented, back slot variant' },
        { id: 'wv-3', name: 'WV 3', alg: "U F' (R U2' R' U2') R' F R", setup: "R' F' R U2 R U2' R' F U'", desc: '3 corners misoriented, front face setup' },
        { id: 'wv-4', name: 'WV 4', alg: "U R U2' (R2' U' R U' R' U2 R)", setup: "(R' U2 R U R' U R2) U2' R' U'", desc: '3 corners misoriented, Sune variant' },
        { id: 'wv-5', name: 'WV 5', alg: "U' L' (U R U' R') L", setup: "L' (R U R' U') L U", desc: '3 corners misoriented, left slot setup' }
      ]
    },
    {
      id: 'wv-2c',
      label: '2 Corners Misoriented (1 Corner Oriented)',
      cases: [
        { id: 'wv-6', name: 'WV 6', alg: "U' (R U' R' U2) (R U' R' U2) (R U R')", setup: "(R U' R') U2' (R U R' U2') (R U R' U)", desc: '1 corner oriented, double sexy insert' },
        { id: 'wv-7', name: 'WV 7', alg: "U' (R' F R U) (R U' R' F')", setup: "(F R U R') (U' R' F' R) U", desc: '1 corner oriented, sledgehammer setup' },
        { id: 'wv-8', name: 'WV 8', alg: "R2 D (R' U' R) D' R2'", setup: "R2 D (R' U R) D' R2'", desc: '1 corner oriented, keyhole variant' },
        { id: 'wv-9', name: 'WV 9', alg: "(R U R' U') (R U' R')", setup: "(R U R') (U R U' R')", desc: '1 corner oriented, basic insert variant' },
        { id: 'wv-10', name: 'WV 10', alg: "U (R U' R' U) (R U2' R')", setup: "(R U2 R') (U' R U R' U')", desc: '1 corner oriented, anti-Sune variant' },
        { id: 'wv-11', name: 'WV 11', alg: "R U R2' U' R2 U' R2' U2' R", setup: "R' U2 R2 U R2' U R U' R'", desc: '1 corner oriented, back slot variant' },
        { id: 'wv-12', name: 'WV 12', alg: "U R2 D (R' U2 R) D' R2'", setup: "R2 D (R' U2' R) D' R2' U'", desc: '1 corner oriented, D-layer keyhole' },
        { id: 'wv-13', name: 'WV 13', alg: "U R U2' R'", setup: "R U2 R' U'", desc: '1 corner oriented, direct insertion' }
      ]
    },
    {
      id: 'wv-1c',
      label: '1 Corner Misoriented (2 Corners Oriented)',
      cases: [
        { id: 'wv-14', name: 'WV 14', alg: "U R' U' R2 U' R2' U2' R", setup: "R' U2 R2 U R2' U R U' R'", desc: '2 corners oriented, back slot variant' },
        { id: 'wv-15', name: 'WV 15', alg: "U L' (R U2' R' U2') R' F R", setup: "R' F' R U2 R U2' R' L U'", desc: '2 corners oriented, left slot variant' },
        { id: 'wv-16', name: 'WV 16', alg: "U R U2' (R2' U' R U' R' U2 R)", setup: "(R' U2 R U R' U R2) U2' R' U'", desc: '2 corners oriented, Sune variant' },
        { id: 'wv-17', name: 'WV 17', alg: "U' L' (U R U' R') L", setup: "L' (R U R' U') L U", desc: '2 corners oriented, left slot setup' },
        { id: 'wv-18', name: 'WV 18', alg: "(R U' R') U (R' U' R U' R' U2 R)", setup: "(R' U2 R U R' U R) U' (R U R')", desc: '2 corners oriented, insert to Sune' },
        { id: 'wv-19', name: 'WV 19', alg: "(R U' R')", setup: "R U R'", desc: '2 corners oriented, direct 3-mover' }
      ]
    },
    {
      id: 'wv-0c',
      label: '0 Corners Misoriented (All 3 Oriented)',
      cases: [
        { id: 'wv-20', name: 'WV 20', alg: "(R U' R') U' (R U R' U R U2' R')", setup: "(R U2 R' U' R U' R') U (R U R')", desc: 'All 3 top corners oriented, insert to Sune' },
        { id: 'wv-21', name: 'WV 21', alg: "R U' (R2' U2' R U R' U R)", setup: "(R' U' R U' R' U2 R2) U R'", desc: 'All 3 top corners oriented, wide Sune' },
        { id: 'wv-22', name: 'WV 22', alg: "U (R U' R' U) (R U' R' U) R U2' R'", setup: "R U2 R' (U' R U R') (U' R U R') U'", desc: 'All 3 top corners oriented, double sexy insert' },
        { id: 'wv-23', name: 'WV 23', alg: "U R U2' (R2' U2' R U R' U R)", setup: "(R' U' R U' R' U2 R2) U2' R' U'", desc: 'All 3 top corners oriented, Sune setup' },
        { id: 'wv-24', name: 'WV 24', alg: "R U' (R2' U' R U' R' U2 R)", setup: "(R' U2 R U R' U R2) U R'", desc: 'All 3 top corners oriented, anti-Sune setup' },
        { id: 'wv-25', name: 'WV 25', alg: "(R U R' U') (R U R' U') R U' R'", setup: "(R U R') (U R U' R') (U R U' R')", desc: 'All 3 top corners oriented, double sexy insert' },
        { id: 'wv-26', name: 'WV 26', alg: "R2 D (R' U R) D' R' U2 R'", setup: "R U2 R' D (R' U' R) D' R2'", desc: 'All 3 top corners oriented, keyhole insertion' },
        { id: 'wv-27', name: 'WV 27', alg: "(R U' R')", setup: "R U R'", desc: 'All 3 top corners oriented, basic insertion' }
      ]
    }
  ]
},

};




  