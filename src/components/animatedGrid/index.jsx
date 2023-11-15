import { AnimatePresence, LayoutGroup } from "framer-motion";

function AnimatedGrid({ children }) {
    return (
        <AnimatePresence initial={false}>
            <LayoutGroup>{children}</LayoutGroup>
        </AnimatePresence>
    );
}

export default AnimatedGrid;
