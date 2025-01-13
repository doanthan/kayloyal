import { useState } from 'react'
import Layout from "components/layout/Layout"
import AccountLayout from "components/layout/AccountLayout"
import { Card, Row, Col, Button, Badge } from 'react-bootstrap'
import { PencilSquare, Globe2, Calendar3 } from 'react-bootstrap-icons'
import toast from 'react-hot-toast'

const FormView = ({ user, form }) => {
    return (
        <Layout pageTitle="Form Details" user={user}>
            <AccountLayout>
                {/* Form Details Card */}
                <Card className="shadow-sm border-0 mb-4">
                    <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h3 className="mb-1">{form.name}</h3>
                                <div className="d-flex align-items-center gap-3 text-muted">
                                    <div className="d-flex align-items-center gap-1">
                                        <Globe2 size={14} />
                                        <span>{form.country || 'Global'}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-1">
                                        <Calendar3 size={14} />
                                        <span>Created {new Date(form.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <Badge
                                        bg={form.status === 'active' ? 'success' : 'warning'}
                                        className="bg-opacity-10"
                                    >
                                        {form.status}
                                    </Badge>
                                </div>
                            </div>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="d-flex align-items-center gap-2"
                                onClick={() => {
                                    // Handle edit details
                                    toast.success('Editing form details')
                                }}
                            >
                                <PencilSquare size={14} />
                                Edit Details
                            </Button>
                        </div>

                        <Row className="g-4">
                            <Col md={3}>
                                <div className="border-start ps-3">
                                    <div className="text-muted small mb-1">Total Submissions</div>
                                    <div className="h4 mb-0">{form.submissions?.length || 0}</div>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="border-start ps-3">
                                    <div className="text-muted small mb-1">Last Submission</div>
                                    <div className="h4 mb-0">
                                        {form.lastSubmission ?
                                            new Date(form.lastSubmission).toLocaleDateString() :
                                            'No submissions'
                                        }
                                    </div>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="border-start ps-3">
                                    <div className="text-muted small mb-1">Form Type</div>
                                    <div className="h4 mb-0">{form.type || 'Standard'}</div>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="border-start ps-3">
                                    <div className="text-muted small mb-1">Fields</div>
                                    <div className="h4 mb-0">
                                        {Object.keys(form.fields || {}).filter(f => form.fields[f].enabled).length}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Rest of your existing form content */}
                {/* ... */}
            </AccountLayout>
        </Layout>
    )
}

export default FormView