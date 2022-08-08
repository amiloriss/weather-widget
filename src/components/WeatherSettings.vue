<template>
	<a-card class="settings-card">
		<div v-if="loading" class="spin-overlay">
			<a-spin class="spin" />
		</div>
		<div class="title-wrapper">
			<h3>Settings</h3>
			<CloseOutlined style="font-size: 17px" v-on:click="onOpenSettings" />
		</div>
		<a-empty v-bind:image="emptyImage" v-if="!weatherInfo?.length"></a-empty>
		<div v-else class="location-items-wrapper">
			<Draggable v-bind:move="onMove" v-on:end="onDrop" v-model="list">
				<WeatherLocationItem
					v-bind:key="weatherInfoItem.name"
					v-for="weatherInfoItem in weatherInfo"
					v-bind:weatherInfoItem="weatherInfoItem"
				/>
			</Draggable>
		</div>
		<div v-if="isShowingError">{{ errorMessagePrint }}</div>
		<div class="add-location-wrapper">
			<a-input
				class="add-location"
				v-model:value="textValue"
				placeholder="Enter new location"
				v-on:keydown="addLocation"
			/>
			<EnterOutlined style="font-size: 20px" v-on:click="addLocation" />
		</div>
	</a-card>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/runtime-core';
import { CloseOutlined, EnterOutlined } from '@ant-design/icons-vue';
import { Empty } from 'ant-design-vue';
import { VueDraggableNext } from 'vue-draggable-next';
import WeatherLocationItem from './WeatherLocationItem.vue';
import { useWeather } from '../hooks/useWeather';
import { TWeather } from '../types/weather';
import { useError } from '../hooks/useError';

export default defineComponent({
	name: 'WeatherSettings',
	components: {
		CloseOutlined,
		EnterOutlined,
		WeatherLocationItem,
		Draggable: VueDraggableNext,
	},
	props: {
		onOpenSettings: Object as () => () => void,
		weatherInfo: Object as () => TWeather[],
	},
	setup() {
		const { fetchWeather, loading, weatherInfo } = useWeather();
		const { showError, isShowingError, errorMessagePrint } = useError();
		const textValue = ref<string>('');
		const isDuplicatedName = ref<boolean>(false);
		const list = ref(weatherInfo);

		const onMove = (event: any) => {
			list.value = event.relatedContext.list;
		};

		const onDrop = () => {
			localStorage.setItem('weather', JSON.stringify(list.value));
		};

		const displayError = () => {
			if (!textValue.value.trim().length) {
				showError('please, enter the city name');
			}

			if (isDuplicatedName.value) {
				showError('this place is already exists, find another');
				isDuplicatedName.value = false;
			}
		};

		const addLocation = async (event: any) => {
			if (event.keyCode === 13 || event.target.nodeName === 'svg') {
				const localStorageData = JSON.parse(
					localStorage.getItem('weather') as string
				) as TWeather[];

				if (localStorageData) {
					isDuplicatedName.value = localStorageData.some(
						el =>
							el.name.toLowerCase().trim() ===
							textValue.value.toLowerCase().trim()
					);
				}

				if (!isDuplicatedName.value && textValue.value.trim().length) {
					loading.value = true;
					await fetchWeather(textValue.value);
					loading.value = false;
				}

				displayError();
			}
		};

		watch(loading, () => {
			if (!loading.value) {
				textValue.value = '';
			}
		});

		return {
			textValue,
			addLocation,
			loading,
			isShowingError,
			errorMessagePrint,
			emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
			list,
			onMove,
			onDrop,
		};
	},
});
</script>

<style lang="scss">
.settings-card {
	width: 300px;
	position: relative;

	.spin-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 20;
		background-color: rgba(255, 255, 255, 0.7);
		.spin {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.title-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.location-items-wrapper {
		min-height: 100px;
		max-height: 250px;
		overflow: auto;
		padding: 0 5px;
	}

	.add-location-wrapper {
		width: 99%;
		display: flex;
		align-items: center;
		margin-top: 15px;

		.add-location {
			width: 90%;
			margin-right: 7px;
		}
	}
}
</style>
