import Layout from "components/layout/Layout"
import AccountLayout from "components/layout/AccountLayout"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { Card, Button, Badge } from "react-bootstrap"
import { onlyAuthUserSSR } from "services/server-library"
import { useRouter } from 'next/router'


const Dashboard = ({ user }) => {
  const router = useRouter()

  return (
    <Layout pageTitle="Dashboard" activeNav="Dashboard" user={user}>
      <AccountLayout accountPageTitle="Dashboard">
        <div className="dashboard">
          <div className="dashboard-summary mb-4">
            <Row>
              <Col md={3}>
                <Card className="bg-info bg-gradient-info shadow-sm">
                  <Card.Body>
                    <p className="fw-bold text-white">Number of Customers</p>
                    <Card.Text className="h4 text-white">100</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-info bg-gradient-info mb-3 shadow-sm">
                  <Card.Body>
                    <p className="fw-bold text-white">Notifications Sent</p>
                    <Card.Text className="h4 text-white">100</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-info bg-gradient-info mb-3 shadow-sm">
                  <Card.Body>
                    <p className="fw-bold text-white">Number of Passes</p>
                    <Card.Text className="h4 text-white">100</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="bg-info bg-gradient-info mb-3 shadow-sm">
                  <Card.Body>

                    <p className="fw-bold text-white">Number of Passes</p>
                    <Card.Text className="h4 text-white">100</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0">Loyalty Passes</h2>
              <Button
                variant="outline-primary"
                onClick={() => router.push('/create/pass')}
              >
                Create New Pass
              </Button>            </div>
            <Row>
              {/* Example Pass Card - Repeat this Col for each pass */}
              <Col md={4} className="mb-4">
                <Card>
                  <div className="position-relative" style={{ height: '150px' }}>
                    <Card.Img
                      variant="top"
                      src="https://nftco-production-bx-wallet-pass.s3.us-west-1.amazonaws.com/pass-assets/1efc95d9-eb99-6088-bb55-b7b5217f258a/strip.png"
                      className="position-absolute w-100 h-100"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-center">
                      Pass Name
                      <Badge bg={'light'}>
                        {'Draft'}
                      </Badge>
                    </Card.Title>

                    <div className="mb-3">
                      <div>Issued Passes: 150</div>
                      <div>Active Passes: 120</div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="me-3">
                          <i className="fab fa-apple"></i> 80
                        </span>
                        <span>
                          <i className="fab fa-google-play"></i> 40
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">

                        <div className="d-flex">
                          <Button variant="link" className="p-1">
                            <i className="fas fa-eye"></i>
                          </Button>
                          <Button variant="link" className="p-1">
                            <i className="fas fa-edit"></i>
                          </Button>
                        </div>
                      </div>

                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

      </AccountLayout>
    </Layout>
  )
}
export default Dashboard

export const getServerSideProps = async (context) => {
  const { req } = context

  const user = await onlyAuthUserSSR(req)
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  } else {

    return {
      props: {
        user: user || null,
      },
    }
  }
}
