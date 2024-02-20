import React, { useEffect, useState } from "react";
import { 
	View, 
	Text, 
	TextInput, 
	TouchableOpacity, 
	FlatList, 
	StyleSheet, 
  Alert,
} from "react-native"; 
import {styles} from "./Style.js"; 
import {useAuth} from "@clerk/clerk-expo"
import {useUser, useClerk} from "@clerk/clerk-react";
import { Button } from "react-native";
import ReusableButton from "./UI/ReusableButton.js";
import ReusableTextField from "./UI/ReusableTextField.js";
import EmailIcon from "./assets/textfieldIcons/Message.png";
import { SafeAreaView } from "react-native-safe-area-context";
import {useNavigation} from '@react-navigation/native';

import axios from "axios";
import queryString from 'query-string';

const InviteScreen = () =>  {  
    //exp://10.18.175.3:8081 -> is what my exp start returns so thats what i use to accept an invite
    //console.log(prefix);
    
    const { isLoaded, userId, sessionId, getToken, User } = useAuth()
    const { user } = useUser();
    const navigation = useNavigation();
    const groupId = user.unsafeMetadata.groupid;
    const groupName = user.unsafeMetadata.groupname;
    const [emailAddress, setEmailAddress] = useState("");
    const bearer = "Bearer sk_test_mRxO1J7Wy4ea8bbTK71socEYQEcP48mud9xjNdtN5s";
    //const url = "exp://10.18.175.3:8081/--/signup";

    const constructLink = () => {
      //group id to send with link
      const queryParams = {
        groupId,
        groupName,
      };
      const queryStringified = queryString.stringify(queryParams);
      // will need to be changed later to scheme roomies:// somethiing like that
      // string should be changed to what you see when you run yarn start
      //exp://10.19.168.70:8081 - varun
      //const redirect_url = "Roomies://--/signup?" + queryStringified;
      const redirect_url = "exp://10.19.40.74:19000/--/signup?" + queryStringified;
      return redirect_url;
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
    const showAlertSuccess = (err) =>
    Alert.alert(
      'invite sent! ',
      'they\'re otw 🏃💨',
        {
          cancelable: true,
          text: 'Cancel',
          onPress: () => Alert.alert('Cancel Pressed'),
          style: 'cancel',
        },
    
    );
    const alreadyHaveAccount = () => {
      navigation.navigate("GroupInfo")
    }


    const handleInvite = async () => {
        //only one invite can be sent per email
        //const redirect_url = "exp://10.18.175.3:8081/--/signup?";
        //creates invite
        const url = constructLink();
        console.log('sending invite');
        console.log(url);
        await axios.post('https://api.clerk.com/v1/invitations', 
        {
          "email_address": emailAddress,
          //since we are using custom flow, we use deeplinking to redirect to our app
          "redirect_url": url,
          "ignore_existing": true
        },
        {
          headers: {
            'Authorization': bearer,
            'Content-Type': "application/json",
          }  
        }
      )
      .then(response => {
        showAlertSuccess();
       
      }).catch(error => {
        // Handle error
        showAlert(error);
       
      });
    };
    const handleEmailChange = (text) => {
      setEmailAddress(text);
    };
	return ( 
		<SafeAreaView style={styles.newcontainer}>
        <Text style={styles.title}>invite roomies 📩</Text>
        <View style={styles.textBoxesContainer}>
            <ReusableTextField
              onChangeText={handleEmailChange}
              value={emailAddress}
              placeholder="Email"
              imageSource={EmailIcon}
              secure={false}
            />
          </View>
             <ReusableButton
          function={handleInvite}
          name="Invite"
          width={"80%"}
          height={"40%"}
        />
         <Text style={{textAlign: "center", marginBottom: 10,}}>Does your roommate already have an account?<TouchableOpacity onPress={alreadyHaveAccount}><Text style={{color: '#92a3fd', textDecorationLine: 'underline',  textDecorationColor: "#92a3fd",}}>Use the code here instead!</Text></TouchableOpacity> </Text>
    </SafeAreaView>
	); 
}; 

export default InviteScreen;
