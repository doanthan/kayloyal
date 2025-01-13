import Select from 'react-select'
import { useState, useEffect } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { useAuth } from "services/AuthProvider"
import DateTimePicker from './DateTimePicker'
import { DateTime } from 'luxon'



function SelectTimePeriod({ isTableLoading, page = "campaigns", setStartEndDate, startEndDate, setIsInitialized, delay = false }) {
    const [selectedOption, setSelectedOption] = useState({ label: "Last 30 days", value: "last30Days" })
    const timeZone = 'America/New_York'; // US/Eastern timezone


    const formatDate = (date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    };


    const setTimePeriod = (option) => {
        sessionStorage.setItem("timePeriod", JSON.stringify(option))
    }

    useEffect(() => {
        if (page === "campaigns") {
            const timePeriod = JSON.parse(sessionStorage.getItem("timePeriod"))
            if (timePeriod) {
                setStartEndDate(timePeriod.startEndDate)
                setSelectedOption(timePeriod.timePeriod)
            }
            if (setIsInitialized) {
                setIsInitialized(true)
            }
        }
    }, [])


    const setCustomDatePeriod = (dates) => {
        setStartEndDate(dates)
        setSelectedOption({ label: "Custom", value: "custom" })
        if (dates[0] && dates[1]) {
            setTimePeriod({
                startEndDate: [formatDate(dates[0]), formatDate(dates[1])],
                timePeriod: { label: "Custom", value: "custom" },
            })
        }
    }



    const options = [
        { label: "Today", value: "today" },
        { label: "Week-to-date", value: "weekToDate" },
        { label: "Month-to-date", value: "monthToDate" },
        { label: "Last 7 days", value: "last7Days" },
        { label: "Last 30 days", value: "last30Days" },
        { label: "Custom", value: "custom" },
    ]

    // Helper to get the start of the day
    const getStartOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Helper to get the start of the week
    const getStartOfWeek = (date) => {
        const day = date.getDay();
        const diff = (day === 0 ? -6 : 1) - day; // Adjust to Monday as the first day of the week
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff);
    };

    // Helper to get the start of the month
    const getStartOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);


    const onSetTimePeriod = (option) => {
        let startDate, endDate;
        const today = new Date();
        switch (option.value) {
            case 'today':
                startDate = getStartOfDay(today);
                endDate = today;
                break;
            case 'weekToDate':
                startDate = getStartOfWeek(today);
                endDate = today;
                break;
            case 'monthToDate':
                startDate = getStartOfMonth(today);
                endDate = today;
                break;
            case 'last7Days':
                endDate = new Date();


                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7); // 7 days including today
                startDate.setHours(0, 0, 0, 0); // Set to beginning of day
                break;

            case 'last30Days':
                // Set end date to the end of yesterday
                endDate = new Date();
                // endDate.setDate(endDate.getDate() - 1); // Move to yesterday
                // endDate.setHours(23, 59, 59, 999); // Set to end of day

                // Set start date to 30 days before the end date
                startDate = new Date(endDate);
                startDate.setDate(endDate.getDate() - 30); // 30 days including end date
                startDate.setHours(0, 0, 0, 0); // Set to beginning of day
                break;
            // case 'last30Days':
            //     const timeZone = 'America/New_York';
            //     const nowInET = DateTime.now().setZone(timeZone);
            //     endDate = nowInET.endOf('day').toJSDate();
            //     startDate = nowInET.minus({ days: 30 }).startOf('day').toJSDate();
            //     break;
            case 'custom':
                startDate = new Date(startEndDate[0])
                endDate = new Date(startEndDate[1])
                break;
            default:
                return;
        }

        if (option.value !== "custom") {
            setTimePeriod({
                startEndDate: [formatDate(startDate), formatDate(endDate)],
                timePeriod: option,
            })
        }
        console.log("[startDate, endDate]", [startDate, endDate])

        setSelectedOption(option)
        setStartEndDate([startDate, endDate])

    }



    return (
        <Row>
            <Col>
                <>
                    <Form.Label>Time Period</Form.Label>
                    <Select
                        value={selectedOption}
                        onChange={(option) => {
                            onSetTimePeriod(option)
                        }}
                        disabled={isTableLoading}
                        options={options}
                        className="basic-single"
                        classNamePrefix="select"
                    />
                </>
            </Col>
            <Col style={{ display: 'flex', flexDirection: 'column' }}>
                {selectedOption?.value === "custom" && (
                    <>
                        <Form.Label>Date Range</Form.Label>
                        <DateTimePicker setCustomDatePeriod={setCustomDatePeriod} initialDates={startEndDate} disabled={isTableLoading} page={page} />
                    </>
                )}
            </Col>
        </Row>
    )
}

export default SelectTimePeriod