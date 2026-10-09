// cfop-data.js — Master algorithm library for the CFOP sidebar
// Includes : F2L and OLL Cases
// Organized by category → subcategory → cases

'use strict';

window.CFOP_DATA = {
    f2l: {
        label: 'F2L',
        badge: 41,
        color: 'var(--face-r)',
        subcats: [{
                id: 'f2l-case1',
                label: 'Corner on top, FL color facing side, edge colors match',
                cases: [{
                        id: 'f2l-1',
                        name: 'F2L 1',
                        alg: "U (R U' R')",
                        setup: "R U R' U'",
                        desc: ''
                    }, {
                        id: 'f2l-2',
                        name: 'F2L 2',
                        alg: "y' U' (R' U R)",
                        setup: "R' U R y",
                        desc: ''
                    }, {
                        id: 'f2l-3',
                        name: 'F2L 3',
                        alg: "U' R U R' U2 (R U' R')",
                        setup: "R U R' U2 R U' R' U",
                        desc: ''
                    }, {
                        id: 'f2l-4',
                        name: 'F2L 4',
                        alg: "d R' U' R U2' (R' U R)",
                        setup: "R' U' R U2 R' U R d'",
                        desc: ''
                    }, {
                        id: 'f2l-5',
                        name: 'F2L 5',
                        alg: "U' R U2' R' U2 (R U' R')",
                        setup: "R U R' U2' R U2 R' U",
                        desc: ''
                    }, {
                        id: 'f2l-6',
                        name: 'F2L 6',
                        alg: "d R' U2 R U2' (R' U R)",
                        setup: "R' U' R U2 R' U2 R d'",
                        desc: ''
                    }, {
                        id: 'f2l-7',
                        name: 'F2L 7',
                        alg: "y' R' U R U' d' (R U R')",
                        setup: "R U' R' d U R' U' R y",
                        desc: ''
                    }, {
                        id: 'f2l-8',
                        name: 'F2L 8',
                        alg: "R U' R' U d (R' U' R)",
                        setup: "R' U R d' U' R U R'",
                        desc: ''
                    }
                ]
            }, {
                id: 'f2l-case2',
                label: 'Corner on top, FL color facing side, edge colors opposite',
                cases: [{
                        id: 'f2l-9',
                        name: 'F2L 9',
                        alg: "y' (R' U' R)",
                        setup: "R' U R y",
                        desc: ''
                    }, {
                        id: 'f2l-10',
                        name: 'F2L 10',
                        alg: "(R U R')",
                        setup: "R U' R'",
                        desc: ''
                    }, {
                        id: 'f2l-11',
                        name: 'F2L 11',
                        alg: "d R' U' R U' (R' U' R)",
                        setup: "R' U R U R' U R d'",
                        desc: ''
                    }, {
                        id: 'f2l-12',
                        name: 'F2L 12',
                        alg: "U' R U R' U (R U R')",
                        setup: "R U' R' U' R U' R' U",
                        desc: ''
                    }, {
                        id: 'f2l-13',
                        name: 'F2L 13',
                        alg: "U' R U2' R' d (R' U' R)",
                        setup: "R' U R d' R U2 R' U",
                        desc: ''
                    }, {
                        id: 'f2l-14',
                        name: 'F2L 14',
                        alg: "R' U2 R2 U R2' U R",
                        setup: "R' U' R2 U' R2' U2 R",
                        desc: ''
                    }, {
                        id: 'f2l-15',
                        name: 'F2L 15',
                        alg: "d R' U R U' (R' U' R)",
                        setup: "R' U R U R' U' R d'",
                        desc: ''
                    }, {
                        id: 'f2l-16',
                        name: 'F2L 16',
                        alg: "U' R U' R' U (R U R')",
                        setup: "R U' R' U' R U R' U",
                        desc: ''
                    }
                ]
            }, {
                id: 'f2l-case3',
                label: 'Corner on top, FL color facing up',
                cases: [{
                        id: 'f2l-17',
                        name: 'F2L 17',
                        alg: "R U2' R' U' (R U R')",
                        setup: "R U' R' U R U2 R'",
                        desc: ''
                    }, {
                        id: 'f2l-18',
                        name: 'F2L 18',
                        alg: "y' R' U2 R U (R' U' R)",
                        setup: "R' U R U' R' U2 R y",
                        desc: ''
                    }, {
                        id: 'f2l-19',
                        name: 'F2L 19',
                        alg: "U R U2 R' U (R U' R')",
                        setup: "R U' R' U' R U2' R' U'",
                        desc: ''
                    }, {
                        id: 'f2l-20',
                        name: 'F2L 20',
                        alg: "y' U' R' U2 R U' (R' U R)",
                        setup: "R' U' R U R' U2' R U y",
                        desc: ''
                    }, {
                        id: 'f2l-21',
                        name: 'F2L 21',
                        alg: "U2 R U R' U (R U R')",
                        setup: "R U' R' U' R U' R' U2'",
                        desc: ''
                    }, {
                        id: 'f2l-22',
                        name: 'F2L 22',
                        alg: "y' U2 R' U' R U' (R' U R)",
                        setup: "R' U' R U R' U R U2 y",
                        desc: ''
                    }, {
                        id: 'f2l-23',
                        name: 'F2L 23',
                        alg: "y' U R' U2 R y R U2 R' U R U' R'",
                        setup: "R U R' U' R U2' R' y' R' U2 R U' y",
                        desc: ''
                    }, {
                        id: 'f2l-24',
                        name: 'F2L 24',
                        alg: "U' R U2' R' y' R' U2 R U' R' U R",
                        setup: "R' U' R U' R' U2 R y R U2 R' U",
                        desc: ''
                    }
                ]
            }, {
                id: 'f2l-case4',
                label: 'Corner down, edge on top',
                cases: [{
                        id: 'f2l-25',
                        name: 'F2L 25',
                        alg: "U R U' R' d' (L' U L)",
                        setup: "L' U' L d R U R' U'",
                        desc: ''
                    }, {
                        id: 'f2l-26',
                        name: 'F2L 26',
                        alg: "y' U' R' U R r' U' R U M'",
                        setup: "M U' R' U r R' U' R U y",
                        desc: ''
                    }, {
                        id: 'f2l-27',
                        name: 'F2L 27',
                        alg: "y' R' U' R U (R' U' R)",
                        setup: "R' U R U' R' U R y",
                        desc: ''
                    }, {
                        id: 'f2l-28',
                        name: 'F2L 28',
                        alg: "R U R' U' (R U R')",
                        setup: "R U' R' U R U' R'",
                        desc: ''
                    }, {
                        id: 'f2l-29',
                        name: 'F2L 29',
                        alg: "R U' R' U (R U' R')",
                        setup: "R U' R' U' R U R'",
                        desc: ''
                    }, {
                        id: 'f2l-30',
                        name: 'F2L 30',
                        alg: "y' R' U R U' (R' U R)",
                        setup: "R' U' R U R' U' R y",
                        desc: ''
                    }
                ]
            }, {
                id: 'f2l-case5',
                label: 'Edge down, corner on top',
                cases: [{
                        id: 'f2l-31',
                        name: 'F2L 31',
                        alg: "U' R U' R' U2 (R U' R')",
                        setup: "R U R' U2' R U R' U",
                        desc: ''
                    }, {
                        id: 'f2l-32',
                        name: 'F2L 32',
                        alg: "d R' U R U2 (R' U R)",
                        setup: "R' U' R U2' R' U' R d'",
                        desc: ''
                    }, {
                        id: 'f2l-33',
                        name: 'F2L 33',
                        alg: "U' R U R' d (R' U' R)",
                        setup: "R' U R d' R U' R' U",
                        desc: ''
                    }, {
                        id: 'f2l-34',
                        name: 'F2L 34',
                        alg: "d R' U' R d' (R U R')",
                        setup: "R U' R' d R' U R d'",
                        desc: ''
                    }, {
                        id: 'f2l-35',
                        name: 'F2L 35',
                        alg: "R U' R' d (R' U R)",
                        setup: "R' U' R d' R U R'",
                        desc: ''
                    }, {
                        id: 'f2l-36',
                        name: 'F2L 36',
                        alg: "(R U R' U') (R U R' U') (R U R')",
                        setup: "R U' R' U R U' R' U R U' R'",
                        desc: ''
                    }
                ]
            }, {
                id: 'f2l-case6',
                label: 'Corner down, edge down',
                cases: [{
                        id: 'f2l-37',
                        name: 'F2L 37',
                        alg: "R U' R' U' R U R' U2 (R U' R')",
                        setup: "R U R' U2' R U' R' U R U R'",
                        desc: ''
                    }, {
                        id: 'f2l-38',
                        name: 'F2L 38',
                        alg: "R U R' U2 R U' R' U (R U R')",
                        setup: "R U' R' U' R U R' U2' R U' R'",
                        desc: ''
                    }, {
                        id: 'f2l-39',
                        name: 'F2L 39',
                        alg: "R U' R' d R' U' R U' (R' U' R)",
                        setup: "R' U R U R' U R d' R U R'",
                        desc: ''
                    }, {
                        id: 'f2l-40',
                        name: 'F2L 40',
                        alg: "R U R' U' R U' R' U2 y' (R' U' R)",
                        setup: "R' U R y U2' R U R' U R U' R'",
                        desc: ''
                    }, {
                        id: 'f2l-41',
                        name: 'F2L 41',
                        alg: "R U' R' U y' R' U2 R U2' (R' U R)",
                        setup: "R' U R U2 R' U2 R y U' R U R'",
                        desc: ''
                    }
                ]
            }
        ]
    },

    oll: {
        label: 'OLL',
        badge: 57,
        color: 'var(--face-u)',
        subcats: [{
                id: 'oll-all-edges-oriented',
                label: 'All Edges Correctly Oriented',
                cases: [{
                        id: 'oll-27',
                        name: 'OLL 27 (Sune)',
                        alg: "L U L' U L U2 L'",
                        setup: "L U2' L' U' L U' L'",
                        desc: 'Sune. The most recognized OLL algorithm.'
                    }, {
                        id: 'oll-26',
                        name: 'OLL 26 (Antisune)',
                        alg: "R' U' R U' R' U2 R",
                        setup: "R' U2' R U R' U R",
                        desc: 'AntiSune. Mirror of the Sune algorithm.'
                    }, {
                        id: 'oll-21',
                        name: 'OLL 21 (H)',
                        alg: "R U2 R' U' R U R' U' R U' R'",
                        setup: "R U R' U R U' R' U R U2' R'",
                        desc: 'Cross made, 2 pairs of headlights'
                    }, {
                        id: 'oll-22',
                        name: 'OLL 22 (Pi)',
                        alg: "R U2' R2 U' R2 U' R2 U2' R",
                        setup: "R' U2 R2' U R2' U R2' U2 R'",
                        desc: 'Recognized by 1 pair of headlights, to be faced to the left.'
                    }, {
                        id: 'oll-23',
                        name: 'OLL 23 (Superman)',
                        alg: "R2 D R' U2 R D' R' U2 R'",
                        setup: "R U2 R' D R' U2' R D' R2'",
                        desc: 'Superman.'
                    }, {
                        id: 'oll-24',
                        name: 'OLL 24',
                        alg: "l' U' L U R U' r' F",
                        setup: "F' r U R' U' L' U l",
                        desc: 'Chameleon shape'
                    }, {
                        id: 'oll-25',
                        name: 'OLL 25',
                        alg: "R' F R B' R' F' R B",
                        setup: "B' R' F R B R' F' R",
                        desc: 'Bowtie shape'
                    }
                ]
            }, {
                id: 'oll-no-edges-oriented',
                label: 'No Edges Correctly Oriented',
                cases: [{
                        id: 'oll-1',
                        name: 'OLL 1',
                        alg: "R U2 R2' F R F' U2' R' F R F'",
                        setup: "F R' F' R U2 F R' F' R2 U2' R'",
                        desc: 'Recognized by 2 bars (3 stickers in a row), to be faced to the sides.'
                    }, {
                        id: 'oll-2',
                        name: 'OLL 2',
                        alg: "F R U R' U' F' f R U R' U' f'",
                        setup: "f U R U' R' f' F U R U' R' F'",
                        desc: 'Recognized by a single bar, to be faced to the left.'
                    }, {
                        id: 'oll-3',
                        name: 'OLL 3',
                        alg: "f R U R' U' f' U' F R U R' U' F'",
                        setup: "F U R U' R' F' U f U R U' R' f'",
                        desc: 'Made of P orientation + U\' + T orientation.'
                    }, {
                        id: 'oll-4',
                        name: 'OLL 4',
                        alg: "f R U R' U' f' U F R U R' U' F'",
                        setup: "F U R U' R' F' U' f U R U' R' f'",
                        desc: 'Made of P orientation + U + T orientation.'
                    }, {
                        id: 'oll-17',
                        name: 'OLL 17',
                        alg: "R U R' U R' F R F' U2 R' F R F'",
                        setup: "F R' F' R U2' F R' F' R U' R' U' R'",
                        desc: 'Dot shape with 2 side sticker blocks forming an arrow.'
                    }, {
                        id: 'oll-20',
                        name: 'OLL 20',
                        alg: "M U R U R' U' M2 U R U' r'",
                        setup: "r U R' U' M2' U R U' R' U' M'",
                        desc: 'H-Dot shape.'
                    }, {
                        id: 'oll-18',
                        name: 'OLL 18',
                        alg: "F R U R' U y' R' U2 R' F R F'",
                        setup: "F R' F' R U2 R y U' R U' R' F'",
                        desc: 'Recognized by the stickers bar at the back.'
                    }, {
                        id: 'oll-19',
                        name: 'OLL 19',
                        alg: "r' R U R U R' U' r R2' F R F'",
                        setup: "F R' F' R2 r' U R U' R' U' R' r",
                        desc: 'Recognized by the lack of stickers bar.'
                    }
                ]
            }, {
                id: 'oll-c-shapes',
                label: 'C shapes',
                cases: [{
                        id: 'oll-46',
                        name: 'OLL 46',
                        alg: "R' U' R' F R F' U R",
                        setup: "R' U' F R' F' R U R",
                        desc: 'Recognized by the stickers bar, to be faced to the right.'
                    }, {
                        id: 'oll-34',
                        name: 'OLL 34',
                        alg: "R U R2 U' R' F R U R U' F'",
                        setup: "F U R' U' R' F' R U R2' U' R'",
                        desc: 'Recognized by the lack of a stickers bar.'
                    }
                ]
            }, {
                id: 'oll-i-shapes',
                label: 'I shapes',
                cases: [{
                        id: 'oll-55',
                        name: 'OLL 55',
                        alg: "R U2 R2 U' R U' R' U2 F R F'",
                        setup: "F R' F' U2' R U R' U R2' U2' R'",
                        desc: 'Recognized by the 2 sets of sticker bars, to be faced to the sides.'
                    }, {
                        id: 'oll-52',
                        name: 'OLL 52',
                        alg: "R U R' U R d' R U' R' F'",
                        setup: "F R U R' d R' U' R U' R'",
                        desc: 'Recognized by having a single bar. To be faced to the right.'
                    }, {
                        id: 'oll-51',
                        name: 'OLL 51',
                        alg: "f R U R' U' R U R' U' f'",
                        setup: "f U R U' R' U R U' R' f'",
                        desc: 'No bars, having 2 blocks of stickers & headlights.'
                    }, {
                        id: 'oll-56',
                        name: 'OLL 56',
                        alg: "F R U R' U' R F' r U R' U' r'",
                        setup: "r U R U' r' F R' U R U' R' F'",
                        desc: 'No bars or blocks. Recognized by 2 pairs of headlights.'
                    }
                ]
            }, {
                id: 'oll-l-shapes',
                label: 'L shapes',
                cases: [{
                        id: 'oll-48',
                        name: 'OLL 48',
                        alg: "F R U R' U' R U R' U' F'",
                        setup: "F U R U' R' U R U' R' F'",
                        desc: 'No bar, headlights facing to the left.'
                    }, {
                        id: 'oll-47',
                        name: 'OLL 47',
                        alg: "R' U' R' F R F' R' F R F' U R",
                        setup: "R' U' F R' F' R F R' F' R U R",
                        desc: 'Mirror of #48. Headlights facing to the right.'
                    }, {
                        id: 'oll-54',
                        name: 'OLL 54',
                        alg: "r U R' U R U' R' U R U2' r'",
                        setup: "r U2 R' U' R U R' U' R U' r'",
                        desc: 'Recognized by having bar & headlights facing right.'
                    }, {
                        id: 'oll-53',
                        name: 'OLL 53',
                        alg: "l' U' L U' L' U L U' L' U2 l",
                        setup: "l' U2' L U L' U' L U L' U l",
                        desc: 'Mirror of case #54. Headlights facing to the left.'
                    }, {
                        id: 'oll-49',
                        name: 'OLL 49',
                        alg: "R' F R' F' R2 U2' y R' F R F'",
                        setup: "F R' F' R y' U2 R2' F R F' R",
                        desc: 'Recognized by having bar & a block. Bar is facing to the left.'
                    }, {
                        id: 'oll-50',
                        name: 'OLL 50',
                        alg: "R' F R2 B' R2' F' R2 B R'",
                        setup: "R B' R2' F R2 B R2' F' R",
                        desc: 'Mirror of case #49.'
                    }
                ]
            }, {
                id: 'oll-p-shapes',
                label: 'P shapes',
                cases: [{
                        id: 'oll-44',
                        name: 'OLL 44',
                        alg: "f R U R' U' f'",
                        setup: "f U R U' R' f'",
                        desc: 'Bar facing left when P is upside-down.'
                    }, {
                        id: 'oll-43',
                        name: 'OLL 43',
                        alg: "f' L' U' L U f",
                        setup: "f' U' L' U L f",
                        desc: 'Mirror of #44. Bar facing right when P is upside-down.'
                    }, {
                        id: 'oll-32',
                        name: 'OLL 32',
                        alg: "R U B' U' R' U R B R'",
                        setup: "R B' R' U' R U B U' R'",
                        desc: 'Recognized by not having a bar. P shape is upside-down on the right.'
                    }, {
                        id: 'oll-31',
                        name: 'OLL 31',
                        alg: "R' U' F U R U' R' F' R",
                        setup: "R' F R U R' U' F' U R",
                        desc: 'Mirror of #32.'
                    }
                ]
            }, {
                id: 'oll-t-shapes',
                label: 'T shapes',
                cases: [{
                        id: 'oll-45',
                        name: 'OLL 45',
                        alg: "F R U R' U' F'",
                        setup: "F U R U' R' F'",
                        desc: 'Recognized by the lack of sticker blocks. Very fast algorithm.'
                    }, {
                        id: 'oll-33',
                        name: 'OLL 33',
                        alg: "R U R' U' R' F R F'",
                        setup: "F R' F' R U R U' R'",
                        desc: 'Recognized by having 2 parallel sticker blocks.'
                    }
                ]
            }, {
                id: 'oll-w-shapes',
                label: 'W shapes',
                cases: [{
                        id: 'oll-38',
                        name: 'OLL 38',
                        alg: "R U R' U R U' R' U' R' F R F'",
                        setup: "F R' F' R U R' U R' U' R U' R'",
                        desc: 'Sticker block will be at the side when correctly positioned.'
                    }, {
                        id: 'oll-36',
                        name: 'OLL 36',
                        alg: "L' U' L U' L' U L U L F' L' F",
                        setup: "F' L F L' U' L' U' L U L' U L",
                        desc: 'Sticker block will be at the side when correctly positioned.'
                    }
                ]
            }, {
                id: 'oll-awkward-shapes',
                label: 'Awkward shapes',
                cases: [{
                        id: 'oll-30',
                        name: 'OLL 30',
                        alg: "R2 U R' B' R U' R2 U R B R'",
                        setup: "R B' R' U' R2 U R' B R U' R2'",
                        desc: 'Recognized by having a stickers block.'
                    }, {
                        id: 'oll-29',
                        name: 'OLL 29',
                        alg: "M U R U R' U' R' F R F' M'",
                        setup: "M F R' F' R U R U' R' U' M'",
                        desc: 'Mirror of case #30. Recognized by having a stickers block.'
                    }, {
                        id: 'oll-41',
                        name: 'OLL 41',
                        alg: "R U' R' U2 R U y R U' R' U' F'",
                        setup: "F U R U R' y' U' R' U2' R U R'",
                        desc: 'Recognized by having headlights.'
                    }, {
                        id: 'oll-42',
                        name: 'OLL 42',
                        alg: "R' U2 R U R' U R y F R U R' U' F'",
                        setup: "F U R U' R' F' y' R' U' R U' R' U2' R",
                        desc: 'Mirror of case #41. Recognized by having headlights.'
                    }
                ]
            }, {
                id: 'oll-fish-shapes',
                label: 'Fish shapes',
                cases: [{
                        id: 'oll-37',
                        name: 'OLL 37',
                        alg: "F R U' R' U' R U R' F'",
                        setup: "F R U' R' U R U R' F'",
                        desc: 'Recognition: 2 sticker blocks. Very fast and flowing algorithm.'
                    }, {
                        id: 'oll-35',
                        name: 'OLL 35',
                        alg: "R U2' R2' F R F' R U2 R'",
                        setup: "R U2' R' F R' F' R2 U2 R'",
                        desc: 'Recognition: No sticker blocks (unlike #37).'
                    }, {
                        id: 'oll-10',
                        name: 'OLL 10',
                        alg: "R U R' U R' F R F' R U2 R'",
                        setup: "R U2' R' F R' F' R U' R' U' R'",
                        desc: 'Stickers block is on the back face when positioned correctly.'
                    }, {
                        id: 'oll-9',
                        name: 'OLL 9',
                        alg: "R U R' U' R' F R2 U R' U' F'",
                        setup: "F U R U' R2' F' R U R U' R'",
                        desc: 'Mirror of #10. Stickers block is on the front face when positioned correctly.'
                    }
                ]
            }, {
                id: 'oll-knight-move-shapes',
                label: 'Knight Move shapes',
                cases: [{
                        id: 'oll-13',
                        name: 'OLL 13',
                        alg: "r U' r' U' r U r' y' R' U R",
                        setup: "R' U' R y r U' r' U r U r'",
                        desc: 'Recognition: 2 sticker blocks.'
                    }, {
                        id: 'oll-14',
                        name: 'OLL 14',
                        alg: "R' F R U R' F' R y' R U' R'",
                        setup: "R U R' y R' F R U' R' F' R",
                        desc: 'Mirror of #13. Recognition: 2 sticker blocks.'
                    }, {
                        id: 'oll-16',
                        name: 'OLL 16',
                        alg: "r U r' R U R' U' r U' r'",
                        setup: "r U r' U R U' R' r U' r'",
                        desc: 'Recognition: 1 stickers block.'
                    }, {
                        id: 'oll-15',
                        name: 'OLL 15',
                        alg: "l' U' l L' U' L U l' U l",
                        setup: "l' U' l U' L' U L l' U l",
                        desc: 'Mirror of #16. Recognition: 1 stickers block.'
                    }
                ]
            }, {
                id: 'oll-big-lightning-bolts',
                label: 'Big Lightning Bolts shapes',
                cases: [{
                        id: 'oll-40',
                        name: 'OLL 40',
                        alg: "R' F R U R' U' F' U R",
                        setup: "R' U' F U R U' R' F' R",
                        desc: 'Big lightning bolt shape.'
                    }, {
                        id: 'oll-39',
                        name: 'OLL 39',
                        alg: "L F' L' U' L U F U' L'",
                        setup: "L U F' U' L' U L F L'",
                        desc: 'Mirror of #40.'
                    }
                ]
            }, {
                id: 'oll-small-lightning-bolts',
                label: 'Small Lightning Bolts shapes',
                cases: [{
                        id: 'oll-8',
                        name: 'OLL 8',
                        alg: "R U2' R' U2 R' F R F'",
                        setup: "F R' F' R U2' R U2 R'",
                        desc: 'Stickers block is lined up with the head of the lightning bolt.'
                    }, {
                        id: 'oll-7',
                        name: 'OLL 7',
                        alg: "r U R' U R U2' r'",
                        setup: "r U2 R' U' R U' r'",
                        desc: 'Mirror of #8.'
                    }, {
                        id: 'oll-12',
                        name: 'OLL 12',
                        alg: "F R U R' U' F' U F R U R' U' F'",
                        setup: "F U R U' R' F' U' F U R U' R' F'",
                        desc: 'Stickers block is not lined up with the head of the lightning bolt.'
                    }, {
                        id: 'oll-11',
                        name: 'OLL 11',
                        alg: "F' L' U' L U F y F R U R' U' F'",
                        setup: "F U R U' R' F' y' F' U' L' U L F",
                        desc: 'Mirror of #12.'
                    }
                ]
            }, {
                id: 'oll-square-shapes',
                label: 'Square shapes',
                cases: [{
                        id: 'oll-6',
                        name: 'OLL 6',
                        alg: "r U2' R' U' R U' r'",
                        setup: "r U R' U R U2 r'",
                        desc: 'Right square shape.'
                    }, {
                        id: 'oll-5',
                        name: 'OLL 5',
                        alg: "l' U2 L U L' U l",
                        setup: "l' U' L U' L' U2' l",
                        desc: 'Mirror of #6.'
                    }
                ]
            }, {
                id: 'oll-arrow-and-h-shapes',
                label: 'Arrow & H shapes',
                cases: [{
                        id: 'oll-28',
                        name: 'OLL 28 (Arrow)',
                        alg: "M' U M U2 M' U M",
                        setup: "M' U' M U2' M' U' M",
                        desc: 'Arrow shape. Pretty quick alg.'
                    }, {
                        id: 'oll-57',
                        name: 'OLL 57 (H Shape)',
                        alg: "R U R' U' M' U R U' r'",
                        setup: "r U R' U' M U R U' R'",
                        desc: 'H Shape OLL.'
                    }
                ]
            }
        ]
    },
};
