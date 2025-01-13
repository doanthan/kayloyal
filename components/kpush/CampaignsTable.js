import React, { useState, useMemo } from "react"
import Table from "react-bootstrap/Table"
import Badge from "react-bootstrap/Badge"
import campaigns from "data/colours.js"
import Dropdown from "react-bootstrap/Dropdown"
import { format, isValid, parse } from "date-fns"

const CampaignsTable = ({ campaigns }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "sendDateTime",
    direction: "descending",
  })

  const [headerConfig, setHeaderConfig] = useState({
    campaignId: { visible: false, displayName: "ID" },
    campaignName: { visible: true, displayName: "Campaign Name" },
    status: { visible: true, displayName: "Status" },
    sendDateTime: { visible: true, displayName: "Date" },
    numberOfSends: { visible: true, displayName: "Sent" },
    clicks: { visible: true, displayName: "Clicked" },
    // Add other headers as needed
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const sortedCampaigns = useMemo(() => {
    let sortableItems = [...campaigns]

    sortableItems.sort((a, b) => {
      if (sortConfig.key === "sendDateTime") {
        const dateA = isValid(new Date(a[sortConfig.key]))
          ? new Date(a[sortConfig.key])
          : new Date(0)
        const dateB = isValid(new Date(b[sortConfig.key]))
          ? new Date(b[sortConfig.key])
          : new Date(0)
        return sortConfig.direction === "ascending"
          ? dateA - dateB
          : dateB - dateA
      } else {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      }
    })

    return sortableItems
  }, [campaigns, sortConfig])

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

  const indexOfLastCampaign = currentPage * pageSize
  const indexOfFirstCampaign = indexOfLastCampaign - pageSize
  const currentCampaigns = sortedCampaigns.slice(
    indexOfFirstCampaign,
    indexOfLastCampaign
  )

  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const handlePageSizeChange = (eventKey) => {
    setPageSize(Number(eventKey))
    setCurrentPage(1) // Reset to first page with new page size
  }

  function getBadgeBackground(status) {
    switch (status) {
      case "SCHEDULED":
        return "info"
      case "DRAFT":
        return "secondary"
      case "SENT":
        return "success"
      default:
        return "light" // Default background color if none of the above
    }
  }

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
          {currentCampaigns.map((campaign, index) => (
            <tr key={index} className='cursor-pointer'>
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
                  ) : header === "status" ? (
                    <Badge
                      bg={getBadgeBackground(campaign[header])}
                      className="fw-bold"
                      style={{ width: "100px" }}
                    >
                      {campaign[header]}
                    </Badge>
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
            disabled={currentPage * pageSize >= campaigns.length}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      </div>
    </>
  )
}

export default CampaignsTable
