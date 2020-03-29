import React, {Component} from 'react';
import {Modal, View, Text} from 'react-native';
export default class EditProduct extends Component {
  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.modalEdit}>
          <View style={{backgroundColor: 'Lightblue'}}>
            <Text>Hello World</Text>
          </View>
        </Modal>
      </View>
    );
  }
}
