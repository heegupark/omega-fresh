import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      isLoading: true,
      view: {
        name: 'catalog',
        params: {}
      }
    };
    this.setView = this.setView.bind(this);
  }

  componentDidMount() {
    fetch('/api/health-check')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({ message: err.message }))
      .finally(() => this.setState({ isLoading: false }));
  }

  setView(string, object) {
    this.setState({
      view: {
        name: string,
        params: object
      }
    });
  }

  render() {
    const { setView } = this;
    const { name, params } = this.state.view;
    let element = null;
    switch (name) {
      case 'catalog':
        element = (
          <main>
            <ProductList setView={setView} />
          </main>);
        break;
      case 'details':
        element = (
          <main>
            <ProductDetails productId={params.productId} setView={setView} />
          </main>);
        break;
    }
    return this.state.isLoading
      ? (
        <div>
          <Header />
          <div className="row mt-5">
            <div className="col-sm text-center">
              <h1 className="mb-5">Testing connections...</h1>
              <div className="spinner-border text-primary mt-5" role="status">
              </div>
            </div>
          </div>
        </div>
      )
      : (
        <div className="container-fluid container-custom">
          <Header />
          {element}
        </div>
      );
  }
}
