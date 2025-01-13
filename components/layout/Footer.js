import Link from "next/link"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Nav from "react-bootstrap/Nav"

const Footer = () => {
    return (
        <footer className="footer bg-info border-top border-light">
            <Container className="py-5">
                <Row>
                    <Col className="d-flex justify-content-start">
                        <div className="about">
                            {/* About links */}
                            <h4 className="h5 text-light">Quick Links</h4>
                            <Nav className="flex-column">
                                <Nav.Item className="mb-2">
                                    <Nav.Link
                                        as={Link}
                                        href="/about"
                                        active={false}
                                        className="p-0 fw-normal text-light"
                                    >
                                        About us
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="mb-2">
                                    <Nav.Link
                                        as={Link}
                                        href="/contact"
                                        active={false}
                                        className="p-0 fw-normal text-light"
                                    >
                                        Contact
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        {/* Logo + contacts */}
                        <div className="contact">
                            <Nav className="flex-column">
                                <Nav.Item className="mb-2">
                                    <Nav.Link href="/" active={false} className="p-0 mb-3">
                                        <h3 className="d-inline text-light">kayloyal</h3>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="mb-2">
                                    <Nav.Link
                                        href="mailto:example@email.com"
                                        active={false}
                                        className="p-0 fw-normal text-light"
                                    >
                                        <i className="fi-mail me-2 align-middle opacity-70"></i>
                                        info@kaytools.com
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>
                    </Col>
                </Row>

                {/* Copyright */}
                <div className="text-center text-light">
                    <p>&copy; kayloyal {new Date().getFullYear()}</p>
                </div>
            </Container>
        </footer>
    )
}

export default Footer
