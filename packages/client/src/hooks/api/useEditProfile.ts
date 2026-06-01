import { profileApi } from '../../api/profileApi';
import { EditPasswordData, User } from '../../types/user';

interface UseEditProfile {
  editAvatar: (data: FormData) => Promise<User | undefined>;
  editPassword: (data: EditPasswordData) => Promise<boolean | undefined>;
}

export const useEditProfile = (): UseEditProfile => {
  const editAvatar = async (data: FormData): Promise<User | undefined> => {
    try {
      const response = await profileApi.editAvatar(data);

      return response;
    } catch (error) {
      console.error(error);

      return undefined;
    }
  };

  const editPassword = async ({
    oldPassword,
    newPassword,
  }: EditPasswordData): Promise<boolean | undefined> => {
    try {
      const response = await profileApi.editPassword({
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      if (response === 'OK') {
        return true;
      }
    } catch (error) {
      console.error(error);

      return undefined;
    }
  };

  return {
    editAvatar,
    editPassword,
  };
};
