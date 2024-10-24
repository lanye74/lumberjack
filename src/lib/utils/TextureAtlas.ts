import {Canvas, type Image, loadImage} from "skia-canvas";



export class TextureAtlas {
	width: number;
	height: number;

	images?: Image[];
	canvas?: Canvas;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	async loadImages(urls: string[]) {
		this.images = await Promise.all(urls.map(url => loadImage(url)));
	}

	constructAtlasFromImages() {
		if(!this.images || this.images instanceof Promise) {
			console.error("TextureAtlas images not loaded!");
			return null;
		}


		this.canvas = new Canvas(this.width * this.images.length, this.height);
		const context = this.canvas.getContext("2d");

		this.images.forEach((image, index) => {
			context.drawImage(image, this.width * index, 0);
		});
	}

	export() {
		if(!this.canvas) {
			console.error("TextureAtlas missing canvas!");
			return null;
		}


		return this.canvas.toDataURLSync("jpg", {quality: 0.85});
	}
}