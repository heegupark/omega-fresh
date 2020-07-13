import React from 'react';
import Header from './header';
import Footer from './footer';
import ProductList from './product-list';
import ProductDetails from './product-details';
import CartSummary from './cart-summary';
import CheckoutForm from './checkout-form';
import Disclaimer from './disclaimer';

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
      cart: [],
      cartItemCount: 0,
      isDisclaimerAccepted: localStorage.getItem('omegafreshaccept')
    };
    this.setView = this.setView.bind(this);
    this.getCartItems = this.getCartItems.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.formattedCurrency = this.formattedCurrency.bind(this);
    this.getTotal = this.getTotal.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.getCountById = this.getCountById.bind(this);
    this.groupByItems = this.groupByItems.bind(this);
    this.handleDisclaimerAccept = this.handleDisclaimerAccept.bind(this);
  }

  componentDidMount() {
    fetch('/api/health-check')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({ message: err.message }))
      .finally(() => {
        this.setState({ isLoading: false });
        this.getCartItems();
      });
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

  removeFromCart(product) {
    const array = [...this.state.cart];
    fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
      .then(res => res.json())
      .then(data => {
        const index = array.findIndex(i => data.cartItemId === i.cartItemId);
        array.splice(index, 1);
        this.setState({
          cart: array
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

  getCountById(cart, id) {
    let count = 0;
    for (const key in cart) {
      if (cart[key].productId === id) {
        count++;
      }
    }
    return count;
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

  handleDisclaimerAccept(accept) {
    this.setState({
      isDisclaimerAccepted: accept
    });
  }

  render() {
    const {
      setView,
      addToCart,
      removeFromCart,
      placeOrder,
      formattedCurrency,
      getTotal,
      getCountById,
      groupByItems,
      handleDisclaimerAccept
    } = this;
    const { name, params } = this.state.view;
    const { cart, isDisclaimerAccepted } = this.state;
    let element = null;
    switch (name) {
      case 'catalog':
        element = (
          <main>
            <ProductList
              setView={setView}
              formattedCurrency={formattedCurrency}
              cart={cart}
              getCountById={getCountById}
              addToCart={addToCart}
              removeFromCart={removeFromCart} />
          </main>);
        break;
      case 'details':
        element = (
          <main>
            <ProductDetails
              addToCart={addToCart}
              productId={params.productId}
              setView={setView}
              cart={cart}
              formattedCurrency={formattedCurrency}
              getCountById={getCountById} />
          </main>);
        break;
      case 'cart':
        element = (
          <main>
            <CartSummary
              setView={setView}
              cart={cart}
              total={getTotal(cart)}
              formattedCurrency={formattedCurrency}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cartGroupByItems={groupByItems(cart)} />
          </main>);
        break;
      case 'checkout':
        element = (
          <main>
            <CheckoutForm
              setView={setView}
              total={getTotal(cart)}
              formattedCurrency={formattedCurrency}
              onSubmit={placeOrder}
              cartGroupByItems={groupByItems(cart)}
              handleDisclaimerAccept={handleDisclaimerAccept} />
          </main>);
        break;
      case 'disclaimer':
        element = (
          <main>
            <Disclaimer />
          </main>);
        break;
    }
    const cartItemCount = this.state.cart.length;
    return this.state.isLoading
      ? (
        <div>
          <Header cartItemCount={cartItemCount} setView={setView} />
          <main>
            <div className="row mt-5">
              <div className="col-sm text-center">
                <h1 className="mb-5">loading items...</h1>
                <div className="spinner-border text-primary mt-5" role="status">
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      )
      : (
        <div className="container-fluid container-custom">
          <Header cartItemCount={cartItemCount} setView={setView}/>
          {element}
          {isDisclaimerAccepted
            ? ''
            : (
              <Disclaimer
                handleDisclaimerAccept={handleDisclaimerAccept}/>
            )
          }
          <Footer />
        </div>
      );
  }
}
