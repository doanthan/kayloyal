import React, { useMemo, useState } from "react"
import Table from "react-bootstrap/Table"
import Dropdown from "react-bootstrap/Dropdown"
import { format, isValid } from "date-fns"

const SentCampaignsTable = ({ campaigns }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Filter campaigns with status 'SENT' and sort by date
  const sentCampaigns = useMemo(() => {
    console.log(campaigns.length)
    return campaigns
      .filter((campaign) => campaign.status === "SENT")
      .sort((a, b) => new Date(b.sendDateTime) - new Date(a.sendDateTime))
  }, [campaigns])

  const headerConfig = {
    campaignName: { visible: true, displayName: "Campaign Name" },
    sendDateTime: { visible: true, displayName: "Date" },
    numberOfSends: { visible: true, displayName: "Sent" },
    clicks: { visible: true, displayName: "Clicked" },
    // Exclude status column
  }

  const visibleHeaders = Object.keys(headerConfig).filter(
    (key) => headerConfig[key].visible
  )

  const indexOfLastCampaign = currentPage * pageSize
  const indexOfFirstCampaign = indexOfLastCampaign - pageSize
  const currentCampaigns = sentCampaigns.slice(
    indexOfFirstCampaign,
    indexOfLastCampaign
  )

  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const handlePageSizeChange = (eventKey) => {
    setPageSize(Number(eventKey))
    setCurrentPage(1) // Reset to first page with new page size
  }

  return (
    <>
      <Table responsive hover>
        <thead>
          <tr>
            {visibleHeaders.map((header) => (
              <th key={header}>{headerConfig[header].displayName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentCampaigns.map((campaign, index) => (
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
      <div className="pagination-controls float-end">
        <div className="pagination-controls d-inline-block me-4">
          <Dropdown onSelect={handlePageSizeChange}>
            <Dropdown.Toggle variant="outline-secondary">
              Page Size: {pageSize}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {[5, 10, 25, 50, 100].map((size) => (
                <Dropdown.Item key={size} eventKey={size}>
                  {size}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="pagination-buttons d-inline-block">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary me-2"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * pageSize >= sentCampaigns.length}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      </div>
    </>
  )
}

export default SentCampaignsTable
