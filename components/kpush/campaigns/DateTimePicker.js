import Form from "react-bootstrap/Form"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"



export default function DateTimePicker({
  initialDates,
  setCustomDatePeriod,
  isTableLoading,
  page,
}) {
  // Function to calculate the date three months ago
  const getThreeMonthsAgo = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date;
  };

  // Function to calculate the date 30 days ago
  const getThirtyDaysAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 31);
    return date;
  };


  // Set the minDate based on the page
  const minDate = page === 'campaigns' ? getThreeMonthsAgo() : getThirtyDaysAgo();

  return (
    <Form.Control
      as={DatePicker}
      selectsRange={true}
      disabled={isTableLoading}
      startDate={initialDates[0]}
      endDate={initialDates[1]}
      minDate={minDate}
      onChange={(update) => setCustomDatePeriod(update)}
      dateFormat="MMM d, yyyy"
    />
  )
}
