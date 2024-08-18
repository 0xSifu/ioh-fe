export interface User {
  id: string;
  username: string;
  email: string;
  lastLogin?: Date;
  isActive: boolean;
  isDelete?: boolean;
  isAccountAdmin: boolean;
  isAdmin: boolean;
  userStatus: string;
  userLanguage: string;
  accessToken: string;
  refreshToken?: string;
}
