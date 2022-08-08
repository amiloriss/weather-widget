<template>
	<div v-if="weatherInfoItem" class="location-item">
		<div class="location-item-name-wrapper">
			<MenuOutlined class="hamburger-icon" />
			<div class="location-item-name">{{ weatherInfoItem.name }}</div>
		</div>
		<DeleteOutlined
			class="trash-icon"
			v-on:click="removeLocation(weatherInfoItem?.name)"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { MenuOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { TWeather } from '../types/weather';
import { useWeather } from '../hooks/useWeather';

export default defineComponent({
	name: 'WeatherLocationItem',
	components: { MenuOutlined, DeleteOutlined },
	props: {
		weatherInfoItem: Object as () => TWeather,
	},
	setup() {
		const { getDataFromStorage } = useWeather();
		const removeLocation = (selectedName?: string) => {
			const localStorageData = JSON.parse(
				localStorage.getItem('weather') as string
			) as TWeather[];

			const filteredData = localStorageData.filter(
				el =>
					el.name.toLocaleLowerCase().trim() !==
					selectedName?.toLocaleLowerCase().trim()
			);

			localStorage.clear();
			localStorage.setItem('weather', JSON.stringify(filteredData));

			getDataFromStorage();
		};

		return {
			removeLocation,
		};
	},
});
</script>

<style lang="scss">
.location-item {
	padding: 5px;
	border-radius: 1px;
	background-color: rgb(218, 218, 218);
	margin-bottom: 15px;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.location-item-name-wrapper {
		display: flex;
		align-items: center;

		.hamburger-icon {
			font-size: 15px;
			cursor: pointer;
		}

		.location-item-name {
			margin-left: 10px;
		}
	}
	.trash-icon {
		font-size: 20px;
	}
}
</style>
