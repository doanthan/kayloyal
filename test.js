import React, { useState } from 'react';
import { Table, Badge, Modal, Button } from 'react-bootstrap';
import { DateTime } from 'luxon';
import Link from 'next/link';

function PastCampaignsTable({ campaigns }) {
    const [sortColumn, setSortColumn] = useState('updatedAt');
    const [sortDirection, setSortDirection] = useState('desc');
    const [showModal, setShowModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    // ... (keep all other functions as they were: formatDate, formatScheduledDate, getStatusBadge, formatRate, handleSort, sortedCampaigns)

    const handleCampaignClick = (campaign) => {
        if (['SCHEDULED', 'DRAFT', 'SENT'].includes(campaign.status.toUpperCase())) {
            setSelectedCampaign(campaign);
            setShowModal(true);
        }
    };

    const CampaignModal = () => (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{selectedCampaign?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Add campaign details here */}
                <p>Status: {selectedCampaign?.status}</p>
                <p>Last Updated: {formatDate(selectedCampaign?.updatedAt)}</p>
                {/* Add more campaign details as needed */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <>
            <Table striped bordered hover responsive>
                <thead>
                    {/* ... (keep the header row as it was) */}
                </thead>
                <tbody>
                    {sortedCampaigns.map((campaign, index) => (
                        <tr key={campaign.id || index}>
                            <td>
                                {campaign.status.toUpperCase() === '(kayloyal)DRAFT' ? (
                                    <Link href={`/campaigns/${campaign.id}/1`}>
                                        <a>{campaign.name}</a>
                                    </Link>
                                ) : (
                                    <a href="#" onClick={() => handleCampaignClick(campaign)} style={{ cursor: 'pointer' }}>
                                        {campaign.name}
                                    </a>
                                )}
                            </td>
                            <td>
                                {getStatusBadge(campaign.status)}
                                {campaign.status.toLowerCase() === 'scheduled' && (
                                    <div>{formatScheduledDate(campaign.scheduledDate)}</div>
                                )}
                            </td>
                            <td>{formatDate(campaign.updatedAt)}</td>
                            <td>{formatRate(campaign.openRate)}</td>
                            <td>{formatRate(campaign.clickRate)}</td>
                            <td>{campaign.order || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <CampaignModal />
        </>
    );
}

export default PastCampaignsTable;