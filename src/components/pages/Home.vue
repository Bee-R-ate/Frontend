<template>
	<div class="d-flex align-center justify-center home-container">
		<img class="beer-handy" src="@/assets/beer-handy.png" alt="">
		<div class="home-content">
			<img width="auto" height="220px" src="@/assets/logo.png" alt="logo bee-r-ate">
			<h2 class="home-title">Bee-R-ate</h2>
			<p class="home-subtitle">Rozpocznij swoją piwną debatę!</p>
			<v-btn class="mb-5" link to="/logowanie" color="secondary">Zaloguj się!</v-btn>
			<p class="mb-1" style="font-size: .9rem">Nie masz konta?</p>
			<v-btn link to="/rejestracja" color="secondary">Zarejestruj się</v-btn>
			
		</div>
	</div>
</template>

<script>
	export default {
		
	}
</script>

<style>
	.home-container {
		height: 100vh;	
		position: relative;
	}
	.home-content {
		height: fit-content;
		text-align: center;
		display: flex;
		flex-direction: column;
	}
	.home-title {
		font-size: 3rem;
		font-weight: 700;
		text-align: center;
		line-height: 55px;
	}
	.home-subtitle {
		font-style: italic;
	}
	.beer-handy {
		height: 200px;
		width: auto;
		position: absolute;
		top: 10%;
		left: 100%;
		animation-name: beer_handy;
		animation-duration: 4s;
		animation-iteration-count: infinite;
	}
	button, a span {
		color: black!important;
	}

	@keyframes beer_handy {
		0% {transform: translate(0)}
		50% {transform: translate(-100%)}
	}
</style>