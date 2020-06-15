import React, { Component } from 'react';

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      isLoading: true,
      amount: 1
    };
    this.handleBackToCatalogClick = this.handleBackToCatalogClick.bind(this);
    this.handleAddToCartClick = this.handleAddToCartClick.bind(this);
    this.handleMinusBtnClick = this.handleMinusBtnClick.bind(this);
    this.handlePlusBtnClick = this.handlePlusBtnClick.bind(this);
  }

  componentDidMount() {
    const { productId } = this.props;
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          product: data
        });
      })
      .catch(err => console.error(err.message))
      .finally(() => this.setState({ isLoading: false }));
  }

  handleBackToCatalogClick() {
    this.props.setView('catalog', {});
  }

  handleAddToCartClick() {
    const { amount } = this.state;
    const { productId, price } = this.state.product;
    const { addToCart } = this.props;
    const addProduct = { productId, price };
    for (let i = 0; i < amount; i++) {
      addToCart(addProduct);
    }
    this.setState({ amount: 1 });
  }

  handleMinusBtnClick() {
    const { amount } = this.state;
    if (amount > 1) { this.setState({ amount: amount - 1 }); }
  }

  handlePlusBtnClick() {
    const { amount } = this.state;
    this.setState({ amount: amount + 1 });
  }

  render() {
    const { formattedCurrency, cart, getCountById } = this.props;
    const { amount } = this.state;

    if (this.state.product) {
      const { productId, image, name, price, shortDescription, longDescription } = this.state.product;
      const { handleBackToCatalogClick, handleAddToCartClick, handlePlusBtnClick, handleMinusBtnClick } = this;
      const currentAmount = getCountById(cart, productId);
      // next line paragraph
      const longDescriptionChanged = longDescription.split('\\n.').map((item, i) => {
        return (<span key={i}>{`${item}.`}<br /><br /></span>);
      });
      return this.state.isLoading
        ? (
          <div className="fade-in row mt-5">
            <div className="col-sm-8 text-center">
              <h1 className="mb-5">Loading product detail...</h1>
              <div className="spinner-border text-warning mt-5" role="status">
              </div>
            </div>
          </div>
        )
        : (
          <div className="fade-in" id={productId}>
            <div className="col-sm card pt-3 card-custom-not-hover">
              <div className="row">
                <div className="col-sm">
                  <span onClick={handleBackToCatalogClick} className="text-secondary back-to-catalog" >{'< Back to Catalog'}</span>
                </div>
              </div>
              <div className="row my-1">
                <div className="col-sm text-center">
                  <img className="img-fluid rounded mx-auto d-block w-100 card-custom-not-hover detail-img-custom" src={image} alt={name} />
                </div>
                <div className="col-sm mx-1 my-1">
                  <div className="row my-1">
                    <div className="col-sm mx-2">
                      <h4>{name}</h4>
                    </div>
                  </div>
                  <div className="row my-1">
                    <div className="col-sm mx-2">
                      <h5 className="text-secondary">{formattedCurrency(price)}</h5>
                    </div>
                  </div>
                  <div className="row my-1">
                    <div className="col-sm mx-2">
                      <p>{shortDescription}</p>
                    </div>
                  </div>
                  <div className="row my-1">
                    <div className="col-sm">
                      <p className="mx-2 text-info">
                        {currentAmount > 1
                          ? `You currently have ${currentAmount} items in you cart`
                          : currentAmount === 1
                            ? 'You currently have 1 item in you cart'
                            : ''}</p>
                    </div>
                  </div>
                  <hr></hr>
                  <div className="row my-1">
                    <div className="col my-auto text-center">
                      <button className="btn btn-outline-secondary btn-sm fade-in" onClick={handleMinusBtnClick}><i className="fas fa-minus"></i></button>
                      <span
                        className="text-center bg-light amount-custom mx-3">
                        {amount}</span>
                      <button autoFocus className="btn btn-outline-secondary btn-sm fade-in" onClick={handlePlusBtnClick}><i className="fas fa-plus"></i></button>
                    </div>
                    <div className="col text-center my-1">
                      <button
                        className="btn btn-outline-dark"
                        onClick={handleAddToCartClick}>
                        {currentAmount > 0
                          ? 'Add More'
                          : 'Add to Cart'}</button>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm mx-2 my-2">
                  <span>{longDescriptionChanged}</span>
                </div>
              </div>
            </div>
          </div>
        );
    } else {
      return null;
    }
  }
}

export default ProductDetails;
