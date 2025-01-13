import { useReducer, useContext, useEffect } from "react";
import jwt from "jsonwebtoken";
import { DateTime } from 'luxon';

import Cookies from "js-cookie";
import React from "react";


// create the context
export const AuthStateContext = React.createContext({});

// set up initial state which is used in the below `AuthProvider` function
const initialState = {
    userId: "",
    accounts: [],
    currentAccounts: [],
    timePeriod: { value: "last30Days", label: "Last 30 Days" },
    startEndDate: ["", ""],
    interval: { value: "day", label: "Days" }
};





// set up the reducer - same as Redux, allows us to process more complex changes
// to the state within the context API
const reducer = (state, action) => {
    switch (action.type) {
        case "setAuthDetails":
            return {
                userId: action.payload.userId,
                accounts: action.payload.accounts,
                timePeriod: action.payload.timePeriod,
                startEndDate: action.payload.startEndDate,
                interval: action.payload.interval
            };
        case "removeAuthDetails":
            return {
                userId: initialState.userId,
                accounts: initialState.accounts,
                currentAccounts: initialState.currentAccounts,
            };
        case "setCurrentAccounts":
            return {
                ...state,
                currentAccounts: action.payload
            };
        case "updateAccounts":
            return {
                ...state,
                accounts: action.payload // Assuming the payload is the new accounts array
            };
        case "setTimePeriod":
            return {
                ...state,
                timePeriod: action.payload.timePeriod,
                startEndDate: action.payload.startEndDate,
                interval: action.payload.interval
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

export const AuthProvider = ({ children }) => {
    let localState = null;
    if (
        typeof localStorage !== "undefined" &&
        localStorage.getItem("kayloyal")
    ) {
        localState = JSON.parse(localStorage.getItem("kayloyal") || "");
    }
    const [state, dispatch] = useReducer(reducer, localState || initialState);

    if (typeof localStorage !== "undefined") {
        useEffect(() => {
            localStorage.setItem("kayloyal", JSON.stringify(state));
        }, [state]);
    }



    const getState = () => {
        return {
            userId: state.userId,
            accounts: state.accounts,
            currentAccounts: state.currentAccounts,
            timePeriod: state.timePeriod,
            startEndDate: state.startEndDate,
            interval: state.interval
        };
    };



    const isAuthenticated = () => {
        // Assuming you store your token in localStorage or cookies
        const decoded = decodeToken(getToken());

        if (!decoded) {
            return false; // No token found, user is not authenticated
        }

        try {


            if (!decoded.exp) {
                console.log("no exp field")
                return false; // No expiration field, consider user not authenticated
            }

            return DateTime.now() < DateTime.fromSeconds(decoded.exp);
        } catch (error) {
            console.error('Error decoding token:', error);
            return false; // In case of decoding error, consider user not authenticated
        }
    }


    const getToken = () => {
        return Cookies.get("kayloyal_jwt");
    };

    const decodeToken = (token) => {
        return jwt.decode(token);
    };

    const logout = () => {
        Cookies.remove("kayloyal_jwt");
        dispatch({ type: "removeAuthDetails" });
    };

    const login = (data) => {
        const formatDate = (date) => {
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        };
        var decoded = jwt.decode(data);
        Cookies.set("kayloyal_jwt", data);
        dispatch({
            type: "setAuthDetails",
            payload: {
                userId: decoded.userId,
                accounts: decoded.accounts,
                timePeriod: { value: "last30days", label: "Last 30 Days" },
                startEndDate: [formatDate(new Date(new Date().setDate(new Date().getDate() - 29))), formatDate(new Date())],
                interval: { value: "day", label: "Days" }
            },
        });
    };

    const setCurrentAccounts = (accounts) => {
        dispatch({
            type: "setCurrentAccounts",
            payload: accounts
        })
    }

    const setTimePeriod = ({ timePeriod, startEndDate, interval }) => {
        dispatch({
            type: "setTimePeriod",
            payload: {
                timePeriod: timePeriod,
                startEndDate: startEndDate,
                interval: interval
            }
        })
    }

    const updateAccounts = (accounts) => {
        console.log("updateDispatch", accounts)
        dispatch({
            type: "updateAccounts",
            payload: accounts

        })
    }

    const authApi = {
        getState,
        login,
        logout,
        isAuthenticated,
        setCurrentAccounts,
        updateAccounts,
        setTimePeriod,
        ...state
    };

    return (
        <AuthStateContext.Provider value={authApi}>
            {children}
        </AuthStateContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthStateContext);
};

export const withAuth = (Component) => {
    return function (props) {
        <AuthStateContext.Consumer>
            {(authApi) => <Component {...props} value={authApi} />}
        </AuthStateContext.Consumer>;
    };
};

export const hasAuthCookie = () => {
    if (Cookies.get("kayloyal_jwt") === undefined) {
        return false;
    } else {
        return true;
    }
};
