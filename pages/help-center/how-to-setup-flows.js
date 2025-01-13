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
import { Alert } from "react-bootstrap"

const HelpCenterSinglePage = ({ user }) => {
  const articleHeading = "How to Setup Web Push for Flows"
  const articleDate = "Feb 22 2024"
  const articleCategory = "Flows"
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
          <Col lg={{ span: 6, offset: 3 }} sm={12}>
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
              <div className="mb-5">
                <h3 className="h5 mb-4">Step 1: Get Started</h3>
                <ol>
                  <li className="fs-lg">
                    Once logged in, you will be directed to the dashboard.
                  </li>
                  <li className="fs-lg">
                    In the navigation menu, click on "Flows".
                  </li>
                </ol>
              </div>
              <div className="mb-5">
                <h3 className="h5 mb-4">Step 2: Message Content</h3>
                <ol>
                  <li className="fs-lg">
                    <strong>Flow message name:</strong> Create a name for this
                    message. It is recommended to make it describe and relate to
                    the flow it will be sent in.
                  </li>
                  <li className="fs-lg">
                    <strong>Title:</strong> Enter a catchy title for your
                    campaign
                  </li>
                  <li className="fs-lg">
                    <strong>Message:</strong> Write a compelling message for
                    your audience.
                  </li>
                  <li className="fs-lg">
                    <strong>Link:</strong> Provide a URL that users will be
                    directed to when they click on the message.
                  </li>
                  <li className="fs-lg">
                    <strong>Icon (optional):</strong> Upload an icon you want to
                    use for your campaign. The fallback image will be the icon
                    tha comes from your account.
                  </li>
                  <li className="fs-lg">
                    <strong>Image (optional):</strong> Provide an eye catching
                    image for your campaign that displays depending on your
                    browser and device type.
                  </li>
                </ol>
              </div>
              <div className="mb-5">
                <h3 className="h5 mb-4">Step 3: Copy data into your Webhook</h3>
                <Alert variant="info" className="d-flex">
                  <i className="fi-alert-circle me-2 me-sm-3 lead"></i>
                  <div>
                    This guide assumes you have already created a flow and are
                    ready to copy the data into your webhook. For more
                    information about creating webhooks in Klaviyo please refer
                    to this guide:{" "}
                    <a
                      target="_blank"
                      href="https://help.klaviyo.com/hc/en-us/articles/4534329515931"
                    >
                      Understanding webhooks in flows
                    </a>
                  </div>
                </Alert>
                <ol>
                  <li className="fs-lg">
                    Copy the url and add it into the "Destination URL" field
                    within the webhook in your flow.
                  </li>
                  <li className="fs-lg">
                    Copy the JSON data which holds the your push message content
                    that you created above and paste it into the "JSON Body"
                    section of your webhook in your flow.
                  </li>
                </ol>
              </div>
              <div className="text-center mb-5">
                <img
                  src="/images/help-center/kaypush-flow-message.png"
                  style={{ width: "400px" }}
                  className="m-auto"
                />
              </div>
              <div className="pb-md-4 pb-3">
                <h3 className="h5 mb-4">Tips for a Successful Campaign</h3>
                <ul>
                  <li className="fs-lg">
                    <strong>Be Clear and Concise:</strong> Ensure your message
                    is easy to understand and straight to the point.
                  </li>
                  <li className="fs-lg">
                    <strong>Use Engaging Media:</strong> Images and icons can
                    significantly increase engagement.
                  </li>
                  <li className="fs-lg">
                    <strong>Test Before Launching:</strong> Always send a test
                    message to catch any errors or issues.
                  </li>
                  <li className="fs-lg">
                    <strong>Monitor and Adjust:</strong> Use the performance
                    metrics to make data-driven decisions for future campaigns.
                  </li>
                </ul>
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
