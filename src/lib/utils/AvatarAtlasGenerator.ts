import {Canvas, type CanvasRenderingContext2D, type Image, loadImage} from "skia-canvas";
import {createHash} from "node:crypto";

import type {UserDataWithPoints} from "$types/database.js";



export default class AvatarAtlasGenerator {
	avatarWidth: number;
	avatarHeight: number;
	quality: number;

	canvas: Canvas;
	context: CanvasRenderingContext2D;

	storedAtlases: Map<string, GeneratedAtlas>;

	constructor(options: AvatarAtlasGeneratorOptions) {
		this.avatarWidth = options.avatarWidth;
		this.avatarHeight = options.avatarHeight;
		this.quality = options.quality ?? 0.8;

		this.canvas = new Canvas(this.avatarWidth, this.avatarHeight);
		this.context = this.canvas.getContext("2d");

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

		this.canvas.width = this.avatarWidth * userAvatars.length;
		this.context.reset();

		userAvatars.forEach((profilePicture, index) => {
			if(profilePicture !== null) {
				this.context.drawImage(profilePicture, this.avatarWidth * index, 0);
			}
		});


		return {
			// re: returning buffer directly: this would only work on a +page.ts file, not a server file
			imageData: await this.canvas.toDataURL("jpg", {quality: this.quality}),
			// TODO: it'd be really funny to return this as an n-bit binary-encoded number
			avatarErrors: userAvatars.map(avatar => avatar === null),
			hasErrors: userAvatars.some(avatar => avatar === null)
		};
	}

	async fetchUserAvatars(urls: AvatarURL[]): Promise<UserAvatar[]> {
		// collect all promise results, succeed or fail
		const imageResults = await Promise.allSettled(
			// pre-emptively don't call loadImage on null urls, just map to null
			urls.map(url => url !== null ? loadImage(url) : Promise.reject(null))
		);

		// typescript type's inferencing is awesome
		return imageResults.map(result => result.status === "fulfilled" ? result.value : null);
	}
}



type AvatarAtlasGeneratorOptions = {
	avatarWidth: number;
	avatarHeight: number;
	quality?: number;
};



type UserAvatar = Image | null;

type AvatarURL = string | null;



type GeneratedAtlas = {
	imageData: string;
	avatarErrors: boolean[];
	hasErrors: boolean;
};
