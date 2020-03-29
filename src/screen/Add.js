import React, {Component} from 'react';
import {
  Text,
  Button,
  View,
  Picker,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';

export default class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      image: null,
      price: '',
      id_categori: '',
      stock: '',
    };
  }

  handleChoosePhoto = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = response.uri;
        this.setState({
          image: source,
          fileImage: response,
        });
      }
    });
  };

  handleAdd = () => {
    const dataFile = new FormData();
    dataFile.append('name', this.state.name);
    dataFile.append('price', this.state.price);

    dataFile.append('stock', this.state.stock);
    dataFile.append('image', {
      uri: this.state.fileImage.uri,
      type: 'image/jpeg',
      name: this.state.fileImage.fileName,
    });
    dataFile.append('id_categori', this.state.id_categori);
    this.props.navigation.navigate('Home');
    axios

      .post('http://192.168.1.4:8012/api/v1/product/', dataFile, {
        headers: {'content-type': 'multipart/form-data'},
      })
      .then(() => {
        Alert.alert('add product success');
      })
      .catch(() => {
        Alert.alert(Error);
      });
  };

  render() {
    return (
      <ScrollView style={styles.scrollViewArea}>
        <View style={styles.txtEditArea}>
          <Text style={styles.txtEdit}>Add Product</Text>
        </View>
        <View style={styles.inpAddArea}>
          <View style={styles.inpArea}>
            <TextInput
              style={styles.inp}
              placeholder="product name"
              onChangeText={name => this.setState({name})}
            />
            <TextInput
              style={styles.inp}
              keyboardType={'number-pad'}
              placeholder="price"
              onChangeText={price => this.setState({price})}
            />
            <TextInput
              style={styles.inp}
              keyboardType={'number-pad'}
              placeholder="Stock"
              onChangeText={stock => this.setState({stock})}
            />
            <Picker
              selectedValue={this.state.id_categori}
              style={styles.inp}
              onValueChange={itemValue =>
                this.setState({id_categori: itemValue})
              }>
              <Picker.Item label="Category" value="0" />
              <Picker.Item label="Makanan" value="1" />
              <Picker.Item label="Minuman" value="2" />
              <Picker.Item label="Kendaraan" value="3" />
              <Picker.Item label="aksesoris kendaraan" value="4" />
            </Picker>
            <Button title="Select Image" onPress={this.handleChoosePhoto} />
            <Image source={{uri: this.state.image}} style={styles.imgArea} />

            <TouchableOpacity
              onPress={() => this.handleAdd()}
              style={styles.btnAddArea}>
              <View>
                <Text style={styles.txtbtnAddArea}>Add Product</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  inp: {
    // backgroundColor:"green",
    width: 300,
    borderRadius: 5,
    height: 35,
    padding: 7,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  scrollViewArea: {
    flex: 1,
  },
  txtEditArea: {
    flex: 1,
    alignItems: 'center',
  },
  txtEdit: {
    fontFamily: 'baskerville',
    fontSize: 25,
    margin: 25,
  },
  inpAddArea: {
    flex: 1,
    alignItems: 'center',
  },
  inpArea: {
    padding: 10,
    marginTop: 50,
  },
  imgArea: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    margin: 20,
  },
  btnAddArea: {
    alignItems: 'center',
  },
  txtbtnAddArea: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 15,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    paddingLeft: 25,
    paddingRight: 25,
  },
});
