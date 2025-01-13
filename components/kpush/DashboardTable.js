import React, { useState, useMemo } from "react"
import Table from "react-bootstrap/Table"
import Badge from "react-bootstrap/Badge"
import campaigns from "data/colours.js"
import Dropdown from "react-bootstrap/Dropdown"
import { format, isValid, parse } from "date-fns"
import AccountSetup from "./AccountSetup"

const CampaignsTable = ({ accounts }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "sendDateTime",
    direction: "descending",
  })

  const [headerConfig, setHeaderConfig] = useState({
    totalRevenue: { visible: false, displayName: "Revenue" },
    klaviyoRevenue: { visible: true, displayName: "Klaviyo Revenue" },
    receivedEmail: { visible: true, displayName: "Received Email" },
    openEmail: { visible: true, displayName: "Opened Email" },
    clickEmail: { visible: true, displayName: "Clicked Email" },
    emailSubscribe: { visible: true, displayName: "Email Subscribed" },
    smsSubscribe: { visible: true, displayName: "SMS Subscribed" },
    emailUnsubscribe: { visible: true, displayName: "Email Unsubscribed" },
    smsUnsubscribe: { visible: true, displayName: "SMS Unsubscribed" },
  })


  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const visibleHeaders = Object.keys(headerConfig).filter(
    (key) => headerConfig[key].visible
  )


  return (
    <>
      <Table responsive hover>
        <thead>
          <tr>
            {visibleHeaders.map((header) => (
              <th
                key={header}
                onClick={() => requestSort(header)}
                style={{ cursor: "pointer" }}
              >
                {headerConfig[header].displayName}
                {sortConfig.key === header ? (
                  sortConfig.direction === "ascending" ? (
                    <i className="ps-1 fi-arrow-long-up"></i>
                  ) : (
                    <i className="ps-1 fi-arrow-long-down"></i>
                  )
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {accounts.map((campaign, index) => (
            <tr key={index}>
              {visibleHeaders.map((header) => (
                <td key={`${index}-${header}`}>
                  {header === "campaignName" ? (
                    <a href={`campaigns/${campaign._id}`}>{campaign[header]}</a>
                  ) : header === "sendDateTime" ? (
                    isValid(new Date(campaign[header])) ? (
                      format(new Date(campaign[header]), "yyyy-MM-dd hh:mma")
                    ) : (
                      ""
                    )
                  ) : (
                    campaign[header]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default CampaignsTable
