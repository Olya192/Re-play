import { ChangeEventHandler, FormEvent, useEffect, useState } from 'react';
import { User } from '@/types/user';
import { BASE_API_URL, RESOURCE_API_URL } from '@/constants/api/apiConstants';
import { useEditProfile } from '@/hooks';
import { selectUser } from '@/slices/userSlice';
import { useSelector } from '@/store';

interface UseProfile {
  user: User | null;
  avatarUrl: string | null;
  handleAvatarChange: ChangeEventHandler<HTMLInputElement>;
  handleAvatarSubmit: (event: FormEvent<HTMLFormElement>) => Promise<boolean>;
}

export const useProfile = (): UseProfile => {
  const currentUser = useSelector(selectUser);

  const { editAvatar } = useEditProfile();
  const [user, setUser] = useState<User | null>(currentUser);
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

  // useEffect(() => {
  //   if (currentUser) {
  //     setUser(currentUser);
  //   }
  // }, []);

  return {
    user,
    avatarUrl,
    handleAvatarChange,
    handleAvatarSubmit,
  };
};
