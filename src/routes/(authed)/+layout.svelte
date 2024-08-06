<style>
	nav {
		position: fixed;

		height: clamp(100px, 10vh, 200px);
		width: 100%;

		bottom: 0;

		border-top: 2px solid #ccc;
		/* box-shadow: 0px; */

		font: 1.5rem Lora;
	}


	@font-face {
		font-family: "Lora";
		src: url("/Lora-Regular.ttf") format("truetype");
		font-weight: normal;
	}

	@font-face {
		font-family: "Lora";
		src: url("/Lora-Bold.ttf") format("truetype");
		font-weight: bold;
	}

</style>



<slot />



<nav id="bottom-bar">
	hey
</nav>
