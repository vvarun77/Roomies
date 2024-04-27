import * as React from "react";
import {Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, TouchableWithoutFeedback} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { StyleSheet } from "react-native";
import {useNavigation} from '@react-navigation/native';
import axios from "axios";
import * as Linking from 'expo-linking';
import { useEffect, useState } from "react";
import queryString from 'query-string';
import ReusableButton from "./UI/ReusableButton.js";
import { SafeAreaView } from "react-native-safe-area-context";
import ReusableTextFiled from "./UI/ReusableTextField.js";
import { styles } from "./Style.js";
import EmailIcon from "./assets/textfieldIcons/Message.png";
import ProfileIcon from "./assets/textfieldIcons/Profile.png";
import PasswordIcon from "./assets/textfieldIcons/Lock.png";
import LogInIcon from "./assets/buttonIcons/Login.png";
import CheckIcon from "./assets/buttonIcons/check3.png";
import BackButton from "./UI/BackButton.js";
import {Keyboard} from 'react-native';


export default function NamesScreen() {
  const [autoJoin, setAutoJoin] = useState(); 
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  var url = Linking.useURL(url);
  
	const handleURL = (url) => {
		const { hostname, path, queryParams } = Linking.parse(url);
		if (path === 'signup') {
      const parsed = queryString.parseUrl(url);
      setGroupName(parsed.query.groupName);
      setGroupCode(parsed.query.groupId);
      setAutoJoin(true);
    } else {
      setAutoJoin(false);
    }
	}
	useEffect(() => {
		if (url) {
			handleURL(url);
		}
	}, [url]);
  // start the sign up process.
  const navigation = useNavigation();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const handleFirstChange = (text) => {
    setFirstName(text);
  };
  const handleLastChange = (text) => {
    setLastName(text);
  };
  const handleNameSubmit = (text) => {
    navigation.navigate("SignUp", {
      firstName: firstName,
      lastName: lastName,
    });
  };


return( 

  <SafeAreaView style={styles.newcontainer}>
     
    <View style={styles.containerClass}> 
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> 

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{paddingTop:"20"}}>  
          <BackButton
            back={'SignIn'}
          />

          {autoJoin ? <Text style={styles.header} >You've been Invited to join {groupName} !</Text> : <Text style={styles.header}>what's your name? 👀</Text>}
                    <View style={styles.textBoxesContainer}>
 
 <View style={styles.textBoxes}>
   <ReusableTextFiled
     onChangeText={handleFirstChange}
     value={firstName}
     placeholder="First Name"
     imageSource={ProfileIcon}
     secure={false}
   />
 </View>
 <View style={styles.textBoxes}>
   <ReusableTextFiled
     onChangeText={handleLastChange}
     value={lastName}
     placeholder="Last Name"
     imageSource={ProfileIcon}
     secure={false}
   />
 </View>
    </View> 
    <ReusableButton
            function={handleNameSubmit}
            name="Continue"
            icon={LogInIcon}
            width={"70%"}
          />
</KeyboardAvoidingView>      
</TouchableWithoutFeedback>
    </View>    

  </SafeAreaView>
 

);
}
