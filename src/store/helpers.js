const parseToObject = (entry) => {
    const [price, count, amount] = entry;
    const parsedAmount = Number(parseFloat(amount).toFixed(4));
    return {
        price,
        count,
        amount: parsedAmount,
    };
};

const parseEntries = (entries) => {
    if (!entries.length) {
        return [];
    }

    const [, items] = entries;

    if (Array.isArray(items?.[0])) {
        return items.map(parseToObject);
    }

    return [parseToObject(items)]
};

const getNewOrderBookState = (state, parsedMessage) => {
    let newBids = [ ...state.bids ]; 
    let newAsks = [ ...state.asks ];

    if (parsedMessage.count === 0) {
        if (parsedMessage.amount === 1) {
            const updatedBids = state.bids.filter((bid) => {
                return bid.price !== parsedMessage.price;
            });
            newBids = updatedBids;
        }
        if (parsedMessage.amount === -1) {
            const updatedAsks = state.asks.filter((ask) => {
                return ask.price !== parsedMessage.price;
            });
            newAsks = updatedAsks;
        }
    } else {
        if (parsedMessage.amount > 0) {
            const updatedMessages = [...state.bids, parsedMessage];
            const sortedMessages = updatedMessages.sort((a, b) => {
                return b.price - a.price;
            });
            const last25Messages = sortedMessages.slice(-25);
            newBids = last25Messages;
        }
        if (parsedMessage.amount < 0) {
            parsedMessage.amount = Math.abs(parsedMessage.amount);
            const updatedMessages = [...state.asks, parsedMessage];
            const sortedMessages = updatedMessages.sort((a, b) => {
                return a.price - b.price;
            });
            const last25Messages = sortedMessages.slice(-25);
            newAsks = last25Messages;
        }
    }

    const {resultBids} = newBids.reduce((acc, bid) => {
        const currentTotal = acc.currentTotal + bid.amount;
        const newBid = {...bid, total: Number(parseFloat(currentTotal).toFixed(4))};
        return {currentTotal, resultBids: [...acc.resultBids, newBid]};
    }, {currentTotal: 0, resultBids: []});

    const {resultAsks} = newAsks.reduce((acc, ask) => {
        const currentTotal = acc.currentTotal + ask.amount;
        const newAsk = {...ask, total: Number(parseFloat(currentTotal).toFixed(4))};
        return {currentTotal, resultAsks: [...acc.resultAsks, newAsk]};
    }, {currentTotal: 0, resultAsks: []});

    return { ...state, bids: resultBids, asks: resultAsks };
}

export const updateOrderBook = (state, data) => {
    if (!data) return state;
    const parsedMessages = parseEntries(data);
    
    const newState = parsedMessages.reduce((acc, parsedMessage) => {
        return getNewOrderBookState(acc, parsedMessage);
    }, state);

    return { ...newState };
}