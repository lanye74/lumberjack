export async function load(loadEvent) {
	const supabase = loadEvent.locals.supabase;
	// if we made it this far, i.e. we were authed in the hook and thus allowed to access this, then of course we're still authed here
	// so we don't need to worry about verifying that we have a session/user etc

	// do some stuff here to organize the top 3/5/20/whatever here idc does it really matter in the grand scheme of things
	// maybe i'll store something like a reset time in a separate table cause neither of the other tables are really designed to have that stuff put in it


	const data = await supabase.from("user_data")
		.select()
		.order("points", {ascending: false})
		// .limit(5);

	console.log(data.data);
}
