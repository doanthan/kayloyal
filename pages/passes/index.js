import Layout from "components/layout/Layout"
import AccountLayout from "components/layout/AccountLayout"
import connect from "services/db"
import Plan from "models/plan"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { Card, Button, Badge } from "react-bootstrap"
import { onlyAuthUserSSR } from "services/server-library"
import { useRouter } from 'next/router'

const Projects = ({ user, passes }) => {
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
                                        <Card.Text className="h4 text-white">{passes?.length || 0}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="bg-info bg-gradient-info mb-3 shadow-sm">
                                    <Card.Body>
                                        <p className="fw-bold text-white">Active Projects</p>
                                        <Card.Text className="h4 text-white">
                                            {passes?.filter(passes => passes.status === 'active').length || 0}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="bg-info bg-gradient-info mb-3 shadow-sm">
                                    <Card.Body>
                                        <p className="fw-bold text-white">Loyalty Programs</p>
                                        <Card.Text className="h4 text-white">
                                            {passes?.filter(passes => passes.cardType === 'Loyalty Cards').length || 0}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="bg-info bg-gradient-info mb-3 shadow-sm">
                                    <Card.Body>
                                        <p className="fw-bold text-white">One-Time Passes</p>
                                        <Card.Text className="h4 text-white">
                                            {passes?.filter(passes => passes.cardType === 'One-Time Use Cards').length || 0}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="h3 mb-0">Your Plans</h2>
                            <Button
                                variant="outline-primary"
                                onClick={() => router.push('/create/pass')}
                            >
                                Create New Pass
                            </Button>
                        </div>

                        <Row>
                            {passes?.map((pass) => (
                                <Col key={pass._id} md={4} className="mb-4">
                                    <Card>
                                        <div className="position-relative" style={{ height: '150px' }}>
                                            <Card.Img
                                                variant="top"
                                                src={pass.images.logo.google}
                                                className="position-absolute w-100 h-100"
                                                style={{ objectFit: 'cover', objectPosition: 'center' }}
                                                onClick={() => router.push(`/passes/${pass._id}`)}
                                            />
                                        </div>
                                        <Card.Body>
                                            <Card.Title className="d-flex justify-content-between align-items-center">
                                                {pass.businessName}
                                                <Badge bg={pass.status === 'active' ? 'success' : 'secondary'}>
                                                    {pass.status}
                                                </Badge>
                                            </Card.Title>

                                            <div className="mb-3">
                                                <div className="text-muted">{pass.planName}</div>
                                                <div className="small">Type: {pass.cardType}</div>
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
                                                        onClick={() => router.push(`/projects/${pass._id}`)}
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

                            {passes?.length === 0 && (
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

export default Projects

export const getServerSideProps = async (context) => {
    const { req } = context

    const user = await onlyAuthUserSSR(req, "passes")
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
            passes: user.passes || []
        }
    }
}
