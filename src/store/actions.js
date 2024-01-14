export const ADD_MESSAGE = 'ADD_MESSAGE';

export function addMessageAction(message) {
    return {
        type: ADD_MESSAGE,
        payload: message
    };
}