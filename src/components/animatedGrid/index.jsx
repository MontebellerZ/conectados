import { AnimatePresence, LayoutGroup } from "framer-motion";

function AnimatedDiv({ children }) {
    return (
        <AnimatePresence initial={false}>
            <LayoutGroup>{children}</LayoutGroup>
        </AnimatePresence>
    );
}

export default AnimatedDiv;
