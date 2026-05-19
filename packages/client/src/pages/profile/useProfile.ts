import { ChangeEventHandler, useEffect, useState } from 'react';
import { User } from '../../types/user/user';
import { profileApi } from '../../api/profileApi';
import { BASE_API_URL, RESOURCE_API_URL } from '../../constants/api/apiConstants';

export const useProfile = () => {
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

  useEffect(() => {
    profileApi.request().then((response) => {
      setUser(response);

      const imgUrl = response?.avatar
        ? `${BASE_API_URL}${RESOURCE_API_URL}${response.avatar}`
        : null;
      setAvatarUrl(imgUrl);
    });
  }, []);

  return {
    user,
    avatarUrl,
    handleAvatarChange,
  };
};
