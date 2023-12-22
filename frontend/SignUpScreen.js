import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { StyleSheet } from "react-native";
import {useNavigation} from '@react-navigation/native';
import { Clerk } from '@clerk/backend';
import axios from "axios";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center", // Center vertically
      alignItems: "center",     // Center horizontally
    },
  });
  
export default function SignUpScreen() {
    //const clerk = Clerk({ apiKey: 'pk_test_Zmlyc3QtZG9scGhpbi05OS5jbGVyay5hY2NvdW50cy5kZXYk' });
    const navigation = useNavigation();
  const { isLoaded, signUp, setActive } = useSignUp();
    var email;
    var userpassword;
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
 
  // start the sign up process.
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
 
    try {
      await signUp.create({
        emailAddress,
        password,
      });
    email = emailAddress;
    userpassword = password;
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

      axios.post('https://npttiggp4i.execute-api.us-east-1.amazonaws.com/default/signUpClerk-roomie', {email: email, userpassword: userpassword}, 
      {
        headers: {
        'Content-Type': "application/json",
        'Accept': "application/json",
        }  
    }  )  
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
  };
 
  return (
    <View style={styles.container}>
      {!pendingVerification && (
        <View>
          <View>
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