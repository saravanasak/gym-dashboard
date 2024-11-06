import React, { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export const Label: React.FC<LabelProps> = ({ children, className, ...props }) => {
  return (
    <label className={`label ${className}`} {...props}>
      {children}
    </label>
  );
};