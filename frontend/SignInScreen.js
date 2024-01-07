import React, { useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import {useNavigation} from '@react-navigation/native';
import { useClerk } from "@clerk/clerk-react"
import * as Linking from 'expo-linking';

export default function SignInScreen() {
  // add logic to check for sign up token
  // clerk token + group id + group name
  const url = Linking.useURL();
	const handleURL = (url) => {
		const { hostname, path, queryParams } = Linking.parse(url);
		if (path === 'signup') {
			console.log('Navigating to ' + path)
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
      navigation.navigate("Home")
     
      } catch (err) {
        console.error(JSON.stringify(err, null, 2));
    }
  };
  const clerk = useClerk();
  return (
    <View>
      <View>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email..."
          placeholderTextColor="#000"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
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
 
      <TouchableOpacity onPress={onSignInPress}>
        <Text>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onNewUserPress}>
        <Text>New user? Sign up here!</Text>
      </TouchableOpacity>
    </View>
  );
}