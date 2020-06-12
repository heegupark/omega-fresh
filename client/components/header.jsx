import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <header className="row bg-dark pt-3 pb-1 mb-3">
        <div className="col-sm">
          <h2 className="text-light ml-5">Omega Shop</h2>
        </div>
      </header>
    );
  }
}

export default Header;
