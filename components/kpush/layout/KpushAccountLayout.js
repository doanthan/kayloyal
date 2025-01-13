import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Container from "react-bootstrap/Container"
import { Col, Row, Button } from "react-bootstrap"
import Collapse from "react-bootstrap/Collapse"
import CardNav from "components/library/CardNav"
import AccountSelect from "components/kpush/AccountSelect"
import { useAuth } from "services/AuthProvider"
import axios from "axios"
import { compressData } from "services/library"
import { getConfigToken } from "services/library"
import { ArrowLeftCircle, ArrowRightCircle } from 'react-bootstrap-icons';


const KpushAccountLayout = ({
  accountPageTitle,
  children,
  accountSelectDisabled = false,
}) => {
  const [open, setOpen] = useState(false)
  const auth = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const minutes = new Date(new Date().getTime() - 15 * 60000);

  useEffect(() => {
    const fetchData = async () => {
      const campaignDownloadDate = localStorage.getItem('campaignDownloadDate');

      if (!campaignDownloadDate || new Date(campaignDownloadDate) < minutes) {
        try {
          const response = await axios.get('/api/get-campaign-report', getConfigToken());
          const compressed = compressData(JSON.stringify(response.data.data));

          localStorage.setItem('campaignDownloadDate', new Date().toISOString());
          localStorage.setItem('campaignData', compressed);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const flowDownloadDate = localStorage.getItem('flowDownloadDate');

      if (!flowDownloadDate || new Date(flowDownloadDate) < minutes) {
        try {
          const response = await axios.get('/api/get-flow-report', getConfigToken());
          const compressed = compressData(JSON.stringify(response.data.data));

          localStorage.setItem('flowDownloadDate', new Date().toISOString());
          localStorage.setItem('flowData', compressed);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    auth.logout()
    router.push("/")
  }

  return (
    <div className="account-content pt-5">
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
                      href="/campaigns"
                      icon="fi-play-circle"
                      active={
                        accountPageTitle === "Create Campaign" ? true : false
                      }
                    >
                      Schedule
                    </CardNav.Item>
                    <CardNav.Item
                      href="/calendar"
                      icon="fi-calendar"
                      active={accountPageTitle === "Calendar" ? true : false}
                    >
                      Calendar
                    </CardNav.Item>
                    <CardNav.Item
                      href="/campaign-report"
                      icon="fi-send"
                      active={accountPageTitle === "Campaign Report" ? true : false}
                    >
                      Campaigns Report
                    </CardNav.Item>
                    <CardNav.Item
                      href="/flow-report"
                      icon="fi-route"
                      active={accountPageTitle === "Flow Report" ? true : false}
                    >
                      Flows Report
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
          <Col className="px-0">
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default KpushAccountLayout
