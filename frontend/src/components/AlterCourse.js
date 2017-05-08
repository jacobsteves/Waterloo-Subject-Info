import React from 'react';

class AlterCourse extends React.Component {

  constructor() {
    super();
    this.state = {
    };
  }

  static propTypes = {
    course: React.PropTypes.string.isRequired,
    inputValue: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    apiKey: React.PropTypes.string.isRequired,
  }

  renderContent() {
    const url = 'https://api.uwaterloo.ca/v2/courses' + this.props.course + '.json' + this.props.apiKey;
    return (
      <div>
      <center>
        <a href={url}><h2>{this.props.course}</h2></a>
        <div>
          <div>
            <form onSubmit={this.props.onSubmit}>
              <input
                placeholder='Change course...'
                onChange={this.props.onChange}
                value={this.props.inputValue}
              />
            </form>
          </div>
        </div>
        <br />
        </center>
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

export default AlterCourse;
