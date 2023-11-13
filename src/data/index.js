import groups from "./words.json";
import seedrandom from "seedrandom";

const GROUPS_PER_LEVEL = 4;
const DEFAULT_MAX_LVL = 1000;

export function getLvl(seed) {
    const pseudoRandom = seedrandom(seed);

    const randPositions = [];

    while (randPositions.length < GROUPS_PER_LEVEL) {
        const randIndex = Math.floor(pseudoRandom() * groups.length);

        if (randPositions.includes(randIndex)) continue;

        randPositions.push(randIndex);
    }

    return randPositions.map((pos) => groups[pos]);
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
