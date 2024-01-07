import * as React from "react";
import {Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { StyleSheet } from "react-native";
import {useNavigation} from '@react-navigation/native';
import axios from "axios";
import * as Linking from 'expo-linking';
import { useEffect, useState } from "react";
import queryString from 'query-string';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center", // Center vertically
      alignItems: "center",     // Center horizontally
    },
  });

export default function SignUpScreen() {

  // check if url contains clerk key, group id, and group name, if so set the text in ui to join the group
  // set clerk method to ticket
  const navigation = useNavigation();
  const { isLoaded, signUp, setActive } = useSignUp();
  var email;
  var userpassword;
  var fName;
  var lName;
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const [groupCode, setGroupCode] = useState(""); 
  const [groupName, setGroupName] = useState(""); 
  //const [ticket, setTicket] = useState(""); 
  const [autoJoin, setAutoJoin] = useState(); 
  
  const url = Linking.useURL();

	const handleURL = (url) => {
		const { hostname, path, queryParams } = Linking.parse(url);
		if (path === 'signup') {
      const parsed = queryString.parseUrl(url);
      setGroupCode(parsed.query.groupId);
      setGroupName(parsed.query.groupName);
      setAutoJoin(true);
    } else {
      setAutoJoin(false);
      console.log("set to false")
    }
	}
	useEffect(() => {
		if (url) {
			handleURL(url);
		} else {
			console.log('No URL');
		}
	}, [url]);
  // start the sign up process.
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }


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
        console.log(JSON.stringify(error));
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
  

  return (
    //the first view checks is autojoin is set, and then conditionally renders join name
    <View style={styles.container}>
        <View>
          {autoJoin ? <Text>You've been Invited to join {groupName} !</Text> : <Text></Text>}
        </View>
      {!pendingVerification && (
        <View>
          <View>
          <TextInput
              value={firstName}
              placeholder="First Name"
              placeholderTextColor="#000"
              onChangeText={(firstName) => setFirstName(firstName)}
            />
          <TextInput
              value={lastName}
              placeholder="Last Name"
              placeholderTextColor="#000"
              onChangeText={(lastName) => setLastName(lastName)}
            />
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email..."
              placeholderTextColor="#000"
              onChangeText={(email) => setEmailAddress(email)}
            />
          </View>
 
          <View>
            <TextInput
              value={password}
              placeholder="Password..."
              placeholderTextColor="#000"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
 
          <TouchableOpacity onPress={onSignUpPress}>
            <Text>Sign up</Text>
          </TouchableOpacity>
        </View>
      )}
      {pendingVerification && (
        <View>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              placeholderTextColor="#000"
              onChangeText={(code) => setCode(code)}
            />
          </View>
          <TouchableOpacity onPress={onPressVerify}>
            <Text>Verify Email</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}