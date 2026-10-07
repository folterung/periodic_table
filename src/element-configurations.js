// Neutral ground-state reference assignments. Sources and prediction policy: docs/electron-configurations.md.
export const configurationSources = {
 nist: { name: 'NIST Atomic Spectra Database 5.12', url: 'https://physics.nist.gov/PhysRefData/ASD/ionEnergy.html' },
 rsc: { name: 'Royal Society of Chemistry', url: 'https://periodic-table.rsc.org/' },
 cipt: { name: 'Lackenby, Dzuba & Flambaum (2019)', url: 'https://arxiv.org/abs/1910.01414' }
};
export const elementConfigurations = [
 {
  "number": 1,
  "configuration": "1s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 2,
  "configuration": "1s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 3,
  "configuration": "1s2 2s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 4,
  "configuration": "1s2 2s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 5,
  "configuration": "1s2 2s2 2p1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 6,
  "configuration": "1s2 2s2 2p2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 7,
  "configuration": "1s2 2s2 2p3",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 8,
  "configuration": "1s2 2s2 2p4",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 9,
  "configuration": "1s2 2s2 2p5",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 10,
  "configuration": "1s2 2s2 2p6",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 11,
  "configuration": "[Ne] 3s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 12,
  "configuration": "[Ne] 3s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 13,
  "configuration": "[Ne] 3s2 3p1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 14,
  "configuration": "[Ne] 3s2 3p2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 15,
  "configuration": "[Ne] 3s2 3p3",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 16,
  "configuration": "[Ne] 3s2 3p4",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 17,
  "configuration": "[Ne] 3s2 3p5",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 18,
  "configuration": "[Ne] 3s2 3p6",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 19,
  "configuration": "[Ar] 4s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 20,
  "configuration": "[Ar] 4s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 21,
  "configuration": "[Ar] 3d1 4s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 22,
  "configuration": "[Ar] 3d2 4s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 23,
  "configuration": "[Ar] 3d3 4s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 24,
  "configuration": "[Ar] 3d5 4s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 25,
  "configuration": "[Ar] 3d5 4s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 26,
  "configuration": "[Ar] 3d6 4s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 27,
  "configuration": "[Ar] 3d7 4s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 28,
  "configuration": "[Ar] 3d8 4s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 29,
  "configuration": "[Ar] 3d10 4s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 30,
  "configuration": "[Ar] 3d10 4s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 31,
  "configuration": "[Ar] 3d10 4s2 4p1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 32,
  "configuration": "[Ar] 3d10 4s2 4p2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 33,
  "configuration": "[Ar] 3d10 4s2 4p3",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 34,
  "configuration": "[Ar] 3d10 4s2 4p4",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 35,
  "configuration": "[Ar] 3d10 4s2 4p5",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 36,
  "configuration": "[Ar] 3d10 4s2 4p6",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 37,
  "configuration": "[Kr] 5s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 38,
  "configuration": "[Kr] 5s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 39,
  "configuration": "[Kr] 4d1 5s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 40,
  "configuration": "[Kr] 4d2 5s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 41,
  "configuration": "[Kr] 4d4 5s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 42,
  "configuration": "[Kr] 4d5 5s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 43,
  "configuration": "[Kr] 4d5 5s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 44,
  "configuration": "[Kr] 4d7 5s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 45,
  "configuration": "[Kr] 4d8 5s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 46,
  "configuration": "[Kr] 4d10",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 47,
  "configuration": "[Kr] 4d10 5s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 48,
  "configuration": "[Kr] 4d10 5s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 49,
  "configuration": "[Kr] 4d10 5s2 5p1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 50,
  "configuration": "[Kr] 4d10 5s2 5p2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 51,
  "configuration": "[Kr] 4d10 5s2 5p3",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 52,
  "configuration": "[Kr] 4d10 5s2 5p4",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 53,
  "configuration": "[Kr] 4d10 5s2 5p5",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 54,
  "configuration": "[Kr] 4d10 5s2 5p6",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 55,
  "configuration": "[Xe] 6s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 56,
  "configuration": "[Xe] 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 57,
  "configuration": "[Xe] 5d1 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 58,
  "configuration": "[Xe] 4f1 5d1 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 59,
  "configuration": "[Xe] 4f3 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 60,
  "configuration": "[Xe] 4f4 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 61,
  "configuration": "[Xe] 4f5 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 62,
  "configuration": "[Xe] 4f6 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 63,
  "configuration": "[Xe] 4f7 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 64,
  "configuration": "[Xe] 4f7 5d1 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 65,
  "configuration": "[Xe] 4f9 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 66,
  "configuration": "[Xe] 4f10 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 67,
  "configuration": "[Xe] 4f11 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 68,
  "configuration": "[Xe] 4f12 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 69,
  "configuration": "[Xe] 4f13 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 70,
  "configuration": "[Xe] 4f14 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 71,
  "configuration": "[Xe] 4f14 5d1 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 72,
  "configuration": "[Xe] 4f14 5d2 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 73,
  "configuration": "[Xe] 4f14 5d3 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 74,
  "configuration": "[Xe] 4f14 5d4 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 75,
  "configuration": "[Xe] 4f14 5d5 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 76,
  "configuration": "[Xe] 4f14 5d6 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 77,
  "configuration": "[Xe] 4f14 5d7 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 78,
  "configuration": "[Xe] 4f14 5d9 6s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 79,
  "configuration": "[Xe] 4f14 5d10 6s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 80,
  "configuration": "[Xe] 4f14 5d10 6s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 81,
  "configuration": "[Xe] 4f14 5d10 6s2 6p1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 82,
  "configuration": "[Xe] 4f14 5d10 6s2 6p2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 83,
  "configuration": "[Xe] 4f14 5d10 6s2 6p3",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 84,
  "configuration": "[Xe] 4f14 5d10 6s2 6p4",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 85,
  "configuration": "[Xe] 4f14 5d10 6s2 6p5",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 86,
  "configuration": "[Xe] 4f14 5d10 6s2 6p6",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 87,
  "configuration": "[Rn] 7s1",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 88,
  "configuration": "[Rn] 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 89,
  "configuration": "[Rn] 6d1 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 90,
  "configuration": "[Rn] 6d2 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 91,
  "configuration": "[Rn] 5f2 6d1 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 92,
  "configuration": "[Rn] 5f3 6d1 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 93,
  "configuration": "[Rn] 5f4 6d1 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 94,
  "configuration": "[Rn] 5f6 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 95,
  "configuration": "[Rn] 5f7 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 96,
  "configuration": "[Rn] 5f7 6d1 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 97,
  "configuration": "[Rn] 5f9 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 98,
  "configuration": "[Rn] 5f10 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 99,
  "configuration": "[Rn] 5f11 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 100,
  "configuration": "[Rn] 5f12 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 101,
  "configuration": "[Rn] 5f13 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 102,
  "configuration": "[Rn] 5f14 7s2",
  "source": "nist",
  "predicted": false
 },
 {
  "number": 103,
  "configuration": "[Rn] 5f14 7s2 7p1",
  "source": "nist",
  "predicted": true
 },
 {
  "number": 104,
  "configuration": "[Rn] 5f14 6d2 7s2",
  "source": "nist",
  "predicted": true
 },
 {
  "number": 105,
  "configuration": "[Rn] 5f14 6d3 7s2",
  "source": "nist",
  "predicted": true
 },
 {
  "number": 106,
  "configuration": "[Rn] 5f14 6d4 7s2",
  "source": "nist",
  "predicted": true
 },
 {
  "number": 107,
  "configuration": "[Rn] 5f14 6d5 7s2",
  "source": "nist",
  "predicted": true
 },
 {
  "number": 108,
  "configuration": "[Rn] 5f14 6d6 7s2",
  "source": "nist",
  "predicted": true
 },
 {
  "number": 109,
  "configuration": "[Rn] 5f14 6d7 7s2",
  "source": "rsc",
  "predicted": true
 },
 {
  "number": 110,
  "configuration": "[Rn] 5f14 6d8 7s2",
  "source": "cipt",
  "predicted": true
 },
 {
  "number": 111,
  "configuration": "[Rn] 5f14 6d9 7s2",
  "source": "cipt",
  "predicted": true
 },
 {
  "number": 112,
  "configuration": "[Rn] 5f14 6d10 7s2",
  "source": "cipt",
  "predicted": true
 },
 {
  "number": 113,
  "configuration": "[Rn] 5f14 6d10 7s2 7p1",
  "source": "rsc",
  "predicted": true
 },
 {
  "number": 114,
  "configuration": "[Rn] 5f14 6d10 7s2 7p2",
  "source": "rsc",
  "predicted": true
 },
 {
  "number": 115,
  "configuration": "[Rn] 5f14 6d10 7s2 7p3",
  "source": "rsc",
  "predicted": true
 },
 {
  "number": 116,
  "configuration": "[Rn] 5f14 6d10 7s2 7p4",
  "source": "rsc",
  "predicted": true
 },
 {
  "number": 117,
  "configuration": "[Rn] 5f14 6d10 7s2 7p5",
  "source": "rsc",
  "predicted": true
 },
 {
  "number": 118,
  "configuration": "[Rn] 5f14 6d10 7s2 7p6",
  "source": "rsc",
  "predicted": true
 }
];
export function elementConfiguration(number) {
 if (!Number.isInteger(number) || number < 1 || number > 118) throw new RangeError('Use an atomic number from 1 to 118.');
 return elementConfigurations[number - 1];
}
