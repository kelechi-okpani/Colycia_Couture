import { useDispatch, useSelector, useStore } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from './store';

/**
 * Custom hook to dispatch actions.
 * Use this instead of the plain `useDispatch` for correct typing of Thunks.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Custom hook to select data from the store.
 * Use this instead of the plain `useSelector` to get automatic state completion.
 */
export const useAppSelector = useSelector.withTypes<RootState>();

/**
 * Custom hook to access the store instance directly.
 * Useful for one-off checks or specialized logic.
 */
export const useAppStore = useStore.withTypes<AppStore>();