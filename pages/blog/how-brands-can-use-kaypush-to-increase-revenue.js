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
  const postTitle =
    "How E-commerce Brands Can Use KayPush Notifications to Increase Revenue"
  const postImage = "/images/blog/revenue.png"
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
              <h4>
                Boosting E-commerce Marketing Strategies with Web Push, Email,
                and SMS
              </h4>
              <p>
                In the highly competitive e-commerce landscape, brands need a
                multi-channel approach to effectively engage customers and drive
                sales. While email and SMS campaigns are longstanding staples,
                integrating web push notifications can elevate your marketing
                strategy, providing a seamless, real-time communication channel
                that enhances customer engagement and increases ROI. This
                article explores how e-commerce brands can implement web push
                notifications alongside email and SMS, with examples of
                automated flows like abandoned cart recovery, browse
                abandonment, and back-in-stock alerts, and the associated
                benefits, statistics, and ROI estimates.
              </p>

              <h4 class="fw-bold">
                Benefits of Integrating Web Push Notifications
              </h4>
              <ol>
                <li>
                  Higher Engagement Rates:
                  <ul>
                    <li>
                      Web Push Notifications: 4% to 8% click-through rate (CTR)
                    </li>
                    <li>
                      Web Push Notifications: 4% to 8% click-through rate (CTR)
                    </li>
                  </ul>
                </li>
                <li>
                  Immediate Reach and Real-Time Communication:
                  <ul>
                    <li>
                      90% of web push notifications are seen within the first
                      few minutes of delivery.
                    </li>
                  </ul>
                </li>
                <li>
                  Higher Opt-In Rates:
                  <ul>
                    <li>Web push notifications: 5% to 10% opt-in rate</li>
                    <li>Email subscriptions: 1% to 3% opt-in rate</li>
                  </ul>
                </li>
                <li>
                  Enhanced Personalization and Targeting:
                  <ul>
                    <li>
                      Personalized web push notifications can increase
                      conversion rates by up to 30%.
                    </li>
                  </ul>
                </li>
                <li>
                  Cost-Effective and Easy to Implement:
                  <ul>
                    <li>
                      Lower cost per engagement compared to email and SMS
                      marketing.
                    </li>
                  </ul>
                </li>
              </ol>

              <h4>Example Flow Automations</h4>
              <h5>1. Abandoned Cart Recovery</h5>
              <p>
                Abandoned carts are a significant issue in e-commerce, with
                approximately 69.57% of shopping carts being abandoned . A
                multi-channel recovery strategy can help recover these lost
                sales.
              </p>
              <p class="fw-bold">Flow Automation:</p>
              <ul>
                <li>
                  Step 1: Email reminder 30 minutes after cart abandonment.
                  <ul>
                    <li>
                      Subject: "Don't Forget Your Items! Complete Your Purchase
                      Now"
                    </li>
                    <li>
                      Body: Highlight the items left in the cart with a clear
                      call-to-action (CTA).
                    </li>
                  </ul>
                </li>
                <li>
                  Step 2: Web push notification 1 hour after abandonment.
                  <ul>
                    <li>
                      Message: "You left something in your cart! Complete your
                      purchase now."
                    </li>
                    <li>CTA: Direct link to the cart.</li>
                  </ul>
                </li>
                <li>
                  Step 3: SMS reminder 24 hours after abandonment.
                  <ul>
                    <li>
                      Message: "Hi [Name], you still have items in your cart.
                      Complete your purchase here: [Link]"
                    </li>
                  </ul>
                </li>
              </ul>
              <p class="fw-bold">ROI Estimate:</p>
              <ul>
                <li>
                  Recovery rate for abandoned carts can increase by 10% to 20%
                  using this multi-channel approach.
                </li>
              </ul>
              <h5>2. Browse Abandonment</h5>
              <p>
                Browse abandonment occurs when users leave the site after
                viewing products without adding them to the cart. Web push
                notifications can re-engage these potential customers.
              </p>
              <p class="fw-bold">Flow Automation:</p>
              <ul>
                <li>
                  Step 1: Web push notification 15 minutes after user leaves the
                  site.
                  <ul>
                    <li>
                      Message: "Still thinking about [Product Name]? Check it
                      out now!"
                    </li>
                    <li>CTA: Link to the product page.</li>
                  </ul>
                </li>
                <li>
                  Step 2: Email 1 hour after abandonment.
                  <ul>
                    <li>Subject: "Did You Find What You Were Looking For?"</li>
                    <li>
                      Body: Showcase the browsed products and suggest similar
                      items.
                    </li>
                  </ul>
                </li>
                <li>
                  Step 3: SMS reminder 24 hours later.
                  <ul>
                    <li>
                      Message: "Hi [Name], we noticed you were interested in
                      [Product Name]. Get it here: [Link]"
                    </li>
                  </ul>
                </li>
              </ul>
              <p class="fw-bold">ROI Estimate:</p>
              <ul>
                <li>
                  Conversion rates can increase by up to 15% by addressing
                  browse abandonment through multiple channels.
                </li>
              </ul>
              <h5>3. Back-in-Stock Alerts</h5>
              <p>
                When a popular item is back in stock, notifying interested
                customers promptly can drive immediate sales.
              </p>
              <p class="fw-bold">Flow Automation:</p>
              <ul>
                <li>
                  Step 1: Web push notification as soon as the product is back
                  in stock.
                  <ul>
                    <li>
                      Message: "[Product Name] is back in stock! Grab it before
                      it’s gone."
                    </li>
                    <li>CTA: Direct link to the product page.</li>
                  </ul>
                </li>
                <li>
                  Step 2: Email notification simultaneously.
                  <ul>
                    <li>Subject: "[Product Name] is Back in Stock!"</li>
                    <li>
                      Body: Highlight the product and encourage quick action.
                    </li>
                  </ul>
                </li>
                <li>
                  Step 3: SMS if the product is still in stock after 24 hours.
                  <ul>
                    <li>
                      Message: "Hi [Name], [Product Name] is back in stock. Buy
                      it now: [Link]"
                    </li>
                  </ul>
                </li>
              </ul>
              <p class="fw-bold">ROI Estimate:</p>
              <ul>
                <li>
                  Sales for back-in-stock products can increase by up to 20%
                  with timely notifications.
                </li>
              </ul>

              <p>
                Integrating web push notifications with your email and SMS
                campaigns can significantly enhance your e-commerce marketing
                strategy. The benefits of higher engagement rates, immediate
                reach, higher opt-in rates, enhanced personalization, and
                cost-effectiveness make web push a powerful addition to your
                marketing toolkit. By implementing automated flows for scenarios
                like abandoned cart recovery, browse abandonment, and
                back-in-stock alerts, you can create a comprehensive,
                multi-channel communication strategy that maximizes your
                marketing efforts and boosts ROI. Embrace the power of web push
                notifications to drive your e-commerce success and stay ahead in
                the competitive market.
              </p>
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
