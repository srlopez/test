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

//tracers
const repeat = (str, times) => (new Array(times + 1)).join(str);
const pad = (num, maxLength) => repeat(`0`, maxLength - num.toString().length) + num;
const formatTime = (time) => `@ ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`;
//


// REDUX BEGIN
//Actions
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'
const ADD       = 'ADD'
const UPDATE    = 'UPDATE'
const REMOVE    = 'REMOVE'
//Actions creators
const increment = ()     => ({ type: INCREMENT })
const decrement = ()     => ({ type: DECREMENT })
const add       = (name) => ({ type: ADD, name })
const update    = (idx)  => ({ type: UPDATE, idx })
const remove    = (idx)  => ({ type: REMOVE, idx })

//Redux Initial State
const initialState = {
  idx: 0,
  list: [
    { name: 'Press many times on "add" buton', status: true },
    { name: 'Or press "+" & "-" to modify the idx', status: true },
    { name: 'to "remove or "update" the item', status: true },
    { name: 'Press or LongPress are alowed on item', status: true },
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
  case ADD:
    return Object.assign({}, state, { ...state,
      list: [ ...state.list, { name: action.name, status: false }]
    })
  case UPDATE:
    return Object.assign({}, state, { ...state,
      list: [
        ...state.list.slice(0, action.idx),
        Object.assign({}, state.list[action.idx], {
          status: !state.list[action.idx].status
        }),
        ...state.list.slice(action.idx + 1)
      ]
    })
  case REMOVE:
    return Object.assign({}, state, { ...state,
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
      add: (name) => dispatch(add(name)),
      update: (idx) => dispatch(update(idx)),
      remove: (idx) => dispatch(remove(idx))
    })
  )(component)
// REDUX END

// APP
export default class RootComponent extends Component {
  render () {
    const AppContainer = connectComponent(App); //So now, can pass Store and Actions as props
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
    console.dir(this.props);
  }

  itemMenu(idx, item){
    Alert.alert(
      item.name, 'options',
      [
        {text: 'update', onPress:() => this.props.update(idx) },
        {text: 'remove', onPress:() => this.props.remove(idx) },
        {text: 'cancel'}
      ]
    )
  }

  showMenu(rowData, rowID) {
  Alert.alert(
      '#'+rowID+'-'+rowData.text,
      'choose an action',
        [
            {text: 'Delete', onPress: () =>
                this.deleteItem(rowID)},
            {text: 'Edit', onPress: () => {
                this.props.navigator.push({
                    name: rowData && rowData.txt || 'New Item',
                    component: ToDoEdit,
                    passProps: { item: rowData, id: rowID }
                    })
                }},
            {text: 'Cancel'}
        ]
    );
}


  render () {
    const dataSource = this.ds.cloneWithRows(this.props.list);

    return (
      <View style={styles.container}>

        <View style={{ flexDirection: 'row', margin: 3}}>
          <Text style={[styles.button, { backgroundColor: 'orange' }]}>#{this.props.idx}  </Text>
          <TouchableHighlight
            onPress={() => {this.props.increment()}}>
            <Text style={styles.button}> [+] </Text></TouchableHighlight>

          <TouchableHighlight
            onPress={() => {this.props.decrement()}}>
            <Text style={styles.button}> [-] </Text></TouchableHighlight>

          <TouchableHighlight
            onPress={() => {this.props.update(this.props.idx)}}>
            <Text style={styles.button}> update </Text></TouchableHighlight>

          <TouchableHighlight
            onPress={() => {this.props.remove(this.props.idx)}}>
            <Text style={styles.button}> remove </Text></TouchableHighlight>

          <TouchableHighlight
            onPress={() => {this.props.add( 'Buy '+Math.floor((Math.random() * 100) + 1)+' apples')}}>
            <Text style={styles.button}> add </Text></TouchableHighlight>
        </View>


        <ListView style={{flex:1}}
                dataSource={dataSource}
                renderRow={(rowData, sectionID, rowID) =>
                  <Item rowID={rowID} rowData={rowData}
                    onPress={this.props.update}
                    onLongPress={this.itemMenu.bind(this)}/>
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
    return (
      <View>
        <TouchableHighlight
          onPress={() => { this.props.onPress( rowID ) }}
          onLongPress={() => { this.props.onLongPress( rowID, rowData ) }}>
          <View style={styles.container0}>
            <Text
              style={[styles.txt, rowData.status && styles.up]}>
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
  txt: {
      fontSize: 16,
      fontWeight: 'normal',
      marginLeft: 5,
      marginTop: 2,
      color: '#222222',
  },
  up: {
      fontWeight: 'bold',
      color: 'orange'
  },
  button: {
      fontWeight: 'bold',
      backgroundColor: 'green',
      color: 'white',
      margin: 3,
  }
})
