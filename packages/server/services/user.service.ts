import { type IUserUpdate, User } from '../models/users';

// Создание пользователя
export async function createUser(firstName: string, lastName: string) {
  return User.create({ firstName, lastName });
}

// Обновление пользователя по ID
export async function updateUserById(id: number, data: IUserUpdate) {
  return User.update(data, { where: { id } });
}

// Удаление пользователя по ID
export async function deleteUserById(id: number) {
  return User.destroy({ where: { id } });
}

// Получение пользователя по ID
export async function getUserById(id: number) {
  return User.findOne({ where: { id } });
}

// Получение пользователей по ID
export async function getUsersByFirstName(firstName: string) {
  return User.findAll({ where: { firstName } });
}
