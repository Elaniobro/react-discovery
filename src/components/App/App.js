import React from 'react';
import PropTypes from 'prop-types';
import Featured from '../Featured/Featured';
import Listing from '../Listing/Listing';

import './App.css';

export default class App extends React.Component {
  static propTypes = {
    history: PropTypes.object,
  }
  constructor(){
    super();
    this.tagline = 'Ending Soonest'
  }

  state = {
    activeFilter: 4,
    auctions: {},
    buttons: [
      {
        id: 1,
        name: 'alpha',
        className: 'btn__group--btn btn__group--alpha',
        title: 'sorted abcd',
        child: {
          className: 'btn__group--emoji',
          ariaLabel: 'abcd',
          emoji:'🔠',
        }
      },
      {
        id: 2,
        name: 'high',
        className: 'btn__group--btn btn__group--high',
        title: 'sorted by highest price',
        child: {
          className: 'btn__group--emoji',
          ariaLabel: 'four money bags',
          emoji:'💰💰💰💰',
        }
      },
      {
        id: 3,
        name: 'low',
        className: 'btn__group--btn btn__group--low',
        title: 'sorted by lowest price',
        child: {
          className: 'btn__group--emoji',
          ariaLabel: 'one money bag',
          emoji:'💰',
        }
      },
      {
        id: 4,
        name: 'time',
        className: 'btn__group--btn btn__group--time',
        title: 'sorted by ending soon',
        child: {
          className: 'btn__group--emoji',
          ariaLabel: 'hourglass timer',
          emoji:'⌛️',
        }
      }
    ],
    featuredAuction: {}
  }

  componentDidMount(){
    this.getSearchResults()
  }

  componentDidUpdate(){
    const { params } = this.props.match;

    localStorage.setItem(params.indexId, JSON.stringify(this.state.auctions))
  }

  // check if item is an auction or not.
  getAuctionStatus = (list) => list.listingInfo[0].listingType[0] === 'Auction' ? true : false;

  getSearchResults = async () => {
    // 1. Set up search url
    const REACT_APP_ID = process.env.REACT_APP_ID;
    const url = `/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&
SERVICE-VERSION=1.0.0&
SECURITY-APPNAME=${REACT_APP_ID}&
GLOBAL-ID=EBAY-US&
RESPONSE-DATA-FORMAT=JSON&
REST-PAYLOAD&
keywords=Funco%20Pop%20Marvel&
paginationInput.entriesPerPage=11&
outputSelector(0)=PictureURLSuperSize&
outputSelector(1)=Subtitle&
itemFilter(0).paramName=Subtitle
`

    // 2. fetch ebay data
    let searchResponse = await fetch(url);
    let searchData = await searchResponse.json();
    // 3. return searchData
    let featuredData = searchData

    searchData = searchData.findItemsByKeywordsResponse[0].searchResult[0].item.slice(1, 11).sort((a, b) => {
      return new Date(a.listingInfo[0].endTime[0]) - new Date(b.listingInfo[0].endTime[0])
    });
    featuredData = featuredData.findItemsByKeywordsResponse[0].searchResult[0].item.slice(0, 1);
    // 4. take a copy of existing state
    let { auctions, featuredAuction } = this.state.auctions;

    // 5. add our data to results variable
    auctions = searchData;
    featuredAuction = featuredData;
    // 6. set the new fishes obj to state
    this.setState({ auctions, featuredAuction });
    // 7. push state to localstorage
    localStorage.setItem(`currentAuctions`, JSON.stringify(this.state.auctions));
  }

  handleSort = (e) =>{
    const name = e.target.name || e.target.parentNode.name;
    const id = Number(e.target.dataset.id || e.target.parentNode.dataset.id);

    let auctions = [...this.state.auctions ];
    let btns = document.querySelectorAll('btn__group--btn');

    btns.forEach(btn => btn.classList.remove('active'));

    if(name === 'alpha'){
      auctions.sort((a, b) => a.title[0].toLowerCase() < b.title[0].toLowerCase() ? -1 : (a.title[0].toLowerCase() > b.title[0].toLowerCase()) ? 1 : 0);
      this.setState({ auctions, activeFilter: id, })
      this.tagline = 'Alphabetical'

    }

    if (name === 'low') {
      auctions.sort((a, b) => a.sellingStatus[0].currentPrice[0].__value__ - b.sellingStatus[0].currentPrice[0].__value__);
      this.setState({ auctions, activeFilter: id, })
      this.tagline = 'Lowest price to highest'

    }

    if (name === 'high') {
      auctions.sort((a, b) => b.sellingStatus[0].currentPrice[0].__value__ - a.sellingStatus[0].currentPrice[0].__value__);
      this.setState({ auctions, activeFilter: id, })
      this.tagline = 'Highest price to lowest'

    }
    if (name === 'time') {
      auctions.sort((a, b) => b.sellingStatus[0].currentPrice[0].__value__ - a.sellingStatus[0].currentPrice[0].__value__);
      this.setState({ auctions, activeFilter: id, })
      this.tagline = 'Ending soon'
    }
  }

  handleBurgerFlip = () => {
    const {hamburger, nav} =this.refs;

    if (hamburger.classList.contains('open')){
      hamburger.classList.remove('open');
    } else {
      hamburger.classList += ' open';
    }

    if(nav.classList.contains('closed')){
      nav.classList.remove('closed');
    } else {
      nav.classList += ' closed';
    }
  }

  render() {
    const { activeFilter, auctions, buttons, featuredAuction} = this.state;

    return (
      <div className="App">
        <header>
          <div ref="hamburger" className="btn__group--btn-hamburger" onClick={this.handleBurgerFlip.bind(this, 'hamburger')}>
            <div>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <nav ref="nav" className="btn__group--wrapper closed">
            {buttons.map(button =>{
              return (
                <button key={button.id} data-id={button.id} className={button.className + (button.id === activeFilter ? ' active' : '')} type="button" name={button.name} onClick={this.handleSort}>
                  <span className={button.child.className} role="img" aria-label={button.child.ariaLabel}>{button.child.emoji}</span>
                  <span className="btn__group--text">{button.title}</span>
                </button>
              )
            })}
          </nav>
        </header>
        {
          Object.keys(featuredAuction).map(result =>
            <Featured
              key={result}
              featuredAuction={featuredAuction} />
          )

        }
        <ul className="searchResults__wrapper">
        {
          Object.keys(auctions).map (result =>
            <Listing
              history={this.props.history}
              key={result}
              index={result}
              data={auctions[result]}
              isAuction={this.getAuctionStatus(auctions[result])}
          />
          )
        }
        </ul>
      </div>
    );
  }
}
