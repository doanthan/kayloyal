import { useRouter } from "next/router"
import Link from "next/link"
import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Button from "react-bootstrap/Button"
import StickyNavbar from "components/library/StickyNavbar"
import Nav from "react-bootstrap/Nav"
import { useAuth } from "services/AuthProvider"

const Header = (props) => {
    const auth = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        auth.logout()
        router.push("/")
    }

    return (
        <Navbar
            as={StickyNavbar}
            expand="lg"
            className={`fixed-top${props.navbarExtraClass ? ` ${props.navbarExtraClass}` : ""
                } navbar-dark bg-info`}
        >
            <Container>
                <Navbar.Brand as={Link} href="/" className="me-3 me-xl-4">

                    kayloyal
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarNav" className="ms-auto" />

                {/* Display content depending on user auth status  */}
                {props.user ? (
                    <Button onClick={handleLogout} size="md" className="order-lg-3 ms-2">
                        <i className="fi-logout me-2"></i>
                        Log out
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="outline-light d-lg-block order-lg-3"
                            size="md"
                            href="/login"
                            className="me-2"
                        >
                            <i className="fi-user me-2"></i>
                            Log in
                        </Button>
                        <Button
                            as={Link}
                            href="/signup"
                            size="md"
                            className="order-lg-3 ms-2"
                        >
                            <i className="fi-plus me-2"></i>
                            Sign Up {props.user && <span> {props.user.email}</span>}
                        </Button>
                    </>
                )}

                <Navbar.Collapse id="navbarNav" className="order-md-2">
                    <Nav navbarScroll style={{ maxHeight: "35rem" }}>
                        {props.user && (
                            <Nav.Item
                                as={Nav.Link}
                                href="dashboard"
                                active={props.activeNav === "Dashboard"}
                            >
                                Dashboard
                            </Nav.Item>
                        )}
                        <Nav.Item
                            as={Nav.Link}
                            href="/#pricing-section"
                            active={props.activeNav === "pricing"}
                        >
                            Pricing
                        </Nav.Item>
                        <Nav.Item
                            as={Nav.Link}
                            href="/contact"
                            active={props.activeNav === "Contact"}
                        >
                            Contact
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header
