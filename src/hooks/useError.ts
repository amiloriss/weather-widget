import { ref } from 'vue';

const errorMessagePrint = ref<string>('');
const isShowingError = ref<boolean>(false);

const showError = (errorMessage: string) => {
	errorMessagePrint.value = errorMessage;
	isShowingError.value = true;
	setTimeout(() => {
		isShowingError.value = false;
	}, 1500);
};

export const useError = () => {
	return {
		showError,
		isShowingError,
		errorMessagePrint,
	};
};
