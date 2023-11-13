import "./styles.css";
import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { getLvl } from "../../data";
import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, X } from "react-feather";

function Play() {
    const { id } = useParams();

    const [showHelp, setShowHelp] = useState(false);

    const lvl = useMemo(() => getLvl(id), [id]);

    return (
        <div id="play">
            <div id="header">
                <Link to={"/"}>
                    <ArrowLeft />
                </Link>

                <button onClick={() => setShowHelp((h) => !h)}>
                    <HelpCircle />
                </button>
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
