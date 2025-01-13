import { useEffect, useState } from "react"
import { getPostBySlug, getAllPostSlugs } from "../../data/posts"
import KpushLayout from "../../components/kpush/layout/KpushLayout"
import Link from "next/link"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Breadcrumb from "react-bootstrap/Breadcrumb"
import Button from "react-bootstrap/Button"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
import ImageLoader from "../../components/library/ImageLoader"
import "lightgallery/css/lightgallery.css"
import "lightgallery/css/lg-video.css"
import "swiper/css"
import "swiper/css/navigation"
import { onlyAuthUserSSR } from "services/server-library"

const BlogSinglePage = ({ user }) => {
  const postTitle = "Best Practice and Tips for Web Push"
  const postImage = "/images/blog/checklist.png"
  const postCategory = "Category"
  const postDate = "2024-01-01"

  const [readingTime, setReadingTime] = useState(0)

  // Add extra class to body
  useEffect(() => {
    const body = document.querySelector("body")
    document.body.classList.add("fixed-bottom-btn")
    return () => body.classList.remove("fixed-bottom-btn")
  })

  // // Calculate the estimated reading time
  useEffect(() => {
    const articleText = document.querySelector(".blog-content").textContent
    const wordsArray = articleText.trim().split(/\s+/)
    const wordCount = wordsArray.length
    const wordsPerMinute = 200
    const time = Math.ceil(wordCount / wordsPerMinute)
    setReadingTime(time)
  }, [])

  return (
    <KpushLayout pageTitle="Blog" activeNav="Blog" user={user}>
      {/* Page content */}
      <Container as="section" className="mt-5 py-5">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-3 pt-md-3">
          <Breadcrumb.Item linkAs={Link} href="/">
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} href="/blog">
            Blog
          </Breadcrumb.Item>
          <Breadcrumb.Item active className="fw-bold">
            {postTitle}
          </Breadcrumb.Item>
        </Breadcrumb>

        <Row className="mt-4 pt-3">
          <Col md={{ span: 8, offset: 2 }} xs={12} lg={8}>
            <div className="blog-header">
              <h1 className="h2 pb-3">{postTitle}</h1>

              <div className="mb-4">
                <ImageLoader
                  src={postImage}
                  width={1296}
                  height={600}
                  alt="Hero image"
                  light="true"
                  className="rounded-3"
                />
              </div>
              <div className="d-flex flex-wrap border-bottom pb-3 mb-4">
                <Link
                  href="#"
                  className="text-uppercase text-decoration-none border-end pe-3 me-3 mb-2"
                >
                  {postCategory}
                </Link>
                <div className="d-flex align-items-center border-end pe-3 me-3 mb-2">
                  <i className="fi-calendar-alt opacity-70 me-2"></i>
                  <span>{postDate}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i className="fi-clock opacity-70 me-2"></i>
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>

            <div className="blog-content fs-lg">
              <section className="mb-5">
                <h3 className="mb-4">Best Practices for Push Campaigns</h3>
                <h4 className="h5">1. Plan and Schedule</h4>
                <p>
                  Plan your push campaigns around key dates and events in your
                  marketing calendar. Schedule them at optimal times when your
                  audience is most active.
                </p>
                <h4 className="h5">2. Craft Compelling Messages</h4>
                <p>
                  Ensure your notifications are concise, clear, and compelling.
                  Use strong CTAs to drive the desired action.
                </p>
                <h4 className="h5">3. Segment Your Audience</h4>
                <p>
                  While push campaigns are not triggered by actions, you can
                  still segment your audience to ensure the messages are
                  relevant. For example, you can send different promotions to
                  different user segments based on their preferences or past
                  behaviors.
                </p>
                <h4 className="h5">4. Frequency and Timing</h4>
                <p>
                  Avoid overwhelming users with too many notifications. Find a
                  balance in frequency and ensure you are sending messages at
                  times when users are most likely to engage.
                </p>
                <h4 className="h5">5. Monitor and Analyze Performance</h4>
                <p>
                  Track the performance of your push campaigns, including open
                  rates, click-through rates, and conversions. Use this data to
                  refine your strategy and improve future campaigns.
                </p>
              </section>
              <section className="mb-5">
                <h3 className="mb-4">Best Practices for Push Campaigns</h3>
                <h4 className="h5">1. Promotional Blasts</h4>
                <ul>
                  <li>
                    <strong>Seasonal Sales:</strong> Announce major sales events
                    like Black Friday, Cyber Monday, or holiday discounts.
                  </li>
                  <li>
                    <strong>Flash Sales:</strong> Promote short-term flash sales
                    to create urgency and drive immediate purchases.
                  </li>
                </ul>
                <h4 className="h5">2. Product Launch Announcements</h4>
                <ul>
                  <li>
                    <strong>New Arrivals:</strong> Inform customers about the
                    launch of new products or collections.
                  </li>
                  <li>
                    <strong>Exclusive Previews:</strong> Offer sneak peeks or
                    early access to new products for loyal customers or
                    subscribers.
                  </li>
                </ul>
                <h4 className="h5">3. Event Announcements</h4>
                <ul>
                  <li>
                    <strong>Webinars and Live Streams:</strong> Notify users
                    about upcoming webinars, live streams, or virtual events.
                  </li>
                  <li>
                    <strong>In-Store Events:</strong> For brands with physical
                    locations, promote in-store events, product demonstrations,
                    or special appearances.
                  </li>
                </ul>
                <h4 className="h5">4. Content Updates</h4>
                <ul>
                  <li>
                    <strong>Blog Posts and Articles:</strong> Share updates when
                    new blog posts or articles are published, driving traffic to
                    your content.
                  </li>
                  <li>
                    <strong>Videos and Tutorials:</strong> Notify users about
                    new videos, tutorials, or other multimedia content.
                  </li>
                </ul>
                <h4 className="h5">5. Special Campaigns</h4>
                <ul>
                  <li>
                    <strong>Anniversary Celebrations:</strong> Celebrate company
                    milestones or anniversaries with special offers or
                    discounts.
                  </li>
                  <li>
                    <strong>Customer Appreciation:</strong> Run campaigns that
                    thank customers for their loyalty, perhaps with a discount
                    code or special offer.
                  </li>
                </ul>
              </section>
              <section className="mb-5">
                <h3 className="mb-4">Example Push Campaign Strategy</h3>
                <h4 className="h5">1. Monthly Promotional Blast</h4>
                <ul>
                  <li>
                    <strong>First Monday of Each Month:</strong> Announce new
                    monthly promotions or discounts.
                  </li>
                </ul>
                <h4 className="h5">2. Seasonal Sales</h4>
                <ul>
                  <li>
                    <strong>Black Friday/Cyber Monday:</strong> Schedule
                    multiple notifications leading up to and during the sales
                    events.
                  </li>
                  <li>
                    <strong>Holiday Promotions:</strong> Plan a series of
                    notifications for holiday sales, starting a few weeks in
                    advance.
                  </li>
                </ul>
                <h4 className="h5">3. New Product Launches</h4>
                <ul>
                  <li>
                    <strong>Bi-Weekly Updates:</strong> Notify users of new
                    products or restocks every two weeks.
                  </li>
                  <li>
                    <strong>In-Store Events:</strong> For brands with physical
                    locations, promote in-store events, product demonstrations,
                    or special appearances.
                  </li>
                </ul>
                <h4 className="h5">4. Content Updates</h4>
                <ul>
                  <li>
                    <strong>Weekly Content Push:</strong> Share new blog posts
                    or videos every Friday.
                  </li>
                </ul>
                <h4 className="h5">5. Event Announcements</h4>
                <ul>
                  <li>
                    <strong>Monthly Webinar Announcements:</strong> Notify users
                    about upcoming webinars or live streams at the beginning of
                    each month.
                  </li>
                </ul>
              </section>
            </div>
          </Col>
        </Row>
      </Container>
    </KpushLayout>
  )
}

export default BlogSinglePage

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
