<script lang="ts" context="module">
	export const hydrate = false;
	export const prerender = true;
</script>

<svelte:head>
	<title>404 Page Not Found</title>
</svelte:head>

<article class="h-screen grid grid-column-1 place-items-center text-center">
	<h1 class="top-1/4 text-5xl font-extrabold text-stone-900 dark:text-stone-50">
		404 Page Not Found
	</h1>
	<div class="top-1/2 text-3xl font-bold text-stone-900 dark:text-stone-50">
		<p>Oops, this is embarrassing - the page you are looking for doesn't exist</p>
		<p>
			To return to the main page of the store, please click <a
				href="/"
				class="text-blue-600 dark:text-blue-300">here</a
			>.
		</p>
	</div>
</article>
