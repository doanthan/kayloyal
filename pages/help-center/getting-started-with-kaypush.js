import { useEffect, useState } from "react"
import Link from "next/link"
import KpushLayout from "../../components/kpush/layout/KpushLayout"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Breadcrumb from "react-bootstrap/Breadcrumb"
import Nav from "react-bootstrap/Nav"
import { Badge } from "react-bootstrap"
import { onlyAuthUserSSR } from "services/server-library"
import Alert from "react-bootstrap/Alert"

const HelpCenterSinglePage = ({ user }) => {
  const articleHeading = "Getting Started with KayPush"
  const articleDate = "Feb 22 2024"
  const articleCategory = "Account"
  const [readingTime, setReadingTime] = useState(0)

  // // Calculate the estimated reading time
  useEffect(() => {
    const articleText = document.querySelector(".article-content").textContent
    const wordsArray = articleText.trim().split(/\s+/)
    const wordCount = wordsArray.length
    const wordsPerMinute = 200
    const time = Math.ceil(wordCount / wordsPerMinute)
    setReadingTime(time)
  }, [])

  // Article links array
  const articles = [
    ["#", "First question heading in the section"],
    ["#", "Massa fermentum, eget nec elementum"],
    ["#", "Eros, dolor in consequat netus?"],
    ["#", "Eu quam bibendum adipiscing leo?"],
    ["#", "In quis pulvinar amet morbi praesent"],
    ["#", "Pellentesque ante quisque sit"],
  ]

  return (
    <KpushLayout pageTitle="Help Center" activeNav="Help Center" user={user}>
      {/* Page content */}
      <Container as="section" className="my-5 pt-lg-5 pt-4 pb-lg-4">
        {/* Breadcrumb */}
        <Breadcrumb className="pt-3">
          <Breadcrumb.Item linkAs={Link} href="/">
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} href="/help-center">
            Help center
          </Breadcrumb.Item>
          <Breadcrumb.Item active className="fw-bold">
            {articleHeading}
          </Breadcrumb.Item>
        </Breadcrumb>

        <Row className="pt-3 pt-md-4">
          {/* Sidebar (article links) */}
          {/* <Col
            as="sidebar"
            md={4}
            className="d-md-block d-none position-relative pe-lg-5"
          >
            <div className="border-start sticky-top" style={{ top: "116px" }}>
              <h3 className="h5 mb-2 pb-1 px-4">Sections in this article</h3>
              <Nav as="ul" className="flex-column fs-sm">
                {articles.map((article, indx) => (
                  <Nav.Item as="li" key={indx}>
                    <Nav.Link
                      as={Link}
                      href={article[0]}
                      className="py-1 px-4 fw-normal"
                    >
                      {article[1]}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </div>
          </Col> */}
          <Col md={{ span: 8, offset: 2 }} xs={12} lg={8}>
            <div className="article-header">
              <h2 className="h3 mb-4">{articleHeading}</h2>
              <div className="d-flex flex-wrap border-bottom pb-3 mb-4">
                <div>
                  <Badge className="me-3" bg="primary">
                    {articleCategory}
                  </Badge>
                </div>
                <div className="d-flex align-items-center border-end border-light pe-3 me-3 mb-2">
                  <i className="fi-calendar-alt opacity-70 me-2"></i>
                  <span>{articleDate}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i className="fi-clock opacity-70 me-2"></i>
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
            <div className="article-content">
              <div className="pb-md-4 pb-3">
                <h3 className="h5 mb-4">Sign Up for KayPush</h3>
                <ol>
                  <li className="fs-lg">
                    <strong>Visit the Sign-Up Page:</strong> Open your web
                    browser and navigate to the KayPush sign-up page.
                  </li>
                  <li className="fs-lg">
                    <strong>Enter Your Details:</strong> Fill in your name,
                    email address, and create a password.
                  </li>
                  <li className="fs-lg">
                    <strong>Agree to Terms:</strong> Read and agree to the terms
                    and conditions.
                  </li>
                  <li className="fs-lg">
                    <strong>Complete the Sign-Up:</strong> Click the "Sign Up"
                    button to create your account.
                  </li>
                  <li className="fs-lg">
                    <strong>Verify Your Email:</strong> Check your email for a
                    verification link and click on it to verify your account.
                  </li>
                </ol>
              </div>
              <div className="pb-md-4 pb-3">
                <h3 className="h5 mb-4">Add Your First Account</h3>
                <ol>
                  <li className="fs-lg">
                    <strong>Log In:</strong> Log in to your KayPush account
                    using your email and password.
                  </li>
                  <li className="fs-lg">
                    <strong>Go to Account Settings:</strong> In the navigation
                    menu, click on "Account Settings".
                  </li>
                  <li className="fs-lg">
                    <strong>Add a New Account:</strong> Click the "Add Account"
                    button.
                  </li>
                  <li className="fs-lg">
                    <strong>Provide Account Details:</strong>
                    <ul>
                      <li className="fs-lg">
                        <strong>Site Name:</strong> Enter a name for your
                        account.
                      </li>
                      <li className="fs-lg">
                        <strong>Klaviyo Public API Key:</strong> This can be
                        found in your Klaviyo account settings (instructions
                        below).
                      </li>
                      <li className="fs-lg">
                        <strong>Klaviyo Private API Key:</strong> This can be
                        found in your Klaviyo account settings (instructions
                        below).
                      </li>
                      <li className="fs-lg">
                        <strong>Website URL:</strong> Enter your brands website.
                      </li>
                    </ul>
                  </li>
                  <li className="fs-lg">
                    <strong>Save Account:</strong> Click the "Save" button to
                    add your account.
                  </li>
                </ol>
              </div>
              <div className="text-center mb-5">
                <Alert variant="info" className="d-flex">
                  <i className="fi-alert-circle me-2 me-sm-3 lead"></i>
                  <div>
                    To find your Klaviyo API keys follow Klaviyo's guide here:{" "}
                    <a
                      target="_blank"
                      href="https://help.klaviyo.com/hc/en-us/articles/115005062267"
                    >
                      How to manage your account's API keys
                    </a>
                  </div>
                </Alert>
              </div>
              <div className="text-center mb-5">
                <img
                  src="/images/help-center/kaypush-create-account.png"
                  style={{ width: "400px" }}
                  className="m-auto"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </KpushLayout>
  )
}

export default HelpCenterSinglePage

//All public pages should use this
export const getServerSideProps = async (context) => {
  const { req } = context

  const user = await onlyAuthUserSSR(req)
  return {
    props: {
      user: user || null, // Ensure user is null if not authenticated
    },
  }
}
