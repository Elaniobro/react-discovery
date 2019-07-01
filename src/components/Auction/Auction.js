import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './Auction.css';

export default class Featured extends React.Component {
  static propTypes = {
    indexId: PropTypes.number,
  }

  state = {
    flag: true,
    auction: [],
  };

  componentDidMount() {
    // 1. populate local storage
    this.hydrateStateWithLocalStorage();
  }

  hydrateStateWithLocalStorage(callback) {
    // 1. take a copy of existing state
    let auction = { ...this.state.auction };
    // 2. loop throughfor all items in state

    if (localStorage.hasOwnProperty('currentAuctions')) {
        // get the key's value from localStorage
      let value = localStorage.getItem('currentAuctions');

      const id = this.props.match.params.indexId;
      // parse the localStorage string and setState
      try {
        value = JSON.parse(value);
        this.setState({ auction: value[id], flag: false }, () => auction);
      } catch (e) {
        // handle empty string
        this.setState({ auction: value[id] }, callback);
      }
    }
  }

  render() {


    return (
      this.state.flag === false &&
      <div className="auction__wrapper">
        <h2 className="auction__item--title">{this.state.auction.title[0]}</h2>
        <figure className="auction__img--wrapper">
          <img src={this.state.auction.pictureURLSuperSize[0]} className="auction__img" alt="Auction Item Thumbnail" />
        </figure>
        <div className="auction__img--caption">
          last bid: ${this.state.auction.sellingStatus[0].currentPrice[0].__value__}
        </div>
        <a className="btn__group--btn auction__item--link" href={this.state.auction.viewItemURL[0]}>Bid on Ebay!</a>
        <div className="auction__item--end-time">
          Auction ends on {moment.utc(this.state.auction.listingInfo[0].endTime[0]).format('dddd MMM DD, YYYY HH:mm')}
        </div>
      </div>

    )
  }
}
