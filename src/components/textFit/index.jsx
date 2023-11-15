import { useEffect, useState } from "react";
import { useMeasure } from "@uidotdev/usehooks";

function TextFit({ children }) {
    const [outerRef, { width: outerWidth }] = useMeasure();
    const [innerRef, { width: innerWidth }] = useMeasure();
    const [fontSize, setFontSize] = useState(1);

    useEffect(() => {
        if (outerWidth < innerWidth) {
            setFontSize((fontSize) => fontSize - 0.1);
        }
    }, [outerWidth, innerWidth]);

    return (
        <div ref={outerRef} style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <div ref={innerRef} style={{ fontSize: `${fontSize}em`, width: "fit-content" }}>
                {children}
            </div>
        </div>
    );
}

export default TextFit;
