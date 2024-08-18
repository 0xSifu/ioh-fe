import { StateCreator } from 'zustand';
import { produce } from 'immer';

interface TableDataItem {
    id: number;
    satuan: string;
    satuanIDR: number;
    innerLimitQty: number;
    totalClaim: number;
    exclusion: number;
    exclusionIDR: number;
    qty: number;
    cover: number;
    prorata: number;
    excessIDR: number;
    idBenefit: number;
    insuranceCode: number;
    rate: number;
    remark: string;
    claimAmount: number;
    prorate: number;
    exclusionAmountFrom: number;
    exclusionAmountTo: number;
    coverAmount: number;
    excessAmount: number;
    deductableFrom: number;
    deductableTo: number;
    coShareFrom: number;
    coShareTo: number;
  }
  
  export interface TableData {
    datatable: TableDataItem[];
    setTableDataDefault: (data: TableDataItem[]) => void;
    updateCell: (rowIndex: number, columnId: string, value: any) => void;
  }
  
  export const createTableDataSlice: StateCreator<TableData> = (set) => ({
    datatable: [] as TableDataItem[],
    setTableDataDefault: (datatable: TableDataItem[]) => set({ datatable }),
    updateCell: (rowIndex: number, columnId: string, value: any) => set((state) =>
      produce(state, (draft) => {
        draft.datatable[rowIndex] = {
          ...draft.datatable[rowIndex],
          [columnId]: value,
        };
      })
    ),
  });