<template>
	<div class="container">
		<h1 class="title">Weather</h1>
		<div class="weather-wrapper">
			<SettingOutlined
				style="font-size: 20px"
				class="settings-icon"
				v-on:click="onOpenSettings"
			/>
			<div v-if="weatherInfo.length">
				<WeatherInfoCard
					v-bind:key="weatherInfoItem.name"
					v-for="weatherInfoItem in weatherInfo"
					v-bind:weatherInfoItem="weatherInfoItem"
				/>
			</div>
			<div style="font-size: 20px" v-else>
				Press on
				<SettingOutlined style="font-size: 20px" /> in right corner and find
				place that you want to see weather
			</div>
			<Overlay v-if="isSettingsOpen">
				<WeatherSettings
					v-bind:onOpenSettings="onOpenSettings"
					v-bind:weatherInfo="weatherInfo"
				/>
			</Overlay>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { SettingOutlined } from '@ant-design/icons-vue';
import WeatherInfoCard from './components/WeatherInfoCard.vue';
import WeatherSettings from './components/WeatherSettings.vue';
import { useWeather } from './hooks/useWeather';
import Overlay from './components/Overlay.vue';
import { TWeather } from './types/weather';

export default defineComponent({
	name: 'App',
	components: {
		WeatherInfoCard,
		WeatherSettings,
		SettingOutlined,
		Overlay,
	},
	setup() {
		const { weatherInfo, getDataFromStorage } = useWeather();
		const isSettingsOpen = ref(false);
		const onOpenSettings = () => {
			isSettingsOpen.value = !isSettingsOpen.value;
		};

		if (JSON.parse(localStorage.getItem('weather') as string) as TWeather) {
			getDataFromStorage();
		}

		return {
			weatherInfo,
			onOpenSettings,
			isSettingsOpen,
		};
	},
});
</script>

<style lang="scss">
.container {
	padding: 20px 40px;
	max-width: 1440px;
	margin: 0 auto;
	position: relative;

	.settings-icon {
		position: absolute;
		right: 20px;
	}

	.title {
		text-transform: uppercase;
		font-size: 50px;
		text-align: center;
	}
}
</style>
