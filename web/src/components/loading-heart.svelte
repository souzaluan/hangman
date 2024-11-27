<header class="container">
	<div class="heart"><div></div></div>
</header>

<style>
	.heart,
	.heart div,
	.heart div:after,
	.heart div:before {
		box-sizing: border-box;
	}
	.heart {
		display: inline-block;
		position: relative;
		width: 10rem;
		height: 10rem;
		transform: rotate(45deg);
		transform-origin: 5rem 5rem;
		color: var(--color-danger-primary);
	}
	.heart div {
		top: 3.5rem;
		left: 3.5rem;
		position: absolute;
		width: 4rem;
		height: 4rem;
		background: currentColor;
		animation: heart-animation 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
	}
	.heart div:after,
	.heart div:before {
		content: ' ';
		position: absolute;
		display: block;
		width: 4rem;
		height: 4rem;
		background: currentColor;
	}
	.heart div:before {
		left: -3rem;
		border-radius: 50% 0 0 50%;
	}
	.heart div:after {
		top: -3rem;
		border-radius: 50% 50% 0 0;
	}
	@keyframes heart-animation {
		0% {
			transform: scale(0.95);
		}
		5% {
			transform: scale(1.1);
		}
		39% {
			transform: scale(0.85);
		}
		45% {
			transform: scale(1);
		}
		60% {
			transform: scale(0.95);
		}
		100% {
			transform: scale(0.9);
		}
	}
</style>
