import React, { useEffect } from 'react'
import ReactModal, { Props as ReactModalAdapterProps } from 'react-modal'
import { PRISM_CSS_CLASSNAME } from '../../constants'
import './Modal.css'

type ModalProps = ReactModalAdapterProps & {
  isMobile: boolean
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="prism-modal-close" onClick={onClick} aria-label="Close modal">
      <div className="prism-modal-close-icon" />
    </button>
  )
}

export default function Modal({ isMobile, onRequestClose, ...props }: ModalProps) {
  useEffect(() => {
    // Set the app element for accessibility
    ReactModal.setAppElement('#root')
  }, [])

  return (
    <ReactModal
      className={`prism-modal-content ${isMobile ? 'mobile' : 'desktop'}`}
      closeTimeoutMS={200}
      id="prism-modal"
      overlayClassName="prism-modal-overlay"
      portalClassName={`${PRISM_CSS_CLASSNAME} prism-modal`}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={true}
      {...props}
    />
  )
}

export function ModalContentContainer({
  isMobile,
  children,
  onClose,
}: {
  isMobile: boolean
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      className={`prism-session-view ${isMobile ? 'mobile' : 'desktop'}`}
      id="prism--ModalContentContainer"
      data-testid="prism-predict-modal"
    >
      <CloseButton onClick={onClose} />
      <div
        className={`prism-modal-inner ${isMobile ? 'mobile' : 'desktop'}`}
        id="prism--ModalContentContainer-child"
      >
        {children}
      </div>
    </div>
  )
}
