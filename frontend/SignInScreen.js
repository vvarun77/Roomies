import React, { useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import {useNavigation} from '@react-navigation/native';
import { useClerk } from "@clerk/clerk-react"
import ReusableButton from "./UI/ReusableButton.js";
import { SafeAreaView } from "react-native-safe-area-context";
import ReusableTextFiled from "./UI/ReusableTextField.js";
import { styles } from "./Style.js";
import EmailIcon from "./assets/textfieldIcons/Message.png";
import PasswordIcon from "./assets/textfieldIcons/Lock.png";
import LogInIcon from "./assets/buttonIcons/Login.png";
import * as Linking from 'expo-linking';

export default function SignInScreen() {
  // add logic to check for sign up token
  // clerk token + group id + group name

  //send user to signup, if they were sent a signup link
  const url = Linking.useURL();
	const handleURL = (url) => {
		const { hostname, path, queryParams } = Linking.parse(url);
		if (path === 'signup') {      
			navigation.navigate('SignUp')
		} else {
			console.log(path, queryParams);
		}
	}
	useEffect(() => {
		if (url) {
			handleURL(url);
		} else {
			console.log('No URL');
		}
	}, [url])
  const navigation = useNavigation();
  const { signIn, setActive, isLoaded } = useSignIn();
 
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const onNewUserPress = async () => {
    navigation.navigate('SignUp')
  }

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
 
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId })
      navigation.navigate("Tab")
     
      } catch (err) {
        console.error(JSON.stringify(err, null, 2));
    }
  };
  const clerk = useClerk();
  const handleEmailChange = (text) => {
    setEmailAddress(text);
  };
  const handlePasswordChange = (text) => {
    setPassword(text);
  };
  return (
    <SafeAreaView style={styles.newcontainer}>
      <View style={styles.containerClass}>
        <Text style={styles.header}>login 🔮</Text>
        <View style={styles.textBoxesContainer}>
          <View style={styles.textBoxes}>
            <ReusableTextFiled
              onChangeText={handleEmailChange}
              value={emailAddress}
              placeholder="Email"
              imageSource={EmailIcon}
              secure={false}
            />
          </View>
          <View style={styles.textBoxes}>
            <ReusableTextFiled
              onChangeText={handlePasswordChange}
              value={password}
              placeholder="Password"
              imageSource={PasswordIcon}
              secure={true}
            />
          </View>
        </View>
        <ReusableButton
          function={onSignInPress}
          name="Login"
          icon={LogInIcon}
        />
        <TouchableOpacity onPress={onNewUserPress}>
          <Text>Don't have an account? Sign 🆙</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
