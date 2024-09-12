export type ProfilePrefix = "ast" | "maint";
export type ProfilePretty = "AST" | "Maintenance";



export type ProfilePrefixToPrettyMap = {
	[key in ProfilePrefix]: ProfilePretty;
};
