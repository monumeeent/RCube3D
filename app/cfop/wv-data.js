// cfop/wv-data.js
// Files Connected: [index.html, cfop/cfop-drawer.js, cfop/wv-renderer.js]
// Code: JavaScript | Exports: [window.WV_DATA]
// Work: Master Winter Variation (WV) Algorithm Dataset, structured by group and oriented corners.
// Last Edit Time: 2026-10-10

'use strict';

window.WV_DATA = {
    label: 'WV',
    badge: 27,
    color: 'var(--face-f, #00d26a)',
    subcats: [
        {
            id: 'wv-3-corners',
            label: '3 Corners Oriented',
            cases: [
                {
                    id: 'wv-1',
                    name: 'Oriented 1',
                    alg: "L' U2 R U R' U2 L",
                    setup: "L' U2 R U' R' U2 L",
                    desc: ''
                }
            ]
        },
        {
            id: 'wv-2-corners',
            label: '2 Corners Oriented',
            cases: [
                {
                    id: 'wv-2',
                    name: 'Rectangle 1',
                    alg: "U' R' F R U R U' R' F'",
                    setup: "F R U R' U' R' F' R U",
                    desc: ''
                },
                {
                    id: 'wv-3',
                    name: 'Rectangle 2',
                    alg: "R U' R'",
                    setup: "R U R'",
                    desc: ''
                },
                {
                    id: 'wv-4',
                    name: 'Snake 1',
                    alg: "R U' R' U R' U' R U' R' U2 R",
                    setup: "R' U2 R U R U' R' U' R U R'",
                    desc: ''
                },
                {
                    id: 'wv-5',
                    name: 'Snake 2',
                    alg: "R2 D R' U' R D' R2",
                    setup: "R2 D R' U R D' R2",
                    desc: ''
                },
                {
                    id: 'wv-6',
                    name: 'Tank 1',
                    alg: "R U R' U' R U' R'",
                    setup: "R U R' U R U' R'",
                    desc: ''
                },
                {
                    id: 'wv-7',
                    name: 'Tank 2',
                    alg: "U' R U' R' U2 R U' R' U2 R U R'",
                    setup: "R U' R' U2 R U' R' U2 R U R' U",
                    desc: ''
                }
            ]
        },
        {
            id: 'wv-1-corner',
            label: '1 Corner Oriented',
            cases: [
                {
                    id: 'wv-8',
                    name: 'Adjacent 1',
                    alg: "R U' R D' R U2 R' D R U2 R",
                    setup: "R' U2 R' D' R U2 R' D R' U R'",
                    desc: ''
                },
                {
                    id: 'wv-9',
                    name: 'Adjacent 2',
                    alg: "U' R' F' R U2 R U2 R' F",
                    setup: "F' R U2 R' U2 R' F R U",
                    desc: ''
                },
                {
                    id: 'wv-10',
                    name: 'Adjacent 3',
                    alg: "U R U2 R'",
                    setup: "R U2 R' U'",
                    desc: ''
                },
                {
                    id: 'wv-11',
                    name: 'Adjacent 4',
                    alg: "U R U' R' U' R' F R U R U' R' F'",
                    setup: "F R U R' U' R' F' R U R U R' U'",
                    desc: ''
                },
                {
                    id: 'wv-12',
                    name: 'Bowtie 1',
                    alg: "U' L' U R U' R' L",
                    setup: "L' R U R' U' L U",
                    desc: ''
                },
                {
                    id: 'wv-13',
                    name: 'Bowtie 2',
                    alg: "U R2 D R' U2 R D' R2",
                    setup: "R2 D' R' U2 R D' R2 U'",
                    desc: ''
                },
                {
                    id: 'wv-14',
                    name: 'Bowtie 3',
                    alg: "U R U2 R2 U' R U' R' U2 R",
                    setup: "R' U2 R U R' U R2 U2 R' U'",
                    desc: ''
                },
                {
                    id: 'wv-15',
                    name: 'Bowtie 4',
                    alg: "U' R' F2 R F2 U L' U L",
                    setup: "L' U' L U' F2 R' F2 R U",
                    desc: ''
                },
                {
                    id: 'wv-16',
                    name: 'Gun (Back)',
                    alg: "R U R2 U' R2 U' R2 U2 R",
                    setup: "R' U2 R2 U R2 U R2 U' R'",
                    desc: ''
                },
                {
                    id: 'wv-17',
                    name: 'Gun (Far)',
                    alg: "U R' U' R2 U' R2 U2 R",
                    setup: "R' U2 R2 U R2 U R U'",
                    desc: ''
                },
                {
                    id: 'wv-18',
                    name: 'Gun (Near)',
                    alg: "U R U' R' U R U2 R'",
                    setup: "R U2 R' U' R U R' U'",
                    desc: ''
                },
                {
                    id: 'wv-19',
                    name: 'Gun (Sides)',
                    alg: "R U' R' U R U2 R2 U' R2 U' R2 U2 R",
                    setup: "R' U2 R2 U R2 U R2 U2 R U' R' U R'",
                    desc: ''
                }
            ]
        },
        {
            id: 'wv-0-corners',
            label: '0 Corners Oriented',
            cases: [
                {
                    id: 'wv-20',
                    name: 'H (Front)',
                    alg: "U R' U L U' R2 U L' U R'",
                    setup: "R U' L U' R2 U L' U' R U'",
                    desc: ''
                },
                {
                    id: 'wv-21',
                    name: 'H (Side)',
                    alg: "U R U' R' U R U' R' U R U2 R'",
                    setup: "R U2 R' U' R U R' U' R U' R' U'",
                    desc: ''
                },
                {
                    id: 'wv-22',
                    name: 'Pi (Back)',
                    alg: "R2 D R' U R D' R' U2 R'",
                    setup: "R U2 R D R' U' R D' R2",
                    desc: ''
                },
                {
                    id: 'wv-23',
                    name: 'Pi (Far)',
                    alg: "R U' R2 U2 R U R' U R",
                    setup: "R' U' R U' R' U2 R2 U R'",
                    desc: ''
                },
                {
                    id: 'wv-24',
                    name: 'Pi (Front)',
                    alg: "R U R' U2 R2 U2 R U R' U R",
                    setup: "R' U' R U' R' U2 R2 U2 R U' R'",
                    desc: ''
                },
                {
                    id: 'wv-25',
                    name: 'Pi (Near)',
                    alg: "R U' R2 U' R U' R' U2 R",
                    setup: "R' U2 R U R' U R2 U R'",
                    desc: ''
                },
                {
                    id: 'wv-26',
                    name: 'Sune 1',
                    alg: "R U R' U' R U R' U' R U' R'",
                    setup: "R U R' U R U' R' U R U' R'",
                    desc: ''
                },
                {
                    id: 'wv-27',
                    name: 'Sune 2',
                    alg: "R U' R' U' R U R' U R U2 R'",
                    setup: "R U2 R' U' R U' R' U R U R'",
                    desc: ''
                }
            ]
        }
    ]
};

window.CFOP_DATA = window.CFOP_DATA || {};
window.CFOP_DATA.wv = window.WV_DATA;