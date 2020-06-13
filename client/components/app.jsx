import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';
import CartSummary from './cart-summary';
import CheckoutForm from './checkout-form';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      isLoading: true,
      view: {
        name: 'catalog',
        params: {}
      },
      cart: []
    };
    this.setView = this.setView.bind(this);
    this.getCartItems = this.getCartItems.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.formattedCurrency = this.formattedCurrency.bind(this);
    this.getTotal = this.getTotal.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
  }

  componentDidMount() {
    fetch('/api/health-check')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({ message: err.message }))
      .finally(() => this.setState({ isLoading: false }));

    this.getCartItems();
  }

  setView(string, object) {
    this.setState({
      view: {
        name: string,
        params: object
      }
    });
  }

  getCartItems() {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => {
        this.setState({
          cart: data
        });
      })
      .catch(err => console.error(err.message));
  }

  addToCart(product) {
    fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          cart: [...this.state.cart, data]
        });
      })
      .catch(err => console.error(err.message));
  }

  placeOrder(newOrder) {
    const order = {
      name: newOrder.name,
      creditCard: newOrder.creditCard,
      shippingAddress: `${newOrder.address1},${newOrder.address2},${newOrder.state},${newOrder.zipcode}`
    };
    fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    })
      .then(res => res.json())
      .then(data => {
        this.setView('checkout', {});
        this.setState({ cart: [] });
      })
      .catch(err => console.error(err.message));
  }

  formattedCurrency(price) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    return formatter.format(price / 100);
  }

  getTotal(cart) {
    let total = 0;
    for (const i in cart) {
      total += cart[i].price;
    }
    return total;
  }

  render() {
    const { setView, addToCart, placeOrder, formattedCurrency, getTotal } = this;
    const { name, params } = this.state.view;
    const { cart } = this.state;
    let element = null;
    switch (name) {
      case 'catalog':
        element = (
          <main>
            <ProductList
              setView={setView}
              formattedCurrency={formattedCurrency} />
          </main>);
        break;
      case 'details':
        element = (
          <main>
            <ProductDetails
              addToCart={addToCart}
              productId={params.productId}
              setView={setView}
              formattedCurrency={formattedCurrency} />
          </main>);
        break;
      case 'cart':
        element = (
          <main>
            <CartSummary
              setView={setView}
              cart={cart}
              getTotal={getTotal}
              formattedCurrency={formattedCurrency} />
          </main>);
        break;
      case 'checkout':
        element = (
          <main>
            <CheckoutForm
              setView={setView}
              total={getTotal(cart)}
              formattedCurrency={formattedCurrency}
              onSubmit={placeOrder} />
          </main>);
        break;
    }
    const cartItemCount = this.state.cart.length;
    return this.state.isLoading
      ? (
        <div>
          <Header cartItemCount={cartItemCount} />
          <div className="row mt-5">
            <div className="col-sm text-center">
              <h1 className="mb-5">Testing connections...</h1>
              <div className="spinner-border text-primary mt-5" role="status">
              </div>
            </div>
          </div>
        </div>
      )
      : (
        <div className="container-fluid container-custom">
          <Header cartItemCount={cartItemCount} setView={setView}/>
          {element}
        </div>
      );
  }
}
