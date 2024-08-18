import { useAppStore } from '@/store/store';

export const useTotalExcess = () => {
    const { datatable } = useAppStore();
    return datatable.reduce((acc, row) => acc + (row.excessAmount || 0), 0);
};
