<template>
	<a-card class="weather-card" :bordered="true" v-if="weatherInfoItem">
		<div class="card-container">
			<div class="place">{{ place }}</div>
			<div class="temp-wrapper">
				<img
					:src="getWeatherImageUrl(weatherInfoItem.weather_icon)"
					alt="weather-image"
				/>
				<div class="temp">{{ weatherInfoItem.temperature }}&#8451;</div>
			</div>
			<div>
				Feels like {{ weatherInfoItem.feels_like }}&#8451;.
				{{ weatherInfoItem.weather_descr }}
			</div>
			<div>Wind speed: {{ weatherInfoItem.wind_speed }}m/s</div>
			<div>Pressure: {{ weatherInfoItem.pressure }}hPa</div>
			<div>Humidity: {{ weatherInfoItem.humidity }}%</div>
			<div>Visibility: {{ weatherInfoItem.visibility }}m</div>
		</div>
	</a-card>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from '@vue/runtime-core';
import { TWeather } from '../types/weather';
import { useWeather } from '../hooks/useWeather';

export default defineComponent({
	name: 'WeatherInfoCard',
	props: {
		weatherInfoItem: Object as () => TWeather,
	},
	setup(props) {
		const { getWeatherImageUrl } = useWeather();
		const { weatherInfoItem } = toRefs(props);
		const place = ref<string>('');

		if (weatherInfoItem.value) {
			place.value =
				weatherInfoItem.value.name + ', ' + weatherInfoItem.value.country;
		}

		return { getWeatherImageUrl, place };
	},
});
</script>

<style lang="scss">
.weather-card {
	margin: 10px !important;
	width: 250px;
	display: inline-block;

	.card-container {
		.place {
			font-weight: 600;
		}
		.temp-wrapper {
			display: flex;
			align-items: center;

			.temp {
				font-size: 30px;
			}
		}
	}
}
</style>
