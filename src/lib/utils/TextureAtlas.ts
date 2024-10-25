import {Canvas, loadImage} from "skia-canvas";
import {createHash, type Hash} from "node:crypto";

import type {PointsLeaderboardEntry} from "$types/database.js";




export class TextureAtlas {
	width: number;
	height: number;

	storedTextures: Map<string, string>;
	hasher: Hash;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;

		this.storedTextures = new Map();
		this.hasher = createHash("sha256");
	}

	async getAtlasFromLeaderboardData(leaderboardData: PointsLeaderboardEntry[] | null) {
		if(leaderboardData === null) return null;

		const urls = leaderboardData.map(user => user.avatarUrl);
		const urlsStringified = JSON.stringify(urls);

		const hash = createHash("md5").update(urlsStringified).digest("hex");

		if(this.storedTextures.has(hash)) {
			return this.storedTextures.get(hash)!;
		}


		const atlas = await this.constructAtlasFromUrls(urls);
		this.storedTextures.set(hash, atlas);

		return atlas;
	}

	async constructAtlasFromUrls(urls: (string | null)[]) {
		// TODO: figure out how to actually handle null avatars
		const images = await Promise.all(urls.map(url => loadImage(url ?? "")));

		const canvas = new Canvas(this.width * images.length, this.height);
		const context = canvas.getContext("2d");


		images.forEach((image, index) => {
			context.drawImage(image, this.width * index, 0);
		});


		// TODO: investigate returning the buffer directly, but svelte throws some errors
		// when it tries to load the buffer on the client
		return canvas.toDataURL("jpg", {quality: 0.85});
	}
}
