import React, {Component} from 'react';
import {
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
  Modal,
  // AsyncStorage,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Picker, Label} from 'native-base';

// import AsyncStorage from '@react-native-community/async-storage';
import {ScrollView} from 'react-native-gesture-handler';
// import ListItemComp from '../components/ListItem'
import axios from 'axios';
import {View} from 'native-base';
import _ from 'lodash';
import {Card} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';

//import { Modal } from 'react-native-paper';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Product: [],
      search: '',
      sort: '',
      idP: 0,
      cartItems: [],
      modalVisible: false,
      modalEdit: false,
      //  edit product
      name: '',

      cost: '',
      id_categori: '',
      stok: '',
      kategory: '',
      image: null,
    };
    this.Search = _.debounce(this.Search, -0);
  }
  editProduct = () => {
    axios.get('http://localhost:8080/api/v1/product/').then(res => {
      this.setState({
        name: res.data[0].name,
        image: res.data.image,
        price: res.data[0].price,
        id_categori: res.data[0].id_categori,
        stock: res.data[0].stock,
      });
    });
  };
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
      // }
    });
  };
  UNSAFE_componentWillMount = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      console.log(value);
      if (value === null) {
        this.props.navigation.navigate('Login');
      }
    } catch (error) {
      console.log(error);
    }
  };
  componentDidMount = () => {
    const id = this.props.match.params.id;
    axios
      .get('http://192.168.1.166:8080/api/v1/product/' + id)
      .then(res => {
        console.log(res);
        this.setState({
          name: res.data[0].name,
          image: res.data.image,
          price: res.data[0].price,
          id_categori: res.data[0].id_categori,
          stock: res.data[0].stock,
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  // Sort
  handleChangeSort = e => {
    this.setState({sort: e});
    this.list();
    // console.warn(this.state.sort)
  };
  list = () => {
    this.setState(state => {
      if (state.sort === 'price') {
        state.Product.sort((a, b) => (a.price > b.price ? 1 : -1));
      } else if (state.sort === 'name') {
        state.Product.sort((a, b) => (a.name > b.name ? 1 : -1));
      } else if (state.sort === 'id_categori') {
        state.Product.sort((a, b) => (a.id_categori > b.id_categori ? 1 : -1));
      } else {
        state.product.sort((a, b) => (a.id > b.id ? 1 : -1));
      }
    });
  };

  onSearch = key => {
    this.setState({
      search: key,
    });
    this.Search(key);
  };

  Search = async key => {
    if (key && key.length > 0) {
      try {
        const response = await axios.get(
          `http://192.168.1.4:8012/api/v1/product/search/${key}`,
        );
        this.setState({
          Product: response.data,
        });
      } catch (err) {
        console.log(err);
        return Alert.alert(
          'Error',
          'Error connection to server error',
          [{text: 'OK'}],
          {
            cancelable: false,
          },
        );
      }
    } else {
      this.getTv();
    }
  };
  componentDidMount = () => {
    this.getTv();
  };
  getTv = async () => {
    await axios.get('http://192.168.1.4:8012/api/v1/product/').then(res => {
      console.log(res.data.result);
      this.setState({
        Product: res.data.result,
      });
    });
  };

  listItemComp({item}) {
    return (
      <View>
        <View style={styles.listArea}>
          <Card
            image={{
              uri: `${item.image.replace('localhost', '192.168.1.4')}`,
            }}>
            <Text
              onPress={() => {
                this.setModalVisible(true);
              }}
              style={styles.mdl}>
              {item.name}
            </Text>
            <Text style={styles.price} h4>
              Rp.{item.price}
            </Text>
            <Text h6 style={styles.description}>
              Added : {item.creat.slice(0, 10)}
            </Text>
            <View style={styles.mdlEditArea}>
              <View style={styles.mdlEdit2}>
                <Button
                  type="clear"
                  title="Add To Cart"
                  onPress={() => this.setModalEdit(item)}
                />
              </View>
              <View style={styles.btnDlte}>
                <Button
                  color="red"
                  title="delete"
                  onPress={() => this.deleteProduct(item.id)}
                />
              </View>
            </View>
          </Card>
        </View>
      </View>
    );
  }

  // delete product
  deleteProduct({item}) {
    console.log(item);
    this.props.navigation.navigate('Home');

    axios.delete('http://192.168.1.4:8012/api/v1/product/' + item);
    Alert.alert('Success Delete Product');
  }
  deleteConfirm() {
    Alert.alert(
      'Toko',
      {text: `Are you sure you want to delete ${this.state.product.name}`},
      [
        {
          text: 'Ask me later',
          onPress: () => this.deleteProduct(),
        },
        {
          text: 'Cancel',
          onPress: () => this.props.navigation.navigate('Home'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }
  // --------------------------------------------------------------------------------- //

  logOut = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log(error);
    }
    // this.render()
    this.props.navigation.navigate('Login');
  };
  setModalEdit(item) {
    this.setState({
      modalEdit: true,
      productId: item.id,
      productName: item.name,
      productPrice: item.price,
      productStock: item.stock,
      productCategory: item.id_categori,
      productImage: item.image.replace('localhost', '192.168.1.4'),
    });
  }
  updateProduct = () => {
    const {productId, name, cost, stok, kategory} = this.state;
    console.log(productId);
    const dataFile = new FormData();
    dataFile.append('name', name);
    dataFile.append('price', cost);

    dataFile.append('stock', stok);
    dataFile.append('image', {
      uri: this.state.fileImage.uri,
      type: 'image/jpeg',
      name: this.state.fileImage.fileName,
    });
    dataFile.append('id_categori', kategory);
    this.props.navigation.navigate('Home');
    axios
      .patch(`http://192.168.1.4:8012/api/v1/product/${productId}` + dataFile, {
        headers: {'content-type': 'multipart/form-data'},
      })
      .then(console.log('edit success'))
      .catch(error => {
        console.log(error);
      });
  };
  modalEdit = () => {
    const {
      productId,
      productPrice,
      productStock,
      productImage,
      productCategory,
    } = this.state;
    const price = productPrice;
    const stock = productStock;
    const category = productCategory;
    const convertPrice = new String(price);
    const convertStock = new String(stock);
    const convertCategory = new String(category);
    const resultPrice = convertPrice.toString();
    const resultStock = convertStock.toString();
    const resultCategory = convertCategory.toString();
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalEdit}>
        <ScrollView style={styles.scrollViewArea}>
          <View style={styles.txtInputArea}>
            <Text style={styles.txtEditArea}>edit Product</Text>
          </View>
          <View style={styles.txtInputArea}>
            <View style={styles.txtInputAddArea}>
              <TextInput
                style={styles.inp}
                placeholder="product name"
                defaultValue={this.state.productName}
                onChangeText={name => this.setState({name})}
              />
              <TextInput
                style={styles.inp}
                keyboardType={'number-pad'}
                placeholder="price"
                defaultValue={resultPrice}
                onChangeText={cost => this.setState({cost})}
              />
              <TextInput
                style={styles.inp}
                keyboardType={'number-pad'}
                placeholder="Stock"
                defaultValue={resultStock}
                onChangeText={stok => this.setState({stok})}
              />
              <Picker
                style={styles.inp}
                onValueChange={kategory => this.setState({kategory})}
                selectedValue={resultCategory}>
                <Picker.Item label="Category" value="0" />
                <Picker.Item label="makanan" value="1" />
                <Picker.Item label="minuman" value="2" />
                <Picker.Item label="kendaraan" value="3" />
                <Picker.Item label="aksesoris kendaraan" value="4" />
              </Picker>
              <Button title="Select Image" onPress={this.handleChoosePhoto} />
              <Image
                source={{
                  uri:
                    this.state.image === null ? productImage : this.state.image,
                }}
                style={styles.imgPickerArea}
              />

              <TouchableOpacity
                onPress={() => this.updateProduct(productId)}
                style={styles.btnAddArea}>
                <View>
                  <Text style={styles.txtAddProduct}>Add Product</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({modalEdit: false})}
                style={styles.btnAddArea}>
                <View>
                  <Text style={styles.txtAddProduct}>Cancel</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    );
  };
  render() {
    const Filter = () => {
      return (
        <View style={styles.sortArea}>
          <Picker
            selectedValue={this.state.sort}
            style={styles.pickerArea}
            onValueChange={value => this.handleChangeSort(value)}>
            <Picker.Item label="price" value="price" />
            <Picker.Item label="name" value="name" />
            <Picker.Item label="category" value="id_categori" />
          </Picker>
        </View>
      );
    };
    const {Product} = this.state;
    return (
      <View style={styles.bodyArea}>
        <View style={styles.searchArea}>
          <View style={styles.search}>
            <TextInput
              style={styles.txtInputSearchArea}
              placeholder="Search"
              onChangeText={e => {
                this.onSearch(e);
              }}
            />
          </View>
          <View style={styles.sortAreaBody}>
            <Label>Sort :</Label>
          </View>
          <Filter onChange={this.handleChangeSort} />
          <TouchableOpacity
            onPress={() => this.logOut()}
            style={styles.logoutArea}>
            <View>
              <Image
                style={styles.imgLogoutArea}
                source={require('../assets/image/lg.png')}
              />
            </View>
          </TouchableOpacity>
        </View>

        <FlatList data={Product} renderItem={this.listItemComp.bind(this)} />
        <this.modalEdit />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  img: {
    marginRight: 10,
  },
  price: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
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
  txtAddProduct: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 15,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 20,
  },
  search: {
    flex: 2,
    borderWidth: 0.5,
    borderColor: 'black',
    height: 35,
    borderRadius: 10,
  },
  listArea: {
    zIndex: -100,
  },
  mdl: {
    marginBottom: 10,
    marginTop: 20,
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'georgia',
  },
  mdlEditArea: {
    flexDirection: 'row',
    marginTop: 5,
  },
  mdlEdit2: {
    marginRight: 90,
  },
  btnDlte: {
    alignSelf: 'flex-end',
    backgroundColor: 'blue',
  },
  sortArea: {
    flex: 1,
  },
  pickerArea: {
    height: 35,
  },
  bodyArea: {
    marginBottom: 50,
  },
  searchArea: {
    flexDirection: 'row',
    margin: 10,
  },
  txtInputSearchArea: {
    padding: 5,
    paddingLeft: 7,
    borderColor: 'blue',
  },
  sortAreaBody: {
    justifyContent: 'center',
    height: 35,
    padding: 10,
  },
  logoutArea: {
    alignItems: 'center',
    height: 35,
  },
  imgLogoutArea: {
    width: 30,
    height: 30,
  },
  imgPickerArea: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    margin: 20,
  },
  btnAddArea: {
    alignItems: 'center',
  },
  txtInputAddArea: {
    padding: 10,
    marginTop: 50,
  },
  txtInputArea: {
    flex: 1,
    alignItems: 'center',
  },
  scrollViewArea: {
    flex: 1,
  },
  txtEditArea: {
    fontFamily: 'baskerville',
    fontSize: 25,
    margin: 25,
  },
});
