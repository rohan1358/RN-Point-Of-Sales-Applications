import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Table, Row, Rows} from 'react-native-table-component';
import Axios from 'axios';
import {Button} from 'react-native-paper';
export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      tableHead: ['Cashier', 'date', 'Amount'],
      tableData: [],
      invoices: [],
    };
  }

  UNSAFE_componentWillMount() {
    Axios.get('http://54.158.219.28:8011/api/v1/order').then(res => {
      const history = res.data;
      () => this.setState({invoices: history.invoices});
    });
    Axios.get('http://54.158.219.28:8011/api/v1/order/todayIncome').then(
      res => {
        const todayIncome = res.data[0].Total;
        this.setState({todayIncome});
      },
    );
    Axios.get('http://54.158.219.28:8011/api/v1/order/allorder').then(res => {
      const allOrder = res.data[0].total_order;
      this.setState({allOrder});
      //   console.log(allOrder);
    });
    Axios.get('http://54.158.219.28:8011/api/v1/order/yearincome').then(res => {
      const yearIncome = res.data[0].total;
      this.setState({yearIncome});
      //   console.log(yearIncome);
    });
  }
  render() {
    const state = this.state;
    return (
      <View style={{flex: 1}}>
        <Button onPress={() => console.log(this.state.invoices)}>
          <Text>test</Text>
        </Button>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View style={styles.income}>
            <View>
              <Text>Today's Income</Text>
              <Text>{state.todayIncome}</Text>
              <Text>+2% Yesterday</Text>
            </View>
          </View>
          <View style={styles.income}>
            <View>
              <Text>Orders</Text>
              <Text>{state.allOrder}</Text>
              <Text>+2% Yesterday</Text>
            </View>
          </View>
          <View style={styles.income}>
            <View>
              <Text>This Year's Income</Text>
              <Text>{state.yearIncome}</Text>
              <Text>+2% Yesterday</Text>
            </View>
          </View>
        </View>
        <View>
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
            <Row
              data={state.tableHead}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows textStyle={styles.text} />
          </Table>
        </View>
        <View style={{flex: 1}} />
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
  income: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
  },
});
