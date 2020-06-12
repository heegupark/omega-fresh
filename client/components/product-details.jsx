import React, { Component } from 'react';

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      isLoading: true
    };
    this.handleBackToCatalogClick = this.handleBackToCatalogClick.bind(this);
    this.handleAddToCartClick = this.handleAddToCartClick.bind(this);
  }

  componentDidMount() {
    const { productId } = this.props;
    fetch(`/api/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
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
    const { productId, price } = this.state.product;
    const addProduct = { productId, price };
    this.props.addToCart(addProduct);
  }

  render() {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    if (this.state.product) {
      const { productId, image, name, price, shortDescription, longDescription } = this.state.product;
      const { handleBackToCatalogClick, handleAddToCartClick } = this;
      const longDescriptionChanged = longDescription.split('\\n.').map((item, i) => {
        return (<span key={i}>{`${item}.`}<br /><br /></span>);
      });
      return this.state.isLoading
        ? (
          <div className="row mt-5">
            <div className="col-sm-8 text-center">
              <h1 className="mb-5">Loading product detail...</h1>
              <div className="spinner-border text-warning mt-5" role="status">
              </div>
            </div>
          </div>
        )
        : (
          <div className="row justify-content-center" id={productId}>
            <div className="col-sm card pt-3 card-custom-not-hover">
              <div className="row">
                <div className="col-sm">
                  <span onClick={handleBackToCatalogClick} className="text-secondary back-to-catalog" >{'< Back to Catalog'}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-sm mx-2 my-2 text-center">
                  <img className="img-fluid rounded mx-auto d-blockw-100 card-custom-not-hover detail-img-custom" src={image} alt={name} />
                </div>
                <div className="col-sm mx-2 my-2">
                  <div className="row">
                    <div className="col-sm mx-2 my-2">
                      <h2>{name}</h2>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm mx-2 my-2">
                      <h4 className="text-secondary">{formatter.format(price / 100)}</h4>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm mx-2 my-2">
                      <p>{shortDescription}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm mx-2 my-2">
                      <button className="btn btn-outline-dark" onClick={handleAddToCartClick}>Add To Cart</button>
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
