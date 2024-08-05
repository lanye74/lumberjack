export async function load({cookies, locals}) {
	return {
		cookies: cookies.getAll(),
		session: locals.session
	};
}
