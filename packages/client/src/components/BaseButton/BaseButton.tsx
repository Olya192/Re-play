import s from './BaseButton.module.css';
import { CSSProperties, MouseEventHandler } from 'react';
import classnames from 'classnames';

interface BaseLinkProps {
  title: string;
  type: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  size?: 'large' | 'default' | 'small';
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const BaseButton = ({
  title,
  type = 'button',
  size = 'default',
  disabled = false,
  style = {},
  onClick,
}: BaseLinkProps) => {
  const classes = classnames(
    s.baseButton,
    size === 'default' && s.baseButtonDefault,
    size === 'small' && s.baseButtonSmall,
    size === 'large' && s.baseButtonLarge
  );

  return (
    <button className={classes} style={style} type={type} disabled={disabled} onClick={onClick}>
      {title}
    </button>
  );
};
