export const formatPixels = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 1,
	useGrouping: false
}).format;



export const formatPoints = new Intl.NumberFormat().format;



export const formatTime = new Intl.DateTimeFormat("en", {
	hour: "numeric",
	hour12: true,

	minute: "2-digit",
	second: "2-digit"
}).format;