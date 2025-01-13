import { useEffect, useState } from "react"
import KpushLayout from "components/kpush/layout/KpushLayout"
import KpushAccountLayout from "components/kpush/layout/KpushAccountLayout"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import FormControl from "react-bootstrap/FormControl"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import ImageLoader from "../../components/library/ImageLoader"
import { useAuth } from "services/AuthProvider"
import { getConfigToken } from "services/library"
import axios from "axios"
import { Spinner } from "react-bootstrap"
import { onlyAuthUserSSR } from "services/server-library"
import TagCreate from "components/khub/Select/TagCreate"

const KpushCampaignsNew = ({ user }) => {
  const [campaignName, setCampaignName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState([])

  useEffect(() => {
    if (tags.length > 0) {
      // Update only the first element and keep the rest of the array unchanged
      setTags([{ value: `khub-${campaignName}`, label: `khub-${campaignName}`, isFixed: true }, ...tags.slice(1)]);
    } else {
      // If there are no tags, initialize the array with the new tag
      setTags([{ value: `khub-${campaignName}`, label: `khub-${campaignName}`, isFixed: true }]);
    }
  }, [campaignName]);

  const onHandleAddTag = (newTags) => {
    setTags([tags[0], ...newTags.slice(1)])
    console.log(tags)
  }

  const onSubmit = async () => {
    setIsLoading(true)
    const payload = {
      name: campaignName, tags: tags.map(tag => tag.value)
    }

    try {
      const url = "/api/campaign"

      const { data } = await axios.post(url, payload, getConfigToken())
      setIsLoading(false)
      if ((data.status = "Success")) {
        window.location.href = `/campaigns/${data._id}/1`
      } else {
        throw new Error("Failed to create campaign")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <KpushLayout pageTitle="Campaigns" activeNav="Dashboard" user={user}>
      <KpushAccountLayout accountPageTitle="Campaigns">
        <div className="campaign-name mb-4">
          <Row>
            <Col md={9} className="d-flex align-items-center mb-3">
              <h2 className="h3 my-0 me-3">Campaigns</h2>
            </Col>
            <Col>
              <Button
                variant="outline-secondary"
                size="sm"
                href="/campaigns"
                className="float-end"
              >
                <i className="fi-arrow-back me-2"></i>
                Back to Campaigns
              </Button>
            </Col>
          </Row>
        </div>

        {/* Campaign Content */}
        <section
          id="campaign-content"
          className="card card-body border-0 shadow-sm p-4 mb-4"
        >
          <h4 className="mb-4">
            <i className="fi-edit text-primary fs-5 mt-n1 me-2"></i>
            Create new campaign
          </h4>
          <Row>
            <Col md={7} className="pe-xl-4 mb-5">
              <Form.Group id="ab-description" className="mb-4">
                <Form.Label className="fw-semibold" htmlFor="campaign-name">
                  Campaign name
                </Form.Label>
                <FormControl
                  type="text"
                  id="campaign-name"
                  minLength={20}
                  maxLength={128}
                  value={campaignName}
                  placeholder="Your Campaign name"
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </Form.Group>
              <Form.Group id="ab-description" className="mb-4">
                <Form.Label className="fw-semibold" htmlFor="campaign-name">
                  Campaign Tags
                </Form.Label>
                <TagCreate tags={tags} initialValue={tags} handleTagSelection={onHandleAddTag} />
              </Form.Group>
            </Col>
            <Col>
              <ImageLoader
                src="/images/job-board/illustrations/reviews.svg"
                width={416}
                height={300}
                alt="Illustration"
                className="v-center"
              />
            </Col>
          </Row>
        </section>

        {/* Action buttons */}
        <div className="action-buttons float-end">
          <Button variant="outline-secondary me-2" href="/campaigns">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={!campaignName.trim()} // Disable button if campaignName is empty or only whitespace
          >
            {isLoading ? (
              <Spinner animation="border" role="status">
                <span className="sr-only"></span>
              </Spinner>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </KpushAccountLayout>
    </KpushLayout>
  )
}

export default KpushCampaignsNew

//All private pages should use this
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
        user: user || null, // Ensure user is null if not authenticated
      },
    }
  }
}
