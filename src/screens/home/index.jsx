import "./styles.css";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllLvls } from "../../data";
import { motion } from "framer-motion";
import { FaCaretDown } from "react-icons/fa";
import Logo from "/logo.svg";
import getToday from "../../utils/getToday";

function Home() {
	const navigate = useNavigate();

	const dateToday = useMemo(() => getToday(), []);
	const linkDaily = useMemo(() => `/play/${dateToday.seed}`, [dateToday]);

	const allLvls = getAllLvls();

	const [showLvls, setShowLvls] = useState(false);

	return (
		<div id="home">
			<div id="header">
				<img src={Logo} />

				<h1 id="homeTitle">CONECTADOS</h1>
			</div>

			<div id="playDaily" className="card">
				<span>Jogo diário</span>
				<span>{dateToday.label}</span>
				<Link to={linkDaily}>Jogar</Link>
			</div>

			<div id="playRandom" className="card">
				<span>Jogo aleatório</span>
				<button
					onClick={() => {
						const randGame = Math.floor(Math.random() * 10 ** 9);
						navigate(`/play/${randGame}`);
					}}
				>
					Jogar
				</button>
			</div>

			<motion.div
				id="playLvls"
				className="cardVertical"
				initial={{ maxHeight: "2.8em" }}
				variants={{ open: { maxHeight: "100%" }, closed: { maxHeight: "2.8em" } }}
				animate={showLvls ? "open" : "closed"}
				layout
			>
				<div>
					<span className="lvlsTitle">Níveis</span>
					<motion.button
						onClick={() => setShowLvls((s) => !s)}
						variants={{
							open: { transform: "rotate(0deg)" },
							closed: { transform: "rotate(180deg)" },
						}}
						animate={showLvls ? "open" : "closed"}
						layout
					>
						<FaCaretDown />
					</motion.button>
				</div>

				<div className="lvlsHolder">
					{allLvls.map(({ id, done }) => {
						const classname = `lvl ${done ? " done" : ""}`;
						const link = `/play/${id}`;

						return (
							<Link key={id} className={classname} to={link}>
								<span>{id}</span>
							</Link>
						);
					})}
				</div>
			</motion.div>
		</div>
	);
}

export default Home;
