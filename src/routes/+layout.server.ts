export async function load(loadEvent) {
	return {
		session: loadEvent.locals.session,
		cookies: loadEvent.cookies.getAll()
	};
}
