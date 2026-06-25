import s from './BaseInput.module.css';
import { Input } from 'antd';
import type { InputProps } from 'antd';

interface BaseInputProps extends Omit<InputProps, 'autoFocus'> {
  label?: string;
  autofocus?: boolean; // кастомный проп с маленькой буквы
}

export const BaseInput = ({
  label,
  type = 'text',
  placeholder = '',
  name,
  autofocus = false,
  ...restProps
}: BaseInputProps) => {
  const InputComponent = type === 'password' ? Input.Password : Input;

  return (
    <label className={s.inputLabel}>
      <span className={s.inputLabelText}>{label}</span>
      <InputComponent
        type={type === 'password' ? undefined : type}
        placeholder={placeholder}
        name={name}
        autoFocus={autofocus}
        {...restProps}
      />
    </label>
  );
};
