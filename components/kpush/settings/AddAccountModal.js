import { useState, useEffect } from "react"
import KlaviyoLinkButton from "./KlaviyoLinkButton"
import { Button, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { InfoCircle } from 'react-bootstrap-icons';
import axios from "axios";
import { getConfigToken } from "services/library";

export default function AddAccountModal({ showAddModal, handleShowAddModal, setAccountState, accountState }) {
    const [name, setName] = useState("");
    const [pkKey, setPkKey] = useState("");
    const [error, setError] = useState("")
    useEffect(() => {
        if (!showAddModal) {
            setError("");  // Clear the error when the modal is closed
        }
    }, [showAddModal]);

    const handlePKSubmit = async () => {
        const url = `api/account`
        if (!pkKey || !name) {
            setError("Name and PK Key required")
            return
        }
        try {
            const { data } = await axios.post(url, { name, pkKey }, getConfigToken())
            setAccountState(data.accounts)
            handleShowAddModal()
        } catch (error) {
            console.error("Error message:", error.response.data.message);
            setError(error.response.data.message)
        }
    }

    return (
        <Modal centered show={showAddModal} onHide={handleShowAddModal}>
            <Modal.Header closeButton>
                <Modal.Title>Add Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Site Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <div className='text-center py-3'>
                    <KlaviyoLinkButton handleShowAddModal={handleShowAddModal} name={name} />
                </div>

                <div className="d-flex align-items-center my-4">
                    <hr className="flex-grow-1" />
                    <span className="px-3 text-primary">OR</span>
                    <hr className="flex-grow-1" />
                </div>

                <Form.Group className="pb-3">
                    <Form.Label className="d-flex align-items-center">
                        Klaviyo PK Key
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip id="pk-key-tooltip">
                                    Example: pk_XXXXXXXXXXXXXXXXXXXXXXXX<br />
                                    Find this in your Klaviyo account settings under API Keys<br />

                                </Tooltip>
                            }
                        >
                            <Button
                                variant="link"
                                className="p-0 ms-2"
                                style={{ verticalAlign: 'baseline' }}
                            >
                                <InfoCircle size={16} />
                            </Button>
                        </OverlayTrigger>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Klaviyo PK Key"
                        onChange={(e) => setPkKey(e.target.value)}
                    />
                </Form.Group>
                <div className='text-center py-3'>
                    <Button variant='outline-primary' onClick={handlePKSubmit}>Add Account</Button>
                </div>
                {error && <div className="text-danger mt-2">{error}</div>}

            </Modal.Body>
        </Modal>
    );
}