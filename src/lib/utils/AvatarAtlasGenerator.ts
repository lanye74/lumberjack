import {Canvas, type Image, loadImage} from "skia-canvas";
import {createHash} from "node:crypto";

import type {UserDataWithPoints} from "$types/database.js";



export default class AvatarAtlasGenerator {
	width: number;
	height: number;
	quality: number;

	storedAtlases: Map<string, GeneratedAtlas>;

	constructor(options: AvatarAtlasGeneratorOptions) {
		this.width = options.width;
		this.height = options.height;
		this.quality = options.quality ?? 0.8;

		this.storedAtlases = new Map();
	}

	async getAtlasFromLeaderboardData(leaderboardData: UserDataWithPoints[] | null) {
		if(leaderboardData === null || leaderboardData.length === 0) {
			return null;
		}

		const urls: AvatarURL[] = leaderboardData.map(user => user.avatarUrl);
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

	generateURLsHash(urls: AvatarURL[]) {
		return createHash("md5")
			.update(JSON.stringify(urls))
			.digest("hex");
	}

	async buildAtlasFromAvatarURLs(urls: AvatarURL[]): Promise<GeneratedAtlas> {
		const userAvatars = await this.fetchUserAvatars(urls);

		const canvas = new Canvas(this.width * userAvatars.length, this.height);
		const context = canvas.getContext("2d");


		userAvatars.forEach((profilePicture, index) => {
			if(profilePicture !== null) {
				context.drawImage(profilePicture, this.width * index, 0);
			}
		});


		return {
			// re: returning buffer directly: this would only work on a +page.ts file, not a server file
			imageData: await canvas.toDataURL("jpg", {quality: this.quality}),
			// TODO: it'd be really funny to return this as an n-bit binary-encoded number
			avatarErrors: userAvatars.map(avatar => avatar === null),
			hasErrors: userAvatars.some(avatar => avatar === null)
		};
	}

	async fetchUserAvatars(urls: AvatarURL[]): Promise<UserAvatar[]> {
		return (
			// collect all promise results, succeed or fail
			await Promise.allSettled(
				// pre-emptively don't call loadImage on null urls, just map to null
				urls.map(url => url !== null ? loadImage(url) : null)
			)
		).map(result => {
			return result.status === "fulfilled" ? result.value : null;
		});
	}
}



type AvatarAtlasGeneratorOptions = {
	width: number;
	height: number;
	quality?: number;
};



type UserAvatar = Image | null;

type AvatarURL = string | null;



type GeneratedAtlas = {
	imageData: string;
	avatarErrors: boolean[];
	hasErrors: boolean;
};
