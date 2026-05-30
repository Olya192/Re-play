import { useEffect, ReactNode, MouseEvent } from 'react';
import classnames from 'classnames';
import s from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnEsc?: boolean;
  closeOnOverlay?: boolean;
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  closeOnEsc = true,
  closeOnOverlay = false,
  ariaLabel,
  className,
  children,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen || !closeOnEsc) {
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        return;
      }

      onClose();
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlay) {
      return;
    }

    if (e.target !== e.currentTarget) {
      return;
    }

    onClose();
  };

  return (
    <div
      className={s.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div className={classnames(s.dialog, className)}>{children}</div>
    </div>
  );
};
