import { createStore } from 'redux';

const initialState = {
    isLoggedIn: false,
    token: null,
    user: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isLoggedIn: true,
                token: action.payload.token,
                user: action.payload.user,
            };
        case 'LOGOUT':
            return {
                ...state,
                isLoggedIn: false,
                token: null,
                user: null,
            };
        default:
            return state;
    }
};

const store = createStore(authReducer);

export default store;
