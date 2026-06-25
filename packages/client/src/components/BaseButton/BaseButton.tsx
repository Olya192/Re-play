import { Button } from 'antd';
import type { CSSProperties, MouseEventHandler } from 'react';

interface BaseButtonProps {
  title: string;
  type?: 'button' | 'submit' | 'reset';
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
}: BaseButtonProps) => {
  // antd использует 'middle' для стандартного размера вместо 'default'
  const antdSize = size === 'default' ? 'middle' : size;

  return (
    <Button
      type="primary"
      htmlType={type}
      disabled={disabled}
      size={antdSize}
      style={style}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};
