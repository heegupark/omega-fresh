import React, { Component } from 'react';
import ProductListItem from './product-list-item';

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
    this.getProducts = this.getProducts.bind(this);
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts() {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        this.setState({
          products: data
        });
      })
      .catch(err => console.error(err.message));
  }

  render() {
    const { products } = this.state;
    return (
      <main className="container-fluid">
        <div className="row justify-content-center">
          {
            products.map((product, index) => {
              const { productId, name, price, image, shortDescription } = product;
              return <ProductListItem
                key={index}
                productId={productId}
                name={name}
                price={price}
                image={image}
                shortDescription={shortDescription} />;
            })
          }
        </div>
      </main>
    );
  }
}

export default ProductList;
