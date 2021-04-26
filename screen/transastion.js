import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedbackBase } from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';

export default class Transastion extends React.Component {
  constructor(){
   super()
   this.state={
     askCameraPermition : null,
     scan : false,
     scanData : "",
     buttonStatus : "normal",
   }
  }
  getCameraPermition=async()=>{
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      askCameraPermition : status === 'granted',
      scan : false,
      scanData : "",
      buttonStatus : "clicked",
    })
  }
  handleBarcode=async(data)=>{
   this.setState({
     scan : true,
     scanData : data,
     buttonStatus : "normal",

   })
  }
  render(){
    if(this.state.buttonStatus === "clicked" && this.state.askCameraPermition){
       return (
         <BarCodeScanner style={StyleSheet.absoluteFillObject} onBarCodeScanned={this.state.scan ? undefined : this.handleBarcode}/>
       )
    }
    else if(this.state.buttonStatus === "normal"){
      console.log(this.state.scanData);
      return (
        <View style={{flex: 1, justifyContent:'center'}}>
         <Text>{this.state.askCameraPermition===true ? this.state.scanData : "Request Camera Permition"}</Text>
         <TouchableOpacity style={styles.button} onPress={this.getCameraPermition}>
           <Text style={styles.buttonText}>Scan</Text>
         </TouchableOpacity>
        </View>
      ); 
    }
}
}
const styles = StyleSheet.create({
   button:{
     width : 100,
     height : 30,
     justifyContent : 'center',
     alignSelf : 'center',
     backgroundColor : 'purple',
     textAlign : 'center',
   },
   buttonText: {
     fontSize : 30,
     color : 'green',
   }
});
