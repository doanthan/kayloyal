import { Card, Form, Button, Col } from 'react-bootstrap';
import ListSegmentSelect from "components/kpush/ListSegmentSelect"

const AudienceCard = ({ account, setAudience, updateNameOrEmail }) => {

    const handledChangeListSegment = (value, type) => {
        setAudience(account.klaviyoPublic, value, type)
    }

    return (
        <Col id={account.id} xs='6'>
            <Card className="m-3" >
                <Card.Header>{account.name}</Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formSenderName">
                            <Form.Label>Sender Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter sender name" value={account.default_sender_name} onChange={(e) => updateNameOrEmail(account.klaviyoPublic, "default_sender_name", e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formSenderEmail">
                            <Form.Label>Sender Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter sender email" value={account.default_sender_email} onChange={(e) => updateNameOrEmail(account.klaviyoPublic, "default_sender_email", e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formIncludedAudience">
                            <Form.Label>Included Audience</Form.Label>
                            <ListSegmentSelect initialValue={account.inclusionAudience} klaviyoPublic={account.klaviyoPublic}
                                onChange={(value) => handledChangeListSegment(value, 'inclusion')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formExcludedAudience">
                            <Form.Label>Excluded Audience</Form.Label>
                            <ListSegmentSelect initialValue={account.exclusionAudience} klaviyoPublic={account.klaviyoPublic}
                                onChange={(value) => handledChangeListSegment(value, 'exclusion')}
                            />
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default AudienceCard;