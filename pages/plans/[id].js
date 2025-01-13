import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from "components/layout/Layout"
import AccountLayout from "components/layout/AccountLayout"
import { Card, Row, Col, Button, Badge, Nav } from 'react-bootstrap'
import { PlusCircle, CreditCard, PersonBadge, FileText, Bell, Ticket } from 'react-bootstrap-icons'

const PlanPage = ({ user }) => {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('passes')
    const { id: planId } = router.query // Get planId from URL


    const createOptions = [
        {
            title: 'Create Pass',
            description: 'Design a digital pass',
            icon: <CreditCard size={20} />,
            link: `/create/pass?planId=${planId}`,
            color: 'primary'
        },
        {
            title: 'Create Sign Up Form',
            description: 'Build a sign up form',
            icon: <PersonBadge size={20} />,
            link: `/create/signup?planId=${planId}`,
            color: 'success'
        },
        {
            title: 'Create Coupon',
            description: 'Create digital coupon',
            icon: <Ticket size={20} />,
            link: `/create/coupon?planId=${planId}`,
            color: 'warning'
        },
        {
            title: 'Send Notification',
            description: 'Message your users',
            icon: <Bell size={20} />,
            link: `/create/notification?planId=${planId}`,
            color: 'info'
        }
    ]

    // Example data - replace with your actual data
    const planItems = {
        passes: [
            {
                id: 1,
                name: "VIP Member Pass",
                type: "pass",
                createdAt: "2024-03-15",
                status: "active",
                subscribers: 145
            },
            {
                id: 2,
                name: "Premium Pass",
                type: "pass",
                createdAt: "2024-03-14",
                status: "active",
                subscribers: 89
            }
        ],
        forms: [
            {
                id: 3,
                name: "Newsletter Signup",
                type: "form",
                createdAt: "2024-03-16",
                status: "active",
                subscribers: 67
            }
        ],
        coupons: [
            {
                id: 4,
                name: "Spring Sale",
                type: "coupon",
                createdAt: "2024-03-17",
                status: "scheduled",
                subscribers: 0
            }
        ],
        notifications: [
            {
                id: 5,
                name: "Weekly Update",
                type: "notification",
                createdAt: "2024-03-18",
                status: "sent",
                subscribers: 234
            }
        ]
    }

    return (
        <Layout pageTitle="Plan Details" user={user}>
            <AccountLayout accountPageTitle="Plan Details">
                {/* Create Cards Section */}
                <Row className="g-4 mb-5">
                    {createOptions.map((option, index) => (
                        <Col md={3} key={index}>
                            <Card
                                className="shadow-sm hover-lift"
                                style={{
                                    cursor: 'pointer',
                                    border: 'none',
                                    borderRadius: '12px',
                                    margin: '0 auto'
                                }}
                                onClick={() => router.push(option.link)}
                            >
                                <Card.Body className="p-3">
                                    <div className="d-flex align-items-center">
                                        <div
                                            className={`rounded-circle bg-${option.color} bg-opacity-10 p-2 me-3`}
                                            style={{ color: `var(--bs-${option.color})` }}
                                        >
                                            {option.icon}
                                        </div>
                                        <div>
                                            <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{option.title}</h6>
                                            <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>{option.description}</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Tabs and Items Section */}
                <div className="mt-5">
                    <Nav
                        variant="tabs"
                        className="mb-4 nav-tabs-custom"
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="passes" className="px-4">
                                <CreditCard size={16} className="me-2" />
                                Passes
                                <Badge bg="primary" className="ms-2 bg-opacity-10">{planItems.passes.length}</Badge>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="forms" className="px-4">
                                <PersonBadge size={16} className="me-2" />
                                Forms
                                <Badge bg="primary" className="ms-2 bg-opacity-10">{planItems.forms.length}</Badge>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="coupons" className="px-4">
                                <Ticket size={16} className="me-2" />
                                Coupons
                                <Badge bg="primary" className="ms-2 bg-opacity-10">{planItems.coupons.length}</Badge>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="notifications" className="px-4">
                                <Bell size={16} className="me-2" />
                                Notifications
                                <Badge bg="primary" className="ms-2 bg-opacity-10">{planItems.notifications.length}</Badge>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Row className="g-4">
                        {planItems[activeTab].map((item, index) => (
                            <Col md={4} key={index}>
                                <Card
                                    className="shadow-sm hover-lift"
                                    style={{
                                        border: 'none',
                                        borderRadius: '12px'
                                    }}
                                >
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 className="mb-1">{item.name}</h5>
                                                <Badge
                                                    bg={
                                                        item.type === 'pass' ? 'primary' :
                                                            item.type === 'form' ? 'success' :
                                                                item.type === 'coupon' ? 'warning' :
                                                                    'info'
                                                    }
                                                    className="bg-opacity-10"
                                                >
                                                    {item.type}
                                                </Badge>
                                            </div>
                                            <Badge
                                                bg={item.status === 'active' ? 'success' : 'warning'}
                                                className="bg-opacity-10"
                                            >
                                                {item.status}
                                            </Badge>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="text-muted">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </small>
                                            <div>
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="text-decoration-none me-2 p-0"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="text-decoration-none text-danger p-0"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </AccountLayout>
        </Layout>
    )
}

export default PlanPage
