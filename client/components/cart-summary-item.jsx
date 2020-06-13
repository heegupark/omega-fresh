import React, { Component } from 'react';

class CartSummaryItem extends Component {
  constructor() {
    super();
    this.handleAddToCartClick = this.handleAddToCartClick.bind(this);
  }

  handleAddToCartClick() {
    const { productId, price, addToCart } = this.props;
    const addProduct = { productId, price };
    addToCart(addProduct);
  }

  render() {
    const { handleAddToCartClick } = this;
    const { name, price, image, shortDescription, amount, formattedCurrency } = this.props;
    return (
      <div className="row justify-content-center  card-deck card my-2 w-100">
        <div className="col-sm my-2">
          <img className="img-fluid rounded mx-auto d-blockw-100 card-custom-not-hover cart-img-custom" src={image} alt={name} />
        </div>
        <div className="col-sm my-2">
          <p className="h2">{name}</p>
          <p className="h4 text-secondary">{formattedCurrency(price)}</p>
          <p className="h6">{shortDescription}</p>
          <div className="text-center mt-5 card-footer-custom ">
            <hr></hr>
            <button className="btn btn-outline-secondary"><i className="fas fa-minus"></i></button>
            <span className="mx-5">{amount}</span>
            <button className="btn btn-outline-dark" onClick={handleAddToCartClick}><i className="fas fa-plus"></i></button>
          </div>
        </div>
      </div>
    );
  }
}

export default CartSummaryItem;
