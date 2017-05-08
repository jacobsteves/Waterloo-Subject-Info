import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Column, Cell} from 'fixed-data-table';

class UniFeed extends React.Component {

  constructor() {
    super();
    this.state = {
    };
  }

  componentWillMount() {
    this.props.getHandler();
  }

  static propTypes = {
    getHandler: React.PropTypes.func.isRequired,
    postList: React.PropTypes.func.isRequired
  }

  renderContent() {
    return (
      <div className='postList'>
        {this.props.postList()}
      </div>
    );
  }

  render() {
    return (
      <div>
        { this.renderContent() }
      </div>
    );
  }
}

export default UniFeed;
