<template>
	<div class="overlay">
		<slot class="modal-window"></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
	name: 'Overlay',
});
</script>

<style lang="scss">
.overlay {
	background-color: rgba(0, 0, 0, 0.8);
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 5;
	display: flex;
	justify-content: center;
	align-items: center;

	.modal-window {
		z-index: 10;
	}
}
</style>
