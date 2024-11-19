import {Canvas, type Image, loadImage} from "skia-canvas";
import {createHash} from "node:crypto";

import type {UserDataWithPoints} from "$types/database.js";



export default class AvatarAtlasGenerator {
	width: number;
	height: number;
	quality: number;

	storedAtlases: Map<string, GeneratedAtlas>;

	constructor({width, height, quality = 0.8}: AAGConstructor) {
		this.width = width;
		this.height = height;
		this.quality = quality;

		this.storedAtlases = new Map();
	}

	async getAtlasFromLeaderboardData(leaderboardData: UserDataWithPoints[] | null) {
		if(leaderboardData === null) return null;

		const urls = leaderboardData.map(user => user.avatarUrl);
		const hash = this.generateURLsHash(urls);

		const storedAtlas = this.storedAtlases.get(hash);

		// attempt to rebuild the atlas if it has errors
		if(storedAtlas !== undefined && storedAtlas.hasErrors === false) {
			return storedAtlas;
		}


		const atlas = await this.buildAtlasFromAvatarURLs(urls);
		this.storedAtlases.set(hash, atlas);

		return atlas;
	}

	generateURLsHash(urls: URLs) {
		return createHash("md5")
			.update(JSON.stringify(urls))
			.digest("hex");
	}

	async buildAtlasFromAvatarURLs(urls: URLs): Promise<GeneratedAtlas> {
		const userAvatars = await this.fetchUserAvatars(urls);

		const canvas = new Canvas(this.width * userAvatars.length, this.height);
		const context = canvas.getContext("2d");


		userAvatars.forEach((profilePicture, index) => {
			if(profilePicture.image) {
				context.drawImage(profilePicture.image, this.width * index, 0);
			}
		});


		return {
			// TODO: investigate returning the buffer directly, but sveltekit throws some errors when it tries to load the buffer on the client
			imageData: await canvas.toDataURL("jpg", {quality: this.quality}),
			avatarErrors: userAvatars.map(avatar => avatar.error),
			hasErrors: userAvatars.some(avatar => avatar.error === true)
		};
	}

	async fetchUserAvatars(urls: URLs): Promise<UserAvatar[]> {
		return await Promise.all(urls.map(async url => {
			if(url === null) {
				return ({
					error: true,
					image: null
				});
			}

			try {
				const image = await loadImage(url);
				return ({
					error: false,
					image
				}) satisfies UserAvatar;
			} catch {
				return ({
					error: true,
					image: null
				}) satisfies UserAvatar;
			}
		}));
	}
}



type AAGConstructor = {
	width: number;
	height: number;
	quality?: number;
};



type URLs = (string | null)[];



type UserAvatar = {
	error: false;
	image: Image;
} | {
	error: true;
	image: null;
};



type GeneratedAtlas = {
	imageData: string;
	avatarErrors: boolean[];
	hasErrors: boolean;
};
