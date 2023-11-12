import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import {useNavigation} from '@react-navigation/native';
import { StyleSheet } from "react-native";
import { useClerk } from "@clerk/clerk-react";
import axios from "axios";
import { getMaxListeners } from "events";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center", // Center vertically
      alignItems: "center",     // Center horizontally
    },
  });
 
export default function SignInScreen() {
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
     
    } catch (err: any) {
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
      <TouchableOpacity onPress={testing}>
        <Text>test</Text>
      </TouchableOpacity>
    </View>
  );
}