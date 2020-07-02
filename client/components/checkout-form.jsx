import React, { Component } from 'react';
import OrderComplete from './order-complete';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      creditCard: '',
      address1: '',
      address2: '',
      state: 'AL',
      zipcode: '',
      isCheckedOut: false,
      cartGroupByItems: '',
      total: this.props.total
    };
    this.handleBackToCatalogClick = this.handleBackToCatalogClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCreditCardChange = this.handleCreditCardChange.bind(this);
    this.handleAddress1Change = this.handleAddress1Change.bind(this);
    this.handleAddress2Change = this.handleAddress2Change.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleZipcodeChange = this.handleZipcodeChange.bind(this);
  }

  handleBackToCatalogClick() {
    this.props.setView('catalog', {});
  }

  handleNameChange(event) {
    if (event.target.value.length < 2) { event.target.value = event.target.value.trim(); }
    this.setState({
      name: event.target.value
    });
  }

  handleCreditCardChange(event) {
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    } else {
      let number = event.target.value.split(' ').join('');
      this.setState({
        creditCard: number
      });
      number = number.substring(0, 4) + ' ' + number.substring(4, 8) + ' ' + number.substring(8, 12) + ' ' + number.substring(12);
      event.target.value = number;
    }
  }

  handleAddress1Change(event) {
    if (event.target.value.length < 2) { event.target.value = event.target.value.trim(); }
    this.setState({
      address1: event.target.value
    });
  }

  handleAddress2Change(event) {
    if (event.target.value.length < 2) { event.target.value = event.target.value.trim(); }
    this.setState({
      address2: event.target.value
    });
  }

  handleStateChange(event) {
    this.setState({
      state: event.target.value
    });
  }

  handleZipcodeChange(event) {
    if (event.target.value.length < 2) { event.target.value = event.target.value.trim(); }
    this.setState({
      zipcode: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { name, creditCard, address1, address2, state, zipcode } = this.state;
    const newOrder = {
      name: name,
      creditCard: creditCard,
      address1: address1,
      address2: address2,
      state: state,
      zipcode: zipcode
    };

    if (name.trim() && creditCard.trim() && address1.trim() && state.trim() && zipcode.trim()) {
      this.props.onSubmit(newOrder);
      this.setState({
        name: '',
        creditCard: '',
        address1: '',
        address2: '',
        state: '',
        zipcode: '',
        isCheckedOut: true,
        cartGroupByItems: this.props.cartGroupByItems
      });
    }

  }

  render() {
    const {
      handleBackToCatalogClick,
      handleNameChange,
      handleCreditCardChange,
      handleAddress1Change,
      handleAddress2Change,
      handleStateChange,
      handleZipcodeChange,
      handleSubmit
    } = this;
    const { isCheckedOut, cartGroupByItems, total } = this.state;
    const { formattedCurrency } = this.props;
    const states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY', 'AE', 'AA', 'AP'];
    const formElement = (
      <div className="fade-in">
        <div className="row">
          <div className="col-sm">
            <span onClick={handleBackToCatalogClick} className="text-secondary cursor-pointer" >{'< Continue Shopping'}</span>
          </div>
        </div>
        <div className="row my-2">
          <div className="col-sm">
            <span className="h4 text-dark checkout-title" >Check Out</span>
          </div>
        </div>
        <div className="row my-2">
          <div className="col-sm text-left">
            <span className="h4 text-secondary checkout-title">Order Total: {formattedCurrency(total)}</span>
          </div>
        </div>
        <div className="row justify-content-center">
          <form className="col-sm-10" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">name</label>
              <input
                autoFocus
                required
                type="text"
                className="form-control"
                id="name"
                placeholder="your name here"
                onChange={handleNameChange} />
            </div>
            <div className="form-group">
              <label htmlFor="credit-card">credit card</label>
              <input
                required
                type="text"
                maxLength="19"
                className="form-control"
                id="credit-card"
                placeholder="your credit card information is safely processed"
                onChange={handleCreditCardChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="address-1">address Line 1</label>
              <input
                required
                type="text"
                className="form-control"
                id="address-1"
                placeholder="your street address here"
                onChange={handleAddress1Change} />
            </div>
            <div className="form-group">
              <label htmlFor="address-2">address Line 2</label>
              <input
                type="text"
                className="form-control"
                id="address-2"
                placeholder="your suite number or other address here"
                onChange={handleAddress2Change} />
            </div>
            <div className="form-group address-custom">
              <label htmlFor="state">state</label>
              <select
                required
                className="form-control form-control-sm"
                onChange={handleStateChange}>
                {
                  states.map((state, index) => {
                    return (<option key={index}>{state}</option>);
                  })
                }
              </select>
            </div>
            <div className="form-group address-custom">
              <label htmlFor="zipcode">zipcode</label>
              <input
                required
                maxLength="5"
                type="text"
                className="form-control"
                id="zipcode"
                placeholder="zipcode"
                onChange={handleZipcodeChange} />
            </div>
            <button type="submit" className="btn btn-outline-secondary">Place Order</button>
          </form>
        </div>
      </div>
    );
    const submitElement = (
      <div className="fade-in">
        <div className="row">
          <div className="col-sm">
            <span onClick={handleBackToCatalogClick} className="text-secondary cursor-pointer" >{'< Continue Shopping'}</span>
          </div>
        </div>
        <OrderComplete
          total={total}
          cartGroupByItems={cartGroupByItems}
          formattedCurrency={formattedCurrency} />
      </div>

    );

    return isCheckedOut ? submitElement : formElement;
  }
}

export default CheckoutForm;
