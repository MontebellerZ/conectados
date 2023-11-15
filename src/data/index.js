import groups from "./words.json";
import seedrandom from "seedrandom";

export const GROUPS_PER_LEVEL = 4;
const DEFAULT_MAX_LVL = 1000;
const DONE_STORAGE_KEY = "doneLvls";
const LVL_STORAGE_KEY = (seed) => `lvl${seed}`;

function checkSimilar(group1, group2) {
    if (group1.group === group2.group) return true;

    for (let i = 0; i < group1.words.length; i++) {
        for (let j = 0; j < group2.words.length; j++) {
            if (group1.words[i] === group2.words[j]) {
                return true;
            }
        }
    }

    return false;
}

export function getLvl(seed) {
    const pseudoRandom = seedrandom(seed);

    const randGroups = [];

    while (randGroups.length < GROUPS_PER_LEVEL) {
        const randIndex = Math.floor(pseudoRandom() * groups.length);

        const includedIndex = randGroups.findIndex((g) => checkSimilar(g, groups[randIndex]));

        if (includedIndex >= 0) continue;

        randGroups.push(groups[randIndex]);
    }

    return randGroups;
}

export function getLvlDone(seed) {
    const lvlStorage = localStorage.getItem(LVL_STORAGE_KEY(seed));
    if (!lvlStorage) return null;

    const tries = JSON.parse(lvlStorage);
    if (!Array.isArray(tries)) return null;

    return { tries: tries, found: tries.filter((found) => found) };
}

export function getAllLvls() {
    const allLvls = [];

    const doneLvlsStorage = localStorage.getItem(DONE_STORAGE_KEY);
    const doneLvls = doneLvlsStorage ? JSON.parse(doneLvlsStorage) : [];

    for (let i = 0; i < DEFAULT_MAX_LVL; i++) {
        const id = (i + 1).toString();
        const done = doneLvls.includes(id);

        allLvls.push({ id: id, done: done });
    }

    return allLvls;
}

export function winLvl(seed, tries) {
    const doneLvlsStorage = localStorage.getItem(DONE_STORAGE_KEY);
    const doneLvls = doneLvlsStorage ? JSON.parse(doneLvlsStorage) : [];

    doneLvls.push(seed);

    localStorage.setItem(DONE_STORAGE_KEY, JSON.stringify(doneLvls));
    localStorage.setItem(LVL_STORAGE_KEY(seed), JSON.stringify(tries));
}
