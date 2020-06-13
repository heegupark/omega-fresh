import React, { Component } from 'react';

class ProductListItem extends Component {
  constructor(props) {
    super(props);
    this.handleProductClick = this.handleProductClick.bind(this);
    this.handleAddToCartClick = this.handleAddToCartClick.bind(this);
    this.handleRemoveFromCartClick = this.handleRemoveFromCartClick.bind(this);
  }

  handleProductClick() {
    this.props.setView('details', { productId: this.props.productId });
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

  render() {
    const { productId, name, price, image, shortDescription, formattedCurrency, amount } = this.props;
    const { handleProductClick, handleAddToCartClick, handleRemoveFromCartClick } = this;
    return (
      <div className="col-md-4 card-deck my-2">
        <div className="card" id={productId}>
          <img
            className="card-img-top img-fluid rounded my-2 mx-auto d-block list-img-custom"
            src={image}
            alt={name}
            onClick={handleProductClick} />
          <div className="card-body card-body-custom" onClick={handleProductClick}>
            <h5 className="card-title">{name}</h5>
            <p className="card-subtitle">{formattedCurrency(price)}</p>
            <p className="card-text">{shortDescription}</p>
          </div>
          <hr></hr>
          {
            amount > 0
              ? (
                <div className="text-center card-footer-custom mb-3">
                  <button className="btn btn-outline-secondary" onClick={handleRemoveFromCartClick}><i className="fas fa-minus"></i></button>
                  <span className="mx-5">{amount}</span>
                  <button className="btn btn-outline-dark" onClick={handleAddToCartClick}><i className="fas fa-plus"></i></button>
                </div>
              )
              : (
                <div className="text-center card-footer-custom mb-3">
                  <button className="mx-3 btn btn-outline-dark" onClick={handleAddToCartClick}>Add to Cart</button>
                </div>
              )
          }

        </div>
      </div>
    );
  }
}

export default ProductListItem;
