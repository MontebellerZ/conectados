import "./styles.css";
import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { getLvl } from "../../data";
import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, X } from "react-feather";
import seedrandom from "seedrandom";

const getRandomOrder = (lvl, seed) => {
    const pseudoRandom = seedrandom(seed);

    const allWords = lvl.flatMap(({ words, group }, i) =>
        words.map((w) => ({ word: w, group, groupIndex: i }))
    );

    for (let i = 0; i < allWords.length; i++) {
        const changePos = Math.floor(pseudoRandom() * allWords.length);

        const aux = allWords[i];
        allWords[i] = allWords[changePos];
        allWords[changePos] = aux;
    }

    return allWords;
};

function Play() {
    const { id } = useParams();

    const lvl = useMemo(() => getLvl(id), [id]);

    const [showHelp, setShowHelp] = useState(false);
    const [tries, setTries] = useState(0);

    const [found, setFound] = useState([]);
    const [selected, setSelected] = useState([]);

    const [randomOrder, setRandomOrder] = useState(getRandomOrder(lvl, id));

    const checkSelected = (selected) => {
        const allSameGroup = selected.every((sel) => sel.group === selected[0].group);

        setSelected([]);

        if (allSameGroup) setFound([...found, selected]);

        setTries((t) => t + 1);
    };

    const dateToday = new Date().toLocaleDateString();

    const isDaily = dateToday.replace(/\//g, "") === id;

    return (
        <div id="play">
            <div id="header">
                <Link to={"/"}>
                    <ArrowLeft />
                </Link>

                <h1>CONECTADOS</h1>

                <button onClick={() => setShowHelp((h) => !h)}>
                    <HelpCircle />
                </button>
            </div>

            <div id="game">
                <div className="settings">
                    <span className="gameID">{isDaily ? dateToday : `#${id}`}</span>
                    <span className="triesCounter">
                        <span>TENTATIVAS:</span> <span>{tries}</span>
                    </span>
                </div>

                <div id="board">
                    {randomOrder.map((box, i) => {
                        const handleSelect = () => {
                            const newSelected = [...selected];

                            const includedIndex = newSelected.findIndex(
                                (sel) => sel.word === box.word
                            );

                            if (includedIndex >= 0) {
                                newSelected.splice(includedIndex, 1);
                                setSelected(newSelected);
                            } else {
                                newSelected.push(box);
                            }

                            setSelected(newSelected);

                            if (newSelected.length === 4) checkSelected(newSelected);
                        };

                        const isSelected = selected.find((sel) => sel.word === box.word);
                        const isFound = found
                            .flatMap((s) => s)
                            .find((fnd) => fnd.word === box.word);

                        const classList = [
                            "card",
                            isSelected ? "selected" : "",
                            isFound ? "found" : "",
                        ];

                        const classname = classList.join(" ");

                        return (
                            <button key={i} onClick={handleSelect} className={classname}>
                                {box.word}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div id="modal" className={showHelp ? "" : "hide"}>
                <div id="help">
                    <div>
                        <HelpCircle />
                        <span>Como jogar</span>
                    </div>

                    <p>Forme grupos de 4 palavras que tenham algo em comum.</p>
                    <p>
                        Clique em uma palavra para selecioná-la. Se precisar, você pode clicar
                        novamente para desselecionar.
                    </p>
                    <p>
                        Assim que você selecionar 4 palavras o jogo irá automaticamente conferir se
                        o grupo está correto.
                    </p>
                    <p>Se estiver correto, a categoria será revelada. Senão, tente novamente.</p>
                    <p>Descubra os 4 grupos.</p>

                    <button onClick={() => setShowHelp(false)}>
                        <X />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Play;
