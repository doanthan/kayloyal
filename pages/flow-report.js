import { useEffect, useState } from "react"
import KpushLayout from "components/kpush/layout/KpushLayout"
import KpushAccountLayout from "components/kpush/layout/KpushAccountLayout"
import { onlyAuthUserSSR } from 'services/server-library'
import AccountSelect from "components/kpush/AccountSelect"
import { Row, Col, Form, Spinner, Card, Button } from "react-bootstrap"
import { decompressData } from "services/library"
import SelectTimePeriod from 'components/kpush/campaigns/SelectTimePeriod'
import FlowTable from 'components/khub/flows/FlowTable'


function FlowReport({ user, accountDetails }) {
    const [tableData, setTableData] = useState([])
    const [displayData, setDisplayData] = useState([])
    const [loading, setLoading] = useState(true)
    const [groupByFlow, setGroupByFlow] = useState(true)
    const [selectedTags, setSelectedTags] = useState([{ label: "View All Tags", value: "all" }])
    const [showConversionRate, setShowConversionRate] = useState(true);
    const [selectedAccounts, setSelectedAccounts] = useState()

    const [startEndDate, setStartEndDate] = useState(() => {
        const today = new Date();
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(today.getDate() - 29)
        // Return an array of two date strings in 'YYYY-MM-DD' format
        return [
            thirtyDaysAgo,
            today
        ];
    })

    const filterCampaignsByAccounts = (data) => {
        if (selectedAccounts?.some(account => account.value === 'all')) {
            return data;
        }
        const selectedValues = selectedAccounts?.map(account => account.value);
        return data.filter(flow => selectedValues?.includes(flow.klaviyoPublic));
    };

    const applyConversionRate = (flowData) => {
        if (!showConversionRate) {
            return flowData;
        } else {
            return flowData.map(flow => {
                const matchingAccount = accountDetails.find(account => account.value === flow.klaviyoPublic);
                if (matchingAccount) {
                    const updatedConversionValue = flow.conversion_value * matchingAccount.conversion;
                    return { ...flow, conversion_value: updatedConversionValue };
                }
                return flow;
            });
        }
    };

    const calculateAdditionalRates = (data) => {
        return data.map(flow => {
            const totalDelivered = flow.delivered;
            const totalOpens = flow.opens_unique;
            const totalClicks = flow.clicks_unique;
            const totalConversions = flow.conversion_uniques;

            const openRate = totalDelivered > 0 ? Math.min(totalOpens / totalDelivered, 1) : 0;
            const clickRate = totalDelivered > 0 ? Math.min(totalClicks / totalDelivered, 1) : 0;
            const conversionRate = totalDelivered > 0 ? Math.min(totalConversions / totalDelivered, 1) : 0;

            console.log(openRate);

            return {
                ...flow,
                openRate: openRate,
                clickRate: clickRate,
                conversionRate: conversionRate
            };
        });
    };


    useEffect(() => {
        const checkDataAndLoad = () => {
            const compressed = localStorage.getItem('flowData');
            if (compressed) {
                const decompressed = decompressData(compressed);
                let processedData = JSON.parse(decompressed);

                // Step 1: Filter by selected accounts
                processedData = filterCampaignsByAccounts(processedData);

                // Step 2: Filter by date range
                processedData = filterDataByDateRange(processedData);

                // Step 3: Apply conversion rate
                processedData = applyConversionRate(processedData);

                // Step 4: Group by flow if necessary
                if (groupByFlow) {
                    processedData = groupDataByFlow(processedData);
                }

                // Step 5: Calculate additional rates
                processedData = calculateAdditionalRates(processedData);
                console.log(processedData)
                setTableData(JSON.parse(decompressed)); // This line might be unnecessary
                setDisplayData(processedData);
                setLoading(false);
            } else {
                // If data is not yet available, check again after a short delay
                setTimeout(checkDataAndLoad, 500);
            }
        };
        checkDataAndLoad();
    }, [showConversionRate, accountDetails, startEndDate, selectedAccounts, groupByFlow]);

    const groupDataByFlow = (data) => {
        return Object.values(data.reduce((acc, item) => {
            const key = `${item.flow_id}_${item.send_channel}`;
            if (!acc[key]) {
                acc[key] = { ...item, messageCount: 1 };
            } else {
                // Sum the numeric values
                ['opens_unique', 'clicks_unique', 'delivered', 'conversion_uniques', 'conversion_value'].forEach(metric => {
                    acc[key][metric] += item[metric];
                });
                // Combine names if they're different
                if (acc[key].name !== item.name) {
                    acc[key].name = `${acc[key].name} / ${item.name}`;
                }
                // Update message count
                acc[key].messageCount += 1;
            }
            return acc;
        }, {}));
    };

    const handleConversionBox = (event) => {
        setShowConversionRate(event.target.checked);
    };

    const handleGroupBox = (event) => {
        setGroupByFlow(event.target.checked);
    };

    const filterDataByDateRange = (data) => {
        const [startDate, endDate] = startEndDate;
        const startIndex = 30 - Math.floor((new Date() - startDate) / (24 * 60 * 60 * 1000));
        const endIndex = 30 - Math.floor((new Date() - endDate) / (24 * 60 * 60 * 1000));

        return data.map(flow => {
            const sumArray = (arr) => arr?.slice(startIndex, endIndex + 1).reduce((sum, value) => sum + value, 0) || 0;

            return {
                ...flow,
                opens: sumArray(flow.opens),
                clicks: sumArray(flow.clicks),
                conversions: sumArray(flow.conversions),
                opens_unique: sumArray(flow.opens_unique),
                clicks_unique: sumArray(flow.clicks_unique),
                delivered: sumArray(flow.delivered),
                conversion_uniques: sumArray(flow.conversion_uniques),
                conversion_value: sumArray(flow.conversion_value),
            };
        });
    };

    return (
        <KpushLayout pageTitle="Flow Report" activeNav="Flow Report" user={user}>
            <KpushAccountLayout accountPageTitle="Flow Report">
                <h3 className="mb-4">Flows Reporting</h3>
                <Card className="">
                    <Card.Body>
                        <Row>
                            <Col xs='4'>
                                <Form.Label>Select Accounts</Form.Label>
                                <AccountSelect accounts={accountDetails} selectedAccounts={selectedAccounts} setSelectedAccounts={setSelectedAccounts} />
                            </Col>
                            <Col xs='8'>
                                <SelectTimePeriod isTableLoading={loading} page="flows" startEndDate={startEndDate} setStartEndDate={setStartEndDate} delay={true} />
                            </Col>

                        </Row>
                        <Row >
                            <Col xs='6'>
                                <Row className='pt-3'>
                                    <Col xs='6'>
                                        <Form.Check
                                            type="switch"
                                            id="group-by-conversion"
                                            label="Show Conversion"
                                            checked={showConversionRate}
                                            onChange={handleConversionBox}
                                        />
                                    </Col>
                                    <Col xs='6'>
                                        <Form.Check
                                            type="switch"
                                            id="group-by-flow"
                                            label="Group by Flow"
                                            checked={groupByFlow}
                                            onChange={handleGroupBox} className="mb-3"
                                        />
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </Card.Body>
                </Card >
                <Row>
                    <FlowTable data={displayData} groupByFlow={groupByFlow} showConversionRate={showConversionRate} accountDetails={accountDetails} startEndDate={startEndDate} />
                </Row>
            </KpushAccountLayout >
        </KpushLayout>

    )
}

export default FlowReport

//All private pages should use this
export const getServerSideProps = async (context) => {
    const { req } = context

    const user = await onlyAuthUserSSR(req, true)
    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        }
    } else {
        const cleanedData = user.accounts.map((account) => ({
            label: account.name,
            value: account.klaviyoPublic,
            conversion: account.conversion || ""
        }))
        return {
            props: {
                user: user || null,
                accountDetails: cleanedData,
            },
        }
    }
}

