import React, { useEffect, useState } from "react"
import Select from "react-select"
import { useAuth } from "services/AuthProvider"

const AccountSelect = ({ accountSelectDisabled = false, accounts, setSelectedAccounts, selectedAccounts }) => {


  const [accountsList, setAccountsList] = useState([])

  useEffect(() => {
    if (accounts) {
      setAccountsList([{ value: 'all', label: 'View All Accounts' }, ...accounts]);
    }
  }, [accounts])

  useEffect(() => {
    const savedAccounts = sessionStorage.getItem('selectedAccounts');
    if (savedAccounts && setSelectedAccounts) {
      setSelectedAccounts(JSON.parse(savedAccounts))
    } else if (accounts && accounts.length > 0 && !selectedAccounts) {
      setSelectedAccounts([{ value: 'all', label: 'View All Accounts' }])
    }
  }, [])



  const handleSelectChange = (selectedOptions) => {
    const allOption = { value: 'all', label: 'View All Accounts' };
    const isAllSelected = selectedOptions.some(option => option.value === 'all');
    const otherOptions = selectedOptions.filter(option => option.value !== 'all');

    let newSelection;

    if (selectedOptions.length > 0 && selectedOptions[selectedOptions.length - 1].value === 'all') {
      // 'All' was just selected, make it the only selection
      newSelection = [allOption];
    } else if (selectedOptions.length === 2 && isAllSelected) {
      // If there are two selections and one is 'all', remove 'all'
      newSelection = otherOptions;
    } else if (isAllSelected) {
      // If 'all' is selected along with other options, keep only 'all'
      newSelection = [allOption];
    } else {
      // Otherwise, keep all selected options
      newSelection = selectedOptions;
    }

    console.log("New selection:", newSelection);
    setSelectedAccounts(newSelection);
    sessionStorage.setItem('selectedAccounts', JSON.stringify(newSelection));
  };
  return (
    <Select
      className="basic-single"
      classNamePrefix="select"
      closeMenuOnSelect={false}
      name="account-select"
      isSearchable
      value={selectedAccounts}
      options={accountsList}
      onChange={handleSelectChange}
      isDisabled={accountSelectDisabled}
      isMulti={true}
      styles={selectStyles}

    />
  )
}

export default AccountSelect

const selectStyles = {
  // ... other styles ...
  menu: (provided) => ({
    ...provided,
    zIndex: 9999, // This should be higher than react-big-calendar's z-index
  }),
  // If you want to ensure the control (the main part of the select) is also above other elements:
  control: (provided, state) => ({
    ...provided,
    zIndex: 1000, // This should be higher than surrounding elements but lower than the menu
    // ... other control styles ...
  }),
}