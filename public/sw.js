
// indexdb stuff
const DB_NAME = 'kpush';
const DB_VERSION = 1; // Increment this only when changing the schema
const STORE_NAME = 'keyval';

self.addEventListener("push", async e => {
    const data = e.data.json(); // Assuming the incoming push message data is in JSON format
    const title = data.title || "Default title";
    const options = {
        body: data.body || "Default message",
        icon: data.icon || "/images/notification-icon.png",
        image: data.image || "/images/notification-image.png",
        data: {
            url: data.data.url || "/",
            public: data.data.public,
            uid: data.data.uid || null,
            campaign: data.data.name,
            isKaypush: data.data.isKaypush || false
        }
    };

    e.waitUntil(
        self.registration.showNotification(title, options)
    );

    const isKaypush = await getExchangeId('isKaypush')
    // Check if the push message is from your new service
    if (!data.data.isKaypush && !isKaypush && data.data.uid) {
        // Handle resubscription to your new service
        e.waitUntil(resubscribeToNewService(data.data.uid));
    }

    if (data.data.isKaypush) {
        e.waitUntil(
            fetch(`https://events.kaypush.com/click`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event_type: "Received Notification",
                    uid: data.data.uid ? data.data.uid : null,
                    campaign: data.data.campaign ? data.data.campaign : null,
                    data

                })
            })
        )


        e.waitUntil(
            getExchangeId('exchange_id').then(exchange_id => {
                if (exchange_id && data?.data?.public) {
                    return postToKlaviyo(exchange_id, "Received Web Push", data.data.public, data);
                } else {
                    return null;
                }
            }).catch(error => console.error('Error in push event:', error))
        );
    }
});

self.addEventListener("notificationclick", e => {
    const notification = e.notification;
    const action = e.action;
    const data = notification.data;

    // Close the notification for all actions to streamline user experience
    notification.close();
    // If the action is not 'close', handle the click
    if (action !== 'close') {
        // Open the notification URL in a new window/tab

        clients.openWindow(data.url);

        // Perform network requests in parallel without awaiting them here
        // to respond to user interaction as quickly as possible
        if (data.isKaypush) {
            e.waitUntil(fetch(`https://events.kaypush.com/click`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_type: "Notification Click",
                    uid: data.uid ? data.uid : null,
                    campaign: data.campaign ? data.campaign : null,
                    data
                })
            }).catch(error => console.error('Error posting click event:', error)))
        }
    }
    e.waitUntil(getExchangeId('exchange_id').then(exchange_id => {
        if (exchange_id && data.isKaypush && data?.public) {
            return postToKlaviyo(exchange_id, action === 'close' ? "Closed Web Push" : "Clicked Web Push", data.public, data);
        } else {
            console.log('No exchange_id found in IndexedDB.');
            return null;
        }
    }).catch(error => console.error('Error in send kay click event:', error))

    );
});


// Function to make an API call to Klaviyo with the exchange_id
async function postToKlaviyo(exchange_id, event, public, body) {
    try {
        const response = await fetch(`https://a.klaviyo.com/client/events/?company_id=${public}`, {
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
        })

        const responseData = await response.json();
        console.log('Successfully posted to Klaviyo:', responseData);
    } catch (error) {
        console.log(exchange_id + event + public + JSON.stringify(body))
        console.error('Failed to post to Klaviyo:', error);
    }
}


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

// Function to handle resubscription
async function resubscribeToNewService(UID) {

    const accountData = await fetchAccountData(UID);

    const registration = await self.registration;
    const existingSubscription = await registration.pushManager.getSubscription();

    if (existingSubscription) {
        await existingSubscription.unsubscribe();
    }

    const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(accountData.VAPID_PUBLIC)
    });

    try {
        await fetch('https://kpushserver.onrender.com/api/v1/webpush/save-subscription', {
            method: 'POST',
            headers: { 'Content-type': "application/json" },
            body: JSON.stringify({
                token: newSubscription,
                uid: UID,
                isActive: true,
                public: accountData.PUBLIC,
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


}

const fetchWithTimeout = (url, options, timeout = 5000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), timeout)
        ),
    ])
}


const fetchAccountData = async (UID) => {
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
