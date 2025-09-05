import React from 'react';
import { Props as ReactModalAdapterProps } from 'react-modal';
import './Modal.css';
type ModalProps = ReactModalAdapterProps & {
    isMobile: boolean;
};
export default function Modal({ isMobile, onRequestClose, ...props }: ModalProps): import("react/jsx-runtime").JSX.Element;
export declare function ModalContentContainer({ isMobile, children, onClose, }: {
    isMobile: boolean;
    children: React.ReactNode;
    onClose: () => void;
}): import("react/jsx-runtime").JSX.Element;
export {};
