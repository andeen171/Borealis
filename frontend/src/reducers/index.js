import { combineReducers } from 'redux';
import auth from './auth'

const reducer = combineReducers({
    auth: auth,
})

export default reducer;
