export async function load({cookies, locals: {safeGetSession}}) {
	const {session} = await safeGetSession();

	return {
		cookies: cookies.getAll(),
		session
	};
}
