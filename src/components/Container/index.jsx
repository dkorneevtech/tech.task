import React, { useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { connect } from 'react-redux';
import { addMessageAction } from '../../store/actions';
import OrderBookTable from '../List';

const Container = (props) => {
    const socketUrl = 'wss://api-pub.bitfinex.com/ws/2'
    const { sendMessage, readyState } = useWebSocket(socketUrl,{
        onOpen: () => {
          console.log('WebSocket connection established.');
        },
        onMessage: (event) => {
          try {
            const data = JSON.parse(event.data);
            props.addMessage(data);
          } catch (e) {
            console.error(e);
          }
        },
        shouldReconnect: (closeEvent) => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
      });

    const subscribe = () => {
        const msg = JSON.stringify({
            event: 'subscribe',
            channel: 'book',
            symbol: 'tBTCUSD',
            prec: 'P0',
            freq: 'F0',
            len: 25
        })
        sendMessage(msg)
    }

    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            subscribe();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [readyState])

    const unsubscribe = () => {
        const msg = JSON.stringify({
            event: 'unsubscribe',
            channel: 'book',
            symbol: 'tBTCUSD',
            prec: 'P0',
            freq: 'F0',
            len: 25
        })
        sendMessage(msg)
    }

    return (
        <div className="container">
            <div className="container__buttons">
                <button className='container__button' onClick={subscribe}>Subscribe</button>
                <button className='container__button' onClick={unsubscribe}>Unsubscribe</button>
            </div>
            <div className='container__tables'>
                <div>
                    <OrderBookTable items={props?.bids} />
                </div>
                <div>
                    <OrderBookTable items={props?.asks} reversedColumns />
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        asks: state.messages.asks,
        bids: state.messages.bids,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addMessage: (message) => dispatch(addMessageAction(message))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
