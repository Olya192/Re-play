export interface User {
  id: number;
  email: string;
  login: string;
  firstName: string;
  secondName: string;
  displayName: string;
  phone: string;
  avatar?: string;
}

export interface ApiUserResponse {
  id: number;
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string | null;
  phone: string;
  avatar: string | null;
}

export interface EditPasswordData {
  oldPassword: string;
  newPassword: string;
}

export const mapApiUserToUser = (apiUser: ApiUserResponse): User => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    login: apiUser.login,
    firstName: apiUser.first_name,
    secondName: apiUser.second_name,
    displayName: apiUser.display_name || '',
    phone: apiUser.phone,
    avatar: apiUser.avatar || undefined,
  };
};
