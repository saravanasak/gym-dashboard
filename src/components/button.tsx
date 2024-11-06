import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, type = 'button', className, ...props }) => {
  return (
    <button type={type} className={`btn ${className}`} {...props}>
      {children}
    </button>
  );
};
