import KpushLayout from "../../components/kpush/layout/KpushLayout"
import Link from "next/link"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Breadcrumb from "react-bootstrap/Breadcrumb"
import BlogCard from "../../components/library/BlogCard"
import { posts } from "../../data/posts"
import { onlyAuthUserSSR } from "services/server-library"

const BlogPage = ({ user }) => {
  const truncate = (input) => {
    if (input.length > 100) {
      return input.substring(0, 100) + "..."
    }
    return input
  }
  return (
    <KpushLayout pageTitle="Blog" activeNav="Blog" user={user}>
      {/* Page content */}
      <div className="bg-dark">
        <Container className="pt-5 pb-5 mt-5">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-3 pt-md-3">
            <Breadcrumb.Item linkAs={Link} href="/">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Blog</Breadcrumb.Item>
          </Breadcrumb>

          {/* Page title */}
          <h1 className="text-light mb-4">Blog Articles</h1>

          {/* Sorting, filters and search */}
          {/* <div className="d-lg-flex pt-1 pb-4 mb-3">
            <div className="d-flex mb-3 mb-lg-0 pe-lg-2">
              <Form.Group
                controlId="sort-by"
                className="d-flex flex-md-row flex-column align-items-md-center flex-grow-1 border-end-md border-light pe-md-4 me-md-4"
              >
                <Form.Label className="d-inline-block text-light me-sm-2 mb-md-0 mb-2 text-nowrap">
                  <i className="fi-arrows-sort mt-n1 me-2 align-middle opacity-70"></i>
                  Sort by:
                </Form.Label>
                <Form.Select className="form-select-light me-md-2">
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Popular</option>
                  <option>Sponsored</option>
                </Form.Select>
              </Form.Group>
              <Form.Group
                controlId="categories"
                className="d-flex flex-md-row flex-column align-items-md-center flex-grow-1 border-end-lg border-light ps-3 ps-md-2 pe-lg-4 me-lg-4"
              >
                <Form.Label className="d-inline-block text-light me-sm-2 mb-md-0 mb-2 text-nowrap">
                  <i className="fi-align-left mt-n1 me-2 align-middle opacity-70"></i>
                  Category:
                </Form.Label>
                <Form.Select className="form-select-light me-md-2">
                  <option>All</option>
                  <option>Reviews</option>
                  <option>Tips &amp; Advice</option>
                  <option>Automotive News</option>
                  <option>Travel</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="position-relative flex-grow-1">
              <Form.Control
                className="form-control-light"
                placeholder="Search articles by keywords..."
              />
              <i className="fi-search position-absolute top-50 end-0 translate-middle-y text-light opacity-70 me-3"></i>
            </div>
          </div> */}

          {/* Featured article */}
          {/* <Row as="article" className="pb-2 pb-md-1 mb-4 mb-md-5">
            <Col xs={12} md={7} lg={8} className="mb-3 mb-md-0">
              <Link
                href="/job-board/blog-single"
                className="d-block position-relative"
              >
                <Badge
                  bg="info"
                  className="badge bg-info position-absolute zindex-5 top-0 end-0 m-3 fs-sm"
                >
                  New
                </Badge>
                <ImageLoader
                  src="/images/car-finder/blog/01.jpg"
                  width={856}
                  height={400}
                  alt="Hero image"
                  light="true"
                  className="rounded-3"
                />
              </Link>
            </Col>
            <Col xs={12} md={5} lg={4}>
              <a className="fs-sm text-uppercase text-decoration-none" href="#">
                Tips &amp; Advice
              </a>
              <h2 className="h5 text-light pt-1">
                <Link href="/job-board/blog-single" className="nav-link">
                  10 Best Electric Bikes from Automotive Manufacturers for a
                  Long Trip
                </Link>
              </h2>
              <p className="d-md-none d-xl-block text-light opacity-70 mb-4">
                Nulla felis neque ultrices ut aliquam. Pellentesque id semper
                iaculis scelerisque etiam egestas interdum proin sit. Ornare
                venenatis, ullamcorper amet arcu ipsum ut morbi enim. Senectus
                quam egestas facilisi enim diam posuere ultricies interdum sed.
                Amet, risus eros cursus vitae, sit?
              </p>
              <a
                href="#"
                className="d-flex align-items-center text-decoration-none"
              >
                <Avatar
                  img={{ src: "/images/avatars/06.jpg", alt: "Kristin Watson" }}
                  size={[48, 48]}
                />
                <div className="ps-2">
                  <h6 className="fs-base text-light lh-base mb-1">
                    Kristin Watson
                  </h6>
                  <div className="d-flex fs-sm text-light opacity-70">
                    <span className="me-2 pe-1">
                      <i className="fi-calendar-alt opacity-70 mt-n1 me-1"></i>
                      May 13
                    </span>
                    <span>
                      <i className="fi-chat-circle opacity-70 mt-n1 me-1"></i>
                      No comments
                    </span>
                  </div>
                </div>
              </a>
            </Col>
          </Row> */}

          {/* Posts (3 columns) */}
          <Row
            xs={1}
            sm={2}
            lg={3}
            className="gx-3 gx-md-4 gy-md-5 gy-4 mb-lg-5 mb-4"
          >
            <Col as="article" className="pb-2 pb-md-1">
              <BlogCard
                href="/blog/benefits-of-web-push-notifications"
                img={{
                  src: "/images/blog/push-notifications.png",
                  size: [900, 400],
                  alt: "Image",
                }}
                category="category"
                title="Benefits of Web Push Notifications"
                author="kaypush"
                date="22 Feb 2024"
                light
              />
            </Col>
            <Col as="article" className="pb-2 pb-md-1">
              <BlogCard
                href="/blog/how-brands-can-use-kaypush-to-increase-revenue"
                img={{
                  src: "/images/blog/revenue.png",
                  size: [900, 400],
                  alt: "Image",
                }}
                category="category"
                title="How E-commerce Brands Can Use KayPush Notifications to Increase Revenue"
                author="kaypush"
                date="22 Feb 2024"
                light
              />
            </Col>
            <Col as="article" className="pb-2 pb-md-1">
              <BlogCard
                href="/blog/best-practice-and-tips-for-web-push"
                img={{
                  src: "/images/blog/checklist.png",
                  size: [900, 400],
                  alt: "Image",
                }}
                category="category"
                title="Best Practice and Tips for Web Push"
                author="kaypush"
                date="22 Feb 2024"
                light
              />
            </Col>
          </Row>

          {/* Pagination */}
          {/* <nav
            className="pagination-light border-top border-light pt-4"
            aria-label="Blog pagination"
          >
            <Pagination className="mb-4 mb-sm-0">
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Ellipsis />
              <Pagination.Item>{8}</Pagination.Item>
              <Pagination.Item>
                <i className="fi-chevron-right"></i>
              </Pagination.Item>
            </Pagination>
          </nav> */}
        </Container>
      </div>
    </KpushLayout>
  )
}

export default BlogPage

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
