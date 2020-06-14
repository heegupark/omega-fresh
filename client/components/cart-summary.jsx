import React, { Component } from 'react';
import CartSummaryItem from './cart-summary-item';

class CartSummary extends Component {
  constructor() {
    super();
    this.handleBackToCatalogClick = this.handleBackToCatalogClick.bind(this);
    this.handleCheckoutClick = this.handleCheckoutClick.bind(this);
  }

  handleBackToCatalogClick() {
    this.props.setView('catalog', {});
  }

  handleCheckoutClick() {
    this.props.setView('checkout', {});
  }

  render() {
    const { formattedCurrency, total, addToCart, removeFromCart, cartGroupByItems } = this.props;
    const { handleBackToCatalogClick, handleCheckoutClick } = this;

    // Group by item
    const array = cartGroupByItems;

    return (
      <div className="fade-in">
        <div className="row">
          <div className="col-sm">
            <span onClick={handleBackToCatalogClick} className="text-secondary back-to-catalog" >{'< Continue Shopping'}</span>
          </div>
        </div>
        <div className="row my-2">
          <div className="col-sm">
            <span className="h3 text-dark ml-3" >My Cart</span>
          </div>
          <div className="col-sm text-right">
            <span className="h4 text-secondary mr-3">{total > 0 ? `Total: ${formattedCurrency(total)}` : ''}</span>
          </div>
        </div>
        <div className="row cart-summary-custom mx-auto">
          { total > 0
            ? (
              <div className="col-sm align-items-center">
                {
                  array.map((item, index) => {
                    const { productId, name, price, image, shortDescription, amount } = item;
                    return <CartSummaryItem
                      key={index}
                      productId={productId}
                      name={name}
                      price={price}
                      image={image}
                      shortDescription={shortDescription}
                      amount={amount}
                      formattedCurrency={formattedCurrency}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart} />;
                  })
                }
              </div>
            )
            : (
              <div className="col-sm my-5">
                <div className="h3 text-center">
                    you cart is empty!
                </div>
              </div>
            )
          }
        </div>
        <hr></hr>
        <div className="row my-2">
          <div className="col text-left ml-3 my-auto">
            <span className="h5 text-secondary">{total > 0 ? `Total: ${formattedCurrency(total)}` : ''}</span>
          </div>
          <div className="col text-right mr-3">
            { total > 0
              ? (<button className="btn btn-sm btn-outline-secondary" onClick={handleCheckoutClick}>Check Out</button>)
              : ''
            }
          </div>
        </div>
      </div>
    );
  }
}

export default CartSummary;
