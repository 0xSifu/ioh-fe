import { useAppStore } from '@/store/store';

export const useTotalCover = () => {
    const { datatable } = useAppStore();
    return datatable.reduce((acc, row) => acc + (row.coverAmount || 0), 0);
};
