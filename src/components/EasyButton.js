/**
 * React Native App
 * https://github.com/srlopez/
 *
 */

'use strict';
import React, {
  Component,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet
} from 'react-native'

export  class EasyRow extends Component {
  render(){
    return(
      <View style={styles.row}>
        {this.props.children}
      </View>
    )
  }
}

export  class EasyButton extends Component {
  render(){
    const label = ' '+this.props.label+' '
    return(
      <TouchableOpacity
        onPress     = {this.props.onPress}
        onLongPress = {this.props.onLongPress}>
        <Text style = {[styles.button, this.props.style]}>{label}</Text>
      </TouchableOpacity>
    )
  }
}



const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    fontWeight: 'bold',
    backgroundColor: 'green',
    color: 'white',
    margin: 3,
  }
})
