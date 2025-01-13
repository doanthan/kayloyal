// Main Initialization
let accountData = null;

// Function to get query parameters from the script URL
const getQueryParams = (scriptSrc) => {
    const params = {};
    const queryString = scriptSrc.split('?')[1];
    if (queryString) {
        const pairs = queryString.split('&');
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
    }
    return params;
};


// Get the current script element
const currentScript = document.currentScript || (function () {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
})();

// Extract the query parameters from the script URL
const queryParams = getQueryParams(currentScript.src);
const UID = queryParams.company_id;
const SITE = queryParams.site
const TRANSFER = queryParams.transfer || false
//only use sw if there is another sw 
const OLD_SW = queryParams.sw


// indexdb stuff
const DB_NAME = 'kpush';
const DB_VERSION = 1; // Increment this only when changing the schema
const STORE_NAME = 'keyval';

const fetchWithTimeout = (url, options, timeout = 5000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), timeout)
        ),
    ])
}





// Function to make an API call to Klaviyo with the exchange_id
async function trackKlaviyo(exchange_id, event, body) {
    try {
        const response = await fetch(`https://a.klaviyo.com/client/events/?company_id=${accountData.PUBLIC}`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                revision: '2024-02-15',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    type: "event",
                    attributes: {
                        properties: body,
                        metric: {
                            data: {
                                type: "metric",
                                attributes: {
                                    name: event
                                }
                            }
                        },
                        profile: {
                            data: {
                                type: "profile",
                                attributes: {
                                    _kx: exchange_id,
                                    "properties": {
                                    }
                                }
                            }
                        }
                    }
                }
            }),
        });
        const x = Math.floor(Date.now() / 1000)
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        console.log('Successfully posted to Klaviyo:');
        return;
    } catch (error) {
        console.error('Failed to post to Klaviyo:', error);
    }
}

// Function to make an API call to Klaviyo with the exchange_id
async function identifyKlaviyo(exchange_id, body) {
    try {
        const response = await fetch(`https://a.klaviyo.com/client/profiles/?company_id=${accountData.PUBLIC}`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                revision: '2024-02-15',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    type: "profile",
                    attributes: {
                        _kx: exchange_id,
                        properties: body
                    },
                }
            }),
        });
        const x = Math.floor(Date.now() / 1000)
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        console.log('Successfully identified to Klaviyo:');
        return;
    } catch (error) {
        console.error('Failed to post to Klaviyo:', error);
    }
}

function getCookie(name) {
    // Encode the cookie name to handle special characters
    name = encodeURIComponent(name);

    // Split document.cookie on semicolons into an array of all the cookies
    const cookieArr = document.cookie.split(';');

    // Loop through the array elements
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].trim().split('=');

        // Decode the cookie name and compare it with the given string (name)
        if (cookiePair[0] === name) {
            // Decode the cookie value, parse it as JSON, and return it
            try {
                return JSON.parse(atob(decodeURIComponent(cookiePair[1])));
            } catch (e) {
                console.error("Error parsing cookie value:", e);
                return null;
            }
        }
    }
    // Return null if the cookie is not found
    return null;
}

// Function to get exchange_id from IndexedDB
async function getExchangeId(key) {
    const db = await openDatabase(); // Use the centralized database opening function
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            if (request.result !== undefined) {
                resolve(request.result); // Key found, resolve with the value
            } else {
                resolve(null); // Key not found, resolve with null to indicate absence
            }
        };
        request.onerror = () => reject(request.error);
    });
}

async function putIndexDbValue(key, value) {
    const db = await openDatabase();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}


// Centralized database initialization function
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onerror = function (event) {
            reject('IndexedDB error:', event.target.error);
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };
    });
}

const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

