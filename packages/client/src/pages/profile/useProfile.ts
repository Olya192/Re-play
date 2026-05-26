import { ChangeEventHandler, FormEvent, useEffect, useState } from 'react';
import { User } from '../../types/user/user';
import { profileApi } from '../../api/profileApi';
import { BASE_API_URL, RESOURCE_API_URL } from '../../constants/api/apiConstants';
import { useEditProfile } from '../../hooks/api/useEditProfile';

interface UseProfile {
  user: User | null;
  avatarUrl: string | null;
  handleAvatarChange: ChangeEventHandler<HTMLInputElement>;
  handleAvatarSubmit: (event: FormEvent<HTMLFormElement>) => Promise<boolean>;
}

export const useProfile = (): UseProfile => {
  const { editAvatar } = useEditProfile();
  const [user, setUser] = useState<User | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const avatarUrl =
    previewAvatar ?? (user?.avatar ? `${BASE_API_URL}${RESOURCE_API_URL}${user.avatar}` : null);

  const handleAvatarChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.currentTarget;
    const file = target.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;

        if (result && typeof result === 'string') {
          setPreviewAvatar(result);
        }
      };

      reader.readAsDataURL(file);
    } else {
      setPreviewAvatar(null);
    }
  };

  // TODO user - брать из стора. В стор user сохраняется при входе в приложение
  const getUser = async (): Promise<User | null> => {
    try {
      const user = await profileApi.getCurrentUser();

      return user;
    } catch (error) {
      console.log(error);

      return null;
    }
  };

  const handleAvatarSubmit = async (event: FormEvent<HTMLFormElement>): Promise<boolean> => {
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const updatedUser = await editAvatar(formData);

    if (updatedUser) {
      setUser(updatedUser);
      setPreviewAvatar(null);

      return true;
    }

    return false;
  };

  useEffect(() => {
    getUser().then((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  return {
    user,
    avatarUrl,
    handleAvatarChange,
    handleAvatarSubmit,
  };
};
