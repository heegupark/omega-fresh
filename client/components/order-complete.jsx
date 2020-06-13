import React, { Component } from 'react';
import OrderCompleteItem from './order-complete-item';

class OrderComplete extends Component {
  render() {
    const { total, formattedCurrency, cartGroupByItems } = this.props;

    return (
      <div>
        <div className="row my-5">
          <div className="col-sm text-center">
            <p className="h2">Your order is successfully placed!</p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-sm text-center">
            <span className="h3 text-secondary">{'[Order Summary]'}</span>
            <span className="h3">{` Total: ${formattedCurrency(total)}`}</span>
          </div>
        </div>
        <div className="row col-md-6 cart-summary-custom mx-auto">
          <div className="col-sm align-items-center">
            {
              cartGroupByItems.map((item, index) => {
                const { productId, name, price, image, amount } = item;
                return <OrderCompleteItem
                  key={index}
                  productId={productId}
                  name={name}
                  price={price}
                  image={image}
                  amount={amount}
                  formattedCurrency={formattedCurrency} />;
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default OrderComplete;
