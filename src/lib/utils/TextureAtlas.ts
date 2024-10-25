import {Canvas, Image, loadImage} from "skia-canvas";
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
		const userProfilePictures = await this.fetchUserProfilePictures(urls);

		const canvas = new Canvas(this.width * userProfilePictures.length, this.height);
		const context = canvas.getContext("2d");


		userProfilePictures.forEach((profilePicture, index) => {
			if(profilePicture.image) {
				context.drawImage(profilePicture.image, this.width * index, 0);
			}
		});


		// TODO: investigate returning the buffer directly, but svelte throws some errors
		// when it tries to load the buffer on the client
		return canvas.toDataURL("jpg", {quality: 0.85});
	}

	async fetchUserProfilePictures(urls: (string | null)[]): Promise<UserProfilePicture[]> {
		return await Promise.all(urls.map(url =>
			loadImage(url ?? "")
				.then(image => ({
					error: false,
					image
				}) satisfies UserProfilePicture)
				.catch(() => ({
					error: true,
					image: null
				}) satisfies UserProfilePicture)
		));
	}
}



// TODO: rename types
type UserProfilePicture = {
	error: false;
	image: Image;
} | {
	error: true;
	image: null;
};
