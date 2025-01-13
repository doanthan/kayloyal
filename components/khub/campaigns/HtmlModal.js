import React from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import DOMPurify from 'dompurify';


export default function HtmlPreview({ template, name, showModal, selectTemplate, mergeFields, setTemplate, link }) {
    // Sanitize the HTML content
    const cleanHtml = DOMPurify.sanitize(template);

    return (
        <Modal show={showModal} onHide={selectTemplate} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
            </Modal.Body>
            <Modal.Footer>
                <div>
                    Merge Fields
                    {mergeFields.length === 0 ? (
                        <Badge bg="secondary">No merge fields</Badge>
                    ) : (
                        mergeFields.map(field => (
                            <Badge key={field} bg="secondary" className="me-1">{field}</Badge>
                        ))
                    )}
                </div>                <Button variant="secondary" onClick={selectTemplate}>
                    Close
                </Button>
                <Button variant="secondary" onClick={() => setTemplate(link)}>
                    Select
                </Button>
            </Modal.Footer>
        </Modal>
    );
}