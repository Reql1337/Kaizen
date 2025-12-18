import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-3 px-6 rounded-2xl font-sans font-medium transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primaryLight shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-white hover:bg-secondaryLight shadow-lg shadow-secondary/20",
    ghost: "bg-transparent text-textLight hover:text-primary hover:bg-primary/5",
    outline: "border-2 border-primary/20 text-primary hover:bg-primary/5"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};