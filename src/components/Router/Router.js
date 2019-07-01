import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from '../App/App';
import Auction from '../Auction/Auction';
import NotFound from '../NotFound/NotFound';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/auction/:indexId" render={(props) => <Auction {...props} />} />
      <Route exact path="/search-results/:keyWord" component={App} />
      <Route exact component={NotFound} />
    </Switch>
  </BrowserRouter>
)