const saveSubscription = async (subscription) => {
    console.log("SUBSCRIPTION!")
    const klaviyoCookie = await getCookie("__kla_id")
    try {
        await fetch('https://kpushserver.onrender.com/api/v1/webpush/save-subscription', {
            method: 'POST',
            headers: { 'Content-type': "application/json" },
            body: JSON.stringify({
                token: subscription,
                uid: UID,
                isActive: true,
                public: accountData.PUBLIC,
                ...(klaviyoCookie && klaviyoCookie.$exchange_id && {
                    exchange_id: klaviyoCookie.$exchange_id,
                    isIdentified: true
                })
            })
        })
    } catch (error) {
        console.log("error posting to kpushserver", error.message)
    }

    try {
        await fetch(`https://events.kaypush.com/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: "Subscribed to Webpush",
                uid: UID,
                quantity: 1
            })
        })
    } catch (error) {
        console.log("error posting to kaypush click", error.message)
    }

    await putIndexDbValue('token', JSON.stringify(subscription))
    await putIndexDbValue('isKaypush', true)
    localStorage.setItem('isKaypush', true)

    if (klaviyoCookie && klaviyoCookie.$exchange_id && accountData.PUBLIC) {
        localStorage.setItem('kpushIdentified', true)
        await putIndexDbValue('exchange_id', klaviyoCookie.$exchange_id);
        await trackKlaviyo(klaviyoCookie.$exchange_id, "Subscribed to Webpush", { subscribed: true, kpushWebToken: subscription })
        await identifyKlaviyo(klaviyoCookie.$exchange_id, { kpushWebToken: subscription, hasWebPush: true })
    }

    return true
}


const fetchAccountData = async () => {
    try {
        const response = await fetchWithTimeout(`https://cdn.kaypush.com/accounts/${UID}.json`, {}, 5000);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch account data:', error);
        return null; // Return null if the fetch fails
    }
};

const checkPermission = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error("No support for service worker!")
    }

    if (!('Notification' in window)) {
        throw new Error("No support for notification API");
    }

    if (!('PushManager' in window)) {
        throw new Error("No support for Push API")
    }
}
const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            return null; // Return null or a default value if permission is not granted
        }
        return permission;
    } catch (error) {
        return null; // Return null or a default value in case of an error
    }
};

const registerSW = async () => {
    let folderLocation = "'./kaypush-sw.js'"

    switch (SITE) {
        case "bigcommerce":
            folderLocation = "./content/kaypush-sw.js"
            break;
        case "shopify":
            folderLocation = "./kaypush-sw.js"
            break;
        case "magento":
            folderLocation = "./kaypush-sw.js"
            break;
        case "wordpress":
            folderLocation = "./kaypush-sw.js"
            break;
        case "drupal":
            folderLocation = "./kaypush-sw.js"
            break;
        case "custom":
            folderLocation = accountData.sw_location
            break;
        default:
            folderLocation = "./kaypush-sw.js"
    }
    const registration = await navigator.serviceWorker.register(folderLocation)
    putIndexDbValue('UID', accountData.UID)
    await navigator.serviceWorker.ready
    return registration
}


const main = async () => {
    try {

        accountData = await fetchAccountData();

        if (accountData) {
            const { PROMPT_TYPE = "native", TITLE, TITLE_COLOR, MESSAGE_COLOR, MESSAGE, MODAL_POSITION, BACKGROUND_COLOR, ACCEPT_BUTTON_TEXT, ACCEPT_BUTTON_COLOR, ACCEPT_BUTTON_TEXT_COLOR, CANCEL_BUTTON_TEXT, CANCEL_BUTTON_COLOR, CANCEL_BUTTON_TEXT_COLOR, TIMING_TYPE = "immediately", PAGE_SECONDS_TO_SHOW = 0, DAYS_TO_REPROMPT = 3, SHOW_ICON, iconUrl } = accountData;

            checkPermission();
            //transfer from old push service
            if (TRANSFER) {
                await checkAndResyncOldServiceWorker()
                checkAndResyncSubscription()
            }

            // Store DAYS_TO_REPROMPT in a global variable
            window.DAYS_TO_REPROMPT = DAYS_TO_REPROMPT;
            window.SHOW_ICON = SHOW_ICON
            window.ICON_URL = iconUrl

            // Check if the modal was dismissed within the last DAYS_TO_REPROMPT days
            const modalDismissedUntil = localStorage.getItem("modalDismissedUntil");
            const now = new Date().getTime();
            if (modalDismissedUntil && now < parseInt(modalDismissedUntil, 10)) {
                console.log("Modal dismissed recently, not showing again.");
                return;
            }

            if (Notification.permission === 'default') {
                if (PROMPT_TYPE === 'custom' && TITLE && MESSAGE && MODAL_POSITION) {
                    // Check if the modal was dismissed within the last 7 days
                    const modalDismissedUntil = localStorage.getItem("modalDismissedUntil");
                    const now = new Date().getTime();
                    if (modalDismissedUntil && now < parseInt(modalDismissedUntil, 10)) {
                        console.log("Modal dismissed recently, not showing again.");
                        return;
                    }
                    setTimeout(() => {
                        showModal({
                            title: TITLE,
                            titleColor: TITLE_COLOR,
                            text: MESSAGE,
                            textColor: MESSAGE_COLOR,
                            modalPosition: MODAL_POSITION,
                            backgroundColor: BACKGROUND_COLOR,
                            iconUrl,
                            showIcon: SHOW_ICON,
                            cancelButtonText: CANCEL_BUTTON_TEXT,
                            cancelButtonBgColor: CANCEL_BUTTON_COLOR,
                            cancelButtonTextColor: CANCEL_BUTTON_TEXT_COLOR,
                            acceptButtonText: ACCEPT_BUTTON_TEXT,
                            acceptButtonBgColor: ACCEPT_BUTTON_COLOR,
                            acceptButtonTextColor: ACCEPT_BUTTON_TEXT_COLOR,
                        });
                    }, TIMING_TYPE === "immediately" ? 0 : PAGE_SECONDS_TO_SHOW * 1000);
                } else if (PROMPT_TYPE === 'native') {
                    const permission = await requestNotificationPermission()
                    if (permission === 'granted') {
                        const registration = await registerSW()
                        const subscription = await registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            // this is the public key to get from server
                            applicationServerKey: urlBase64ToUint8Array(accountData.VAPID_PUBLIC)
                        })
                        await saveSubscription(subscription)
                    }
                }
            }


            setTimeout(async () => {
                const kpushIdentified = localStorage.getItem('kpushIdentified')
                sessionStorage.setItem("checkKl", !kpushIdentified);
                if (!kpushIdentified) {
                    sessionStorage.setItem("checkKl", false);
                    const klaviyoCookie = await getCookie("__kla_id")
                    if (Notification.permission === 'granted' && klaviyoCookie.$exchange_id && accountData.PUBLIC) {
                        const token = await getExchangeId('token')
                        await identifyKlaviyo(klaviyoCookie.$exchange_id, { kpushWebToken: JSON.parse(token), hasWebPush: true })
                        await putIndexDbValue('exchange_id', klaviyoCookie.$exchange_id)
                        localStorage.setItem('kpushIdentified', true)
                    }
                }
            }, 2000)
        }

    } catch (error) {
        console.error("Permission check failed:", error);
        return; // Exit the function to prevent further execution
    }

};

