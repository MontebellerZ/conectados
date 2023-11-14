import groups from "./words.json";
import seedrandom from "seedrandom";

const GROUPS_PER_LEVEL = 4;
const DEFAULT_MAX_LVL = 1000;

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

export function getAllLvls() {
    const allLvls = [];

    const doneLvlsStorage = localStorage.getItem("doneLvls");
    const doneLvls = doneLvlsStorage ? JSON.parse(doneLvlsStorage) : [];

    for (let i = 0; i < DEFAULT_MAX_LVL; i++) {
        const id = i + 1;
        const done = doneLvls.includes(id);

        allLvls.push({ id: id, done: done });
    }

    return allLvls;
}
