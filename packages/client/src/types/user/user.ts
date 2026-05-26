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

export interface EditPasswordData {
  oldPassword: string;
  newPassword: string;
}
