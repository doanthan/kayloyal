import React from "react"
import { Modal, Row, Col, Button } from "react-bootstrap"

const OptinModal = ({
  backgroundColor,
  title,
  titleColor,
  message,
  messageColor,
  acceptButtonText,
  acceptButtonBgColor,
  acceptButtonTextColor,
  cancelButtonText,
  cancelButtonBgColor,
  cancelButtonTextColor,
  showModal,
  modalPosition,
  position,
  onClose,
  isPreview,
  iconUrl,
  showIcon
}) => {
  const getPositionProperties = () => {
    switch (modalPosition) {
      case "Top Right":
        return {
          transform: showModal ? "translate(0,0)" : "translate(110%, 0)",
          bottom: "unset",
          left: "unset",
          top: isPreview ? "0" : "20px",
          right: isPreview ? "0" : "20px",
        }
      case "Bottom Left":
        return {
          transform: showModal ? "translate(0,0)" : "translate(-110%, 0)",
          top: "unset",
          right: "unset",
          bottom: isPreview ? "0" : "20px",
          left: isPreview ? "0" : "20px",
        }
      case "Top Left":
        return {
          transform: showModal ? "translate(0,0)" : "translate(-110%, 0)",
          bottom: "unset",
          right: "unset",
          top: isPreview ? "0" : "20px",
          left: isPreview ? "0" : "20px",
        }
      case "Bottom Right":
        return {
          transform: showModal ? "translate(0,0)" : "translate(110%, 0)",
          top: "unset",
          left: "unset",
          bottom: isPreview ? "0" : "20px",
          right: isPreview ? "0" : "20px",
        }
      default:
        return {
          transform: showModal ? "translate(0,0)" : "translate(-110%, 0)",
          bottom: "unset",
          left: "unset",
          top: "0",
          right: "0",
        }
    }
  }

  const handleClose = () => {
    onClose()
  }
  return (
    <Modal.Dialog
      className="rounded shadow-sm p-4"
      style={{
        width: "450px",
        zIndex: isPreview ? "1000" : "10000",
        backgroundColor: backgroundColor,
        transition: "transform 0.5s",
        position: position,
        ...getPositionProperties(),
      }}
    >
      <Row>
        {showIcon && iconUrl && (
          <Col md={3}>
            <img src={iconUrl} alt="Image" />
          </Col>
        )}
        <Col>
          <div>
            {title && <h5 style={{ color: titleColor }}>{title}</h5>}
            <p style={{ color: messageColor }}>{message}</p>
          </div>
        </Col>
      </Row>
      <div className="text-end">
        <button
          onClick={handleClose}
          style={{
            color: cancelButtonTextColor,
            backgroundColor: cancelButtonBgColor,
          }}
          className="btn me-2"
          id="cancel-button"
        >
          {cancelButtonText}
        </button>
        <button
          style={{
            color: acceptButtonTextColor,
            backgroundColor: acceptButtonBgColor,
          }}
          className="btn me-2"
          id="accept-button"
        >
          {acceptButtonText}
        </button>
      </div>
    </Modal.Dialog>
  )
}

export default OptinModal
