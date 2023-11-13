import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../screens/home";
import Play from "../screens/play";

function RouterManager() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path="/play" element={<Play />} />
                <Route path="/play/:id" element={<Play />} />
            </Routes>
        </BrowserRouter>
    );
}

export default RouterManager;
