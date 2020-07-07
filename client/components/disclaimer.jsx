import React, { Component } from 'react';

class Disclaimer extends Component {
  constructor() {
    super();
    this.handleAcceptClick = this.handleAcceptClick.bind(this);
  }

  handleAcceptClick() {
    localStorage.setItem('omegafreshaccept', true);
    this.props.handleDisclaimerAccept(true);
  }

  render() {
    const { handleAcceptClick } = this;
    return (
      <div className="modal">
        <div className="modal-content">
          <p className="mx-auto my-3 h4">Welcome to Omega Fresh</p>
          <div className="mx-auto my-2 text-center">This app is created strictly for demonstration purposes. By clicking the button below, you accept that no purchases will be made, no payment processing will be done, and actual personal information should not be used in checkout.</div>
          <button className="btn btn-sm btn-danger mx-auto my-3" onClick={handleAcceptClick}>Accept</button>
        </div>
      </div>
    );
  }
}

export default Disclaimer;
