
import Cookies from "js-cookie";
import { planData } from "data/pricing";
import pako from "pako";
import { DateTime } from 'luxon';
import { Badge } from 'react-bootstrap'


export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const toCamelCase = (str) => {
    return str
        .split(' ') // Split the string into words
        .map((word, index) => {
            // Lowercase the first word, capitalize the initial letter of subsequent words
            if (index === 0) {
                return word.toLowerCase();
            } else {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
        })
        .join(''); // Join all the words to form a single string
};


export const getConfigToken = (type = "application/json") => {
    let config = {};
    const jwt = Cookies.get("kayloyal_jwt");
    if (jwt) {
        config.headers = {
            authorization: `Bearer ${jwt}`,
            "Content-Type": `${type}`,
        };
    }
    return config;
};

export const formatWebsite = (formattedWebsite) => {

    // Remove the protocol (http://, https://) if it exists
    formattedWebsite = formattedWebsite.replace(/^(?:https?:\/\/)?/i, "");

    // Remove 'www.' if it exists
    formattedWebsite = formattedWebsite.replace(/^www\./i, "");

    // Remove any trailing slashes
    formattedWebsite = formattedWebsite.replace(/\/+$/, "");

    // Remove any path, query string, or fragment
    formattedWebsite = formattedWebsite.split('/')[0]; // Get the domain part only

    // Add 'www.' prefix if it's not an IP address and 'www.' was not part of the original URL
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(formattedWebsite) && !formattedWebsite.startsWith('www.')) {
        formattedWebsite = 'www.' + formattedWebsite;
    }
    return formattedWebsite
}

export const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};


export const convertImageToBase64 = async (imageUrl) => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob(); // Convert the response to a blob

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); // This is the base64 string
            reader.onerror = reject;
            reader.readAsDataURL(blob); // Read the blob as a Data URL (base64)
        });
    } catch (error) {
        console.error("Failed to convert image to Base64:", error);
        return null;
    }
};

export const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

export const getNextHalfHour = () => {
    const now = new Date();
    let minutes = now.getMinutes();
    let hours = now.getHours();

    // Check if we need to round up to the next hour
    if (minutes >= 30) {
        minutes = 0; // Reset minutes to 0
        hours++;     // Increment the hour
    } else {
        minutes = 30; // Set minutes to 30
    }

    // Set the minutes and hours to the next half-hour mark
    now.setMinutes(minutes);
    now.setHours(hours);
    now.setSeconds(0); // Optionally reset seconds to 0 for cleanliness
    now.setMilliseconds(0); // Optionally reset milliseconds to 0

    // Handle the case where the hours increment moves to the next day
    if (hours >= 24) {
        now.setHours(hours - 24);
        now.setDate(now.getDate() + 1);
    }

    return now;
}

export function getPlanPrices(planName) {
    const plan = planData.find((p) => p.name === planName);
    if (!plan) {
        throw new Error(`Plan with name ${planName} not found`);
    }
    return {
        tokenPrice: plan.tokenPrice,
        planPrice: plan.planPrice,
    };
}

