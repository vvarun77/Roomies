import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { styles } from "./Style.js";
import { useAuth } from "@clerk/clerk-expo";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native";
import ReusableButton from "./UI/ReusableButton.js";
import ReusableTextField from "./UI/ReusableTextField.js";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./UI/BackButton.js";
import { Poppins } from "@expo-google-fonts/poppins";
import {Keyboard} from 'react-native';
import ReusableTextFiled from "./UI/ReusableTextField.js";
import EmailIcon from "./assets/textfieldIcons/Message.png";
import PasswordIcon from "./assets/textfieldIcons/Lock.png";
import LogInIcon from "./assets/buttonIcons/Login.png";
import { useSignIn } from "@clerk/clerk-expo";


export default function JoinGroupSignInScreen () {
    const navigation = useNavigation();
    const { signIn, setActive, isLoaded } = useSignIn();
   
    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const onNewUserPress = async () => {
      console.log('linked')
      navigation.navigate('SignUp');
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
          navigation.navigate("JoinGroup")
         
          } catch (err) {
            showAlert(err);
            //console.error(JSON.stringify(err, null, 2));
        }
      };
      const clerk = useClerk();
      const handleEmailChange = (text) => {
        setEmailAddress(text);
      };
      const handlePasswordChange = (text) => {
        setPassword(text);
      };
    
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
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.newcontainer}>
          <View style={styles.containerClass}>
         
        
            <Text style={styles.header}>Sign In to Join Group 🔮</Text>
      
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
              function={onSignInPress}
              name="Login"
              icon={LogInIcon}
              width={"70%"}
            />
            
              <Text style={{textAlign: "center", marginBottom: 10,}}>Don't have an account?  <TouchableOpacity onPress={onNewUserPress}><Text style={{color: '#92a3fd', textDecorationLine: 'underline',  textDecorationColor: "#92a3fd",}}>Sign 🆙</Text></TouchableOpacity> </Text>
          </View>
        </SafeAreaView>
        </TouchableWithoutFeedback>
      );
    }