// store.js, from here: https://react.christmas/2019/7
import React, { createContext, useContext, useReducer } from 'react';

const StoreContext = createContext();


const initialState =
{
    count: 0,
    message: "",
    isNewClient: false
};

const clientProfileInitialState = {
    lastName: '',
    firstName: ''
}

const infoReducer = (state, action) => {

}

const reducer = (state, action) => {
    switch (action.type) {
        case "increment":
            return {
                count: state.count + 1,
                message: action.message
            }
        case "decrement":
            return {
                count: state.count - 1,
                message: action.message
            }
        case "reset":
            return {
                count: 0,
                message: action.message
            }
        case "newClient":
            return {
                isNewClient: true
            }
        case "existingClient":
            return {
                isNewClient: false
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStore = () => useContext(StoreContext);