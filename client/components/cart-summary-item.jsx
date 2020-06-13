import React, { Component } from 'react';

class CartSummaryItem extends Component {
  render() {
    const { formattedCurrency } = this.props;

    const { name, price, image, shortDescription, amount } = this.props;
    return (
      <div className="row justify-content-center  card-deck card my-2 w-100">
        <div className="col-sm my-2">
          <img className="img-fluid rounded mx-auto d-blockw-100 card-custom-not-hover cart-img-custom" src={image} alt={name} />
        </div>
        <div className="col-sm my-2">
          <p className="h2">{name}</p>
          <p className="h4 text-secondary">{formattedCurrency(price)}</p>
          <p className="h6">{shortDescription}</p>
          <p className="h5">Amount: <span>{amount}</span></p>
        </div>
      </div>
    );
  }
}

export default CartSummaryItem;
