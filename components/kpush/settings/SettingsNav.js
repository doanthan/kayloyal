import Nav from "react-bootstrap/Nav"

export default function SettingsNav({ paymentPlan = "Free Plan" }) {
  return (
    <Nav variant="tabs">
      <Nav.Item>
        <Nav.Link href="kayloyal-settings" eventKey="push">
          <i className="fi-user me-2"></i>
          kayloyal Settings
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="account-settings" eventKey="account">
          <i className="fi-home me-2"></i>
          Account Settings
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="billing-settings" eventKey="billing">
          <i className="fi-credit-card me-2"></i>
          Billing
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="payment" eventKey="payment">
          <i className="fi-credit-card me-2"></i>
          Upgrade Accounts
        </Nav.Link>
      </Nav.Item>

    </Nav>
  )
}
