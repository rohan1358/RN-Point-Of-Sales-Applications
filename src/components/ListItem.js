import React from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Content, ListItem, Left, Thumbnail, Right, Button} from 'native-base';
import Edit from '../screen/Add';
import {ScrollView} from 'react-native-gesture-handler';

const listItemComp = props => {
  const {name, image} = props.data;
  console.log();
  return (
    <ScrollView style={{minHeight: 80}}>
      <Content>
        <ListItem>
          <Left>
            {image ? (
              <Thumbnail
                style={styles.img}
                source={{uri: `${image.replace('localhost', '192.168.1.198')}`}}
              />
            ) : (
              <Text>No Image</Text>
            )}
            <Text style={{marginLeft: 10}}>{name}</Text>
          </Left>
        </ListItem>
      </Content>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  img: {
    marginRight: 10,
  },
});

export default listItemComp;
