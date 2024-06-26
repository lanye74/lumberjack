# clock-app
Log where you are, instantly


## todo list
1. chores
	- [x] set up git
	- [ ] figure out how to spin up a server on appdev (or perhaps another vm? i quite like the ubuntu vm)
	- [ ] reach out about getting a domain
2. think about architecture
	- [x] set up supabase
	- [x] set up oauth
		- [ ] move oauth to whatever service account we have instead of this temporary one
	- [x] primary table will be the timestamped logs
		- timestamp, location, user id
		- probably something else i'll realize i'm missing after reaching step 8... talk to josh
	- [x] need another table for user profiles
		- points, user settings (also cache settings locally ofc)
	- do we need to cache leaderboard rankings? because it’s so small can just pull it all client side
		- points should probably reset weekly/monthly... maybe we do need a leaderboard service anyway
		- can i make ranked splits? hahahaha
		- see 9.1
3. set up database, and implement the base functions that will access it
	- [x] probably need a supabasemanager that exposes methods
	- [x] oauth methods exposed
	- database methods exposed:
		- [x] log location
		- [ ] update/view your logs
		- [ ] points system
4. bind these methods to buttons in a highly minimal, just-usable ui
	- [ ] make sure it all works from a raw data standpoint
5. investigate pwas
	- [ ] figure out how to set up a pwa
	- [ ] bind this pwa to the domain and test if it works
		- can use my github io if domain is taking a while
	- [ ] ensure that there’s some amount of hot-reloading available on the pwa
6. design the app
	- [ ] i probably want a tab system at the bottom
		- do i need to make my own icons? should i? probably can just ~~rob~~ borrow material icons
	- [ ] bottom bar will probably consist of clock, points/leaderboard, settings
	- [ ] learn figma for designs/mockups?
		- it'd be silly
7. turn the design into the app
	- [ ] test a sveltekit project to make sure i'm not crazy
	- [ ] build the app
		- this is a tiny bullet point but it will probably take up the majority of the time
8. iterate
9. think long-term
	- [ ] possibly we can host our own supabase instance
		- it'd be even funnier if i just wrote the database software myself
		- not for any good reason. just because i can


## stlp
stuff that's not important for getting the app off of the ground, but ideal for an stlp project

- [ ] admin panel to view/export statistics




holy SHIT i just realized that steps 1–7 need to be done within the next month
i'm not gonna have time for literally anything else...
