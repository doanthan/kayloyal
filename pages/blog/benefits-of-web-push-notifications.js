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
  const postTitle = "Benefits of Web Push Notifications"
  const postImage = "/images/blog/push-notifications.png"
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
              <p>
                In today's fast-paced digital landscape, businesses must
                leverage multiple channels to engage with their audience
                effectively. While email and SMS campaigns remain powerful
                tools, incorporating web push notifications can significantly
                enhance their effectiveness, leading to improved ROI. Web push
                notifications provide a direct, real-time communication channel
                that can complement and amplify the efforts of email and SMS
                marketing. Here’s how web push can enhance these campaigns.
              </p>

              <h4>1. Improved Engagement Rates</h4>
              <p>
                Web push notifications boast higher engagement rates compared to
                traditional email campaigns. On average, web push notifications
                have a click-through rate (CTR) of around 4% to 8%, which is
                significantly higher than the average email CTR of approximately
                2.5% . This increased engagement can drive more traffic to your
                website or landing pages, enhancing the effectiveness of your
                marketing efforts.
              </p>

              <h4>2. Immediate Reach and Real-Time Communication</h4>
              <p>
                One of the standout features of web push notifications is their
                immediacy. Unlike emails, which can sit unread in an inbox, web
                push notifications are delivered instantly to a user’s device,
                grabbing their attention right away. Studies have shown that
                around 90% of web push notifications are seen within the first
                few minutes of delivery . This real-time communication can be
                particularly effective for time-sensitive promotions, flash
                sales, or urgent updates, driving immediate responses and
                conversions.
              </p>
              <h4>3. Higher Opt-In Rates</h4>
              <p>
                Web push notifications often have higher opt-in rates compared
                to email subscriptions. The opt-in process for web push is
                straightforward and non-intrusive, leading to an opt-in rate of
                approximately 5% to 10%, while email opt-in rates tend to hover
                around 1% to 3% . This higher opt-in rate means you can build a
                larger audience more quickly, providing a bigger pool of engaged
                users to target with your campaigns.
              </p>
              <h4>4. Enhanced Personalization and Targeting</h4>
              <p>
                Personalization is key to effective marketing, and web push
                notifications excel in this area. With the ability to segment
                your audience based on their behavior, preferences, and
                demographics, you can send highly targeted messages that
                resonate with individual users. Personalized web push
                notifications have been shown to increase conversion rates by up
                to 30% . This level of personalization can significantly enhance
                the performance of your email and SMS campaigns when used in
                conjunction.
              </p>
              <h4>5. Cost-Effective and Easy to Implement</h4>
              <p>
                Web push notifications are cost-effective, especially when
                compared to the costs associated with email marketing platforms
                or SMS gateways. The cost per engagement is lower, making it an
                attractive option for businesses of all sizes. Additionally,
                implementing web push notifications is straightforward,
                requiring minimal technical expertise. This ease of
                implementation allows businesses to quickly add this powerful
                tool to their marketing arsenal and start seeing results.
              </p>
              <h4>6. Re-engagement and Retargeting Opportunities</h4>
              <p>
                Web push notifications provide an excellent opportunity for
                re-engagement and retargeting. Users who have previously engaged
                with your website can be retargeted with personalized messages,
                encouraging them to return and complete a desired action, such
                as making a purchase or signing up for a newsletter. Retargeted
                web push notifications have been shown to increase conversion
                rates by up to 20% , making them an effective tool for boosting
                ROI.
              </p>
              <h4>Summary:</h4>
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
