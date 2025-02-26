<script lang="ts">
	/* some thoughts on what i want to do here

	i want to be able to use the navbar/bottombar/whatever as the form navigation container
	like if i'm okay with hiding the nav links in the /form route then i think it would make sense to repurpose it too

	but i have some issues

	displaying the links is of no consequence. but how do i get data in and out from the form navbar, though?
	i could emit events, maybe. but then i have unnecessary bindings for the link navbar
	- i guess i could make the listener very specifically "onquestionchange"
	- or i could also make it general, "onclick", and let the parent component handle the link navbar's onclicks too i.e. page navigation

	i could maybe use a custom store to sync client-side form navigation?
	or i could also use URL parameters to store state maybe...
	but i only intended to use URL parameters for current question, and storing the entire state may be verbose. i could encode it, of course
	- i mean four states^four circles = 256, which can be encoded in two hexadecimal characters
	- and then again, the state is only visual. it'll still get server-side validation
	- but then again again, i need to make sure that that does't interfere with using the forward/back buttons
	- can i pushState only for the current question? and then maybe i just recompute the validation state on navigation to make sure it's up to date?

	*/
</script>
