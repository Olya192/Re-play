import { ChangeEvent, FormEvent, useState } from 'react';
import { validatePassword } from '../../utils/validate/validatePassword';
import { useEditProfile } from '../../hooks/api/useEditProfile';

interface EditPasswordFormData {
  oldPassword: string;
  newPassword: string;
  repeatedPassword: string;
}

interface UseEditPasswordForm {
  formData: EditPasswordFormData;
  error: string;
  success: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent) => void;
}

interface Passwords {
  oldPassword: string;
  newPassword: string;
  repeatedPassword: string;
}

export const useEditPasswordForm = (): UseEditPasswordForm => {
  const { editPassword } = useEditProfile();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    repeatedPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSuccess(false);

    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (error) {
      setError('');
    }
  };

  const checkPasswordValidity = ({
    oldPassword,
    newPassword,
    repeatedPassword,
  }: Passwords): boolean => {
    const validationRules = [
      {
        check: () => Boolean(oldPassword && newPassword && repeatedPassword),
        errorMessage: 'Все поля обязательны для заполнения',
      },
      {
        check: () => validatePassword(newPassword),
        errorMessage:
          'Пароль должен содержать от 8 до 40 символов, минимум одну заглавную букву и цифру',
      },
      {
        check: () => newPassword === repeatedPassword,
        errorMessage: 'Новый пароль и подтверждение не совпадают',
      },
      {
        check: () => oldPassword !== repeatedPassword,
        errorMessage: 'Новый пароль должен отличаться от текущего',
      },
    ];

    const failedRule = validationRules.find((rule) => !rule.check());

    if (failedRule) {
      setError(failedRule.errorMessage);

      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { oldPassword, newPassword, repeatedPassword } = formData;

    const isNewPasswordValid = checkPasswordValidity({
      oldPassword,
      newPassword,
      repeatedPassword,
    });

    if (!isNewPasswordValid) {
      return;
    }

    const response = await editPassword({ oldPassword, newPassword });

    if (!response) {
      setError('Ошибка при сохранении пароля. Проверьте введенные данные и повторите попытку');

      return;
    }

    console.log('Пароль успешно изменён', response);
    setFormData({ oldPassword: '', newPassword: '', repeatedPassword: '' });
    setError('');
    setSuccess(true);
  };

  return {
    formData,
    error,
    success,
    handleChange,
    handleSubmit,
  };
};
