import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Container from "react-bootstrap/Container"
import { Col, Row, Button } from "react-bootstrap"
import Collapse from "react-bootstrap/Collapse"
import CardNav from "components/library/CardNav"
import { useAuth } from "services/AuthProvider"
import { ArrowLeftCircle, ArrowRightCircle } from 'react-bootstrap-icons';


const AccountLayout = ({
    accountPageTitle,
    children,
}) => {
    const auth = useAuth()
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(true);


    const handleLogout = () => {
        auth.logout()
        router.push("/")
    }

    return (
        <div className="account-content pt-5 ">
            <Container fluid style={{ padding: '0 20px' }}>
                <Row className="mx-0">
                    {/* Sidebar (Account nav) */}
                    <Col md={sidebarOpen ? 2 : 'auto'} className="px-0 transition-width">
                        <div className={`card card-body border-0 shadow-sm pb-1 me-lg-1 sidebar ${sidebarOpen ? '' : 'collapsed'}`}
                            style={{
                                width: sidebarOpen ? 'auto' : '60px',  // Set collapsed width to 60px
                                transition: 'width 0.3s ease'  // Smooth transition
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center pb-2">
                                <h5 className={sidebarOpen ? '' : 'd-none'}>Menu</h5>
                                <Button
                                    variant="link"
                                    className="p-0"
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                                >
                                    {sidebarOpen ? <ArrowLeftCircle size={24} /> : <ArrowRightCircle size={24} />}
                                </Button>
                            </div>
                            <Collapse in={sidebarOpen} >
                                <div id="account-menu">
                                    <CardNav className="">
                                        <CardNav.Item
                                            href="/dashboard"
                                            icon="fi-dashboard"
                                            active={accountPageTitle === "Dashboard" ? true : false}
                                        >
                                            Dashboard
                                        </CardNav.Item>
                                        <CardNav.Item
                                            href="/passes"
                                            icon="fi-play-circle"
                                            active={
                                                accountPageTitle === "Passes" ? true : false
                                            }
                                        >
                                            Passes
                                        </CardNav.Item>
                                        <CardNav.Item
                                            href="/calendar"
                                            icon="fi-calendar"
                                            active={accountPageTitle === "Calendar" ? true : false}
                                        >
                                            Notifications
                                        </CardNav.Item>
                                        <CardNav.Item
                                            href="/campaign-report"
                                            icon="fi-send"
                                            active={accountPageTitle === "Campaign Report" ? true : false}
                                        >
                                            Customers
                                        </CardNav.Item>
                                        <CardNav.Item
                                            href="/flow-report"
                                            icon="fi-route"
                                            active={accountPageTitle === "Flow Report" ? true : false}
                                        >
                                            Reports
                                        </CardNav.Item>
                                        <CardNav.Item
                                            href="/account-settings"
                                            icon="fi-settings"
                                            active={accountPageTitle === "Settings" ? true : false}
                                        >
                                            Settings
                                        </CardNav.Item>
                                        <CardNav.Item onClick={handleLogout} icon="fi-logout">
                                            Log Out
                                        </CardNav.Item>
                                    </CardNav>
                                </div>
                            </Collapse>
                        </div>
                    </Col>

                    {/* Page content - adjust the width to take remaining space */}
                    <Col className="px-5">
                        {children}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default AccountLayout
