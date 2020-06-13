import React, { Component } from 'react';
import CartSummaryItem from './cart-summary-item';

class CartSummary extends Component {
  constructor() {
    super();
    this.handleBackToCatalogClick = this.handleBackToCatalogClick.bind(this);
    this.groupByItems = this.groupByItems.bind(this);
    this.handleCheckoutClick = this.handleCheckoutClick.bind(this);
  }

  handleBackToCatalogClick() {
    this.props.setView('catalog', {});
  }

  groupByItems(cart) {
    const array = [];
    const cartArr = cart.reduce((result, item) => {
      if (!result[item.productId]) { result[item.productId] = 0; }
      result[item.productId]++;
      return result;
    }, {});

    for (const key in cartArr) {
      for (const i in cart) {
        if (Number(key) === cart[i].productId) {
          array.push({
            productId: cart[i].productId,
            name: cart[i].name,
            price: cart[i].price,
            image: cart[i].image,
            shortDescription: cart[i].shortDescription,
            amount: cartArr[key]
          });
          break;
        }
      }
    }
    return array;
  }

  handleCheckoutClick() {
    this.props.setView('checkout', {});
  }

  render() {
    const { cart, formattedCurrency, getTotal, addToCart, removeFromCart } = this.props;
    const { handleBackToCatalogClick, groupByItems, handleCheckoutClick } = this;

    // Group by item
    const array = groupByItems(cart);

    // Total
    const total = getTotal(cart);
    return (
      <div>
        <div className="row">
          <div className="col-sm">
            <span onClick={handleBackToCatalogClick} className="text-secondary back-to-catalog" >{'< Continue Shopping'}</span>
          </div>
        </div>
        <div className="row my-2">
          <div className="col-sm">
            <span className="text-dark h2" >My Cart</span>
          </div>
          <div className="col-sm text-right">
            <span className="h4 text-secondary">{total > 0 ? `Total: ${formattedCurrency(total)}` : ''}</span>
          </div>
        </div>
        <div className="row justify-content-center cart-summary-custom">
          { total > 0
            ? (
              <div className="col-sm">
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
          <div className="col text-left">
            <span className="h4 text-secondary">{total > 0 ? `Total: ${formattedCurrency(total)}` : ''}</span>
          </div>
          <div className="col text-right">
            { total > 0
              ? (<button className="btn btn-outline-secondary" onClick={handleCheckoutClick}>Check Out</button>)
              : ''
            }
          </div>
        </div>
      </div>
    );
  }
}

export default CartSummary;
