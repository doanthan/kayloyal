import React from "react"
import { Button } from "react-bootstrap"

const AccountSetup = () => {
  return (
    <section className="rounded p-5 bg-secondary text-center h-100">
      <div className="h-100 d-flex flex-column justify-content-center align-items-center">
        <h4 className="mb-5 h5">Connect your first account to get started!</h4>
        <Button
          className="d-inline-block"
          href="/account-settings"
          variant="primary"
          size="lg"
        >
          Go to Account Settings
        </Button>
      </div>
    </section>
  )
}

export default AccountSetup
