import React, { useState, useEffect } from 'react';
import Table from "react-bootstrap/Table";
import { formatCurrency } from 'services/library';
import { CaretUpFill, CaretDownFill } from 'react-bootstrap-icons';

const DashboardTable = ({ accounts, setloadingStats, setRevenue, setKlaviyoRevenue, setEmailsReceived, setSMSReceived }) => {
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const formatNumber = (num) => {
        return num?.toLocaleString() || '0';
    };

    useEffect(() => {
        const totals = accounts.reduce((acc, account) => {
            acc.totalRevenue += account.totalRevenue;
            acc.klaviyoRevenue += account.klaviyoRevenue;
            acc.emailsReceived += account.emailsReceived;
            acc.smsReceived += account.smsReceived;
            return acc;
        }, { totalRevenue: 0, klaviyoRevenue: 0, emailsReceived: 0, smsReceived: 0 });

        setRevenue(totals.totalRevenue);
        setKlaviyoRevenue(totals.klaviyoRevenue);
        setEmailsReceived(totals.emailsReceived);
        setSMSReceived(totals.smsReceived);
        setloadingStats(false)
    }, [accounts]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedAccounts = [...accounts].sort((a, b) => {
        if (!sortField) return 0;

        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === 'string') {
            return sortDirection === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc'
            ? <CaretUpFill size={12} />
            : <CaretDownFill size={12} />;
    };


    return (
        <div style={{ overflowX: 'auto' }}>
            <Table size="sm" hover>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')} style={headerStyle}>
                            Account <SortIcon field="name" />
                        </th>
                        <th onClick={() => handleSort('totalRevenue')} style={headerStyle}>
                            Revenue <SortIcon field="totalRevenue" />
                        </th>
                        <th onClick={() => handleSort('klaviyoRevenue')} style={headerStyle}>
                            Klaviyo Rev <SortIcon field="klaviyoRevenue" />
                        </th>
                        <th onClick={() => handleSort('emailsReceived')} style={headerStyle}>
                            Emails <SortIcon field="emailsReceived" />
                        </th>
                        <th onClick={() => handleSort('emailsOpened')} style={headerStyle}>
                            Opens <SortIcon field="emailsOpened" />
                        </th>
                        <th onClick={() => handleSort('emailsClicked')} style={headerStyle}>
                            Clicks <SortIcon field="emailsClicked" />
                        </th>
                        <th onClick={() => handleSort('smsReceived')} style={headerStyle}>
                            SMS <SortIcon field="smsReceived" />
                        </th>
                        <th onClick={() => handleSort('smsClicked')} style={headerStyle}>
                            SMS Clicks <SortIcon field="smsClicked" />
                        </th>
                        <th onClick={() => handleSort('emailSubscribed')} style={headerStyle}>
                            Email Sub <SortIcon field="emailSubscribed" />
                        </th>
                        <th onClick={() => handleSort('emailUnsubscribed')} style={headerStyle}>
                            Unsub <SortIcon field="emailUnsubscribed" />
                        </th>
                        <th onClick={() => handleSort('smsSubscribed')} style={headerStyle}>
                            SMS Sub <SortIcon field="smsSubscribed" />
                        </th>
                        <th onClick={() => handleSort('smsUnsubscribed')} style={headerStyle}>
                            SMS Unsub <SortIcon field="smsUnsubscribed" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAccounts.map((account, index) => (
                        <tr key={index}>
                            <td>{account.name}</td>
                            <td>{formatCurrency(account.totalRevenue)}</td>
                            <td>{formatCurrency(account.klaviyoRevenue)}</td>
                            <td>{formatNumber(account.emailsReceived)}</td>
                            <td>{formatNumber(account.emailsOpened)}</td>
                            <td>{formatNumber(account.emailsClicked)}</td>
                            <td>{formatNumber(account.smsReceived)}</td>
                            <td>{formatNumber(account.smsClicked)}</td>
                            <td>{formatNumber(account.emailSubscribed)}</td>
                            <td>{formatNumber(account.emailUnsubscribed)}</td>
                            <td>{formatNumber(account.smsSubscribed)}</td>
                            <td>{formatNumber(account.smsUnsubscribed)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

const headerStyle = {
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    padding: '8px',
    fontSize: '0.875rem',
    userSelect: 'none'
};

export default DashboardTable;