import axios from 'axios';
import { ref } from 'vue';
import { TWeather } from '../types/weather';
import { useError } from './useError';

const weatherInfo = ref<TWeather[]>([]);
const loading = ref<boolean>(false);
const { showError, isShowingError } = useError();

const fetchWeather = async (city: string) => {
	const response = await axios
		.get(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=671a2670979787b3c3e87e89df8b6387&units=metric`
		)
		.then(res => res.data)
		.catch(err => showError(err.response.data.message));

	const data = await response;

	if (data && !isShowingError.value) {
		weatherInfo.value.push({
			name: data.name,
			country: data.sys.country,
			temperature: Math.round(data.main.temp),
			feels_like: Math.round(data.main.feels_like),
			visibility: data.visibility,
			humidity: data.main.humidity,
			pressure: data.main.pressure,
			weather_descr: data.weather[0].description,
			wind_speed: data.wind.speed,
			weather_icon: data.weather[0].icon,
		});
	}

	localStorage.setItem('weather', JSON.stringify(weatherInfo.value));
};

const getDataFromStorage = () => {
	weatherInfo.value = JSON.parse(
		localStorage.getItem('weather') as string
	) as TWeather[];
};

const getWeatherImageUrl = (icon: string, size = '2x') => {
	return `http://openweathermap.org/img/wn/${icon}@${size}.png`;
};

export const useWeather = () => {
	return {
		fetchWeather,
		weatherInfo,
		getWeatherImageUrl,
		getDataFromStorage,
		loading,
	};
};
