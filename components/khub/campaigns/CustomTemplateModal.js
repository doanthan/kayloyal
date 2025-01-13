import React from 'react'
import { Modal, Button, Row, Col, Card } from 'react-bootstrap'

function PreviewModal({ show, onHide, templates, handleChooseTemplate }) {

    const handleTemplateClick = (template) => {
        handleChooseTemplate(template.id, template.links.self, template.attributes.html);
        onHide();
    };
    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Email Templates Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    {templates.map((template, index) => (
                        <Col key={index} md={6} lg={4} className="mb-3">
                            <Card>
                                <Card.Header>{template.attributes.name}</Card.Header>
                                <Card.Body className="p-0">
                                    <div style={{ position: 'relative' }}>
                                        <iframe
                                            srcDoc={template.attributes.html}
                                            style={{
                                                width: '100%',
                                                height: '300px',
                                                border: 'none'
                                            }}
                                            title={`Template Preview ${index + 1}`}
                                        />
                                        <div onClick={() => handleTemplateClick(template)}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                cursor: 'pointer',
                                                zIndex: 2,
                                            }}></div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
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