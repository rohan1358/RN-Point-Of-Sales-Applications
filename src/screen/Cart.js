import React, {Component} from 'react';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
} from 'native-base';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import Axios from 'axios';
import qs from 'query-string';
import AsyncStorage from '@react-native-community/async-storage';
export class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.route.params.data,
      counter: 0,
      state: 1,
      dummy: [],
      user: this.props.route.params.user,
    };
    this.handleDelete = this.deleteOneCart.bind(this);
  }
  add(e, hello) {
    let counter = 1;
    this.setState(state => {
      const data = state.data;
      let productAlreadyInCart = false;
      data.map(cp => {
        if (cp.id === hello.id) {
          counter = cp.count += 1;
          productAlreadyInCart = true;
          if (cp.count === hello.stock) {
            alert('cant add to cart');
          }
        }
      });
      if (!productAlreadyInCart) {
        data.push({...hello, count: 1});
      }
      return {data: data};
    });
  }
  reduce(e, hello) {
    let counter = 1;
    this.setState(state => {
      const data = state.data;
      let productAlreadyInCart = false;
      data.map(cp => {
        if (hello.count === 1) {
          this.deleteOneCart(hello);
        } else {
          if (cp.id === hello.id) {
            // if (cp.count === 1) {
            //   this.handleDelete();
            // }
            counter = cp.count -= 1;
            productAlreadyInCart = true;
          }
        }
      });
      // if (!productAlreadyInCart) {
      //   data.push({...hello, count: 1});
      // }
      return {data: data};
    });
  }
  cartNull() {
    return (
      <View style={{alignItems: 'center', marginTop: 100}}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../assets/image/restaurant.png')}
            style={{width: 200, height: 200}}
          />
          <Text
            style={{
              fontFamily: 'airbnb cereal app',
              fontSize: 30,
              fontWeight: 'bold',
            }}>
            You cart is empty
          </Text>
          <Text style={{color: '#CECECE', marginTop: 10}}>
            Please add some items from the menu
          </Text>
        </View>
      </View>
    );
  }
  deleteOneCart = id => {
    this.setState(state => {
      const cartItems = state.data.filter(a => a.id !== id.id);
      return {data: cartItems};
    });
  };
  Checkout = () => {
    const date = new Date();
    const month = date.toDateString();
    const year = date.getFullYear();
    this.setState({setModalShow: true});
    const invoices = new Date().toLocaleString().replace(/[/:, -,P,M,A]/gi, '');
    this.props.route.params.data.forEach(state => {
      const form = {
        product_id: state.id,
        qty: state.count,
        invoices,
        total: state.count * state.price,
        dates: month,
        users: this.state.user,
        year: year,
      };
      Axios.post('http://54.158.219.28:8011/api/v1/order', qs.stringify(form));
    });
    Alert.alert(invoices);
  };
  delete(id) {
    console.log(this.state.data[0].count);
  }
  addQty() {}
  render() {
    const {cartItems} = this.state;
    console.log(this.state.data);
    return (
      <View style={{flex: 1}}>
        <View style={{alignItems: 'center', backgroundColor: 'lightblue'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', paddingVertical: 5}}>
            Item Cart
          </Text>
        </View>
        <Container>
          <Content>
            {/* <FlatList
              data={this.state.data}
              renderItem={({item}) => (
                <this.cartNotNull
                  title={item.name}
                  id={item.id}
                  img={item.image}
                  hapus={this.handleDelete}
                />
              )}
              keyExtractor={item => item.id}
            /> */}
            {this.state.data.map(hello => {
              return (
                <ListItem thumbnail>
                  <Left>
                    <Thumbnail
                      square
                      source={{
                        uri: hello.image.replace(
                          'localhost:8012',
                          '54.158.219.28:8011',
                        ),
                      }}
                    />
                  </Left>
                  <Body>
                    <Text style={{fontWeight: 'bold'}}>{hello.name}</Text>
                    <View style={{flexDirection: 'row', marginTop: 10}}>
                      <Button
                        style={styles.btnAddReduce}
                        onPress={e => this.reduce(e, hello)}>
                        <Text style={styles.txtBtn}>Reduce</Text>
                      </Button>
                      <Text
                        style={{
                          marginRight: 0,
                          paddingTop: 4,
                        }}>
                        {' '}
                        {hello.count}{' '}
                      </Text>
                      <Button
                        style={styles.btnAddReduce}
                        onPress={e => {
                          this.add(e, hello);
                        }}>
                        <Text style={styles.txtBtn}>Add</Text>
                      </Button>
                    </View>
                  </Body>
                  <Right>
                    <TouchableOpacity onPress={() => this.handleDelete(hello)}>
                      <Text>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity transparent onPress={() => this.cek()}>
                      <Text>Cek</Text>
                    </TouchableOpacity>
                  </Right>
                </ListItem>
              );
            })}
          </Content>
        </Container>
        <View style={{marginHorizontal: 20, marginBottom: 10}}>
          <View>
            <Text>Total</Text>
            <Text style={{}}>
              Rp.
              {this.props.route.params.data.reduce(
                (a, c) => a + c.price * c.count,
                0,
              )}
              *
            </Text>
          </View>
          <Button
            onPress={() => this.Checkout()}
            style={{justifyContent: 'center', borderRadius: 10}}>
            <Text>Checkout</Text>
          </Button>
        </View>
        <View style={styles.btm}>
          <View style={styles.btmnavigate}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Home')}>
              <Text>Home</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btmnavigate}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Cart')}>
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
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
  txtBtn: {
    fontSize: 10,
    color: 'black',
  },
  btnAddReduce: {
    height: 30,
    backgroundColor: 'lightblue',
  },
});

const mapStateToProps = ({product}) => {
  return {product};
};
export default connect(mapStateToProps)(Cart);
