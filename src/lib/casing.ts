// https://stackoverflow.com/a/65642944/
type SnakeToCamelCase<S extends string> =
	S extends `${infer T}_${infer U}` ?
	// clever recursion trick
	`${T}${Capitalize<SnakeToCamelCase<U>>}` :
	S;

type CamelToSnakeCase<S extends string> =
	S extends `${infer T}${infer U}` ?
	`${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}` :
	S;



export type NestedSnakeToCamelCase<T> = T extends object ? {
	[K in keyof T as SnakeToCamelCase<K & string>]: NestedSnakeToCamelCase<T[K]>
} : T;

export type NestedCamelToSnakeCase<T> = T extends object ? {
	[K in keyof T as CamelToSnakeCase<K & string>]: NestedCamelToSnakeCase<T[K]>
} : T;



// export function shallowSnakeCasedToCamelCasedObject<T extends object>(object: T): NestedSnakeToCamelCase<T>;
// export function shallowSnakeCasedToCamelCasedObject(object: null): null;
export function shallowSnakeCasedToCamelCasedObject<T extends object | null>(object: T): NestedSnakeToCamelCase<T> | null {
	if(object === null) return null;


	// TODO: can this be typed?
	const output: any = {};

	Object.entries(object).forEach(([key, value]) => {
		const camelCasedKey = snakeStringToCamel(key);
		output[camelCasedKey] = value;
	});

	return output;
}


// export function shallowCamelCasedToSnakeCasedObject<T extends object>(object: T): NestedSnakeToCamelCase<T>;
// export function shallowCamelCasedToSnakeCasedObject(object: null): null;
export function shallowCamelCasedToSnakeCasedObject<T extends object | null>(object: T): NestedCamelToSnakeCase<T> | null {
	if(object === null) return null;

	const output: any = {};

	Object.entries(object).forEach(([key, value]) => {
		const snakeCasedKey = camelStringToSnake(key);
		output[snakeCasedKey] = value;
	});

	return output;
}



// extracts _[letter] from the capture group, which is how we're able to replace it with uppercase
const snakeStringToCamel = (string: string) => string.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const camelStringToSnake = (string: string) => string.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
