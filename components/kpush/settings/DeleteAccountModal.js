import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useAuth } from 'services/AuthProvider';
import { getConfigToken } from 'services/library';

export default function DeleteAccountModal({ showDeleteModal, handleDeleteModal, account, idx, setAccountState }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.delete(`/api/account?idx=${idx}`, getConfigToken());
            setAccountState(data.accounts)
            handleDeleteModal(); // Close the modal
        } catch (error) {
            setError('Failed to delete account. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Modal centered show={showDeleteModal} onHide={handleDeleteModal}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Are you sure you want to delete this account?</h5>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Button
                    onClick={onDelete}
                    variant="danger"
                    className="text-center"
                    disabled={loading}
                >
                    {loading ? 'Deleting...' : 'Delete Account'}
                </Button>
            </Modal.Body>
        </Modal>
    );
}
