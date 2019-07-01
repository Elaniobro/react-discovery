import React from 'react';
import PropTypes from 'prop-types';

import './Featured.css'

const Featured = (props) => (
  <div className="featured__wrapper">
    <h1>Featured Deal of The Day</h1>

    <figure className="featured__img--wrapper">
      <img src={props.featuredAuction[0].pictureURLSuperSize[0]} className="featured__img" alt="Auction Item Thumbnail" />
      <figcaption className="featured__img--caption">
        <h2 className="featured__item--title">
          {props.featuredAuction[0].title[0]}
        </h2>
        <a className="featured__item--link" name="ebayLink" href={props.featuredAuction[0].viewItemURL[0]}>Bid on Ebay!</a>
      </figcaption>
    </figure>

  </div>
)

Featured.propTypes = {
  title: PropTypes.array,
  pictureURLSuperSize: PropTypes.array,
  viewItemURL: PropTypes.array,
  endTime: PropTypes.array,
}

export default Featured;
