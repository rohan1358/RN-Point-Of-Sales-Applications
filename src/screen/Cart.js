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
import {StyleSheet, TouchableOpacity, View, Image, Alert} from 'react-native';
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
  }
  UNSAFE_componentWillMount() {
    console.log(this.props);
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
            Alert.alert('cant add to cart');
          }
        }
      });
      if (!productAlreadyInCart) {
        data.push({...hello, count: 1});
      }
      AsyncStorage.setItem('data', JSON.stringify(data));
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
          this.deleteOneCart(e, hello);
        } else {
          if (cp.id === hello.id) {
            counter = cp.count -= 1;
            productAlreadyInCart = true;
          }
        }
      });
      AsyncStorage.setItem('data', JSON.stringify(data));
      return {data: data};
    });
    this.props.route.params.deleteOneCart(e, hello);
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
  deleteOneCart = (e, id) => {
    console.log(id);
    this.setState(props => {
      const data = this.state.data.filter(a => a.id !== id.id);
      AsyncStorage.setItem('data', JSON.stringify(data));
      console.log(data);
      return {data: data};
    });
    this.props.route.params.deleteOneCart(e, id);
  };
  Checkout = () => {
    const state = this.state;
    console.log(state.user);
    const date = new Date();
    const month = date.toDateString();
    const year = date.getFullYear();
    const invoices = new Date().toLocaleString().replace(/[/:, -,P,M,A]/gi, '');
    this.state.data.map(state => {
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
    Alert.alert('Succes, Checkin History ');
  };
  addQty() {}
  render() {
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
                    <TouchableOpacity
                      onPress={e =>
                        // this.props.route.params.deleteOneCart(e, hello)
                        this.deleteOneCart(e, hello)
                      }>
                      <Text>Delete</Text>
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
              {this.state.data.reduce((a, c) => a + c.price * c.count, 0)}*
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
