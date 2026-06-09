import s from './EditPasswordForm.module.css';
import { BaseInput } from '../BaseInput';
import { BaseButton } from '../BaseButton';
import { useEditPasswordForm } from './useEditPasswordForm';

export const EditPasswordForm = () => {
  const { formData, error, success, handleChange, handleSubmit } = useEditPasswordForm();

  return (
    <form className={s.editPasswordForm} onSubmit={handleSubmit}>
      <h2 className={s.editPasswordTitle}>Изменить пароль</h2>
      <BaseInput
        label="Пароль"
        placeholder="Введите текущий пароль"
        name="oldPassword"
        type="password"
        value={formData.oldPassword}
        onChange={handleChange}
      />
      <BaseInput
        label="Новый пароль"
        placeholder="Введите новый пароль"
        name="newPassword"
        type="password"
        value={formData.newPassword}
        onChange={handleChange}
      />
      <BaseInput
        label="Повторите новый пароль"
        placeholder="Повторите новый пароль"
        name="repeatedPassword"
        type="password"
        value={formData.repeatedPassword}
        onChange={handleChange}
      />
      {error && <div className={s.errorMessage}>{error}</div>}
      {success && <div className={s.successMessage}>Пароль обновлен</div>}
      <BaseButton title="Сохранить" type="submit" style={{ width: '130px' }} />
    </form>
  );
};
