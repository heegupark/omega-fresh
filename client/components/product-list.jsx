import React, { Component } from 'react';
import ProductListItem from './product-list-item';

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      total: 0,
      page: 1
    };
    this.getProducts = this.getProducts.bind(this);
    this.handleLoadMoreBtnClick = this.handleLoadMoreBtnClick.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleBackToTopBtnClick = this.handleBackToTopBtnClick.bind(this);
  }

  componentDidMount() {
    const { page } = this.state;
    this.getProducts(page, 6);
  }

  getProducts(page, itemsPerPage) {
    const _page = page || 1;
    const _itemsPerPage = itemsPerPage || 6;
    fetch(`/api/products/1/${_itemsPerPage * _page}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          products: data,
          total: data[0].total
        });
      })
      .catch(err => console.error(err.message));
  }

  handleLoadMoreBtnClick() {
    this.getProducts(this.state.page + 1, 6);
    this.loadMore();
  }

  handleBackToTopBtnClick() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  loadMore() {
    this.setState({
      page: this.state.page + 1
    });
  }

  render() {
    const { products, page, total } = this.state;
    const { setView, formattedCurrency, getCountById, cart, addToCart, removeFromCart } = this.props;
    const { handleLoadMoreBtnClick, handleBackToTopBtnClick } = this;
    return (
      <div>
        <div className="fade-in row justify-content-center">
          {
            products.map((product, index) => {
              const { productId, name, price, image, shortDescription } = product;
              const amount = getCountById(cart, productId);
              return <ProductListItem
                key={index}
                productId={productId}
                name={name}
                price={price}
                image={image}
                shortDescription={shortDescription}
                setView={setView}
                formattedCurrency={formattedCurrency}
                addToCart={addToCart}
                amount={amount}
                removeFromCart={removeFromCart} />;
            })
          }
        </div>
        { total > page * 6
          ? (
            <div className="row">
              <div className="col-sm text-center">
                <div className="cursor-pointer my-2" onClick={handleLoadMoreBtnClick}>load more</div>
              </div>
            </div>
          )
          : ''
        }
        <div className="row">
          <div className="col-sm text-center">
            <div className="cursor-pointer my-2" onClick={handleBackToTopBtnClick}>back to top</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductList;
