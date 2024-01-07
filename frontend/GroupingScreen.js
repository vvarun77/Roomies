import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from "@clerk/clerk-expo"
import axios from "axios";
import { useMutation } from '@apollo/client';
import { createTodo } from "./mutations.js";
import {useUser, useClerk} from "@clerk/clerk-react";
import * as Linking from 'expo-linking';
import queryString from 'query-string';

const GroupingScreen = () => {
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [addTodoHook, { data: createData, loading: createLoading, error: createError }] = useMutation(createTodo);
  const navigation = useNavigation();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [autoJoin, setAutoJoin] = useState(false); 
  const url = Linking.useURL();
  const [urlState, setUrlState] = useState(undefined);
  const [result, setResult] = useState(undefined);


  //const url = Linking.useURL();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);


  useEffect(() => {
    const updateURL = async () => {
      if (urlState === undefined) {
        try {
          // It seems like url is always null from the useURL (possibly because of the async nature of getInitialURL) until we explicitly call getInitialUrl.
          // So therefore, the first time the URL gets a value from useURL, we call getInitialURL ourselves to get the first value.
          // See https://github.com/expo/expo/issues/23333
          const initialUrl = await Linking.getInitialURL();
          setUrlState(initialUrl);
          return initialUrl; // Return the initial URL if needed
        } catch (error) {
          console.error("Error updating URL:", error);
          return null; // Return null or handle the error as needed
        }
      }

      if (url === urlState) {
        return urlState;
      }

      setUrlState(url);
      return url; // Return the updated URL
    };

    const result = updateURL();
    
    // Now 'result' will contain the result of the updateURL function (initial URL or updated URL)
  }, [url, urlState]);
	useEffect(() => {
    const handleURL = async (url) => {
      const { hostname, path, queryParams } = Linking.parse(url);
      if (path === 'signup') {
        const parsed = queryString.parseUrl(url);
        setGroupCode(parsed.query.groupId);
        setGroupName(parsed.query.groupName);
        setAutoJoin(true);
        console.log("auto join set to", autoJoin, groupId, groupName);
      }
      console.log("set group information" , groupCode,  groupName);
    }
    const autoJoinGroup = async () => {
      console.log(autoJoin);
        console.log("called", autoJoin)
        await axios.post('https://etex9zchp4.execute-api.us-east-1.amazonaws.com/default/groupClerk-roomie', 
          {
              "userId": userId,
              "groupId": groupCode,
              "groupName": groupName
          }, 
          {
              headers: {
                  'Content-Type': "application/json",
                  'Accept': "application/json",
              }  
          }
        )
        .then(response => {
          signOut();
          navigation.navigate('SignIn');
        }); 
    };
		if (url) {
			handleURL(url);
      console.log("handled url", autoJoin);
		} else {
			console.log('No URL');
		}
    console.log("autoJoin is set to", autoJoin);
    if(autoJoin) {
      console.log("calling function");
      autoJoinGroup();
    }
  }, [url]);


  const handleCreateGroup = async () => {
    // Handle creating a group
    // add group id to meta data and create lambada function using AWS
    console.log('Creating group:', groupName);
    await axios.post('https://etex9zchp4.execute-api.us-east-1.amazonaws.com/default/groupClerk-roomie', 
        {
            "userId": userId,
            "groupName": groupName
        }, 
        {
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
            }  
        }
    )
    .then(response => {
        addTodoHook({ variables: { input: {id: response.data, todos: [], payments: []} } }) 
      })
    .then(response => {
      signOut();
      navigation.navigate('SignIn')
    })
    .catch(error => {
      // Handle error
      console.error('Axios request error:', error);
  });
  };

  const handleJoinGroup = async () => {
    // Handle joining a group
    console.log('Joining group:', groupCode);
    await axios.post('https://etex9zchp4.execute-api.us-east-1.amazonaws.com/default/groupClerk-roomie', 
    {
        "userId": userId,
        "groupId": groupCode
    }, 
    {
        headers: {
            'Content-Type': "application/json",
            'Accept': "application/json",
        }  
    }
  )
  .then(response => {
    signOut();
    navigation.navigate('SignIn')
  }) 
  };

  const handleSignInClick = async () =>{
    navigation.navigate('SignIn')
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Join or Create a Room!</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Room Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter group name"
          value={groupName}
          onChangeText={(text) => setGroupName(text)}
        />
        <Button title="Create Group" onPress={handleCreateGroup} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Room Code:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter group code"
          value={groupCode}
          onChangeText={(text) => setGroupCode(text)}
        />
        <Button title="Join Group" onPress={handleJoinGroup} />
      </View>
      <Button onPress={handleSignInClick} title="SignIn"> Back to Sign In </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: '80%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default GroupingScreen;
