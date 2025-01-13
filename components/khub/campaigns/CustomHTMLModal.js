import React from 'react'
import { Modal, Button } from 'react-bootstrap'

function PreviewModal({ show, onHide, html }) {
    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Email Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <iframe
                    srcDoc={html}
                    style={{
                        width: '100%',
                        height: '600px',
                        border: 'none'
                    }}
                    title="Email Preview"
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PreviewModal