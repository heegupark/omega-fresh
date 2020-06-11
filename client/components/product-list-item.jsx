import React, { Component } from 'react';

class ProductListItem extends Component {
  render() {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    const { productId, name, price, image, shortDescription } = this.props;
    return (
      <div className="col-4 card-deck mb-3">
        <div className="card" id={productId}>
          <img className="card-img-top" src={image} alt={name} />
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <h6 className="card-subtitle">{formatter.format(price / 100)}</h6>
            <p className="card-text h6">{shortDescription}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductListItem;
