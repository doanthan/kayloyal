import React, { useState, useRef, useEffect } from 'react'
import { Card, Form, Button } from 'react-bootstrap'
import { CheckCircleFill } from 'react-bootstrap-icons'
import { checkValidEmailHtml } from 'services/library'
import PreviewModal from 'components/khub/campaigns/CustomTemplateModal'
import axios from 'axios'
import { getConfigToken } from 'services/library'

function CustomTemplateCard({ account, onSelect, onRemove, onPreview }) {
    const [emailHtml, setEmailHtml] = useState('')
    const [isValidHtml, setIsValidHtml] = useState(false)
    const textareaRef = useRef(null)
    const [showPreview, setShowPreview] = useState(false)
    const [templates, setTemplates] = useState([])
    const [greenTick, setGreenTick] = useState(false)
    const [next, setNext] = useState()
    const [prev, setPrev] = useState()


    const handleEmailHtmlChange = (e) => {
        const html = e.target.value
        setEmailHtml(html)
        const isValid = checkValidEmailHtml(html) && html !== ""
        console.log(isValid)
        setIsValidHtml(isValid)

        if (isValid && html != "") {
            onSelect({
                type: "html",
                html: html,
                klaviyoPublic: account.klaviyoPublic
            })
            setGreenTick(true)
        } else {
            onRemove(account.klaviyoPublic)
            setGreenTick(false)

        }
    }
    const handleChooseTemplate = (templateId, templateLink, templateHtml) => {
        onSelect({
            type: "template",
            templateId: templateId,
            templateLink: templateLink, // Assuming this exists in the account object
            klaviyoPublic: account.klaviyoPublic
        })
        setEmailHtml(templateHtml)
        setGreenTick(true)
    }


    const handleSelectTemplate = async () => {
        const { data } = await axios.get(`/api/templates?account=${account.klaviyoPublic}`, getConfigToken())
        setTemplates(data.data)
        setShowPreview(true)
        // setNext(data.next)
        // setPrev(data.prev)
    }


    return (
        <Card className="mb-3" style={{ height: 'auto' }}>
            <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                    {account.name}
                    <div>
                        {greenTick && <CheckCircleFill className="text-success me-2" />}
                        <Button variant="outline-secondary" size="sm" onClick={() => onPreview(emailHtml)}>
                            Preview
                        </Button>
                    </div>
                </Card.Title>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Button disabled={isValidHtml} variant="primary" onClick={handleSelectTemplate}>
                        Select Template
                    </Button>
                </div>
                <div className="text-center mb-3">
                    <hr className="d-inline-block w-25 align-middle" />
                    <span className="px-2">or</span>
                    <hr className="d-inline-block w-25 align-middle" />
                </div>
                <Form.Group className="mb-3">
                    <Form.Control
                        as="textarea"
                        ref={textareaRef}
                        placeholder="Paste your email HTML here"
                        value={emailHtml}
                        onChange={handleEmailHtmlChange}
                    />
                </Form.Group>
            </Card.Body>
            <PreviewModal
                show={showPreview}
                onHide={() => setShowPreview(false)}
                templates={templates}
                handleChooseTemplate={handleChooseTemplate}
            />
        </Card>
    )
}

export default CustomTemplateCard