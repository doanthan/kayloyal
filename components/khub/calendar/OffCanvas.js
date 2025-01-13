import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TagCreate from "components/khub/Select/TagCreate"
import { DateTime } from 'luxon';
import axios from 'axios';
import { getConfigToken } from 'services/library';



export default function OffCanvas({ showOffcanvas, setShowOffcanvas, selectedDate }) {
    const [campaignName, setCampaignName] = useState('');
    const [draftDate, setDraftDate] = useState(selectedDate);
    const [tags, setTags] = useState([])
    const [campaignNameError, setCampaignNameError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Check if campaign name is empty
        if (!campaignName.trim()) {
            setCampaignNameError('You must provide a campaign name.');
            return; // Stop the form submission
        }
        setCampaignNameError('');
        // Convert draftDate to ISO string format
        const scheduledDate = DateTime.fromJSDate(draftDate).toUTC().toISO();

        const payload = {
            name: campaignName, tags: tags.map(tag => tag.value), scheduledDate: scheduledDate
        }

        try {
            const url = "/api/campaign"

            const { data } = await axios.post(url, payload, getConfigToken())
            if ((data.status = "Success")) {
                window.location.href = `/campaigns/${data._id}/1`
            } else {
                throw new Error("Failed to create campaign")
            }
        } catch (error) {
            console.error("Error submitting form:", error)
        }

        // Handle form submission here
        console.log({ campaignName, draftDate, tags });
        setShowOffcanvas(false);
    };

    useEffect(() => {
        console.log(selectedDate)
        setDraftDate(selectedDate)
        setCampaignName("")
        setTags([])
    }, [selectedDate])

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



    return (
        <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} className='widerOffcanvas' placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Create Email Campaign</Offcanvas.Title>
            </Offcanvas.Header>

            <Form onSubmit={handleSubmit} className="d-flex flex-column h-100">
                <Offcanvas.Body>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Campaign Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            placeholder="Enter campaign name"
                            isInvalid={!!campaignNameError}
                        />
                        <Form.Control.Feedback type="invalid">
                            {campaignNameError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold" >Draft Date</Form.Label>
                        <div style={{ width: '100%' }}>
                            <DatePicker
                                selected={draftDate}
                                onChange={(date) => setDraftDate(date)}
                                customInput={<Form.Control style={{ width: '100%' }} />}
                                dateFormat="MMMM d, yyyy"
                                value={draftDate}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group id="ab-description">
                        <Form.Label className="fw-semibold" htmlFor="campaign-name">
                            Campaign Tags
                        </Form.Label>
                        <TagCreate tags={tags} initialValue={tags} handleTagSelection={onHandleAddTag} />
                    </Form.Group>
                </Offcanvas.Body>
                <div className="mt-auto p-3">
                    <Button variant="outline-primary" type="submit">
                        Continue
                    </Button>
                </div>
            </Form>

        </Offcanvas>
    )
}
