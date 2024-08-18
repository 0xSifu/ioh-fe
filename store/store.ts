import { create } from "zustand";
import { createTableDataSlice, TableData } from "./slices/tableDataSlice";

import {
  createIsOpenSlice,
  IsOpenSliceInterface,
} from "./slices/createIsOpenSlice";

type AppStoreInterface = IsOpenSliceInterface & TableData;

export const useAppStore = create<AppStoreInterface>()((...a) => ({
  ...createIsOpenSlice(...a),
  ...createTableDataSlice(...a),
}));