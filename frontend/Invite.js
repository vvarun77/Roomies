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

const InviteScreen = () =>  {  
    //exp://10.18.175.3:8081 -> is what my exp start returns so thats what i use to accept an invite
    //console.log(prefix);
    
    const { isLoaded, userId, sessionId, getToken, User } = useAuth()
    const { user } = useUser();
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
      const redirect_url = "exp://10.22.32.190:8081/--/signup?" + queryStringified;
      return redirect_url;
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
