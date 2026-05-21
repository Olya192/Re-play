import s from './AvatarForm.module.css';
import { BaseButton } from '../BaseButton';
import { ChangeEventHandler, FormEvent, FormEventHandler, useRef, useState } from 'react';

interface AvatarFormProps {
  avatarUrl: string | null;
  handleAvatarChange: ChangeEventHandler<HTMLInputElement>;
  handleAvatarSubmit: (event: FormEvent<HTMLFormElement>) => Promise<boolean>;
}

export const AvatarForm = ({
  avatarUrl,
  handleAvatarChange,
  handleAvatarSubmit,
}: AvatarFormProps) => {
  const [isBtnDisabled, setBtnDisabled] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const isFile = event.target.files?.[0];

    if (isFile) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }

    handleAvatarChange(event);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    const isAvatarSaved = await handleAvatarSubmit(event);

    if (isAvatarSaved) {
      setBtnDisabled(true);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className={s.avatarWrapper}>
        <div className={s.avatar}>
          {avatarUrl && <img src={avatarUrl} className={s.avatar} alt="" />}
        </div>

        <div className={s.avatarInput}>
          <input
            ref={fileInputRef}
            id="avatar"
            type="file"
            name="avatar"
            accept="image/*"
            onChange={onChange}
          />
          <BaseButton title="Сохранить" type="submit" size="small" disabled={isBtnDisabled} />
        </div>
      </div>
    </form>
  );
};
