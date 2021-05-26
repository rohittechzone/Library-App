import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedbackBase, Image, TextInput } from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import db from "../config" 
import firebase from "firebase"

export default class Transastion extends React.Component {
  constructor(){
   super()
   this.state={
     askCameraPermition : null,
     scan : false,
     scanData : "",
     buttonStatus : "normal",
     scanBookId: "",
     scanStudentId : ""
   }
  }
  getCameraPermition=async(id)=>{
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      askCameraPermition : status === 'granted',
      scan : false,
      scanData : "",
      buttonStatus : id,
      
    })
  }
  handleBarcode=async({data})=>{
   if(this.state.buttonStatus=="bookid"){
     this.setState({
       scan : true,
       scanBookId : data,
       buttonStatus : "normal"
     }
     )
   }
   else if(this.state.buttonStatus=="studentid"){
    this.setState({
      scan : true,
      scanStudentId : data,
      buttonStatus : "normal"
    }
    )
  }
  }
   initiatebook=async()=>{
   db.collection("transastion").add({
     book_id : this.state.scanBookId,
     student_id : this.state.scanStudentId,
     transastion_type : "issued",
     date : firebase.firestore.Timestamp.now().toDate()
   })
   const book_ref = db.collection("books")
   book_ref.where("bookid",'==',this.state.scanBookId).get().then((snapshot)=>{
     snapshot.forEach((doc)=>{
       book_ref.doc(doc.id).update({bookavailability:false})
     })
   })
   //db.collection("students").doc(this.state.scanStudentId).update({ 'noofbooksissued' : firebase.firestore.FieldValue.increment(+1) })
   const student_ref = db.collection("students")
   student_ref.where("studentid","==",this.state.scanStudentId).get().then((snapshot)=>{
    console.log(student_ref)
    snapshot.forEach((doc)=>{
      student_ref.doc(doc.id).update({noofbooksissued:firebase.firestore.FieldValue.increment(+1)})
    })
  })
  }
  returnbook=async()=>{
    db.collection("transastion").add({
      book_id : this.state.scanBookId,
      student_id : this.state.scanStudentId,
      transastion_type : "returned",
      date : firebase.firestore.Timestamp.now().toDate()
    })
    const book_ref = db.collection("books")
    book_ref.where("bookid",'==',this.state.scanBookId).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        book_ref.doc(doc.id).update({bookavailability:true})
      })
    })

    //db.collection("students").doc(this.state.scanStudentId).update({ 'noofbooksissued' : firebase.firestore.FieldValue.increment(-1) })
    const student_ref = db.collection("students")
    console.log(this.state.scanStudentId)
    student_ref.where("studentid","==",this.state.scanStudentId).get().then((snapshot)=>{
     console.log(student_ref)
     snapshot.forEach((doc)=>{
      
       student_ref.doc(doc.id).update({noofbooksissued:firebase.firestore.FieldValue.increment(-1)})
     })
   })
  }
  handleTransation=async()=>{
   const bookref = await db.collection("books").where("bookid","==",this.state.scanBookId).get()
   console.log("book")
   bookref.docs.map((doc)=>{
    var book = doc.data()
    console.log(book)
    if(book.bookavailability){
      this.initiatebook()
    }
    else{
      this.returnbook()
    }
      
   })
  }
  render(){
    if(this.state.buttonStatus !== "normal" && this.state.askCameraPermition){
       return (
         <BarCodeScanner style={StyleSheet.absoluteFillObject} onBarCodeScanned={this.state.scan ? undefined : this.handleBarcode}/>
       )
    }
    else if(this.state.buttonStatus === "normal"){
      console.log(this.state.scanData);
      return (
        <View style={{flex: 1, justifyContent:'center'}} >
          <View>
          <Image source = {require("../assets/booklogo.jpg")} style={{width:200,height:200,alignSelf:'center'}}></Image>
          </View>

          <View style={{flexDirection:'row',alignSelf:'center',margin:20}}>
            <TextInput placeholder = "Enter the book id" style={styles.inputbox} value={this.state.scanBookId} onChangeText={(text)=>
            this.setState(
              {
                scanBookId : text
              }
            )
            }/>
            <TouchableOpacity style={styles.scanbutton} onPress={()=>{
             this.getCameraPermition("bookid")
            }}>
              <Text style={styles.buttonText}>
               Scan
               </Text>
            </TouchableOpacity>
             
            </View>
            
            <View style={{flexDirection:'row',alignSelf:'center',margin:20}}>
            <TextInput placeholder = "Enter the students id" style={styles.inputbox} value={this.state.scanStudentId} onChangeText={(text)=>
            this.setState(
              {
                scanStudentId : text
              }
            )
            }/>
            <TouchableOpacity style={styles.scanbutton}onPress={()=>{
             this.getCameraPermition("studentid")
            }}>
             <Text style={styles.buttonText}>
               Scan
             </Text>
            </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={this.handleTransation}>
              <Text>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        
      ); 
    }
}
}
const styles = StyleSheet.create({
   scanbutton:{
     width : 100,
     height : 30,
     backgroundColor : 'purple',
     textAlign : 'center',
     marginLeft:20
   },
   inputbox:{
    width : 200,
    height : 40,
    backgroundColor : 'purple',
    textAlign : 'center',
    borderWidth : 2,
    borderRadius : 40,
    alignSelf:'center'
  },
   buttonText: {
     fontSize : 24,
     color : 'green',
   }
});
