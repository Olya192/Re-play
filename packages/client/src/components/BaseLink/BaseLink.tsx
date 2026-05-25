import s from './BaseLink.module.css';
import { CSSProperties, MouseEventHandler } from 'react';
import classnames from 'classnames';

interface BaseLinkProps {
  text: string;
  link?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export const BaseLink = ({ text, link = '', style = {}, onClick }: BaseLinkProps) => {
  const hrefProp = link ? { href: link } : {};

  return (
    <a
      {...hrefProp}
      className={classnames(s.baseLinkPrimary, s.baseLink)}
      style={style}
      onClick={onClick}
    >
      <span>{text}</span>
    </a>
  );
};
