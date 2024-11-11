# lumberjack
Log where you are, instantly


## roadmap (approximately)

TODO: steal best practices from [cobalt](https://github.com/imputnet/cobalt/tree/main/web) (i love u cobalt)
- [put more logic in layouts, not components](https://github.com/imputnet/cobalt/blob/main/web/src/routes/%2Blayout.svelte#L78)
- [error pages](https://github.com/imputnet/cobalt/blob/main/web/src/routes/%2Berror.svelte)
- read the [svelte config dos](https://kit.svelte.dev/docs/configuration)
	- and just all of the docs in general frankly
- possibly mimic their icon library?


### stuff i've been thinking about
- finishing refactoring
- svelte 5 is out!!!!
	- less dependencies finally?????
- tauri...

### 2.7.0
try to get app a bit cleaner
- rescale UI?
- info panel in settings
	- app version, author (me), changelog
- pop up for reload on new app version
	- maybe cookie to store if the reload was clicked?
	- and then popup for "click here to see what's changed"?
	- in the future if i need closable modals, make sure to use shallow routing - push history so the native back button will close it
- perhaps: confetti on log submission?
- note: with how much backend work i'm slowly accruing, this may become a 3.0.0

### 2.8.0
make app even easier (and more invasive)
- create geofences in google maps and export them
	- (for auto detecting location client-side and server-side)
- record location on log submission
- reuse pop up from new app version
- maybe this is 3.0.0. how major are major versions?

### 3.0.0
- log editor

### 4.0.0
- admins and admin data exports
- possibly graphs and stuff?

### 5.0.0
ui rework
- i don't know what this entails and it may be scrapped
- possibly chip away at idea of reworking view transitions?
	- i think my idea of rendering all pages at once and then sliding between them is really really bad but it could be funny
- this may actually be large enough for a major version
- perhaps use a UI library

### at some point
- add a page-by-page log input ui
- do more server calls on client-side maybe
- make it more PWA-y
- switch to bun/deno

### at some point really soon
- please make error handling way better
- like it's not even funny how bad it is



## misc goals
- host supabase instance locally?
	- is this necessary?
- possibly bonus points for visiting underserved schools?
- bounties??
	- this would require an actual homepage instead of josh's "just throw the clock in on the front page"
		- this needs to happen anyway when i make the form something you click through instead of just throwing all the controls on one page (lmao)
- ranked splits xd (actually do it though)
- points --> themes
- profile borders???
	- discord cat ears border (real and true)
- stealing points?
- custom color name (real and true)
