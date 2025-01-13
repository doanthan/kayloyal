import Select from 'react-select';
import { useAuth } from 'services/AuthProvider'


const Selector = ({ name, handleTagSelection, tags, selectedTags }) => {
    function getUniqueTags(accounts) {
        if (accounts && accounts.length > 0) {
            // Flatten the tags from all accounts and remove duplicates
            const uniqueTags = [...new Set(tags)];
            // Map unique tags to the format required by react-select
            const options = uniqueTags.map(tag => ({
                value: tag,
                label: tag
            }));

            // Add the "All Tags" option at the beginning
            options.unshift({ value: 'all', label: 'View All Tags' });

            return options;
        }

        // Return an empty array if there are no accounts or tags
        return [];
    }

    const handleSelectChange = (selectedOptions) => {
        let updatedSelection;

        // Check if 'View all Tags' is selected
        const isAllSelected = selectedOptions.some(option => option.value === 'all');
        const otherOptionsSelected = selectedOptions.filter(option => option.value !== 'all');

        if (selectedOptions.length > 0 && selectedOptions[selectedOptions.length - 1].value === 'all') {
            // If 'View all Tags' was just selected, make it the only selection
            updatedSelection = [{ value: 'all', label: 'View all Tags' }];
        } else if (selectedOptions.length === 2 && isAllSelected) {
            // If there are two selections and one is 'all', remove 'all'
            updatedSelection = otherOptionsSelected;
        } else if (isAllSelected) {
            // If 'all' is selected along with other options, keep only 'all'
            updatedSelection = [{ value: 'all', label: 'View all Tags' }];
        } else {
            // Otherwise, keep all selected options
            updatedSelection = selectedOptions;
        }

        // Call the parent's handleTagSelection with the updated selection
        handleTagSelection(updatedSelection);
    };

    const tagOptions = getUniqueTags(tags)
    return (
        <Select
            classNamePrefix="select"
            name="accounts"
            closeMenuOnSelect={false}
            isSearchable
            isMulti={true}
            value={selectedTags}
            onChange={handleSelectChange}
            options={tagOptions}
            styles={selectStyles}
        />
    );
};

export default Selector;

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