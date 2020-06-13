import React, { Component } from 'react';

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleClickCartDetail = this.handleClickCartDetail.bind(this);
    this.handleLogoClick = this.handleLogoClick.bind(this);
  }

  handleClickCartDetail() {
    this.props.setView('cart', {});
  }

  handleLogoClick() {
    this.props.setView('catalog', {});
  }

  render() {
    const { cartItemCount } = this.props;
    const oddOrEven = cartItemCount % 2 === 1;
    const { handleClickCartDetail, handleLogoClick } = this;
    return (
      <header className="row bg-dark pt-3 pb-1 mb-3">
        <div className="col">
          <div className="shop-title-custom">
            <img className="logo-img mb-2" src="/images/o-logo.png"></img>
            <span className="text-light logo-text ml-1" onClick={handleLogoClick}>omega fresh</span>
          </div>
        </div>
        <div className="col text-right text-white cart-custom" >
          <span className="mx-2 mb-1 text-left">{cartItemCount || ''}</span>
          <span
            className={'mx-2 cart-icon-custom'}
            onClick={handleClickCartDetail}>
            {
              cartItemCount > 29
                ? (<i className={`fas fa-truck ${oddOrEven ? 'size-up-down-odd' : 'size-up-down-even'}`}></i>)
                : cartItemCount > 19
                  ? (<i className={`fas fa-shopping-cart ${oddOrEven ? 'size-up-down-odd' : 'size-up-down-even'}`}></i>)
                  : cartItemCount > 9
                    ? (<i className={`fas fa-shopping-basket ${oddOrEven ? 'size-up-down-odd' : 'size-up-down-even'}`}></i>)
                    : (<i className={`fas fa-shopping-bag ${oddOrEven ? 'size-up-down-odd' : 'size-up-down-even'}`}></i>)
            }
          </span>
        </div>
      </header>
    );
  }
}

export default Header;
