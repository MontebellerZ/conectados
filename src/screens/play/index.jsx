import { useMemo } from "react";
import { useParams } from "react-router";
import { getLvl } from "../../data";
import { Link } from "react-router-dom";

function Play() {
    const { id } = useParams();

    const lvl = useMemo(() => getLvl(id), [id]);

    return (
        <div id="play">
            <div id="header">
                <Link to={"/"}></Link>
            </div>
        </div>
    );
}

export default Play;
