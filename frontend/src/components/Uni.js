import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Column, Cell} from 'fixed-data-table';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import '../stylesheets/Uni.css';
import '../stylesheets/fixed-data-table.css';
import UniFeed from './UniFeed';
import AlterCourse from './AlterCourse';
import FilterBox from './FilterBox';
import { getCourses } from '../actions/UniActions';
import $ from 'jquery';

const { func, instanceOf, string } = React.PropTypes;

const TextCell = ({rowIndex, data, ...props}) => (
  <Cell>
    {data[rowIndex]}
  </Cell>
);

class Uni extends React.Component {

  constructor() {
    super();
    let windowWidth = $(window).width();
    this.state = {
      start: true,
      inputValue: '/CS',
      inputError: '',
      command: '',
      apiKey: '?key=faca98055f32de96a5a0cf931efd5bf3',
      Response: '',
      feeds: Immutable.fromJS({}),
      screenWidth: windowWidth,
      columnWidths: {
        courseCode: $(window).width() / 5,
        courseName: $(window).width() / 5,
        courseDescr: $(window).width() * 3 / 5
      }
    };
    this._onColumnResizeEndCallback = this._onColumnResizeEndCallback.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  updateDimensions() {
    if(!this.state.start) {
      const { courseCode, courseName, courseDescr } = this.state.columnWidths;
      const { screenWidth } = this.state;
      const newWidth = $(window).width();
      this.setState(({columnWidths}) => ({
        columnWidths: {
          courseCode: courseCode * (newWidth / screenWidth),
          courseName: courseName * (newWidth / screenWidth),
          courseDescr: courseDescr * (newWidth / screenWidth)
        },
        screenWidth: newWidth
      }));
    }
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount(){
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  static propTypes: {
    getCourses: func.isRequired,
    inputValue: string
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.unis.get('feed')) {
      this.setState({
        feeds: nextProps.unis
      });
    }
  }

  changeCommand(e) {
    e.preventDefault();
    const { inputValue } = this.state;
    const url = 'https://api.uwaterloo.ca/v2/courses' + inputValue + '.json' + this.state.apiKey;
    if (inputValue) {
      this.props.getCourses(url);
      this.setState({
        inputValue: '',
        command: inputValue
      });
    }
  }

  getHandler() {
    const url = 'https://api.uwaterloo.ca/v2/courses' + this.state.command + '.json' + this.state.apiKey;
    this.props.getCourses(url);
  }

  _onColumnResizeEndCallback(newColumnWidth, columnKey) {
      this.setState(({columnWidths}) => ({
        columnWidths: {
          ...columnWidths,
          [columnKey]: newColumnWidth,
        }
      }));
    }

  postList() {
    if(this.state.command) {
      var {columnWidths} = this.state;
      const posts = (this.state.feeds && this.state.feeds) || [];
      let titles = [];
      let courseCodes = [];
      let courseDesc = [];
      let a = 0;
      posts.map((post, i) => {
        post.map((info, j) => {
          titles.push(info.get('title'));
          courseCodes.push(info.get('subject') + ' ' + info.get('catalog_number'));
          courseDesc.push(info.get('description'));
          ++a;
        });
      });
      return (
        <Table
          rowHeight={100}
          rowsCount={a}
          onColumnResizeEndCallback={this._onColumnResizeEndCallback}
          isColumnResizing={false}
          width={columnWidths.courseCode + columnWidths.courseName + columnWidths.courseDescr}
          height={1500}
          headerHeight={50}
          {...this.props}>
          <Column
            columnKey="courseCode"
            header={<Cell>Course Code</Cell>}
            cell={<TextCell data={courseCodes} />}
            width={columnWidths.courseCode}
            isResizable={true}
            minWidth={100}
            maxWidth={300}
          />
          <Column
            columnKey="courseName"
            header={<Cell>Course Name</Cell>}
            cell={<TextCell data={titles} />}
            width={columnWidths.courseName}
            isResizable={true}
            minWidth={100}
            maxWidth={300}
          />
          <Column
            columnKey="courseDescr"
            header={<Cell>Description</Cell>}
            cell={<TextCell data={courseDesc} />}
            width={columnWidths.courseDescr}
            isResizable={true}
            minWidth={100}
            maxWidth={1500}
          />
          </Table>
      );
    }
  }

  handleSelect(choice, index){
    if (index>=0) {
      this.setState({Response: choice + ' is a nice choice'});
      const url = 'https://api.uwaterloo.ca/v2/courses/' + choice + '.json' + this.state.apiKey;
      this.props.getCourses(url);
      if (this.state.inputValue) {
        this.setState({
          inputValue: '',
          command: choice
        });
      }
    } else {
      this.setState({Response: choice + ' isn\'t on the list!'});
    }
  }

  handleInputChange(e) {
    this.setState({
      inputValue: e.target.value
    });
  }

  unsetStart(){
    this.setState({
      start: false
    })
  }

  render() {
    if(this.state.start) {
      this.unsetStart();
    }
    let courseLists = ['CS', 'PHYS', 'SCI', 'SE', 'MATH', 'ECE', 'PMATH'];
    return (
      <div><br />
        <center><div><h2>Uwaterloo Course Information</h2></div></center>
        <FilterBox
        max = {7}
        objects = {courseLists}
        handleSelect = {(a, b) => this.handleSelect(a, b)}
        />
        <p>{ this.state.Response }</p>
        <div className="centered">
          <UniFeed
            getHandler={() => this.getHandler()}
            postList={() => this.postList()}
          />
        </div>
      </div>
    );
  }

}
//https://uwaterloo.ca/relativistic-quantum-information-conference/sites/ca.relativistic-quantum-information-conference/files/uploads/images/kpmb_toronto_architectural_photography_amanda_large_younes_bounhar_qnc_waterloo-1.jpg
function mapStateToProps(state) {
  return {
    unis: state.unis
  };
}

const actionCreators = {
  getCourses
};

export default connect(mapStateToProps, actionCreators)(Uni);
