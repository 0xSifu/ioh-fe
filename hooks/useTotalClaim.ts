import { useAppStore } from '@/store/store';

export const useTotalClaim = () => {
    const { datatable } = useAppStore();
    return datatable.reduce((acc, row) => acc + (row.claimAmount || 0), 0);
};
