import { ADD_MESSAGE } from "./actions";
import { updateOrderBook } from "./helpers";

const initialState = {
    bids: [],
    asks: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_MESSAGE: {
            return updateOrderBook(state, action.payload);
        }
        default:
            return state;
    }
};

export default reducer;
