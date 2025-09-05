import React from 'react';
interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
}
declare const ActionButton: React.FC<ButtonProps>;
export default ActionButton;
