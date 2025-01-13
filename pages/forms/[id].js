import { useState } from 'react'
import Layout from "components/layout/Layout"
import AccountLayout from "components/layout/AccountLayout"
import { Card, Button, Badge, ButtonGroup, Dropdown } from "react-bootstrap"
import { PencilSquare, Share, ThreeDotsVertical } from 'react-bootstrap-icons'
import { onlyAuthUserSSR } from "services/server-library"
import SignUp from "components/pass/SignUp"
import Form from "models/Form" // Import your Form model

const FormView = ({ user, form }) => {
    const [showShareModal, setShowShareModal] = useState(false)

    return (
        <Layout pageTitle={form.name} user={user}>
            <AccountLayout>
                {/* Header with actions */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="mb-1">{form.name}</h4>
                        <div className="d-flex align-items-center gap-2">
                            <Badge
                                bg={form.status === 'active' ? 'success' : 'warning'}
                                className="bg-opacity-10"
                            >
                                {form.status}
                            </Badge>
                            <span className="text-muted small">
                                Created {new Date(form.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            href={`/forms/${form._id}/edit`}
                            className="d-flex align-items-center gap-2"
                        >
                            <PencilSquare size={16} />
                            Edit Form
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => setShowShareModal(true)}
                            className="d-flex align-items-center gap-2"
                        >
                            <Share size={16} />
                            Share
                        </Button>
                        <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle
                                variant="light"
                                split
                                className="border"
                            >
                                <ThreeDotsVertical size={16} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end">
                                <Dropdown.Item>View Analytics</Dropdown.Item>
                                <Dropdown.Item>Duplicate Form</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item className="text-danger">
                                    Delete Form
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                {/* Form Preview */}
                <Card className="shadow-sm border-0">
                    <Card.Body className="p-4">
                        <SignUp
                            initialBrandTheme={form.theme}
                            enabledFields={form.fields}
                            readOnly={true}
                        />
                    </Card.Body>
                </Card>

                {/* Share Modal */}
                <Modal
                    show={showShareModal}
                    onHide={() => setShowShareModal(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Share Form</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3">
                            <label className="form-label">Form URL</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={`${process.env.NEXT_PUBLIC_URL}/f/${form._id}`}
                                    readOnly
                                />
                                <Button variant="outline-secondary">
                                    Copy
                                </Button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Embed Code</label>
                            <div className="input-group">
                                <textarea
                                    className="form-control font-monospace"
                                    rows={3}
                                    readOnly
                                    value={`<iframe src="${process.env.NEXT_PUBLIC_URL}/f/${form._id}/embed" width="100%" height="600" frameborder="0"></iframe>`}
                                />
                                <Button variant="outline-secondary">
                                    Copy
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </AccountLayout>
        </Layout>
    )
}

export const getServerSideProps = async (context) => {
    const { req, params } = context
    const { id } = params

    const user = await onlyAuthUserSSR(req)
    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        }
    }
    try {
        // Fetch the form
        const form = await Form.findOne({
            _id: id,
        })

        if (!form) {
            return { notFound: true }
        }

        // Check if user has access to the plan
        const hasAccess = user.plans.some(planId =>
            planId.toString() === form.planId.toString()
        )


        if (!hasAccess) {
            return {
                redirect: {
                    destination: "/dashboard",
                    permanent: false,
                    query: { error: 'access-denied' }
                }
            }
        }


        return {
            props: {
                user,
                form: JSON.parse(JSON.stringify(form)) // Serialize the form data
            }
        }
    }
    catch (error) {
        console.error('Error fetching form:', error)
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
                query: { error: 'fetch-error' }
            }
        }
    }

}

export default FormView 