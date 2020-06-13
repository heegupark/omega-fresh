import React, { Component } from 'react';

class ProductListItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setView('details', { productId: this.props.productId });
  }

  render() {

    const { productId, name, price, image, shortDescription, formattedCurrency } = this.props;
    const { handleClick } = this;
    return (
      <div className="col-md-4 card-deck my-2" onClick={handleClick}>
        <div className="card card-custom" id={productId}>
          <img className="card-img-top img-fluid rounded my-2 mx-auto d-block list-img-custom" src={image} alt={name} />
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <p className="card-subtitle">{formattedCurrency(price)}</p>
            <p className="card-text">{shortDescription}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductListItem;
