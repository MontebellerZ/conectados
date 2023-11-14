import "./styles.css";
import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { getLvl } from "../../data";
import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, X } from "react-feather";
import seedrandom from "seedrandom";
import TextFit from "../../components/textFit";

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

	const randomOrder = useMemo(() => getRandomOrder(lvl, id), [lvl, id]);

	const checkSelected = (selected) => {
		const allSameGroup = selected.every((sel) => sel.group === selected[0].group);

		setSelected([]);

		if (allSameGroup) {
			const foundGroup = {
				...lvl.find((group) => group.group === selected[0].group),
				groupIndex: selected[0].groupIndex,
			};

			setFound([...found, foundGroup]);
		}

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
					{found.map((box, i) => {
						const classList = ["box", "box" + (box.groupIndex + 1)];

						const classname = classList.join(" ");

						return (
							<div key={i} className={classname}>
								<p>{box.group}</p>
								<p>{box.words.join(", ")}</p>
							</div>
						);
					})}
					{randomOrder.map((card, i) => {
						const handleSelect = () => {
							const newSelected = [...selected];

							const includedIndex = newSelected.findIndex(
								(sel) => sel.word === card.word
							);

							if (includedIndex >= 0) {
								newSelected.splice(includedIndex, 1);
								setSelected(newSelected);
							} else {
								newSelected.push(card);
							}

							setSelected(newSelected);

							if (newSelected.length === 4) checkSelected(newSelected);
						};

						const isSelected = selected.find((sel) => sel.word === card.word);
						const isFound = found.find((fnd) => fnd.group === card.group);

						const classList = [
							"card",
							isSelected ? "selected" : "",
							isFound ? "found" : "",
						];

						const classname = classList.join(" ");

						return (
							<button key={i} onClick={handleSelect} className={classname}>
								<TextFit>{card.word}</TextFit>
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
