import Layout from "components/layout/Layout"
import AccountLayout from "components/layout/AccountLayout"
import connect from "services/db"
import Plan from "models/plan"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { Card, Button, Badge } from "react-bootstrap"
import { onlyAuthUserSSR } from "services/server-library"
import { useRouter } from 'next/router'

const Plans = ({ user, plans }) => {
    const router = useRouter()

    return (
        <Layout pageTitle="Projects" activeNav="Projects" user={user}>
            <AccountLayout accountPageTitle="Projects">
                <div className="projects">
                    <div className="projects-summary mb-4">
                        <Row>
                            <Col md={3}>
                                <Card className="bg-info bg-gradient-info shadow-sm">
                                    <Card.Body>
                                        <p className="fw-bold text-white">Total Projects</p>
                                        <Card.Text className="h4 text-white">{plans?.length || 0}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="bg-info bg-gradient-info mb-3 shadow-sm">
                                    <Card.Body>
                                        <p className="fw-bold text-white">Active Projects</p>
                                        <Card.Text className="h4 text-white">
                                            {plans?.filter(plan => plan.status === 'active').length || 0}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="bg-info bg-gradient-info mb-3 shadow-sm">
                                    <Card.Body>
                                        <p className="fw-bold text-white">Loyalty Programs</p>
                                        <Card.Text className="h4 text-white">
                                            {plans?.filter(plan => plan.cardType === 'Loyalty Cards').length || 0}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="bg-info bg-gradient-info mb-3 shadow-sm">
                                    <Card.Body>
                                        <p className="fw-bold text-white">One-Time Passes</p>
                                        <Card.Text className="h4 text-white">
                                            {plans?.filter(plan => plan.cardType === 'One-Time Use Cards').length || 0}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="h3 mb-0">Your Projects</h2>
                            <Button
                                variant="outline-primary"
                                onClick={() => router.push('/create/pass')}
                            >
                                Create New Pass
                            </Button>
                        </div>

                        <Row>
                            {plans?.map((plan) => (
                                <Col key={plan._id} md={4} className="mb-4">
                                    <Card onClick={() => router.push(`/plans/${plan._id}`)}>
                                        <div className="position-relative" style={{ height: '150px' }}>
                                            <Card.Img
                                                variant="top"
                                                src={plan.brandLogo}
                                                className="position-absolute w-100 h-100"
                                                style={{ objectFit: 'cover', objectPosition: 'center' }}
                                            />
                                        </div>
                                        <Card.Body>
                                            <Card.Title className="d-flex justify-content-between align-items-center">
                                                {plan.businessName}
                                                <Badge bg={plan.status === 'active' ? 'success' : 'secondary'}>
                                                    {plan.status}
                                                </Badge>
                                            </Card.Title>

                                            <div className="mb-3">
                                                <div className="text-muted">{plan.planName}</div>
                                                <div className="small">Type: {plan.cardType}</div>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="me-3">
                                                        <i className="fab fa-apple"></i> {/* Add apple pass count */}
                                                    </span>
                                                    <span>
                                                        <i className="fab fa-google-play"></i> {/* Add google pass count */}
                                                    </span>
                                                </div>
                                                <div className="d-flex">
                                                    <Button
                                                        variant="link"
                                                        className="p-1"
                                                        onClick={() => router.push(`/projects/${plan._id}`)}
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </Button>
                                                    <Button
                                                        variant="link"
                                                        className="p-1"
                                                        onClick={() => router.push(`/projects/${plan._id}/edit`)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}

                            {plans?.length === 0 && (
                                <Col md={12}>
                                    <Card className="text-center p-5">
                                        <Card.Body>
                                            <h3>No Projects Yet</h3>
                                            <p>Create your first project to get started!</p>
                                            <Button
                                                variant="primary"
                                                onClick={() => router.push('/create/plan')}
                                            >
                                                Create Project
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    </div>
                </div>
            </AccountLayout>
        </Layout>
    )
}

export default Plans

export const getServerSideProps = async (context) => {
    const { req } = context

    const user = await onlyAuthUserSSR(req, "plans")
    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        }
    }

    return {
        props: {
            user: user || null,
            plans: user.plans || []
        }
    }
}
