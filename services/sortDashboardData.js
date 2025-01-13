const sortDashboardData = (data) => {
    const result = [];
    console.log(data)
    data.forEach(item => {
        const name = item?.name
        const klaviyoPublic = item?.klaviyoPublic;
        let totalRevenue = 0;
        let klaviyoRevenue = 0;
        let emailsReceived = 0;
        let emailsOpened = 0
        let emailsClicked = 0;
        let smsReceived = 0;
        let smsClicked = 0;
        let emailSubscribed = 0;
        let emailUnsubscribed = 0;
        let smsSubscribed = 0;
        let smsUnsubscribed = 0;

        // Process each metric based on its name
        item?.data?.attributes.data.forEach(entry => {
            switch (item.metricName) {
                case "Revenue":
                    entry.measurements.sum_value.forEach(value => {
                        totalRevenue += value;
                        if (entry.dimensions[0] !== "") {
                            klaviyoRevenue += value;
                        }
                    });
                    break;
                case "Received Email":
                    entry.measurements.count.forEach(value => {
                        emailsReceived += value;
                    });
                    break;
                case "Opened Email":
                    entry.measurements.count.forEach(value => {
                        emailsOpened += value;
                    });
                    break;
                case "Clicked Email":
                    entry.measurements.count.forEach(value => {
                        emailsClicked += value;
                    });
                    break;
                case "Received SMS":
                    entry.measurements.count.forEach(value => {
                        smsReceived += value;
                    });
                    break;
                case "Clicked SMS":
                    entry.measurements.count.forEach(value => {
                        smsClicked += value;
                    });
                    break;
                case "Subscribed to Email":
                    entry.measurements.count.forEach(value => {
                        emailSubscribed += value;
                    });
                    break;
                case "Unsubscribed from Email Marketing":
                    entry.measurements.count.forEach(value => {
                        emailUnsubscribed += value;
                    });
                    break;
                case "Subscribed to SMS Marketing":
                    entry.measurements.count.forEach(value => {
                        smsSubscribed += value;
                    });
                    break;
                case "Unsubscribed from SMS Marketing":
                    entry.measurements.count.forEach(value => {
                        smsUnsubscribed += value;
                    });
                    break;
            }
        });

        // Check if an entry with the same account already exists
        let existingEntry = result.find(r => r.klaviyoPublic === klaviyoPublic);
        if (existingEntry) {
            existingEntry.totalRevenue += totalRevenue;
            existingEntry.klaviyoRevenue += klaviyoRevenue;
            existingEntry.emailsReceived += emailsReceived;
            existingEntry.emailsOpened += emailsOpened;
            existingEntry.emailsClicked += emailsClicked;
            existingEntry.smsReceived += smsReceived;
            existingEntry.smsClicked += smsClicked;
            existingEntry.emailSubscribed += emailSubscribed;
            existingEntry.emailUnsubscribed += emailUnsubscribed;
            existingEntry.smsSubscribed += smsSubscribed;
            existingEntry.smsUnsubscribed += smsUnsubscribed;
        } else {
            result.push({
                name: name,
                klaviyoPublic: klaviyoPublic,
                totalRevenue: totalRevenue,
                klaviyoRevenue: klaviyoRevenue,
                emailsReceived: emailsReceived,
                emailsOpened: emailsOpened,
                emailsClicked: emailsClicked,
                smsReceived: smsReceived,
                smsClicked: smsClicked,
                emailSubscribed: emailSubscribed,
                emailUnsubscribed: emailUnsubscribed,
                smsSubscribed: smsSubscribed,
                smsUnsubscribed: smsUnsubscribed
            });
        }
    });
    console.log(result)

    return result;
}

export { sortDashboardData }