export function formatCurrency(amount, currency = "en-US", currencyDollar = "USD") {
    return new Intl.NumberFormat(currency, {
        style: 'currency',
        currency: currencyDollar,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

export function compressData(data) {
    // Convert string to Uint8Array
    const input = new TextEncoder().encode(data);

    // Compress data
    const deflated = pako.deflate(input);

    // Encode to Base64
    const base64Encoded = btoa(String.fromCharCode.apply(null, deflated));
    return base64Encoded;
}

export function decompressData(encoded) {
    // Decode from Base64 to binary string
    const binaryString = atob(encoded);

    // Convert binary string to byte array
    const charList = binaryString.split('').map(char => char.charCodeAt(0));
    const byteArray = new Uint8Array(charList);

    // Decompress data
    const inflated = pako.inflate(byteArray, { to: 'string' });
    return inflated;
}


export async function mergeMatchingAccounts(list2, list1, key) {
    const matchedAccounts = list1.filter(item1 =>
        list2.some(item2 =>
            item2[key] === item1[key]
        )
    ).map(item1 => {
        const matchingItem2 = list2.find(item2 =>
            item2[key] === item1[key]
        );

        return {
            ...item1,
            ...matchingItem2
        };
    });

    console.log(matchedAccounts); // Output the matched and merged accounts
    return matchedAccounts;
}

export const checkValidEmailHtml = (html) => {
    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Check for parsing errors
    if (doc.body.querySelector('parsererror')) {
        return false;
    }

    // Check for essential tags
    const htmlTag = doc.documentElement;
    const headTag = doc.head;
    const bodyTag = doc.body;

    if (!htmlTag || htmlTag.tagName !== 'HTML' ||
        !headTag || headTag.tagName !== 'HEAD' ||
        !bodyTag || bodyTag.tagName !== 'BODY') {
        return false;
    }

    // Helper function to check if tags are properly closed
    const checkTagsClosed = (element) => {
        const openTags = [];
        const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

        for (let node of element.childNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (!selfClosingTags.includes(node.tagName.toLowerCase())) {
                    openTags.push(node.tagName);
                    if (!checkTagsClosed(node)) {
                        return false;
                    }
                    if (openTags.pop() !== node.tagName) {
                        return false;
                    }
                }
            }
        }
        return openTags.length === 0;
    };

    // Check if all tags are properly closed
    if (!checkTagsClosed(htmlTag)) {
        return false;
    }


    return true; // If all checks pass, the email HTML is considered valid
};

export const createGmailLikePreview = (emailHtml) => {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.5;
                        color: #202124;
                        margin: 0;
                        padding: 20px;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        border: 1px solid #dadce0;
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    .email-header {
                        background-color: #f1f3f4;
                        padding: 12px 20px;
                        border-bottom: 1px solid #dadce0;
                    }
                    .email-subject {
                        font-size: 18px;
                        font-weight: bold;
                        margin: 0;
                    }
                    .email-body {
                        padding: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">

                    <div class="email-body">
                        ${emailHtml}
                    </div>
                </div>
            </body>
            </html>
        `;
};

export const formatCampaignDate = (dateString) => {
    const date = DateTime.fromISO(dateString);
    const now = DateTime.local();
    const diff = now.startOf('day').diff(date.startOf('day'), 'days').days;

    if (diff === 0) {
        return `Today at ${date.toFormat('h:mm a')}`;
    } else if (diff === 1) {
        return `Yesterday at ${date.toFormat('h:mm a')}`;
    } else {
        return date.toFormat('LLL d \'at\' h:mm a');
    }
};

export const formatScheduledDate = (dateString) => {
    const date = DateTime.fromISO(dateString);
    const now = DateTime.local();
    const diff = date.startOf('day').diff(now.startOf('day'), 'days').days;

    if (diff === 0) {
        return `Today at ${date.toFormat('h:mm a')}`;
    } else {
        return date.toFormat('MMMM d, yyyy \'at\' h:mm a');
    }
};

export const getStatusBadge = (status, date) => {
    let variant;
    switch (status.toLowerCase()) {
        case 'scheduled':
            if (date) {
                const scheduledDate = DateTime.fromJSDate(date);
                const now = DateTime.now();
                console.log(scheduledDate)
                console.log(now)
                variant = scheduledDate < now ? 'success' : 'info';
            } else {
                variant = 'info';
            }
            break;
        case 'draft':
            variant = 'secondary';
            break;
        case 'kayloyal-draft':
            variant = 'secondary';
            break;
        case 'cancelled':
            variant = 'danger';
            break;
        default:
            variant = 'primary';
    }
    return <Badge bg={variant}>{variant === "success" ? "SENT" : status}</Badge>;
};

export const groupAndAggregateCampaigns = (campaigns) => {
    const groupedData = {};

    campaigns?.forEach(campaign => {
        const channel = campaign.send_channel.toLowerCase(); // Normalize to lowercase
        campaign.tagNames.forEach(tag => {
            const groupKey = `${tag}_${channel}`; // Combine tag and channel for a unique key
            if (!groupedData[groupKey]) {
                groupedData[groupKey] = {
                    tagName: tag,
                    channel: channel,
                    isTag: true,
                    campaigns: 0,
                    statistics: {}
                };
            }

            groupedData[groupKey].campaigns++;

            Object.entries(campaign.statistics).forEach(([key, value]) => {
                if (key.endsWith('_rate') || key === "average_order_value" || key === "revenue_per_recipient") {
                    // For rate statistics, we'll sum them up and later calculate the average
                    groupedData[groupKey].statistics[key] = (groupedData[groupKey].statistics[key] || 0) + value;
                } else {
                    // For non-rate statistics, we'll sum them up
                    groupedData[groupKey].statistics[key] = (groupedData[groupKey].statistics[key] || 0) + value;
                }
            });
        });
    });

    // Calculate averages for rate statistics
    Object.values(groupedData).forEach(group => {
        Object.entries(group.statistics).forEach(([key, value]) => {
            if (key === "open_rate") {
                group.statistics[key] = (group.statistics.opens_unique / group.statistics.delivered * 100 || 0);
            } else if (key === "click_rate") {
                group.statistics[key] = (group.statistics.clicks_unique / group.statistics.delivered * 100 || 0);
            } else if (key === "conversion_rate") {
                group.statistics[key] = (group.statistics.conversion_uniques / group.statistics.delivered * 100 || 0)
            } else if (key === "average_order_value") {
                group.statistics[key] = (group.statistics.conversion_value / group.statistics.conversions || 0)
            } else if (key === "delivery_rate") {
                group.statistics[key] = (group.statistics.delivered / (group.statistics.delivered + group.statistics.bounced_or_failed) * 100 || 0)
            }
            else if (key === "revenue_per_recipient") {
                group.statistics[key] = (group.statistics.conversion_value / group.statistics.delivered || 0)
            } else if (key === "bounce_rate") {
                group.statistics[key] = (group.statistics.bounced / (group.statistics.delivered + group.statistics.bounced_or_failed) || 0)
            } else if (key === "bounced_or_failed_rate") {
                group.statistics[key] = (group.statistics.bounced_or_failed / (group.statistics.delivered + group.statistics.bounced_or_failed) || 0)
            } else if (key === "spam_complaint_rate") {
                group.statistics[key] = (group.statistics.spam_complaints / group.statistics.delivered || 0)
            } else if (key === "unsubscribe_rate") {
                group.statistics[key] = (group.statistics.unsubscribes / group.statistics.delivered || 0)
            }
        });
    });
    console.log(Object.values(groupedData))
    return Object.values(groupedData);
};



export function formatDateString(dateString) {
    if (dateString) {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // This will give you YYYY-MM-DD
    }
    return ''; // Return an empty string if dateString is null or undefined
}

export function formatTagNames(tagNames) {
    if (tagNames) {
        return tagNames.join(', ');
    }
}

export const formatRate = (rate) => {
    return `${rate.toFixed(3)}%`;
};

export const formatNumberWithCommas = (number, needDecimals = true) => {
    return number.toLocaleString(undefined, {
        minimumFractionDigits: needDecimals ? 2 : 0,
        maximumFractionDigits: needDecimals ? 2 : 0
    });
};