import * as React from "react";
import {Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, TouchableWithoutFeedback, Alert } from "react-native";
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

export default function SignUpScreen({ route }, components) {
  // check if url contains clerk key, group id, and group name, if so set the text in ui to join the group
  // set clerk method to ticket
  const navigation = useNavigation();
  const { isLoaded, signUp, setActive } = useSignUp();
  var email;
  var userpassword;
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState(""); 
 const [firstName, setFirstName] = React.useState(route.params.firstName);
 const [lastName, setLastName] = React.useState(route.params.lastName);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const [groupName, setGroupName] = useState(""); 
  //ticket can be used later for users who accept invites to not verify email, but it will take some rewriting
  //const [ticket, setTicket] = useState(""); 
  const [groupCode, setGroupCode] = useState("");
  const [autoJoin, setAutoJoin] = useState(); 
  
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
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    const showAlert = (err) =>
    Alert.alert(
      
      err.errors[0].message,
      err.errors[0].longMessage,
      
        {
          cancelable: true,
          text: 'Cancel',
          onPress: () => Alert.alert('Cancel Pressed'),
          style: 'cancel',
        },
    
    );

    //only if the user is has a group code, then execute new sign up, else sign up via ticket
    try {
      //link contains parameters then set ticket stratgey, maybe if else with different questions
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });
  
    email = emailAddress;
    userpassword = password;
    fName = firstName;
    lName = lastName;

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
 
      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
 
  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
 
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      await setActive({ session: completeSignUp.createdSessionId });
      console.log(completeSignUp.createdSessionId );

      axios.post('https://npttiggp4i.execute-api.us-east-1.amazonaws.com/default/signUpClerk-roomie', {
        email: email, userpassword: userpassword, fName: fName, lName: lName}, 
      {
        headers: {
        'Content-Type': "application/json",
        'Accept': "application/json",
        }  
      }  
      )  
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        showAlert(error);
      });
      navigation.navigate('Groups');
    } catch (err) {
        if(err.errors[0].code == "verification_already_verified"){
          navigation.navigate('Groups');
        }
        else{
            console.error(JSON.stringify(err, null, 2));
        }
    }
  }
  

  const handleFirstChange = (text) => {
    setFirstName(text);
  };
  const handleLastChange = (text) => {
    setLastName(text);
  };
  const handleEmailChange = (text) => {
    setEmailAddress(text);
  };
  const handlePasswordChange = (text) => {
    setPassword(text);
  };
  const handleCodeChange = (text) => {
    setCode(text);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView style={styles.newcontainer}>
      {!pendingVerification && (
        <View style={styles.containerClass}>            
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{paddingTop:"20"}}>  
          <BackButton
            back={'SignIn'}
          />
          {autoJoin ? <Text style={styles.header} >You've been Invited to join {groupName} !</Text> : <Text style={styles.header}>complete sign 🆙</Text>}
          <View style={styles.textBoxesContainer}>
          <View style={styles.textBoxes}>
            <ReusableTextFiled
              onChangeText={handleEmailChange}
              //value={emailAddress}
              placeholder="Email"
              imageSource={EmailIcon}
              secure={false}
            />
            </View>
            <View style={styles.textBoxes}>
              <ReusableTextFiled
                onChangeText={handlePasswordChange}
                //value={password}
                placeholder="Password"
                imageSource={PasswordIcon}
                secure={true}
              />
            </View>
          </View>
          <ReusableButton
            function={onSignUpPress}
            name="Create"
            icon={LogInIcon}
            width={"70%"}
          />
          </KeyboardAvoidingView>
        </View>
      )}
      {pendingVerification && (
          <View style={styles.containerClass}>
            <Text style={styles.header} >verify email 📧</Text>
            <TextInput
        style={{
          width: "70",
          borderBottomWidth: 4,
          textAlign: "center",
          fontSize: 24,
          marginTop: "20%",
        }}
        placeholder="Code"
        value={code}
        onChangeText={(text) => setCode(text)}
        />
          <ReusableButton
            function={onPressVerify}
            name="Verify"
            icon={CheckIcon}
            width={"100%"}
            height={"40%"}
          />
        </View>
      )}
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
