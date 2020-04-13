import React, {Component} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Table, Row, Rows} from 'react-native-table-component';
import Axios from 'axios';
import {Button} from 'react-native-paper';
export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Cashier', 'date', 'Amount'],
      tableData: [[]],
      users: [],
      dates: [],
      total: [],
    };
  }
  getAllHistory() {
    Axios.get('http://54.158.219.28:8011/api/v1/order').then(res => {
      const history = res.data;
      // this.setState({invoices: history});
      history.map(histori => {
        console.log(histori);
        this.state.tableData.push(histori.users);
        // this.state.tableData.push(histori.dates);
        // this.state.tableData.push(histori.total);
      });
    });
  }
  UNSAFE_componentWillMount() {
    Axios.get('http://54.158.219.28:8011/api/v1/order').then(res => {
      const history = res.data;
      // this.setState({invoices: history});
      history.map(histori => {
        console.log(histori);
        this.state.users.push(histori.users);
        this.state.dates.push(histori.dates);
        this.state.total.push(histori.total);
      });
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
        <View
          style={{
            alignItems: 'center',
            backgroundColor: 'lightblue',
            marginBottom: 10,
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold', paddingVertical: 5}}>
            History
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View style={styles.income}>
            <View>
              <Text>Today's Income</Text>
              <Text>Rp.{state.todayIncome}</Text>
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
              <Text>Rp.{state.yearIncome}</Text>
              <Text>+2% Yesterday</Text>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', flex: 1, marginTop: 10}}>
          <ScrollView>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.historyArea}>
                <Text style={styles.title}>Cachier</Text>
                {state.users.map(user => {
                  return <Text style={styles.content}>{user}</Text>;
                })}
              </View>
              <View style={styles.historyArea}>
                <Text style={styles.title}>Date</Text>
                {state.dates.map(user => {
                  return <Text style={styles.content}>{user}</Text>;
                })}
              </View>
              <View style={styles.historyArea}>
                <Text style={styles.title}>Amount</Text>
                {state.total.map(user => {
                  return <Text style={styles.content}>{user}</Text>;
                })}
              </View>
            </View>
          </ScrollView>
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    borderBottomWidth: 2,
    marginBottom: 5,
  },
  historyArea: {
    flex: 1,
    borderWidth: 1,
    // paddingLeft: 5,
  },
  content: {
    marginVertical: 4,
    borderBottomWidth: 1,
    paddingLeft: 5,
  },
});
