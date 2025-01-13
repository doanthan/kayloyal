import { useState, forwardRef, useEffect } from 'react';
import { Table, Dropdown, Button, Modal } from 'react-bootstrap';
import { formatCampaignDate, formatScheduledDate, getStatusBadge } from 'services/library'
import { DateTime } from 'luxon';
import ModalCampaign from 'components/khub/campaigns/ModalCampaign'
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import { getConfigToken } from 'services/library';
import axios from 'axios'

function PastCampaignsTable({ campaigns, handleCampaignDelete, klaviyoCampaignData }) {
    const [sortColumn, setSortColumn] = useState('updatedAt');
    const [sortDirection, setSortDirection] = useState('desc');
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState(null);


    const router = useRouter()





    const CustomToggle = forwardRef(({ children, onClick }, ref) => (
        <Button
            variant="link"
            className="text-dark"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            <ThreeDotsVertical />
        </Button>
    ));
    const formatRate = (rate) => {
        return rate ? `${(rate * 100).toFixed(2)}%` : '-';
    };

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedCampaigns = [...campaigns].sort((a, b) => {
        let aValue = a[sortColumn];
        let bValue = b[sortColumn];

        if (sortColumn === 'status') {
            // For "SCHEDULED" and "SENT" statuses, use scheduledDate for sorting
            if (['SCHEDULED', 'SENT'].includes(a.status.toUpperCase()) &&
                ['SCHEDULED', 'SENT'].includes(b.status.toUpperCase())) {
                aValue = DateTime.fromISO(a.scheduledDate);
                bValue = DateTime.fromISO(b.scheduledDate);
            } else {
                // For other statuses, sort alphabetically
                aValue = a.status.toUpperCase();
                bValue = b.status.toUpperCase();
            }
        } else if (sortColumn === 'updatedAt' || sortColumn === 'scheduledDate') {
            aValue = DateTime.fromISO(aValue);
            bValue = DateTime.fromISO(bValue);
        } else if (sortColumn === 'openRate' || sortColumn === 'clickRate') {
            aValue = aValue || 0;
            bValue = bValue || 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const handleCampaignClick = (campaign) => {
        if (['SCHEDULED', 'DRAFT', 'SENT', "CANCELLED"].includes(campaign.status.toUpperCase())) {
            setSelectedCampaign(campaign);
        } else if (campaign.status.toUpperCase() === "kayloyal-DRAFT") {
            router.push(`/campaigns/${campaign._id}/1`)
        }
    };

    useEffect(() => {
        if (selectedCampaign) {
            console.log(selectedCampaign)
            setShowModal(true);
        }
    }, [selectedCampaign]);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCampaign(null);  // Reset selectedCampaign when modal is closed
    };

    const onDeleteCampaign = async (campaign) => {
        setCampaignToDelete(campaign);
        setShowDeleteModal(true);
    }

    const onSetStatus = async (campaign, status) => {
        console.log(campaign._id)
        const url = `/api/change-campaign-status`
        const { data } = axios.patch(url, { id: campaign._id, status }, getConfigToken())
    }


    const handleDeleteConfirm = async () => {
        // Implement your delete logic here
        const url = `api/campaign/${campaignToDelete._id}`
        await axios.delete(url, getConfigToken())
        handleCampaignDelete(campaignToDelete._id)
        // After deletion logic, close the modal
        setShowDeleteModal(false);
        setCampaignToDelete(null);
    };

    const DeleteConfirmationModal = () => (
        <Modal show={showDeleteModal && campaignToDelete} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Campaign</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>You are about to delete {campaignToDelete?.name}.</p>
                <p>This will also remove the scheduled/draft campaigns from Klaviyo.</p>
                <p>This action can't be undone. Are you sure you want to continue?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteConfirm}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );



    const SortableHeader = ({ column, children }) => (
        <th onClick={() => handleSort(column)} style={{ cursor: 'pointer' }}>
            <div className="d-flex align-items-center">
                {children}
                <span className="ms-2">
                    {sortColumn === column && (
                        <i className={`bi ${sortDirection === 'asc' ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}`}></i>
                    )}
                </span>
            </div>
        </th>
    );


    return (
        <Table striped bordered hover responsive className="table-sm text-sm">            <thead>
            <tr>
                <SortableHeader column="name">Name</SortableHeader>
                <SortableHeader column="status">Status</SortableHeader>
                <SortableHeader column="accounts">Accounts</SortableHeader>
                <SortableHeader column="updatedAt">Last Updated</SortableHeader>
            </tr>
        </thead>
            <tbody>
                {sortedCampaigns.map((campaign, index) => (
                    <tr key={campaign.id || index}>
                        <td>
                            <a href="#" onClick={() => handleCampaignClick(campaign)} style={{ cursor: 'pointer' }}>
                                {campaign.name}
                            </a>
                        </td>
                        <td>
                            {getStatusBadge(campaign.status, new Date(campaign.date))}
                            {campaign.status.toLowerCase() === 'scheduled' && (
                                <div>{formatScheduledDate(campaign.scheduledDate)}</div>
                            )}
                        </td>
                        <td>{campaign.sendToAccountsCount}</td>
                        <td>{formatCampaignDate(campaign.updatedAt)}</td>
                        <td>
                            {campaign.status.toUpperCase() !== "CANCELLED" && <Dropdown>
                                <Dropdown.Toggle as={CustomToggle} id={`dropdown-${campaign.id}`} />
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleCampaignClick(campaign)}>{campaign.status.toUpperCase() === "SENT" ? "View" : "Edit"}</Dropdown.Item>
                                    {campaign.status.toUpperCase() === "SCHEDULED" && <Dropdown.Item onClick={() => onSetStatus(campaign, "revert")}>Set to Draft</Dropdown.Item>}
                                    {campaign.status.toUpperCase() === "SCHEDULED" && <Dropdown.Item onClick={() => onSetStatus(campaign, "cancel")}>Cancel Send</Dropdown.Item>}
                                    {campaign.status.toUpperCase() === "DRAFT" && <Dropdown.Item onClick={() => onSetStatus(campaign, "schedule")}>Schedule Send</Dropdown.Item>}
                                    {["DRAFT", "kayloyal-DRAFT"].includes(campaign.status.toUpperCase()) && <Dropdown.Item onClick={() => onDeleteCampaign(campaign)}>Delete</Dropdown.Item>}

                                    {/* {campaign.status.toUpperCase() === "SCHEDULED" && <Dropdown.Item onClick={() => onReschedule(campaign)}>Reschedule</Dropdown.Item>} */}

                                </Dropdown.Menu>
                            </Dropdown>}
                        </td>
                    </tr>
                ))}
            </tbody>
            <ModalCampaign showModal={showModal} setShowModal={handleCloseModal} campaign={selectedCampaign} />
            <DeleteConfirmationModal />
        </Table >
    );
}

export default PastCampaignsTable;