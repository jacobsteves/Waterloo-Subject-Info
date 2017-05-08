import $ from 'jquery';
import { GET_COURSES } from '../constants/ActionTypes';

export function getCourses(url) {
  return dispatch =>
  $.get(url).then(response => {
    dispatch({ type: GET_COURSES, feed: response.data });
  });
}
