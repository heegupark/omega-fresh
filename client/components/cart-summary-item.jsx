import React, { Component } from 'react';

class CartSummaryItem extends Component {
  constructor() {
    super();
    this.handleAddToCartClick = this.handleAddToCartClick.bind(this);
    this.handleRemoveFromCartClick = this.handleRemoveFromCartClick.bind(this);
    this.handleViewDetailClick = this.handleViewDetailClick.bind(this);
  }

  handleAddToCartClick() {
    const { productId, price, addToCart } = this.props;
    const addProduct = { productId, price };
    addToCart(addProduct);
  }

  handleRemoveFromCartClick() {
    const { productId, removeFromCart } = this.props;
    const removeProduct = { productId };
    removeFromCart(removeProduct);
  }

  handleViewDetailClick() {
    const { productId } = this.props;
    this.props.setView('details', { productId });
  }

  render() {
    const { handleAddToCartClick, handleRemoveFromCartClick, handleViewDetailClick } = this;
    const { name, price, image, shortDescription, amount, formattedCurrency } = this.props;
    return (
      <div className="fade-in row card-deck card my-2">
        <div className="col-sm my-2 cursor-pointer" onClick={handleViewDetailClick}>
          <img className="img-fluid rounded mx-auto d-block card-custom-not-hover cart-img-custom" src={image} alt={name} />
        </div>
        <div className="col-sm my-2">
          <p className="h4 cursor-pointer" onClick={handleViewDetailClick}>{name}</p>
          <p className="h5 text-secondary">{formattedCurrency(price)}</p>
          <p className="h6">{shortDescription}</p>
          <div className="text-center card-footer-custom-cart">
            <hr></hr>
            <button className="btn btn-sm btn-outline-secondary" onClick={handleRemoveFromCartClick}><i className="fas fa-minus"></i></button>
            <span className="mx-5 amount-custom">{amount}</span>
            <button className="btn btn-sm btn-outline-dark" onClick={handleAddToCartClick}><i className="fas fa-plus"></i></button>
          </div>
        </div>
      </div>
    );
  }
}

export default CartSummaryItem;
