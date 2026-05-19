import s from './AvatarForm.module.css';
import { BaseButton } from '../BaseButton';
import { useState } from 'react';

interface AvatarFormProps {
  avatarUrl: string | undefined;
}

export const AvatarForm = ({ avatarUrl }: AvatarFormProps) => {
  const [isBtnDisabled, setBtnDisabled] = useState(true);

  return (
    <form>
      <div className={s.avatarWrapper}>
        <div className={s.avatar}>
          {avatarUrl && <img src={avatarUrl} className={s.avatar} alt="" />}
        </div>

        <div className={s.avatarInput}>
          <input id="avatar" type="file" name="avatar" accept="image/*" />
          <BaseButton title="Сохранить" type="submit" size="small" disabled={isBtnDisabled} />
        </div>
      </div>
    </form>
  );
};
