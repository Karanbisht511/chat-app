import { useDispatch } from "react-redux";
import type { AppDispatch } from "../stateManagement/store";

export const useAppDispatch: () => AppDispatch = useDispatch;