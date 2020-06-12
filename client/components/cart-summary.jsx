import React, { Component } from 'react';
import CartSummaryItem from './cart-summary-item';

class CartSummary extends Component {
  constructor() {
    super();
    this.handleBackToCatalogClick = this.handleBackToCatalogClick.bind(this);
  }

  handleBackToCatalogClick() {
    this.props.setView('catalog', {});
  }

  render() {
    const { cart } = this.props;
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
    const { handleBackToCatalogClick } = this;
    return (
      <div>
        <div className="row">
          <div className="col-sm">
            <span onClick={handleBackToCatalogClick} className="text-secondary back-to-catalog" >{'< Back to Catalog'}</span>
          </div>
        </div>
        <div className="row justify-content-center">
          {
            array.map((item, index) => {
              const { name, price, image, shortDescription, amount } = item;
              return <CartSummaryItem
                key={index}
                name={name}
                price={price}
                image={image}
                shortDescription={shortDescription}
                amount={amount} />;
            })
          }
        </div>
      </div>
    );
  }
}

export default CartSummary;
