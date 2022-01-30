import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {State, StateDispatch} from '../store';

export const useStateSelector: TypedUseSelectorHook<State> = useSelector;

export const useStateDispatch = () => useDispatch<StateDispatch>();
