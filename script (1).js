// we pick up these unique values from the customer
const TIME = 1000
const PUBLIC = "VZdSUY"
const UID = "abc1234"
const VAPID_PUBLIC =
  "BGoZQd1aLopszQRcM4sStm6TqoJmpnVqqEfpnv53bDBfJKMPMzg8H9MixunCXTAc4lIL9JxPoNTGXISHfWJyOf8"

// {
//     "subject": "mailto: <doanthan@gmaul.com>",
//         "publicKey": "BGoZQd1aLopszQRcM4sStm6TqoJmpnVqqEfpnv53bDBfJKMPMzg8H9MixunCXTAc4lIL9JxPoNTGXISHfWJyOf8",
//             "privateKey": "EGi7yIfNLF_l4v34I8CoAbc34fvQiW159UCEiXv_A9g"
// }

// indexdb stuff
const DB_NAME = "kpush"
const DB_VERSION = 1 // Increment this only when changing the schema
const STORE_NAME = "keyval"

setTimeout(async () => {
  const kpushIdentified = localStorage.getItem("kpushIdentified")
  sessionStorage.setItem("checkKl", !kpushIdentified)
  if (!kpushIdentified) {
    sessionStorage.setItem("checkKl", false)
    const klaviyoCookie = await getCookie("__kla_id")
    if (Notification.permission === "granted" && klaviyoCookie.$exchange_id) {
      const token = await getExchangeId("token")
      await identifyKlaviyo(klaviyoCookie.$exchange_id, {
        webToken: JSON.parse(token),
        hasWebPush: true,
      })
      //await trackKlaviyo(klaviyoCookie.$exchange_id, "Webpush Identified", { subscribed: true, webToken: JSON.parse(token) })
      await putIndexDbValue("exchange_id", klaviyoCookie.$exchange_id)
      localStorage.setItem("kpushIdentified", true)
    }
  }
}, 2000)

setTimeout(async () => {
  checkPermission()
  if (Notification.permission === "default") {
    const permission = await requestNotificationPermission()
    if (permission === "granted") {
      console.log("HERE WE GO")
      await registerSW()
    }
  }
}, TIME)

const saveSubscription = async (subscription) => {
  console.log("SUBSCRIPTION!")
  const klaviyoCookie = getCookie("__kla_id")

  const response = await fetch(
    "https://kpushserver.onrender.com/api/v1/webpush/save-subscription",
    {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        token: subscription,
        uid: UID,
        exchange_id: klaviyoCookie.$exchange_id
          ? klaviyoCookie.$exchange_id
          : null,
        isIdentified: klaviyoCookie.$exchange_id ? true : false,
        isActive: true,
        public: PUBLIC,
      }),
    }
  )
  await putIndexDbValue("token", JSON.stringify(subscription))

  if (klaviyoCookie.$exchange_id) {
    await trackKlaviyo(klaviyoCookie.$exchange_id, "Subscribed to Webpush", {
      subscribed: true,
      webToken: subscription,
    })
    await identifyKlaviyo(klaviyoCookie.$exchange_id, {
      webToken: subscription,
      hasWebPush: true,
    })
  }

  return response
}

const registerSW = async () => {
  const registration = await navigator.serviceWorker.register(
    "https://myworkspace07d1b.myclickfunnels.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdy9PRFE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1cef1394748bb5cbc36081f074d4596a191d8996/importsw.js"
  )
  await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    // this is the public key to get from server
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
  })
  // check to see if Klaviyo user exists. If so, create indexeddb data store with Id
  const klaviyoCookie = getCookie("__kla_id")
  if (klaviyoCookie.$exchange_id) {
    localStorage.setItem("kpushIdentified", true)
    await putIndexDbValue("exchange_id", klaviyoCookie.$exchange_id)
  }
  await saveSubscription(subscription)
  return registration
}

const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission()
  if (permission !== "granted") {
    throw new Error("Notification permission not granted")
  }
  return permission
}

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

const checkPermission = () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No support for service worker!")
  }

  if (!("Notification" in window)) {
    throw new Error("No support for notification API")
  }

  if (!("PushManager" in window)) {
    throw new Error("No support for Push API")
  }
}

const checkCookie = async () => {
  const klaviyoCookie = getCookie("__kla_id")
  console.log(klaviyoCookie)
  if (klaviyoCookie.$exchange_id) {
    await putIndexDbValue("exchange_id", klaviyoCookie.$exchange_id)
  }
}

// Function to make an API call to Klaviyo with the exchange_id
async function trackKlaviyo(exchange_id, event, body) {
  try {
    const response = await fetch(
      `https://a.klaviyo.com/client/events/?company_id=${PUBLIC}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          revision: "2024-02-15",
          "content-type": "application/json",
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
                    name: event,
                  },
                },
              },
              profile: {
                data: {
                  type: "profile",
                  attributes: {
                    _kx: exchange_id,
                    properties: {},
                  },
                },
              },
            },
          },
        }),
      }
    )
    const x = Math.floor(Date.now() / 1000)
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }

    console.log("Successfully posted to Klaviyo:")
    return
  } catch (error) {
    console.error("Failed to post to Klaviyo:", error)
  }
}

// Function to make an API call to Klaviyo with the exchange_id
async function identifyKlaviyo(exchange_id, body) {
  try {
    const response = await fetch(
      `https://a.klaviyo.com/client/profiles/?company_id=${PUBLIC}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          revision: "2024-02-15",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          data: {
            type: "profile",
            attributes: {
              _kx: exchange_id,
              properties: body,
            },
          },
        }),
      }
    )
    const x = Math.floor(Date.now() / 1000)
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }

    console.log("Successfully identified to Klaviyo:")
    return
  } catch (error) {
    console.error("Failed to post to Klaviyo:", error)
  }
}

function getCookie(name) {
  // Encode the cookie name to handle special characters
  name = encodeURIComponent(name)

  // Split document.cookie on semicolons into an array of all the cookies
  const cookieArr = document.cookie.split(";")

  // Loop through the array elements
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].trim().split("=")

    // Decode the cookie name and compare it with the given string (name)
    if (cookiePair[0] === name) {
      // Decode the cookie value, parse it as JSON, and return it
      try {
        return JSON.parse(atob(decodeURIComponent(cookiePair[1])))
      } catch (e) {
        console.error("Error parsing cookie value:", e)
        return null
      }
    }
  }
  // Return null if the cookie is not found
  return null
}

// Function to get exchange_id from IndexedDB
async function getExchangeId(key) {
  const db = await openDatabase() // Use the centralized database opening function
  const transaction = db.transaction([STORE_NAME], "readonly")
  const store = transaction.objectStore(STORE_NAME)
  const request = store.get(key)

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      if (request.result !== undefined) {
        resolve(request.result) // Key found, resolve with the value
      } else {
        resolve(null) // Key not found, resolve with null to indicate absence
      }
    }
    request.onerror = () => reject(request.error)
  })
}

async function putIndexDbValue(key, value) {
  const db = await openDatabase()
  const transaction = db.transaction([STORE_NAME], "readwrite")
  const store = transaction.objectStore(STORE_NAME)
  const request = store.put(value, key)

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// Centralized database initialization function
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = function (event) {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }

    request.onerror = function (event) {
      reject("IndexedDB error:", event.target.error)
    }

    request.onsuccess = function (event) {
      resolve(event.target.result)
    }
  })
}