main();

// Create the modal container
const modal = document.createElement("div")
modal.id = "optinModal"
modal.className = "modal rounded shadow-sm p-4"
modal.style.cssText =
    "display: none; position: fixed; width: 450px; height: auto; transition: transform 0.5s ease-out;"

// Create the row container
const rowDiv = document.createElement("div")
rowDiv.className = "row"

// Create the column for the text
const textCol = document.createElement("div")
textCol.className = "col-md-9"
const modalTitle = document.createElement("h5")
modalTitle.id = "modalTitle"
modalTitle.textContent = "Title" // Default title
const modalText = document.createElement("p")
modalText.id = "modalText"
modalText.textContent = "This is a simple modal example." // Default text
textCol.appendChild(modalTitle)
textCol.appendChild(modalText)

// Create the footer for buttons
const footerDiv = document.createElement("div")
footerDiv.className = "text-end"
const cancelButton = document.createElement("button")
cancelButton.id = "cancelButton"
cancelButton.className = "btn me-2"
cancelButton.textContent = "Cancel"
const acceptButton = document.createElement("button")
acceptButton.id = "acceptButton"
acceptButton.className = "btn"
acceptButton.textContent = "Accept"
footerDiv.appendChild(cancelButton)
footerDiv.appendChild(acceptButton)

// Append all parts to the modal
rowDiv.appendChild(textCol)
rowDiv.appendChild(footerDiv)
modal.appendChild(rowDiv)
document.body.appendChild(modal)

let currentModalPosition = "Top Right" // Default position


function getPositionProperties(modalPosition) {
    const positions = {
        "Top Right": {
            top: "20px",
            right: "20px",
            bottom: "unset",
            left: "unset",
            transform: "translateX(0%)",
        },
        "Bottom Left": {
            top: "unset",
            right: "unset",
            bottom: "20px",
            left: "20px",
            transform: "translateX(0%)",
        },
        "Top Left": {
            top: "20px",
            right: "unset",
            bottom: "unset",
            left: "20px",
            transform: "translateX(0%)",
        },
        "Bottom Right": {
            top: "unset",
            right: "20px",
            bottom: "20px",
            left: "unset",
            transform: "translateX(0%)",
        },
    }
    return positions[modalPosition] || positions["Top Right"]
}

