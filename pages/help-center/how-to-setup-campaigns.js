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

const HelpCenterSinglePage = ({ user }) => {
  const articleHeading = "How to Setup a Web Push Campaign"
  const articleDate = "Feb 22 2024"
  const articleCategory = "Campaigns"
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
                    In the navigation menu, click on "Campaigns".
                  </li>
                  <li className="fs-lg">
                    <strong>Create new campaign:</strong> Click the 'Create new
                    campaign' button to get started!
                  </li>
                  <li className="fs-lg">
                    <strong>Campaign Name:</strong> Enter a descriptive campaign
                    name and then click 'Create' to create your campaign.
                  </li>
                </ol>
              </div>
              <div className="mb-5">
                <h3 className="h5 mb-4">Step 2: Campaign Details</h3>
                <ol>
                  <li className="fs-lg">
                    <strong>Target Audience:</strong> Choose the segment of
                    users you want to target from the dropdown which will be
                    populated from your Klaviyo account.
                  </li>
                  <li className="fs-lg">
                    <strong>Message content:</strong>
                    <ul>
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
                        <strong>Icon (optional):</strong> Upload an icon you
                        want to use for your campaign. The fallback image will
                        be the icon tha comes from your account.
                      </li>
                      <li className="fs-lg">
                        <strong>Image (optional):</strong> Provide an eye
                        catching image for your campaign that displays depending
                        on your browser and device type.
                      </li>
                    </ul>
                  </li>
                  <li className="fs-lg">
                    <strong>Send Schedule:</strong> Select the date and time you
                    want the campaign to be sent.
                    <ul>
                      <li className="fs-lg">
                        <strong>Send now:</strong> Send the campaign immediately
                        when published.
                      </li>
                      <li className="fs-lg">
                        <strong>Scheduled:</strong> Choose a specific date and
                        time for the campaign to be sent once published.
                      </li>
                    </ul>
                  </li>
                  <li className="fs-lg">
                    <strong>Publish:</strong> Publish, Save as Draft or Delete
                    options
                    <ul>
                      <li className="fs-lg">
                        <strong>Publish:</strong> Publish the campaign to send
                        to your audience.
                      </li>
                      <li className="fs-lg">
                        <strong>Save as Draft:</strong> Save the campaign as a
                        draft to continue making edits and send later.
                      </li>
                      <li className="fs-lg">
                        <strong>Delete:</strong> Completely delete the campaign.
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>
              <div className="text-center mb-5">
                <img
                  src="/images/help-center/kaypush-create-campaign.png"
                  style={{ width: "300px" }}
                  className="m-auto"
                />
              </div>
              <div className="mb-5">
                <h3 className="h5 mb-4">Step 3: Monitor your Campaign</h3>
                <ol>
                  <li className="fs-lg">
                    If your campaign has not been sent you can still edit the
                    campaign details and schedule by clicking the campaign name
                    in the table on the 'Campaigns' section.
                  </li>
                  <li className="fs-lg">
                    Once you have published your campaign you can view the
                    performance in the 'Campaigns' or 'Dashboard' section.
                  </li>
                </ol>
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
