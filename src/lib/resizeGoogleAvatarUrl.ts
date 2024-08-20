const targetSizes = [32, 64, 96, 128, 192, 256, 384, 512, 1024];
const maxSizeIndex = targetSizes.length - 1;

const sizeRegex = new RegExp(/s(\d+)(-[a-z])?/);



export default function resizeGoogleAvatarUrl(url: string) {
	// probably should find a better way to validate this but eh
	if(!url.includes("googleusercontent")) {
		return url;
	}


	// [full match, first matching group (numbers), suffix]
	const match = sizeRegex.exec(url);

	if(!match) {
		// TODO: give this a color
		console.log("[ResizeGoogleAvatarUrl] Found avatar URL that didn't need to be transformed:", url);
		return url;
	}


	const parsedSize = parseInt(match[1]);
	const sizeIndex = targetSizes.indexOf(parsedSize);

	if(sizeIndex === -1) {
		// kms
		console.log("[ResizeGoogleAvatarUrl] Received size not in targetSizes array:", parsedSize);
		return url;
	}


	const resizedIndex = Math.min(sizeIndex + 2, maxSizeIndex);
	const newSize = targetSizes[resizedIndex];


	// the $2 represents the second capturing group, so any trailing data (the -c stuff) gets kept
	const newUrl = url.replace(sizeRegex, `s${newSize}$2`);


	return newUrl;
}
