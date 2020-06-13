import React, { Component } from 'react';

class Header extends Component {
  constructor() {
    super();
    this.handleClickCartDetail = this.handleClickCartDetail.bind(this);
  }

  handleClickCartDetail() {
    this.props.setView('cart', {});
  }

  render() {
    const { cartItemCount } = this.props;
    const { handleClickCartDetail } = this;
    return (
      <header className="row bg-dark pt-3 pb-1 mb-3">
        <div className="col">
          <h2 className="text-light shop-title-custom">Omega Shop</h2>
        </div>
        <div className="col text-right text-white cart-custom" >
          <span className="mx-1">{cartItemCount || ''}</span>
          <span className="mx-1">{cartItemCount ? 'items' : ''}</span>
          <span className="mx-1 cart-icon-custom" onClick={handleClickCartDetail}><i className="fas fa-shopping-cart"></i></span>
        </div>
      </header>
    );
  }
}

export default Header;
