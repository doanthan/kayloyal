import React, { useState } from 'react';
import { Card, ToggleButtonGroup, ToggleButton, Form, Modal, Button, InputGroup } from 'react-bootstrap';
import { planData } from "data/pricing";
import { PlusCircle, DashCircle } from 'react-bootstrap-icons';
import axios from 'axios';
import { getConfigToken } from 'services/library';
import { loadStripe } from "@stripe/stripe-js"
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
function PricingModule() {
  //annual or monthly
  const [billingCycle, setBillingCycle] = useState('annual');
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);


  const getPrice = () => {
    if (billingCycle === 'annual') {
      return 10;
    } else if (billingCycle === 'monthly') {
      return 15;
    } else {
      return 0;  // Default return value if billingCycle is neither 'annual' nor 'monthly'
    }
  };
  const handleOpenCloseModal = () => {
    setShowModal(!showModal);
  };


  const handleCheckout = async () => {
    const stripe = await stripePromise

    // Here you would integrate with Stripe to create a checkout session
    const url = `/api/create-checkout-session`
    const payload = {
      billingCycle,
      quantity
    }

    const { data } = await axios.post(url, payload, getConfigToken())
    await stripe.redirectToCheckout({ sessionId: data.sessionId })

    console.log(data)
    // Stripe logic goes here
  };

  return (
    <div className='text-center '>
      <Form>
        <ToggleButtonGroup type="radio" name="billingCycle" defaultValue={billingCycle}>
          <ToggleButton
            id="tbg-radio-1"
            value="annual"
            variant="outline-primary"
            onChange={() => setBillingCycle('annual')}
          >
            Annual
          </ToggleButton>
          <ToggleButton
            id="tbg-radio-2"
            value="monthly"
            variant="outline-primary"
            onChange={() => setBillingCycle('monthly')}
          >
            Monthly
          </ToggleButton>
        </ToggleButtonGroup>
      </Form>
      <Card className="mt-3 ">
        <Card.Body>

          <div className="d-flex my-auto text-center justify-content-center align-items-end ">
            <h1
              className="text-primary me-2"
              style={{ fontSize: "3.5rem" }}
            >
              {`$${getPrice()}  `}
            </h1>
            <p>per account</p>
          </div>

          <Card.Text >
            {billingCycle === 'annual' ? 'Billed annually ' : 'Billed monthly '}
          </Card.Text>
          <Button variant="outline-primary" onClick={handleOpenCloseModal}>Buy Now</Button>
          <p className='pt-3'> With a Paid account you get:</p>
          {planData[0].features.map((feature, i) => (
            <p
              key={i}
              className={feature.enabled ? "text-dark" : "text-muted"}
            >
              {feature.enabled ? (
                <i className="fi-check-circle text-success me-2 d-inline-block"></i>
              ) : (
                <i className="fi-x-circle text-danger me-2 d-inline-block"></i>
              )}
              {feature.description}
            </p>
          ))}
        </Card.Body>
        <Modal show={showModal} onHide={handleOpenCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Accounts to kayloyal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className='text-center'>
              <Form.Group>
                <div className='text-center pb-3'>
                  <ToggleButtonGroup type="radio" name="billingCycle" value={billingCycle} onChange={val => setBillingCycle(val)}>
                    <ToggleButton
                      id="tbg-radio-1"
                      value="annual"
                      variant="outline-primary"
                    >
                      Annual
                    </ToggleButton>
                    <ToggleButton
                      id="tbg-radio-2"
                      value="monthly"
                      variant="outline-info"
                    >
                      Monthly
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
                <Form.Label>Number of Accounts to Add:</Form.Label>
                <InputGroup>
                  <Button variant="outline-secondary" onClick={() => setNumAccounts(prev => Math.max(1, prev - 1))}>
                    <DashCircle />
                  </Button>
                  <Form.Control
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    onBlur={() => {
                      const parsedValue = parseInt(quantity) || 0;
                      setQuantity(Math.min(Math.max(1, parsedValue), 200));
                    }}
                    min="0"
                    aria-label="Number of accounts"
                  />
                  <Button variant="outline-secondary" onClick={() => setQuantity(prev => prev + 1)}>
                    <PlusCircle />
                  </Button>
                </InputGroup>
              </Form.Group>
            </Form>
            <div className="text-center pt-4">
              <div className="d-flex my-auto text-center justify-content-center align-items-end ">

                <h1
                  className="text-primary me-2"
                  style={{ fontSize: "3.5rem" }}
                >
                  {`$${getPrice() * quantity}  `}
                </h1>
                <p className='text-primary'>/ month</p>
              </div>
              <p> {billingCycle === 'annual' ? 'billed annually ' : 'billed monthly '}</p>

            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleOpenCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
            {/* <p className='text-muted'>Please read our Terms and Conditions here.</p> */}
          </Modal.Footer>
        </Modal>
      </Card>
    </div>
  );
}

export default PricingModule;