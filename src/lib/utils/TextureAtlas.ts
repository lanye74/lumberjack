import {Canvas, Image, loadImage} from "skia-canvas";
import {createHash, type Hash} from "node:crypto";

import type {PointsLeaderboardEntry} from "$types/database.js";



// TODO: this probably shold be renamed to AvatarAtlas
export class TextureAtlas {
	width: number;
	height: number;

	storedTextures: Map<string, Texture>;
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


		const storedTexture = this.storedTextures.get(hash);

		// attempt to rebuild the atlas if it has errors
		if(storedTexture !== undefined && storedTexture.hasErrors === false) {
			return storedTexture;
		}


		const texture = await this.buildTextureFromAvatarURLs(urls);
		this.storedTextures.set(hash, texture);

		return texture;
	}

	async buildTextureFromAvatarURLs(urls: (string | null)[]): Promise<Texture> {
		const userAvatars = await this.fetchUserAvatars(urls);

		const canvas = new Canvas(this.width * userAvatars.length, this.height);
		const context = canvas.getContext("2d");


		userAvatars.forEach((profilePicture, index) => {
			if(profilePicture.image) {
				context.drawImage(profilePicture.image, this.width * index, 0);
			}
		});


		return {
			// TODO: investigate returning the buffer directly, but svelte throws some errors when it tries to load the buffer on the client
			imageData: await canvas.toDataURL("jpg", {quality: 0.85}),
			avatarErrors: userAvatars.map(avatar => avatar.error),
			hasErrors: userAvatars.some(avatar => avatar.error === true)
		};
	}

	async fetchUserAvatars(urls: (string | null)[]): Promise<UserAvatar[]> {
		return await Promise.all(urls.map(url =>
			loadImage(url ?? "")
				.then(image => ({
					error: false,
					image
				}) satisfies UserAvatar)
				.catch(() => ({
					error: true,
					image: null
				}) satisfies UserAvatar)
		));
	}
}



type UserAvatar = {
	error: false;
	image: Image;
} | {
	error: true;
	image: null;
};



type Texture = {
	imageData: string;
	avatarErrors: boolean[];
	hasErrors: boolean;
}
