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
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Picker, Label} from 'native-base';

import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import {View} from 'native-base';
import _ from 'lodash';
import {Card} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import {connect} from 'react-redux';
import {getProduct} from '../redux/action/product';

export class Home extends Component {
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
      name: '',
      cost: '',
      id_categori: '',
      stok: '',
      kategory: '',
      image: null,
      qty: 0,
    };
    this.Search = _.debounce(this.Search, -0);
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
  UNSAFE_componentWillMount = async () => {
    this.backHandler.remove();
    try {
      const value = await AsyncStorage.getItem('token');
      const value2 = await AsyncStorage.getItem('user');
      this.setState({user: value2});
      console.log(value);
      console.log(this.state.user);
      if (value === null) {
        this.props.navigation.navigate('Login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleChangeSort = e => {
    this.setState({sort: e});
    this.list();
  };
  list = () => {
    this.setState(state => {
      if (state.sort === 'price') {
        state.Product.sort((a, b) => (a.price > b.price ? 1 : -1));
      } else if (state.sort === 'name') {
        state.Product.sort((a, b) => (a.name > b.name ? 1 : -1));
      } else if (state.sort === 'id_categori') {
        state.Product.sort((a, b) => (a.id_categori > b.id_categori ? 1 : -1));
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
          `http://54.158.219.28:8011/api/v1/product/search/${key}`,
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
  backAction = () => {
    BackHandler.exitApp();
    return true;
  };
  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.getTv();
  };
  getTv = async () => {
    await this.props.dispatch(getProduct()).then(response => {
      this.setState({
        Product: response.value.data.result,
      });
    });
  };
  Card(e, item) {
    // console.log(item);
    this.setState(state => {
      const data = state.cartItems;
      const cartNull = false;
      let productAlreadyInCart = false;
      data.map(cp => {
        if (cp.id === item.id) {
          cp.count += 1;
          productAlreadyInCart = true;
          if (cp.count === item.stock) {
            alert('cant add to cart');
            cp.count -= 1;
          }
        }
        // console.log(cp);
        // console.log(item);
      });
      if (!productAlreadyInCart) {
        data.push({...item, count: 1});
      }
      // if (!cartNull) {
      //   data.push(item);
      // }
      // console.log(data);
      // data.push(item);
    });
    // this.state.cartItems.map(cart => {
    //   if (item.id === cart.id) {
    //     console.log('ini sama');
    //   } else {
    //     this.state.cartItems.push(item);
    //   }
    // });
    // console.log(this.state.cartItems);
  }

  listItemComp({item}) {
    return (
      <View>
        <View style={styles.listArea}>
          <Card
            image={{
              uri: `${item.image.replace(
                'localhost:8012',
                '54.158.219.28:8011',
              )}`,
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
                  title="Edit"
                  onPress={() => this.setModalEdit(item)}
                />
              </View>
              <View style={styles.mdlEdit2}>
                <Button
                  type="clear"
                  title="Add To Cart"
                  onPress={e => this.Card(e, item)}
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
  deleteProduct(item) {
    console.log(item);
    this.props.navigation.navigate('Home');

    axios
      .delete('http://54.158.219.28:8011/api/v1/product/' + item)
      .then(Alert.alert('Success delete product'))
      .catch(Alert.alert('failed to delete product'));
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
      productImage: item.image.replace('localhost:8012', '54.158.219.28:8011'),
    });
  }
  updateProduct = () => {
    console.log(this.state.fileImage.fileName);
    const {productId, name, cost, stok, productCategory} = this.state;
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
    dataFile.append('id_categori', productCategory);
    console.log(dataFile);
    this.props.navigation.navigate('Home');
    console.log(dataFile);
    axios
      .patch(`http://54.158.219.28:8011/api/v1/product/${productId}`, dataFile)
      .then(() => Alert.alert('edit product success'))
      .then(this.setState({modalEdit: false}))

      .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
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
                selectedValue={resultCategory}
                style={styles.inp}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({productCategory: itemValue})
                }>
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
                  <Text style={styles.txtAddProduct}>Edit Product</Text>
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
  addCart() {
    console.log('add Cart');
  }
  deleteItem(data) {
    console.log('delete');
  }
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

        <FlatList
          style={styles.list}
          data={Product}
          renderItem={this.listItemComp.bind(this)}
        />
        <View style={styles.btm}>
          <View style={styles.btmnavigate}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Home')}>
              <Text>Home</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btmnavigate}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('Cart', {
                  data: this.state.cartItems,
                  user: this.state.user,
                })
              }>
              <Text>Cart</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btmnavigate}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Add')}>
              <Text>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btmnavigate}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('History')}>
              <Text>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        <this.modalEdit />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {flex: 1},
  btm: {
    flex: 0.07,
    flexDirection: 'row',
  },
  btmnavigate: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
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
    marginRight: 20,
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
    flex: 1,
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

const mapStateToProps = ({product}) => {
  return {product};
};
export default connect(mapStateToProps)(Home);
