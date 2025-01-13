import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { PlusCircle, Image as ImageIcon, CardText, Grid3x3, PlayBtn, Trash } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const MessageTypes = [
    { id: 'text', name: 'Text Message', icon: CardText },
    { id: 'image', name: 'Image Message', icon: ImageIcon },
    { id: 'rich', name: 'Rich Image Message', icon: Grid3x3 },
    { id: 'card', name: 'Card Message', icon: Grid3x3 },
];

const MessagePreview = ({ message, isSelected }) => {
    const renderContent = () => {
        switch (message.type) {
            case 'text':
                return (
                    <p className="m-0" style={{
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-all', // This will break long words at any character
                        hyphens: 'auto',        // This will add hyphens when breaking words
                        WebkitHyphens: 'auto',  // For Safari support
                        msHyphens: 'auto',      // For IE support
                        maxWidth: '100%'        // Ensure text stays within bubble
                    }}>
                        {message.content}
                    </p>
                );
            case 'image':
                return (
                    <div className="image-preview">
                        <img
                            src={message.imageUrl || '/placeholder.svg'}
                            alt="Preview"
                            className="rounded-2"
                            style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }}
                        />
                    </div>
                );
            case 'rich':
                return (
                    <div>
                        <img
                            src={message.imageUrl || '/placeholder.svg'}
                            alt="Preview"
                            className="rounded-2 mb-2"
                            style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }}
                        />
                        <h6 className="mb-1">{message.title}</h6>
                        <p className="m-0 small">{message.content}</p>
                    </div>
                );
            case 'card':
                return (
                    <div className="card-message">
                        <h6 className="mb-1">{message.title}</h6>
                        <p className="mb-2 small">{message.content}</p>
                        <div className="d-flex gap-2">
                            {message.buttons?.map((btn, idx) => (
                                <button key={idx} className="btn btn-sm btn-light">{btn.label}</button>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className={`message-bubble mb-3 rounded-3 ${isSelected ? 'selected' : ''}`}
            style={{
                maxWidth: '80%',
                marginLeft: ['image', 'rich', 'card'].includes(message.type) ? '0' : 'auto',
                backgroundColor: ['image', 'rich', 'card'].includes(message.type) ? '#ffffff' : '#00B900',
                color: ['image', 'rich', 'card'].includes(message.type) ? '#000000' : '#ffffff',
                padding: '8px 12px',
                fontSize: '14px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                position: 'relative',
                wordBreak: 'break-all',  // Break long words
                hyphens: 'auto',         // Add hyphens
                minWidth: '50px',
                maxWidth: '80%'          // Ensure consistent max width
            }}
        >
            {renderContent()}
        </div>
    );
};

const MessageEditor = ({ message, onUpdate, onDelete }) => {
    const renderFields = () => {
        switch (message.type) {
            case 'text':
                return (
                    <Form.Group>
                        <Form.Label className="small">Message Text</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={message.content}
                            onChange={(e) => onUpdate({ ...message, content: e.target.value })}
                        />
                    </Form.Group>
                );
            case 'image':
                return (
                    <Form.Group>
                        <Form.Label className="small">Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            value={message.imageUrl}
                            onChange={(e) => onUpdate({ ...message, imageUrl: e.target.value })}
                        />
                    </Form.Group>
                );
            case 'rich':
                return (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label className="small">Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={message.imageUrl}
                                onChange={(e) => onUpdate({ ...message, imageUrl: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small">Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={message.title}
                                onChange={(e) => onUpdate({ ...message, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="small">Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={message.content}
                                onChange={(e) => onUpdate({ ...message, content: e.target.value })}
                            />
                        </Form.Group>
                    </>
                );
            case 'card':
                return (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label className="small">Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={message.title}
                                onChange={(e) => onUpdate({ ...message, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small">Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={message.content}
                                onChange={(e) => onUpdate({ ...message, content: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="small">Buttons</Form.Label>
                            {message.buttons?.map((btn, idx) => (
                                <Form.Control
                                    key={idx}
                                    type="text"
                                    className="mb-2"
                                    value={btn.label}
                                    onChange={(e) => {
                                        const newButtons = [...message.buttons];
                                        newButtons[idx] = { ...btn, label: e.target.value };
                                        onUpdate({ ...message, buttons: newButtons });
                                    }}
                                />
                            ))}
                        </Form.Group>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Form className="message-editor">
            {renderFields()}
            <Button variant="danger" className="mt-3" onClick={() => onDelete(message.id)}>
                <Trash className="me-2" />
                Delete Message
            </Button>
        </Form>
    );
};

export default function MessageBuilder() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    const addMessage = (type) => {
        const newMessage = {
            id: Date.now(),
            type,
            content: type === 'text' ? 'New message' : 'Description',
            title: ['rich', 'card'].includes(type) ? 'Title' : '',
            imageUrl: ['image', 'rich'].includes(type) ? '' : undefined,
            buttons: type === 'card' ? [{ label: 'Button 1' }, { label: 'Button 2' }] : undefined,
        };
        setMessages([...messages, newMessage]);
    };

    const updateMessage = (updatedMessage) => {
        setMessages(messages.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg));
        setSelectedMessage(updatedMessage);
    };

    const deleteMessage = (id) => {
        setMessages(messages.filter(msg => msg.id !== id));
        setSelectedMessage(null);
    };

    const handleSend = () => {
        // Here you would implement the logic to send the messages
        console.log('Sending messages to:', phoneNumber);
        setShowModal(false);
        setPhoneNumber('');
    };

    return (
        <Container fluid>
            <Row className="vh-100">
                <Col md={3} className="border-end p-3">
                    <h6 className="text-uppercase text-muted mb-4" style={{ fontSize: '13px', fontWeight: '600' }}>Message Types</h6>
                    {MessageTypes.map((type) => (
                        <Card key={type.id} className="mb-3 border-0 shadow-sm" onClick={() => addMessage(type.id)} style={{ cursor: 'pointer' }}>
                            <Card.Body className="d-flex justify-content-between align-items-center py-2">
                                <div className="d-flex align-items-center">
                                    <type.icon className="me-2" size={18} />
                                    <Card.Title className="mb-0" style={{ fontSize: '14px' }}>{type.name}</Card.Title>
                                </div>
                                <PlusCircle size={20} className="text-primary" />
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
                <Col md={6} className="border-end p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-uppercase text-muted mb-0" style={{ fontSize: '13px', fontWeight: '600' }}>Preview</h6>
                        <Button variant="primary" size="sm" className="d-flex align-items-center gap-1" onClick={() => setShowModal(true)}>
                            <PlayBtn size={16} />
                            Preview & Test
                        </Button>
                    </div>
                    <div className="mobile-frame">
                        <div className="mobile-screen">
                            <div className="mobile-header">
                                <span className="mobile-time">9:41</span>
                                <div className="mobile-app-name">Line</div>
                            </div>
                            <div className="mobile-content">
                                {messages.map((message) => (
                                    <div key={message.id} onClick={() => setSelectedMessage(message)}>
                                        <MessagePreview
                                            message={message}
                                            isSelected={selectedMessage?.id === message.id}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col md={3} className="p-3">
                    <h6 className="text-uppercase text-muted mb-4" style={{ fontSize: '13px', fontWeight: '600' }}>Message Properties</h6>
                    {selectedMessage ? (
                        <MessageEditor
                            message={selectedMessage}
                            onUpdate={updateMessage}
                            onDelete={deleteMessage}
                        />
                    ) : (
                        <p className="text-muted small">Select a message to edit its properties</p>
                    )}
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Preview & Test</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Enter Mobile Phone Number</Form.Label>
                        <Form.Control
                            type="tel"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSend}>
                        Send
                    </Button>
                </Modal.Footer>
            </Modal>

            <style jsx>{`
        .mobile-frame {
          width: 320px;
          height: 650px;
          background-color: #1c1c1e;
          border-radius: 40px;
          padding: 12px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
          position: relative;
          margin: 0 auto;
        }
        .mobile-screen {
          width: 100%;
          height: 100%;
          background-color: #B2C7DA;
          border-radius: 32px;
          overflow: hidden;
          position: relative;
        }
        .mobile-header {
          height: 60px;
          background-color: #00B900;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        .mobile-time {
          font-size: 13px;
          color: #ffffff;
          font-weight: 500;
        }
        .mobile-app-name {
          font-size: 16px;
          color: #ffffff;
          font-weight: 600;
        }
        .mobile-content {
          height: calc(100% - 60px);
          overflow-y: auto;
          padding: 16px;
        }
        .mobile-screen::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 24px;
          background-color: #1c1c1e;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
        }
        .message-bubble {
          position: relative;
          transition: all 0.2s ease;
        }
        .message-bubble:hover {
          opacity: 0.9;
        }
        .message-bubble.selected {
          outline: 2px solid #0d6efd;
        }
        .mobile-content::-webkit-scrollbar {
          width: 6px;
        }
        .mobile-content::-webkit-scrollbar-track {
          background: transparent;
        }
        .mobile-content::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .message-bubble::before {
          content: '';
          position: absolute;
          top: 15px;
          width: 10px;
          height: 10px;
          background-color: inherit;
          transform: rotate(45deg);
          z-index: 0;
        }
        .message-bubble[style*="margin-left: auto"]::before {
          right: -5px;
        }
        .message-bubble:not([style*="margin-left: auto"])::before {
          left: -5px;
        }
      `}</style>
        </Container>
    );
}