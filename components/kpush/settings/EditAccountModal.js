import React from "react"
import { Button } from "react-bootstrap"
import Form from "react-bootstrap/Form"
import { Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { getConfigToken } from "services/library"
import { useAuth } from "services/AuthProvider"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { Col, Row, Container } from "react-bootstrap"
import ListSegmentSelect from "../ListSegmentSelect"
import MetricSelect from 'components/khub/Select/MetricSelect'
import TagCreate from 'components/khub/Select/TagCreate'


async function fetchAccount(klaviyoPublic) {
  try {
    const response = await axios.get(
      `/api/account?klaviyoPublic=${klaviyoPublic}`,
      getConfigToken()
    )
    const data = await response.data
    return data // This will contain the account data
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error)
  }
}

export default function EditAccountModal({
  showEditModal,
  handleShowEditModal,
  klaviyoPublic,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const [timezones, setTimezones] = useState([])
  const [inclusionAudience, setInclusionAudience] = useState()
  const [exclusionAudience, setExclusionAudience] = useState()
  const [conversionMetric, setConversionMetric] = useState()
  const [accountTags, setAccountTags] = useState()

  const auth = useAuth()
  const { accounts } = auth
  useEffect(() => {
    // Get all IANA time zone names
    setTimezones(Intl.supportedValuesOf("timeZone"))
  }, [])

  useEffect(() => {
    if (showEditModal) {
      fetchAccount(klaviyoPublic).then((data) => {
        if (data && data.account) {
          reset({
            ...data.account,
          })
          setInclusionAudience(data.account.inclusionAudience)
          setExclusionAudience(data.account.exclusionAudience)
          setConversionMetric(data.account.conversionMetric)
          setAccountTags(data.account?.tags?.map(tag => ({ value: tag, label: tag })))
        }
      })
    }
  }, [showEditModal])



  if (!showEditModal) {
    return null
  }



  const saveAccount = async (data) => {
    try {
      setLoading(true)
      data.inclusionAudience = inclusionAudience
      data.exclusionAudience = exclusionAudience
      data.conversionMetric = conversionMetric
      data.tags = accountTags.map(tag => tag.value)

      const response = await axios.patch(
        `/api/account?klaviyoPublic=${klaviyoPublic}`,
        data,
        getConfigToken()
      )
      await auth.updateAccounts(response.data.accounts)
      setLoading(false)
      handleShowEditModal()
      // Optionally handle success (e.g., show a success message, close the modal, etc.)
    } catch (error) {
      setLoading(false)
      console.error("Failed to update account:", error.message)
      // Optionally handle error (e.g., show an error message)
    }
  }

  return (
    <Modal centered show={showEditModal} onHide={handleShowEditModal} size="lg">
      <Modal.Header closeButton className="p-4">
        <Modal.Title>Edit Account</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-3 py-4">
        <Container>
          <Form onSubmit={handleSubmit(saveAccount)}>
            <div className="site-details">
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Account Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Account Name"
                      {...register("name")}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Currency Rate</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Conversion Rate (default 1)"
                      {...register("conversion", {
                        setValueAs: v => v === "" ? 1 : parseFloat(v),
                        required: "Conversion Rate is required",
                      })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Account Tags</Form.Label>
                    <TagCreate createNew={true} handleTagSelection={setAccountTags} initialValue={accountTags} tags={accounts} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Conversion Metric</Form.Label>
                    <MetricSelect klaviyoPublic={klaviyoPublic} onChange={setConversionMetric} initialValue={conversionMetric} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Sender Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Sender Name"
                      {...register("default_sender_name")}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Sender Email</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Sender Email"
                      {...register("default_sender_email")}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Default Lists and Segments</Form.Label>
                    <ListSegmentSelect initialValue={inclusionAudience} klaviyoPublic={klaviyoPublic} onChange={setInclusionAudience} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Exclude Lists and Segments</Form.Label>
                    <ListSegmentSelect initialValue={exclusionAudience} klaviyoPublic={klaviyoPublic} onChange={setExclusionAudience} />
                  </Form.Group>
                </Col>
              </Row>
            </div>
            <div className="klaviyo-details mb-3">
              <Row>
                <Col>
                  <Form.Label className="fw-bold">Timezone</Form.Label>
                  <Form.Select {...register("timezone")} className="w-100">
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Label className="fw-bold">
                    Klaviyo Public Key
                  </Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="id"
                    value={klaviyoPublic}
                    disabled
                  />
                </Col>
              </Row>
            </div>

            <div className="buttons float-end">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Account"}
              </Button>
            </div>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  )
}
