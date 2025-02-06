import { create } from "zustand";
import { UserData } from "../Modals/Interface";

type StoreUser = {
    user: UserData | null;
    setUser: (user: UserData | null) => void;
};

const useUser = create<StoreUser>((set) => ({
    user: null,
    setUser: (user) => set({ user: user || null }), // تجنب القيم undefined
  }));

export default useUser;