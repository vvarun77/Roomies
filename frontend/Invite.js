import React, { useEffect, useState } from "react";
import { 
	View, 
	Text, 
	TextInput, 
	TouchableOpacity, 
	FlatList, 
	StyleSheet, 
} from "react-native"; 
import {styles} from "./Style.js"; 
import {useAuth} from "@clerk/clerk-expo"
import {useUser, useClerk} from "@clerk/clerk-react";
import {useNavigation} from '@react-navigation/native';
import { Button } from "react-native";

import axios from "axios";
import queryString from 'query-string';
import * as Linking from 'expo-linking';

const InviteScreen = () =>  { 
    //create invite deep link and maybe add group id to redirect URL
    // ex of https://www.example.com/my-sign-up?__clerk_ticket=..... I will create param for group id, here just get it from the current user
    // i want to create a link to the sign up page with the group ID, which will then be checked by app.js to see if the app was opened with
    // a clerk token which will add the group id to the user when they sign up
    //this is so when we generate links when testing -> we can open our own, later we would need to use the scheme
    
    //exp://10.18.175.3:8081 -> is what my exp start returns
    	//console.log(prefix);
    //
    //const url = "exp://10.18.175.3:8081/--/signup";
    const { isLoaded, userId, sessionId, getToken, User } = useAuth()
    const { user } = useUser();
    const [redirect, setRedirect] = useState('');
    const groupId = user.unsafeMetadata.groupid;
    const groupName = user.unsafeMetadata.groupname;
    const [emailAddress, setEmailAddress] = useState("");
    const bearer = "Bearer sk_test_mRxO1J7Wy4ea8bbTK71socEYQEcP48mud9xjNdtN5s";

    const constructLink = () => {
      const queryParams = {
        groupId,
        groupName,
      };
      const queryStringified = queryString.stringify(queryParams);

      // Construct your full link with the query parameters
      const redirect_url = `exp://10.18.175.3:8081/--/signup?${queryStringified}`;

      // Now `fullLink` contains the link with the query parameters
      //console.log('Full Link:', redirect_url);
      setRedirect(redirect_url);
    }

    const handleInvite = async () => {
        //constructLink();
        // Handle joining a group
        console.log('sending invite', redirect);
        await axios.post('https://api.clerk.com/v1/invitations', 
        {
          "email_address": emailAddress,
          "redirect_url": redirect
        },
        {
          headers: {
            'Authorization': bearer,
            'Content-Type': "application/json",
          }  
        }
      )
      .then(response => {
        console.log(JSON.stringify(response));
      }).catch(error => {
        // Handle error
        console.error('Axios request error:', error);
      });
    };

	return ( 
		<View style={styles.container}> 
		    <Text style={styles.heading}> Invite Roomies </Text> 
            <View>
                <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Email"
                placeholderTextColor="#000"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </View>
            <Button onPress={handleInvite} title="Invite"> Invite </Button>
		</View> 
	); 
}; 

export default InviteScreen;
