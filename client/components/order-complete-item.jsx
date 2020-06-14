import React, { Component } from 'react';

class OrderCompleteItem extends Component {
  render() {
    const { name, price, image, amount, formattedCurrency } = this.props;
    return (
      <div className="col-sm fade-in row card-deck card my-2 text-center">
        <div className="col-sm my-1">
          <img className="img-fluid rounded mx-auto card-custom-not-hover order-complete-item-img" src={image} alt={name} />
        </div>
        <div className="col-sm my-1">
          <p className="h6">{name}</p>
          <p className="h6 text-secondary">{formattedCurrency(price)}</p>
          <p className="h6">{`amount: ${amount}`}</p>
        </div>
      </div>
    );
  }
}

export default OrderCompleteItem;
