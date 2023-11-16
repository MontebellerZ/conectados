import "./styles.css";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { GROUPS_PER_LEVEL, getLvl, getLvlDone, winLvl } from "../../data";
import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, X } from "react-feather";
import { AiOutlineShareAlt } from "react-icons/ai";
import { motion } from "framer-motion";
import seedrandom from "seedrandom";
import TextFit from "../../components/textFit";
import AnimatedDiv from "../../components/animatedGrid";

const DEVICE_AGENTS = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

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

const getSequence = (tries) => {
	return tries
		.map((t) => {
			switch (t?.groupIndex) {
				case 0:
					return "🟧";
				case 1:
					return "🟩";
				case 2:
					return "🟦";
				case 3:
					return "🟪";
				default:
					return "❌";
			}
		})
		.join(" ");
};

function Play() {
	const { id } = useParams();

	const lvl = useMemo(() => getLvl(id), [id]);
	const lvlDone = useMemo(() => getLvlDone(id), [id]);

	const [showHelp, setShowHelp] = useState(false);
	const [shareText, setShareText] = useState("Compartilhe");

	const [tries, setTries] = useState(lvlDone ? lvlDone.tries : []);
	const [found, setFound] = useState(lvlDone ? lvlDone.found : []);
	const [selected, setSelected] = useState([]);
	const [wrong, setWrong] = useState([]);
	const [correct, setCorrect] = useState([]);

	const [randomOrder, setRandomOrder] = useState(lvlDone ? [] : getRandomOrder(lvl, id));

	const win = useMemo(() => found.length === GROUPS_PER_LEVEL, [found]);
	const dateToday = useMemo(() => new Date().toLocaleDateString(), []);
	const isDaily = useMemo(() => dateToday.replace(/\//g, "") === id, [id, dateToday]);
	const isDevice = useMemo(() => DEVICE_AGENTS.test(navigator.userAgent), []);
	const isFirefox = useMemo(
		() => navigator.userAgent.toLowerCase().indexOf("firefox") !== -1,
		[]
	);

	const gameIdText = useMemo(() => (isDaily ? dateToday : `#${id}`), [isDaily, dateToday, id]);
	const sequence = useMemo(() => getSequence(tries), [tries]);

	const checkSelected = (selected) => {
		const allSameGroup = selected.every((sel) => sel.group === selected[0].group);
		const groupIndex = allSameGroup ? selected[0].groupIndex : null;

		const foundGroup = allSameGroup
			? { ...lvl.find((group) => group.group === selected[0].group), groupIndex }
			: null;

		setSelected([]);
		setTries((t) => [...t, foundGroup]);

		if (allSameGroup) {
			const orderSelected = selected.sort(
				(a, b) =>
					foundGroup.words.findIndex((w) => w === a.word) -
					foundGroup.words.findIndex((w) => w === b.word)
			);

			setCorrect(orderSelected);

			const unfoundedItems = randomOrder.filter((rnd) => !orderSelected.includes(rnd));

			const newOrder = [...orderSelected, ...unfoundedItems];
			setRandomOrder(newOrder);

			setTimeout(() => {
				setRandomOrder(unfoundedItems);
				setFound([...found, foundGroup]);
			}, 2000);
		} else {
			setWrong(selected);
			setTimeout(() => setWrong([]), 2000);
		}
	};

	const handleShare = async () => {
		const resultText = `Joguei Conectados ${gameIdText} e consegui em ${tries.length} tentativas.\n\n${sequence}\n\nJogue também em: montebellerz.github.io/conectados/`;

		if (isDevice && !isFirefox && navigator.share) {
			await navigator.share({ text: resultText });
			setShareText("Compartilhado!");
		} else {
			await navigator.clipboard.writeText(resultText);
			setShareText("Copiado!");
		}

		setTimeout(() => setShareText("Compartilhe"), 2000);
	};

	useEffect(() => {
		if (!win) return;

		winLvl(id, tries);
	}, [win, id, tries]);

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

			<motion.div
				initial="hide"
				id="result"
				variants={{
					show: { transform: "scale(1)", maxHeight: "100%" },
					hide: { transform: "scale(0)", maxHeight: "0%" },
				}}
				animate={win ? "show" : "hide"}
				layout
			>
				<p>
					<b>Parabéns!</b>
				</p>

				<p>
					Você conseguiu em <b>{tries.length}</b> tentativas.
				</p>

				<p>{sequence}</p>

				<button onClick={handleShare}>
					<AiOutlineShareAlt />
					<span>{shareText}</span>
				</button>
			</motion.div>

			<div id="game">
				<div className="settings">
					<span className="gameID">{gameIdText}</span>
					<span className="triesCounter">
						<span>TENTATIVAS:</span> <span>{tries.length}</span>
					</span>
				</div>

				<div id="board">
					<AnimatedDiv>
						{found.map((box) => {
							const classList = ["box", "box" + (box.groupIndex + 1)];

							const classname = classList.join(" ");

							return (
								<motion.div
									key={box.group}
									className={classname}
									initial={{ opacity: 0, scale: 0 }}
									animate={{ opacity: 1, scale: 1 }}
									layout
								>
									<TextFit>{box.group}</TextFit>
									<TextFit>{box.words.join(", ")}</TextFit>
								</motion.div>
							);
						})}
						{randomOrder.map((card) => {
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

							const groupClass = `card${card.groupIndex + 1}`;
							const isSelected = selected.find((sel) => sel.word === card.word);
							const isCorrect = correct.find((crct) => crct.word === card.word);
							const isWrong = wrong.find((wrg) => wrg.word === card.word);

							const classList = [
								"card",
								groupClass,
								isSelected ? "selected" : "",
								isCorrect ? "found" : "",
								isWrong ? "wrong" : "",
							];

							const classname = classList.join(" ");

							return (
								<motion.button
									key={card.word}
									onClick={handleSelect}
									className={classname}
									exit={{ scale: 0.5, opacity: 0 }}
									layout
								>
									<TextFit>{card.word}</TextFit>
								</motion.button>
							);
						})}
					</AnimatedDiv>
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
					<p>Descubra os {GROUPS_PER_LEVEL} grupos.</p>

					<button onClick={() => setShowHelp(false)}>
						<X />
					</button>
				</div>
			</div>
		</div>
	);
}

export default Play;
