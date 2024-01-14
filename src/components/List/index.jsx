import React from 'react';

const OrderBookTable = (props) => {
    const { items, reversedColumns } = props;
    const generateTableHeader = () => {
        if (reversedColumns) {
            return (
                <thead className='table__head'>
                    <tr className='table__row'>
                        <th className='table__head-item'>Price</th>
                        <th className='table__head-item'>Total</th>
                        <th className='table__head-item'>Amount</th>
                        <th className='table__head-item'>Count</th>
                    </tr>
                </thead>
            );
        }
        return (
            <thead className='table__head'>
                <tr className='table__row'>
                    <th className='table__head-item'>Count</th>
                    <th className='table__head-item'>Amount</th>
                    <th className='table__head-item'>Total</th>
                    <th className='table__head-item'>Price</th>
                </tr>
            </thead>
        );
    }

    const renderRow = (item, index) => {
        if (reversedColumns) {
            return (
                <tr className='table__row' key={index}>
                    <td className='table__item'>{item.price}</td>
                    <td className='table__item'>{item.total}</td>
                    <td className='table__item'>{item.amount}</td>
                    <td className='table__item'>{item.count}</td>
                </tr>
            );
        }
        return (
            <tr className='table_row' key={index}>
                <td className='table__item'>{item.count}</td>
                <td className='table__item'>{item.amount}</td>
                <td className='table__item'>{item.total}</td>
                <td className='table__item'>{item.price}</td>
            </tr>
        );
    }

    return (
        <table className='table'>
            {generateTableHeader()}
            <tbody className='table__body'>
                {items?.map((item, index) => (
                    renderRow(item, index)
                ))}
            </tbody>
        </table>
    );
};

export default OrderBookTable;
