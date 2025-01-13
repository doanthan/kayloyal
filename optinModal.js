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
    if (options.iconUrl && options.iconUrl.trim() !== "") {
        const imageCol = document.createElement("div")
        imageCol.className = "col-md-3"
        const img = document.createElement("img")
        img.src = options.iconUrl
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

async function requestNotificationPermission() {
    const permission = await Notification.requestPermission()
    if (permission !== "granted") {
        throw new Error("Permission not granted for Notification")
    }
}

async function subscribeUserToPush() {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("YOUR_PUBLIC_VAPID_KEY_HERE"),
    })

    // Send the subscription to your server
    await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "Content-Type": "application/json",
        },
    })
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
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
        await requestNotificationPermission()
        await subscribeUserToPush()
        closeModal()
    } catch (error) {
        console.error("Error during subscription process:", error)
    }
})

// Expose showModal globally
window.showModal = showModal

// Main function
const fetchWithTimeout = (url, options, timeout = 5000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), timeout)
        ),
    ])
}

const fetchAccountData = async () => {
    try {
        const response = await fetchWithTimeout('https://cdn.kaypush.com/accounts/Op1vnuw.json', {}, 5000);
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

const extractFields = (data) => {
    const defaultValues = {
        TIME: 1000,
        PUBLIC: "defaultPublic",
        UID: "defaultUid",
        VAPID_PUBLIC: "defaultVapidPublic",
        TIMING_TYPE: "delayed",
        PAGE_SECONDS: 5000, // Default delay of 5 seconds
        DAYS_TO_REPROMPT: 7 // Default to 7 days if not set
    }

    if (!data) {
        return defaultValues
    }

    const { TIME = defaultValues.TIME, PUBLIC = defaultValues.PUBLIC, UID = defaultValues.UID, VAPID_PUBLIC = defaultValues.VAPID_PUBLIC, TIMING_TYPE = defaultValues.TIMING_TYPE, PAGE_SECONDS = defaultValues.PAGE_SECONDS, DAYS_TO_REPROMPT = defaultValues.DAYS_TO_REPROMPT } = data;
    return { TIME, PUBLIC, UID, VAPID_PUBLIC, TIMING_TYPE, PAGE_SECONDS, DAYS_TO_REPROMPT };
};

const main = async () => {
    const accountData = await fetchAccountData();
    const { TIME, PUBLIC, UID, VAPID_PUBLIC, TIMING_TYPE, PAGE_SECONDS, DAYS_TO_REPROMPT } = extractFields(accountData);
    console.log('TIME:', TIME);
    console.log('PUBLIC:', PUBLIC);
    console.log('UID:', UID);
    console.log('VAPID_PUBLIC:', VAPID_PUBLIC);
    console.log('TIMING_TYPE:', TIMING_TYPE);
    console.log('PAGE_SECONDS:', PAGE_SECONDS);
    console.log('DAYS_TO_REPROMPT:', DAYS_TO_REPROMPT);

    // Store DAYS_TO_REPROMPT in a global variable
    window.DAYS_TO_REPROMPT = DAYS_TO_REPROMPT;

    // Check if the modal was dismissed within the last DAYS_TO_REPROMPT days
    const modalDismissedUntil = localStorage.getItem("modalDismissedUntil");
    const now = new Date().getTime();
    if (modalDismissedUntil && now < parseInt(modalDismissedUntil, 10)) {
        console.log("Modal dismissed recently, not showing again.");
        return;
    }

    // Conditionally show the modal based on TIMING_TYPE
    setTimeout(() => {
        showModal({
            title: "Want to receive updates?",
            titleColor: "#212529",
            text: "Get the latest updates so you never miss a beat!",
            textColor: "#212529",
            modalPosition: "Bottom Right",
            backgroundColor: "#ffffff",
            imageSrc: "", // Add the iconUrl here if needed
            cancelButtonText: "No, thanks",
            cancelButtonBgColor: "#fff",
            cancelButtonTextColor: "#212529",
            acceptButtonText: "Yes, please!",
            acceptButtonBgColor: "#198754",
            acceptButtonTextColor: "#fff",
            iconUrl: "https://example.com/icon.png" // Example icon URL
        });
    }, TIMING_TYPE === "immediately" ? 0 : PAGE_SECONDS);

    // indexdb stuff
    const DB_NAME = 'kpush';
    const DB_VERSION = 1; // Increment this only when changing the schema
    const STORE_NAME = 'keyval';

    setTimeout(async () => {
        const kpushIdentified = localStorage.getItem('kpushIdentified')
        sessionStorage.setItem("checkKl", !kpushIdentified);
        if (!kpushIdentified) {
            sessionStorage.setItem("checkKl", false);
            const klaviyoCookie = await getCookie("__kla_id")
            if (Notification.permission === 'granted' && klaviyoCookie.$exchange_id) {
                const token = await getExchangeId('token')
                await identifyKlaviyo(klaviyoCookie.$exchange_id, { kpushWebToken: JSON.parse(token), hasWebPush: true })
                //await trackKlaviyo(klaviyoCookie.$exchange_id, "Webpush Identified", { subscribed: true, webToken: JSON.parse(token) })
                await putIndexDbValue('exchange_id', klaviyoCookie.$exchange_id)
                localStorage.setItem('kpushIdentified', true)
            }
        }
    }, 2000)

    setTimeout(async () => {
        checkPermission()
        if (Notification.permission === 'default') {
            const permission = await requestNotificationPermission()
            if (permission === 'granted') {
                console.log("HERE WE GO")
                await registerSW()
            }
        }
    }, TIME)
};

// Call the main function
main();