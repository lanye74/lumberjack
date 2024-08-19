const targetSizes = [32, 64, 96, 128, 192, 256, 384, 512, 1024];
const maxSizeIndex = targetSizes.length - 1;

const sizeRegex = new RegExp(/[\d]+/);



// TODO: make this less naïve
function resizeGoogleAvatarUrl(url: string) {
	const [baseUrl, avatarSize] = url.split("=");
	const extractedSize = sizeRegex.exec(avatarSize)![0];
	const parsedSize = parseInt(extractedSize);

	const sizeIndex = targetSizes.indexOf(parsedSize);

	const resizedIndex = Math.min(sizeIndex + 2, maxSizeIndex);
	const newSize = targetSizes[resizedIndex];


	const newSizeUrlComponent = extractedSize.replace(extractedSize, newSize.toString());


	return `${baseUrl}=${newSizeUrlComponent}`;
}