function showModal(options) {
    const positionStyles = getPositionProperties(
        options.modalPosition || currentModalPosition
    )
    Object.assign(modal.style, {
        top: positionStyles.top,
        right: positionStyles.right,
        bottom: positionStyles.bottom,
        left: positionStyles.left,
        backgroundColor: options.backgroundColor || "#fff",
        display: "block",
        transform: ["Top Right", "Bottom Right"].includes(options.modalPosition)
            ? "translateX(100%)"
            : "translateX(-100%)",
    })

    setTimeout(() => {
        // Animate into view
        modal.style.transform = positionStyles.transform
    }, 10)

    modalTitle.textContent = options.title || "Title"
    modalTitle.style.color = options.titleColor || "#212529"
    modalText.textContent = options.text || "This is a simple modal example."
    modalText.style.color = options.textColor || "#212529"

    // Conditionally create and append imageCol if iconUrl exists
    if (window.SHOW_ICON && window.ICON_URL && window.ICON_URL.trim() !== "") {
        const imageCol = document.createElement("div")
        imageCol.className = "col-md-3"
        const img = document.createElement("img")
        img.src = window.ICON_URL
        img.alt = "Image"
        imageCol.appendChild(img)
        rowDiv.insertBefore(imageCol, textCol)
    }

    cancelButton.style.backgroundColor =
        options.cancelButtonBgColor || "#dc3545"
    cancelButton.style.color = options.cancelButtonTextColor || "#adb5bd"
    cancelButton.textContent = options.cancelButtonText || "No thanks"
    acceptButton.style.backgroundColor =
        options.acceptButtonBgColor || "#28a745"
    acceptButton.style.color = options.acceptButtonTextColor || "#198754"
    acceptButton.textContent = options.acceptButtonText || "Yes please"

    // Update current position
    currentModalPosition = options.modalPosition || "Top Right"
}

function closeModal() {
    modal.style.transform = ["Top Right", "Bottom Right"].includes(
        currentModalPosition
    )
        ? "translateX(100%)"
        : "translateX(-100%)"
    setTimeout(() => {
        modal.style.display = "none"
    }, 500) // Delay to match the transition time
}

cancelButton.addEventListener("click", () => {
    // Set a timestamp in localStorage to prevent showing the modal for DAYS_TO_REPROMPT days
    const now = new Date().getTime();
    const repromptInMillis = window.DAYS_TO_REPROMPT * 24 * 60 * 60 * 1000;
    localStorage.setItem("modalDismissedUntil", now + repromptInMillis);
    closeModal();
});

acceptButton.addEventListener("click", async () => {
    try {
        closeModal();
        const permission = await requestNotificationPermission();  // Capture the result here
        const accountData = await fetchAccountData();
        if (permission === 'granted' && accountData) {
            const registration = await registerSW()
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                // this is the public key to get from server
                applicationServerKey: urlBase64ToUint8Array(accountData.VAPID_PUBLIC)
            })
            await saveSubscription(subscription)
        }
    } catch (error) {
        console.error("Error during subscription process:", error);
    }
});
// Expose showModal globally
window.showModal = showModal

async function checkAndResyncSubscription() {

    try {
        // Get all registrations
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (registrations.length === 0) {
            console.log("No service worker registrations found.");
            return;
        }

        // Process each registration
        for (const registration of registrations) {
            console.log(`Found registration with scope: ${registration.scope}`);
            // Check the subscription for each registration
            const existingSubscription = await registration.pushManager.getSubscription();
            if (existingSubscription) {
                console.log("Found subscription:", existingSubscription);
                const isKaypush = await getExchangeId('isKaypush') || false
                const isKaypushLocal = localStorage.getItem('isKaypush') || false
                if (existingSubscription && !isKaypush && !isKaypushLocal) {
                    await existingSubscription.unsubscribe();

                    // Subscribe with new VAPID keys
                    const newSubscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(accountData.VAPID_PUBLIC)
                    });

                    // Send the new subscription details to your server
                    await saveSubscription(newSubscription);

                }
            } else {
                console.log(`No subscription found for registration with scope: ${registration.scope}`);
            }
        }
    } catch (error) {
        console.error("Error in checkAndResyncSubscription:", error);
    }
}

async function checkAndResyncOldServiceWorker() {
    navigator.serviceWorker.getRegistrations().then(async function (registrations) {
        registrations.forEach(async function (registration) {
            if (OLD_SW && registration.active && registration.active.scriptURL.endsWith(OLD_SW)) {
                // Unregister the old service worker

                await registration.unregister();
                console.log('Unregistered old service worker:', registration.active.scriptURL);
                await registerSW()
            }
            else if (registration.active && !registration.active.scriptURL.endsWith('kaypush-sw.js')) {

                registration.unregister().then(async function (success) {
                    if (success) {
                        console.log('Unregistered old service worker:', registration.active.scriptURL);
                        // Register new service worker
                        await registerSW();
                    }
                });
            }
        });
    });

}


