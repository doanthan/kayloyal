import Link from "next/link"
import KpushLayout from "../../components/kpush/layout/KpushLayout"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Breadcrumb from "react-bootstrap/Breadcrumb"
import FormControl from "react-bootstrap/FormControl"
import Button from "react-bootstrap/Button"
import FormGroup from "../../components/library/FormGroup"
import BlogCard from "../../components/library/BlogCard"
import { onlyAuthUserSSR } from "services/server-library"
import Image from "next/image"

const HelpCenterPage = ({ user }) => {
  return (
    <KpushLayout pageTitle="Help Center" activeNav="Help Center" user={user}>
      {/* Hero (Search form) */}
      <section className="bg-dark py-5">
        <Container className="mb-md-2 mb-lg-4 py-4">
          <Breadcrumb className="pt-3 mb-4">
            <Breadcrumb.Item linkAs={Link} href="/">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Help center</Breadcrumb.Item>
          </Breadcrumb>

          <Row>
            <Col lg={4} sm={12}>
              <h1 className="mb-4 pb-2 text-white">Help is on the way!</h1>
              <h4 className="text-white">
                Check out our step by step guides to get you started and feeling
                confident to start sending and converting today!
              </h4>
              {/* <FormGroup className="rounded-pill">
              <FormControl size="lg" placeholder="What are you looking for?" />
              <Button size="lg" variant="primary rounded-pill px-sm-4 px-3">
                <i className="fi-search me-sm-2"></i>
                <span className="d-sm-inline d-none">Search</span>
              </Button>
            </FormGroup> */}
            </Col>
            <Col lg={8} sm={12}>
              <div className="text-center m-auto">
                <Image
                  src="/images/general/help-support.svg"
                  width={300}
                  height={300}
                  className="m-auto"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Topics */}
      <section
        className="position-relative bg-white rounded-xxl-4 mb-5 py-2 pb-lg-4 zindex-5"
        style={{ marginTop: "-30px" }}
      >
        <Container className="pt-2 pt-md-5">
          <Row
            sm={1}
            md={2}
            lg={3}
            className="gx-3 gx-md-4 gy-md-5 gy-4 mb-lg-5 mb-4"
          >
            <Col as="article" className="pb-2 pb-md-1">
              <BlogCard
                type="card-horizontal"
                href="/help-center/getting-started-with-kaypush"
                img={{
                  src: "/images/job-board/blog/01.jpg",
                  alt: "Image",
                }}
                category={{
                  href: "#",
                  title: "Account",
                }}
                title="Getting started with kaypush"
                text="Learn how to sign up, connect your first account and get started with kaypush."
                author={{
                  href: "",
                  img: "",
                  name: "kaypush",
                }}
                date="Feb 22 2024"
              />
            </Col>
            <Col as="article" className="pb-2 pb-md-1">
              <BlogCard
                type="card-horizontal"
                href="/help-center/how-to-setup-campaigns"
                img={{
                  src: "/images/job-board/blog/02.jpg",
                  alt: "Image",
                }}
                category={{
                  href: "#",
                  title: "Campaigns",
                }}
                title="How to set up a Web Push Campaign"
                text="Learn how to easily create your first Web Push campaign and connect with your customers"
                author={{
                  href: "",
                  img: "",
                  name: "kaypush",
                }}
                date="Feb 22 2024"
              />
            </Col>
            <Col as="article" className="pb-2 pb-md-1">
              <BlogCard
                type="card-horizontal"
                href="/help-center/how-to-setup-flows"
                img={{
                  src: "/images/job-board/blog/04.jpg",
                  alt: "Image",
                }}
                category={{
                  href: "#",
                  title: "Flows",
                }}
                title="How to set up Web Push for Flows"
                text="Learn how to set up Web Push messages and use in automated Flows."
                author={{
                  href: "",
                  img: "",
                  name: "kaypush",
                }}
                date="Feb 22 2024"
              />
            </Col>
          </Row>
        </Container>
      </section>
    </KpushLayout>
  )
}

export default HelpCenterPage

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
