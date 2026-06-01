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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputKey, setInputKey] = useState(0);
  const isBtnDisabled = !selectedFile;

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);

    handleAvatarChange(event);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const isAvatarSaved = await handleAvatarSubmit(event);

    if (isAvatarSaved) {
      setSelectedFile(null);
      setInputKey((prev) => prev + 1);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className={s.avatarWrapper}>
        <div className={s.avatar}>
          {avatarUrl && <img src={avatarUrl} className={s.avatar} alt="Аватар" />}
        </div>

        <div className={s.avatarInput}>
          <input
            key={inputKey}
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
