import { create } from "zustand";

interface storeState {
  color: string;
  mode: string;
  changeColor: (color: string) => void;
  changeMode: (mode: string) => void;
}

export const useStoreState = create<storeState>((set) => ({
  color: "#FFFFF",
  mode: "rectangle",
  changeColor: (val) => set({ color: val }),
  changeMode: (val) => set({ mode: val }),
}));
