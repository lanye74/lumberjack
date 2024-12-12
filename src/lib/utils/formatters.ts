const pixelFormatter = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 1,
	useGrouping: false
}).format;

export const formatPixels = (value: number) => `${pixelFormatter(value)}px`;



export const formatPoints = new Intl.NumberFormat().format;
