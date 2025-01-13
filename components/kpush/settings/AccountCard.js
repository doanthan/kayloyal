import { Card, Col, Button, Row } from "react-bootstrap"
import { useState, useRef } from "react"
import EditAccountModal from "components/kpush/settings/EditAccountModal"
import DeleteAccountModal from "components/kpush/settings/DeleteAccountModal"
import axios from "axios"
import { getConfigToken, convertFileToBase64 } from "services/library"
import Papa from 'papaparse'

export default function AccountCard({ account, idx, setAccountState }) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const handleDeleteModal = () => setShowDeleteModal(!showDeleteModal)
  const handleShowEditModal = () => setShowEditModal(!showEditModal)
  const [error, setError] = useState('');



  return (
    <Col md={4} key={idx}>
      <Card className="mb-4">
        <Card.Body>
          <div className="account-details mb-5">
            <Card.Title className="mb-2">{account.label}</Card.Title>
            <Card.Text className="mb-2">
              <strong>Public Key:</strong> {account.value}
            </Card.Text>
          </div>

          <div className="float-end">
            <Button
              onClick={handleShowEditModal}
              variant="secondary me-2"
              size="sm"
            >
              <i className="fi-edit me-1"></i> Edit
            </Button>

            <Button
              onClick={handleDeleteModal}
              variant="outline-danger"
              size="sm"
            >
              <i className="fi-trash me-1"></i> Delete
            </Button>

          </div>
        </Card.Body>
        <EditAccountModal
          showEditModal={showEditModal}
          handleShowEditModal={handleShowEditModal}
          klaviyoPublic={account.value}
        />
        <DeleteAccountModal
          showDeleteModal={showDeleteModal}
          handleDeleteModal={handleDeleteModal}
          account={account}
          idx={idx}
          setAccountState={setAccountState}
        />
      </Card>
    </Col>
  )
}
