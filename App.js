import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import Transastion from './screen/transastion'
import Search from './screen/search'
export default class Library_App extends React.Component {
  render(){
  return (
      <AppContainer/>
  );
}
}
const TabNavigator = createBottomTabNavigator({
  TransastionScreen : {screen:Transastion},
  Search : {screen:Search}
})
const AppContainer = createAppContainer(TabNavigator)
const styles = StyleSheet.create({

});
