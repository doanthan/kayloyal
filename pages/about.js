import Layout from "components/layout/Layout"
import { Container, Row, Col, Card } from "react-bootstrap"
import { Award, Globe2, Lightning, People } from 'react-bootstrap-icons'

export default function About() {
    return (
        <Layout pageTitle="About Kayloyal - Mobile Loyalty Platform">
            {/* Hero Section */}
            <section className="bg-light py-5">
                <Container>
                    <Row className="align-items-center pt-5">
                        <Col lg={6}>
                            <h1 className="display-4 fw-bold mb-4">
                                Bridging Klaviyo and Mobile Wallets
                            </h1>
                            <p className="lead mb-4">
                                Kayloyal transforms your Klaviyo customer data into engaging mobile wallet experiences.
                                We help retailers create meaningful connections with their customers through digital loyalty cards.
                            </p>
                        </Col>
                        <Col lg={6}>
                            <img
                                src="/images/about-hero.png"
                                alt="Kayloyal Platform"
                                className="img-fluid rounded shadow-lg"
                            />
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Mission Section */}
            <section className="py-5">
                <Container>
                    <Row className="justify-content-center text-center mb-5">
                        <Col lg={8}>
                            <h2 className="fw-bold mb-4">Our Mission</h2>
                            <p className="lead">
                                To empower retailers with seamless mobile loyalty solutions that
                                enhance customer engagement and drive business growth through
                                the power of Klaviyo integration.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Features Section */}
            <section className="bg-light py-5">
                <Container>
                    <h2 className="text-center fw-bold mb-5">Why Choose Kayloyal</h2>
                    <Row>
                        <Col md={3}>
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body className="text-center p-4">
                                    <Lightning className="text-primary mb-3" size={40} />
                                    <h5 className="fw-bold">Instant Integration</h5>
                                    <p>Seamlessly connect with your existing Klaviyo setup</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body className="text-center p-4">
                                    <Globe2 className="text-primary mb-3" size={40} />
                                    <h5 className="fw-bold">Global Reach</h5>
                                    <p>Support for both Apple and Google Wallet platforms</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body className="text-center p-4">
                                    <Award className="text-primary mb-3" size={40} />
                                    <h5 className="fw-bold">Loyalty First</h5>
                                    <p>Specialized in creating engaging loyalty experiences</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body className="text-center p-4">
                                    <People className="text-primary mb-3" size={40} />
                                    <h5 className="fw-bold">Customer Focus</h5>
                                    <p>Drive engagement with personalized experiences</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Team/Company Section */}
            <section className="py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <h2 className="fw-bold mb-4">Built for Retailers</h2>
                            <p className="mb-4">
                                As retailers ourselves, we understand the challenges of
                                maintaining customer engagement in a digital world. Kayloyal
                                was born from the need to bridge the gap between Klaviyo's
                                powerful email marketing and the convenience of mobile wallets.
                            </p>
                            <p>
                                Our platform helps retailers of all sizes create and manage
                                digital loyalty cards that integrate seamlessly with their
                                existing Klaviyo workflows, making loyalty programs more
                                accessible and engaging than ever.
                            </p>
                        </Col>
                        <Col lg={6}>
                            <img
                                src="/images/team.png"
                                alt="Kayloyal Team"
                                className="img-fluid rounded shadow-lg"
                            />
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-white py-5">
                <Container className="text-center">
                    <h2 className="fw-bold mb-4">Ready to Transform Your Loyalty Program?</h2>
                    <p className="lead mb-4">
                        Join retailers who are revolutionizing their customer engagement
                        with Kayloyal's mobile wallet integration.
                    </p>
                    <button className="btn btn-light btn-lg">
                        Get Started Today
                    </button>
                </Container>
            </section>
        </Layout>
    )
}
