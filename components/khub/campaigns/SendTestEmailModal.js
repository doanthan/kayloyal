import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { getConfigToken } from 'services/library';

const TestEmailModal = ({ testModal, setTestModal, accountDetails, template, data }) => {
    const [emailList, setEmailList] = useState('');
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [error, setError] = useState()

    useEffect(() => {
        setError()
    }, [])

    const handleCheckboxChange = (accountValue) => {
        setSelectedAccounts(prev => {
            if (prev.includes(accountValue)) {
                return prev.filter(value => value !== accountValue); // Remove unchecked item
            } else {
                return [...prev, accountValue]; // Add checked item
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedAccounts.length === accountDetails.length) {
            setSelectedAccounts([]); // Unselect all if all are selected
        } else {
            setSelectedAccounts(accountDetails.map(account => account.value)); // Select all
        }
    };

    const handleSendTestEmail = async () => {
        const emails = emailList.split(',').map(email => email.trim()); // Split by comma and trim spaces
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation

        const allValid = emails.every(email => emailRegex.test(email)); // Check if all emails are valid
        if (!emailList || selectedAccounts.length < 1) {
            setError("You need to enter email or select an account to send to.")
        }

        if (allValid) {
            console.log('data', data);
            console.log('template', template);

            await axios.post('/api/send-test-emails', { emails, klaviyoPublicKeys: selectedAccounts, template, mergeFields: data }, getConfigToken())
            setTestModal(false); // Close the modal after sending the email
        } else {
            setError('Please enter valid email addresses.'); // Inform the user about invalid input
        }
    };
    return (
        <Modal show={testModal} onHide={() => setTestModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Send Test Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Email addresses (comma-separated):</Form.Label>
                        <Form.Control
                            as="textarea"  // Changed from type="text" to as="textarea"
                            placeholder="Enter emails"
                            value={emailList}
                            onChange={(e) => setEmailList(e.target.value)}
                            rows={3}  // Optional: Specifies the number of rows in the textarea
                        />
                    </Form.Group>
                    {error && <p color="danger">{error}</p>} {/* Display error message in red */}
                    <Button variant="outline-primary" onClick={handleSelectAll} >
                        {selectedAccounts.length === accountDetails.length ? 'Unselect All' : 'Select All'}
                    </Button>
                    <Row className='pt-3'>
                        {accountDetails.map((account, index) => (
                            <Col key={index} xs={6}> {/* xs={6} ensures two columns on all screen sizes */}
                                <Form.Check
                                    type="checkbox"
                                    label={account.label}
                                    name="accountGroup"
                                    id={`checkbox-${account.value}`}
                                    checked={selectedAccounts.includes(account.value)}
                                    onChange={() => handleCheckboxChange(account.value)}
                                />
                            </Col>
                        ))}
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setTestModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSendTestEmail}>
                    Send Email
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TestEmailModal;

