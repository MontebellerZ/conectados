import "./styles.css";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllLvls } from "../../data";
import Logo from "../../components/logo";

function Home() {
    const navigate = useNavigate();

    const dateToday = useMemo(() => new Date().toLocaleDateString(), []);
    const linkDaily = useMemo(() => `/play/${dateToday.replace(/\//g, "")}`, [dateToday]);

    const allLvls = getAllLvls();

    return (
        <div id="home">
            <div id="header">
                <Logo />

                <h1 id="homeTitle">CONECTADOS</h1>
            </div>

            <div id="playDaily" className="card">
                <span>Jogo diário</span>
                <span>{dateToday}</span>
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

            <div id="playLvls">
                <span className="lvlsTitle">Níveis</span>

                <div className="lvlsHolder">
                    {allLvls.map(({ id, done }) => {
                        const classname = `lvl ${done ? " done" : ""}`;
                        const link = `/play/${id}`;

                        return (
                            <Link key={id} className={classname} to={link}>
                                {id}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Home;
