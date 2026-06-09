import s from './BaseInput.module.css';

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: string;
  placeholder?: string;
  name: string;
  autofocus?: boolean;
}

export const BaseInput = ({
  label,
  type = 'text',
  placeholder = '',
  name,
  autofocus = false,
  ...restProps
}: BaseInputProps) => {
  return (
    <label className={s.inputLabel}>
      <span className={s.inputLabelText}>{label}</span>
      <input
        className={s.inputField}
        type={type}
        placeholder={placeholder}
        name={name}
        autoFocus={autofocus}
        {...restProps}
      />
    </label>
  );
};
