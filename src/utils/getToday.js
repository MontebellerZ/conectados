function getToday() {
	const today = new Date();

	const d = today.getDate().toString().padStart(2, "0");
	const m = (today.getMonth() + 1).toString().padStart(2, "0");
	const y = today.getFullYear().toString().padStart(4, "0");

	return {
		seed: y + m + d,
		label: today.toLocaleDateString(),
	};
}

export default getToday;
