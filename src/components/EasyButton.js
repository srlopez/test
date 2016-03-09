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

  static defaultProps = {
    color: 'green',
    size: 15,
  }

  render(){
    var this_props_children_WithProps = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, { color: this.props.color, size: this.props.size })
    })

    return(
      <View style={styles.row}>
        {this_props_children_WithProps}
      </View>
    )
  }
}

export  class EasyButton extends Component {
  render(){
    const label = ' '+this.props.label+' '
    const style = {
      fontSize: this.props.size,
      backgroundColor: this.props.color
    }
    return(
      <TouchableOpacity
        onPress = {this.props.onPress}
        onLongPress = {this.props.onLongPress}>
        <Text style = {[style, styles.button, this.props.style]}>{label}</Text>
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
  },
  button: {
    height: 26,
    borderRadius: 8,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: 'snow',
    margin: 5,
  }
})
