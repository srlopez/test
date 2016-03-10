'use strict';
import React, {
  Navigator,
  Component,
  View, ListView, ScrollView,
  Text, TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Alert
} from 'react-native';

import { Provider, connect } from "react-redux";
import { createStore, applyMiddleware, combineReducers, bindActionCreators } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";


import { EasyRow, EasyButton } from './components/EasyButton'

//tracers
const repeat = (str, times) => (new Array(times + 1)).join(str);
const pad = (num, maxLength) => repeat(`0`, maxLength - num.toString().length) + num;
const formatTime = (time) => `@ ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`;
//

// REDUX BEGIN
//Actions
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'
const SET       = 'SET'
const ADD       = 'ADD'
const UPDATE    = 'UPDATE'
const REMOVE    = 'REMOVE'
//Actions creators
const increment = ()     => ({ type: INCREMENT })
const decrement = ()     => ({ type: DECREMENT })
const set       = (idx)  => ({ type: SET, idx })
const add       = (name) => ({ type: ADD, name })
const update    = (idx)  => ({ type: UPDATE, idx })
const remove    = (idx)  => ({ type: REMOVE, idx })

//Redux Initial State
const initialState = {
  idx: 0,
  list: [
    { name: 'Do 3 Click on "add" buton', status: true },
    { name: 'Then 3 Click on "+" to set idx on item #3', status: true },
    { name: 'Click "update", and the item status changes', status: true },
    { name: 'Press on item #3, and the remaining disapears', status: true },
    { name: "I don't want disapears", status: false },
   ]
}
//Reducer
const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
  case DECREMENT:
    return Object.assign({}, state, { ...state,
      idx: (state.idx-1 + state.list.length) % state.list.length
    })
  case INCREMENT:
    return Object.assign({}, state, { ...state,
      idx: (state.idx+1) % state.list.length
    })
  case SET:
    return Object.assign({}, state, { ...state,
      idx: action.idx
    })
  case ADD:
    return Object.assign({}, state, { ...state,
      list: [ ...state.list, { name: action.name, status: false }]
    })
  case UPDATE:
    if(action.idx<0) return state;
    return Object.assign({}, state, {
      ...state,
      list: [
        ...state.list.slice(0, action.idx),
        Object.assign({}, state.list[action.idx], {
          status: !state.list[action.idx].status
        }),
        ...state.list.slice(action.idx + 1)]
    })
  case REMOVE:
    if(action.idx<0) return state;
    return Object.assign({}, state, {
      idx: action.idx==state.list.length-1?action.idx-1:action.idx,
      list: [
        ...state.list.slice(0, action.idx),
        ...state.list.slice(action.idx + 1)
      ]
    })
  default:
    return state
  }
}
//Redux Middelware
const loggerMiddleware = createLogger();
const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
)(createStore);
//Wrapper to bind state and actions to props on Presentational Component
const connectComponent = (component) => connect(
    (state) => ({
      idx: state.idx,
      list: state.list
    }),
    (dispatch) => ({
      increment: () => dispatch(increment()),
      decrement: () => dispatch(decrement()),
      set:    (idx) => dispatch(set(idx)),
      add:   (name) => dispatch(add(name)),
      update: (idx) => dispatch(update(idx)),
      remove: (idx) => dispatch(remove(idx))
    })
  )(component)
// REDUX END

// APP
export default class RootComponent extends Component {
  render () {
    const AppContainer = connectComponent(App);
    return (
      <Provider store={createStoreWithMiddleware(reducer, initialState)}>
        <AppContainer />
      </Provider>
    )
  }
}

class App extends Component {
  constructor(){
    super();
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }

  // Fat arrow to avoid Binding this.itemMenu.bind(this);
  itemMenu = (idx, item) => {
    Alert.alert(
      item.name, '#'+idx+' options',
      [
        {text: 'update', onPress:() => this.props.update(idx) },
        {text: 'remove', onPress:() => this.props.remove(idx) },
        {text: 'cancel'}
      ]
    )
  }

  render () {


    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 90 }}>Quiz</Text>
        <EasyRow color='darkcyan' size={20}>
          <EasyButton label={'#'+this.props.idx} style={{ backgroundColor: 'coral' }} />
          <EasyButton label=' + '    onPress={() => {this.props.increment()}} />
          <EasyButton label=' - '    onPress={() => {this.props.decrement()}} />
          <EasyButton label='update' onPress={() => {this.props.update(this.props.idx)}} />
          <EasyButton label='remove' onPress={() => {this.props.remove(this.props.idx)}} />
          <EasyButton label='add'    onPress={() => {this.props.add( 'Buy '+Math.floor((Math.random() * 100) + 1)+' apples')}} style={{ backgroundColor: 'green' }}/>
        </EasyRow>

        <ListView style={{flex:1}}
                dataSource={this.ds.cloneWithRows(this.props.list)}
                renderRow={(rowData, sectionID, rowID) =>
                  <Item selected={this.props.idx==rowID} rowID={rowID} rowData={rowData}
                  //WRONG WAY
                  onPress={() => this.props.update(rowID)}
                  onLongPress={() => this.itemMenu(rowID, rowData)}
                  //RIGHT WAY
                  //onPress={() => this.props.update(parseInt(rowID))}
                  //onLongPress={() => this.itemMenu(parseInt(rowID), rowData)}
                  />
                }
              />


      </View>
    )
  }
}

class Item extends Component {
  render() {
    const rowData = this.props.rowData;
    const rowID = this.props.rowID;
    const selected = this.props.selected;
    return (
      <View>
        <TouchableHighlight
          //WRONG
            //onPress={() => { this.props.onPress( rowID ) }}
            //onLongPress={() => { this.props.onLongPress( rowID, rowData ) }}>
          //RIGHT WAY
            onPress={this.props.onPress}
            onLongPress={this.props.onLongPress}>
          <View style={styles.row}>
            <Text
              style={[styles.txt, rowData.status && styles.up, selected && {color: 'black'}]}>
              #{rowID}. {rowData.name}
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.hr}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  row:{
      flexDirection: 'row',
  },
  txt: {
      fontSize: 16,
      fontWeight: 'normal',
      marginLeft: 5,
      marginTop: 2,
      color: 'grey',
  },
  up: {
      fontWeight: 'bold',
      color: 'orange'
  },
})
