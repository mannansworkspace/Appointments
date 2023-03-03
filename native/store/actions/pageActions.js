import {
    CLEAR_ERROR,
    PAGE_LOADING,
    PAGE_LOADED
} from './types'

export const clearError = () => {
	return {
		type: CLEAR_ERROR
	};
};

export const setPageLoading = () => {
	return {
		type: PAGE_LOADING
	};
};

export const clearPageLoading = () => {
	return {
		type: PAGE_LOADED
	};
};