import { ChangeEventHandler, FormEvent, useEffect, useState } from 'react';
import { User } from '../../types/user/user';
import { profileApi } from '../../api/profileApi';
import { BASE_API_URL, RESOURCE_API_URL } from '../../constants/api/apiConstants';
import { useEditProfile } from '../../hooks/api/useEditProfile';

export const useProfile = () => {
  const { editAvatar } = useEditProfile();
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleAvatarChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.target;
    const file = target.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;

        if (result && typeof result === 'string') {
          setAvatarUrl(result);
        }
      };

      reader.readAsDataURL(file);
    } else {
      const imgUrl = user?.avatar ? `${BASE_API_URL}${RESOURCE_API_URL}${user.avatar}` : null;
      setAvatarUrl(imgUrl);
    }
  };

  // TODO user - брать из стора. В стор user сохраняется при входе в приложение
  const getUser = async () => {
    try {
      const user = await profileApi.request();

      return user;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser().then((user) => {
      if (user) {
        setUser(user);
        const imgUrl = user?.avatar ? `${BASE_API_URL}${RESOURCE_API_URL}${user.avatar}` : null;
        setAvatarUrl(imgUrl);
      }
    });
  }, []);

  const handleAvatarSubmit = async (event: FormEvent<HTMLFormElement>): Promise<boolean> => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const user = await editAvatar(formData);

    if (user) {
      return true;
    }

    return false;
  };

  return {
    user,
    avatarUrl,
    handleAvatarChange,
    handleAvatarSubmit,
  };
};
