import s from './AvatarForm.module.css';
import { BaseButton } from '../BaseButton';
import { ChangeEventHandler, useState } from 'react';

interface AvatarFormProps {
  avatarUrl: string | null;
  handleAvatarChange: ChangeEventHandler<HTMLInputElement>;
}

export const AvatarForm = ({ avatarUrl, handleAvatarChange }: AvatarFormProps) => {
  const [isBtnDisabled, setBtnDisabled] = useState(true);

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const isFile = event.target.files?.[0];

    if (isFile) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }

    handleAvatarChange(event);
  };

  return (
    <form>
      <div className={s.avatarWrapper}>
        <div className={s.avatar}>
          {avatarUrl && <img src={avatarUrl} className={s.avatar} alt="" />}
        </div>

        <div className={s.avatarInput}>
          <input id="avatar" type="file" name="avatar" accept="image/*" onChange={onChange} />
          <BaseButton title="Сохранить" type="submit" size="small" disabled={isBtnDisabled} />
        </div>
      </div>
    </form>
  );
};
