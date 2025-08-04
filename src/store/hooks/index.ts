import { useDispatch } from "react-redux";
import { type AppDispatch } from "../index";
import { type TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "../index";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch=()=>useDispatch<AppDispatch>();