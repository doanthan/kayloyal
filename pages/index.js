import Layout from "components/layout/Layout"
import Container from "react-bootstrap/Container"
import { Col, Row, Image, InputGroup } from "react-bootstrap"
import IconBox from "../components/library/IconBox"
import Link from "next/link"
import BlogCard from "../components/library/BlogCard"
import Button from "react-bootstrap/Button"
import StepCard from "../components/library/StepCard"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import PricingModule from "components/kpush/PricingModule"
import { onlyAuthUserSSR } from "services/server-library"
import { Link as ScrollLink, Element } from 'react-scroll';
import { Typewriter } from 'react-simple-typewriter'
import GKAccordionBox from 'components/khub/Index/AccordionFAQ'

const HomePage = ({ user }) => {
  const features = [
    {
      icon: "fi-users",
      color: "success",
      title: "Manage multiple accounts",
      text: "Easily integrate and manage multiple accounts, making it easier to manage all of your brands web push activities within the same platform.",
    },
    {
      icon: "fi-send",
      color: "accent",
      title: "Loyalty Passes for Klaviyo",
      text: "Create and personalise email campaigns for multiple accounts from one portal using sheets and mergefields.",
    },
    {
      icon: "fi-route",
      color: "warning",
      title: "Tag Based Reporting",
      text: "Report on multiple campaigns from different Klaviyo accounts using Campaign tags to aggregate reporting.",
    },
    {
      icon: "fi-calendar",
      color: "danger",
      title: "Campaign Calendar",
      text: "Use our Campaign Calendar to view which campaigns in which accounts are scheduled, and create connected campaigns.",
    }
  ]
  return (
    <Layout pageTitle="Web Push made easy" user={user}>
      {/* Hero */}
      <section className="py-md-8 py-6 bg-white pt-5"
        style={{
          backgroundImage: "url('/images/index/mentor-glow.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain'
        }}
      >
        <Container className="py-lg-6 pt-5">
          <Row className="align-items-center gy-4 justify-content-center pt-5">
            <Col xxl={8} xl={8} md={10} className='pt-5'>
              <div className="d-flex flex-column gap-5 text-center">
                <div className="d-flex flex-column gap-2">
                  <h1 className="mb-0 display-2 fw-bold">
                    <span>Digi-Wallets for Klaviyo</span>{' '}
                    <span
                      className="headingTyped text-primary"
                      style={{
                        minHeight: '1.2em',
                        display: 'inline-flex',
                        alignItems: 'flex-start'
                      }}
                    >
                      <Typewriter
                        words={['Loyalty Programs', 'Store Tracking', 'Push Notifications', 'Marketing Agencies']}
                        loop
                        cursor
                        cursorStyle='|'
                        typeSpeed={50}
                        deleteSpeed={50}
                        delaySpeed={1000}
                      />
                    </span>
                  </h1>
                </div>
                <Col className="d-flex justify-content-center">
                  <Button href="/blog" variant="outline-primary">
                    Sign up for Trial Account
                  </Button>
                </Col>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* What do we do? */}
      <section className="position-relative bg-white rounded-xxl-4 my-5 pb-5 zindex-5">
        <Container>

          <Row
            xs={1}
            sm={2}
            md={3}
            lg={4}
            className="g-4 justify-content-center"
          >
            {features.map((feature, indx) => (
              <Col key={indx}>
                <IconBox
                  type="card-shadow"
                  media={feature.icon}
                  mediaShape="circle"
                  mediaColor={feature.color}
                  title={feature.title}
                  titleSize="5" // from 1 to 6, where 1 is h1 and 6 is h6
                  text={feature.text}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>





      {/* Pricing */}
      <Element className="bg-white py-5">
        <Container as="section" className="py-5">
          <Row>
            <Col sm={12} md={{ span: 6, offset: 3 }}>
              <h2 className="text-center text-info mb-5">How much is it?</h2>
            </Col>
          </Row>
          <PricingModule />
        </Container>
      </Element>

      {/* <Container as="section" className="py-5 my-5">
        <Row>
          <Col>
            <h2 className="text-center mb-5">Frequently Asked Questions</h2>
          </Col>
        </Row>
        <Row>
          <Col md={{ offset: 2, span: 8 }} xs={12}>
            <GKAccordionBox accordionItems={test} itemClass="px-0" />

          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <Button href="/help-center" variant="outline-primary">
              Visit the Help Center
            </Button>
          </Col>
        </Row>
      </Container> */}
    </Layout>
  )
}

export default HomePage

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
