//import liraries
import React, {Component, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Size} from '../Utility/sizes';
import Colors from '../Utility/Colors';
import {Regular} from '../Assets/fonts';
import {Route} from '../Navigation/Routes';
import Navigator from '../Utility/Navigator';

// create a component
const MyComponent = props => {
  const [listview, setlistview] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Menu</Text>
        <TouchableOpacity
          onPress={() => {
            props.navigation.closeDrawer();
          }}>
          <MaterialCommunityIcons name={'close'} size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.lineView} />
      <View style={styles.body}>
        <View
          style={[
            styles.categoryButton,
            {backgroundColor: listview ? '#fff' : '#fdecef'},
          ]}>
          <Text
            style={[
              styles.textToggleView,
              {color: listview ? '#000' : Colors.Background},
            ]}>
            Shop by Categories
          </Text>
          <TouchableOpacity onPress={() => setlistview(!listview)}>
            <MaterialIcons
              name={listview ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={20}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => Navigator.navigate(Route.Recipes)}>
          <Text style={styles.textView}>Recipes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Navigator.navigate(Route.Offers)}>
          <Text style={styles.textView}>Offers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Navigator.navigate(Route.StoreLocator)}>
          <Text style={styles.textView}>Store Locator</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Navigator.navigate(Route.AboutUs)}>
          <Text style={styles.textView}>About Us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    justifyContent: 'space-between',
    padding: 20,
    flexDirection: 'row',
  },
  lineView: {
    padding: 0.3,
    backgroundColor: 'grey',
  },
  body: {
    padding: 20,
  },
  categoryButton: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
  },
  textView: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  textToggleView: {},
});

//make this component available to the app
export default MyComponent;
