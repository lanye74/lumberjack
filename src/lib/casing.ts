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



type NestedSnakeToCamelCase<T> = T extends object ? {
	[K in keyof T as SnakeToCamelCase<K & string>]: NestedSnakeToCamelCase<T[K]>
} : T;

type NestedCamelToSnakeCase<T> = T extends object ? {
	[K in keyof T as CamelToSnakeCase<K & string>]: NestedCamelToSnakeCase<T[K]>
} : T;



export function snakeCasedToCamelCasedObjectShallow<T extends object>(object: T): NestedSnakeToCamelCase<T> {
	// TODO: can this be typed?
	const output: any = {};

	Object.entries(object).forEach(([key, value]) => {
		const camelCasedKey = snakeStringToCamel(key);
		output[camelCasedKey] = value;
	});

	return output;
}



export function camelCasedToSnakeCasedObjectShallow<T extends object>(object: T): NestedCamelToSnakeCase<T> {
	const output: any = {};

	Object.entries(object).forEach(([key, value]) => {
		const snakeCasedKey = camelStringToSnake(key);
		output[snakeCasedKey] = value;
	});

	return output;
}



//                                                                             v extracts letter from the capture group
const snakeStringToCamel = (string: string) => string.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const camelStringToSnake = (string: string) => string.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
