import React from 'react';
import PropTypes from 'prop-types';

import './Listing.css'

export default class Listing extends React.Component {
  static propTypes = {
    isAuction: PropTypes.bool,
    bidCount: PropTypes.number,
    title: PropTypes.string,
    galleryURL: PropTypes.string,
    value: PropTypes.number,
    info: PropTypes.string,
    viewItemURL: PropTypes.string,
    endTime: PropTypes.string,
  }
  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = (e) => {
    // 1. stop form from loading

    // 2. store listing page data in localStorage
    localStorage.setItem(`listingID_${this.props.index}`, JSON.stringify(this.props.data))
    // 3. go to listing page
    if(e.target.name !== 'ebayLink'){
      this.props.history.push({
        pathname: `/auction/${this.props.index}`,
        state: this.props.state,
        props: this.props
      })
    }

  }

  handleEbayLinkClick = (e) =>{
    // // 1. stop form from loading
    // e.preventDefault();
    // console.log(this.props.data.viewItemURL[0])
    // this.props.location = this.props.data.viewItemURL[0]
  }

  render(){
    let auctionType;
    let auctionBadge;
    const bidCount = this.props.data.sellingStatus[0].bidCount;

    const cta = this.props.isAuction ? 'Place a Bid!' : 'Buy Now on Ebay!'


    if (this.props.isAuction){
      auctionType = `# of bids: ${bidCount}`;
      auctionBadge = `🛎`;
    } else {
      auctionType = `Current price: $${this.props.data.sellingStatus[0].currentPrice[0].__value__}`
    }

    return (
      <li key={this.props.index} className="searchResults__item" onClick={this.handleClick.bind(this)}>
        <h2 className="searchResults__item--title">
          <span className="searchResults__item--badge">{auctionBadge}</span>{this.props.data.title}
        </h2>
        <figure className="searchResults__img--wrapper">
          <img src={this.props.data.galleryURL[0]} className="searchResults__img" alt="Auction Item Thumbnail"/>
        </figure>
        <div className="searchResults__img--caption">
          {auctionType}
        </div>
        <a className="searchResults__item--link" name="ebayLink" href={this.props.data.viewItemURL[0]}>{cta}</a>
      </li>
    )
  }
}
