import Immutable from 'immutable';
import { GET_COURSES } from '../constants/ActionTypes';

const initialState = Immutable.Map({
  feed: {}
});

export default function unis(state = initialState, action) {
  let newState = state;

  switch (action.type) {
  case GET_COURSES:
    newState = state.set('feed', Immutable.fromJS(action.feed));
    return newState;

  default:
    return state;
  }
}
