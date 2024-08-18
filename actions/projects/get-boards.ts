import { mockBoards } from '@/mocks/boards';

export const getBoards = async (userId: string) => {
  if (!userId) {
    return null;
  }

  return mockBoards.filter(board =>
    board.visibility === 'public' || board.assigned_user.some(user => user.name === 'User One') 
  );
};