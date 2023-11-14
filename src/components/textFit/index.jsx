import React, { useEffect, useState } from "react";
import { useMeasure } from "@uidotdev/usehooks";

function TextFit({ children }) {
	const [outerRef, { width: outerWidth }] = useMeasure();
	const [innerRef, { width: innerWidth }] = useMeasure();
	const [fontSize, setFontSize] = useState(16);

	useEffect(() => {
		if (outerWidth < innerWidth) {
			setFontSize((fontSize) => fontSize - 1);
		}
	}, [outerWidth, innerWidth]);

	return (
		<div ref={outerRef} style={{ display: "flex", justifyContent: "center", width: "100%" }}>
			<div ref={innerRef} style={{ fontSize: fontSize, width: "fit-content" }}>
				{children}
			</div>
		</div>
	);
}

export default TextFit;
