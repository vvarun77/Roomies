import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from "@clerk/clerk-expo"
import axios from "axios";
import { useMutation } from '@apollo/client';
import { createTodo } from "./mutations.js";
import {useUser} from "@clerk/clerk-react";

    // need to create lookup for users
    // tasks[groupId[email]]
    // https://f0ik5w7k41.execute-api.us-east-1.amazonaws.com/default/emailToGroupId
    // /default/emailToGroupId

const GroupingScreen = () => {
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [addTodoHook, { data: createData, loading: createLoading, error: createError }] = useMutation(createTodo);
  const navigation = useNavigation();
  const { isLoaded, userId, sessionId, getToken } = useAuth()
  const { user } = useUser();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);

  const handleCreateGroup = async () => {
    // Handle creating a group
    
    console.log('Creating group:', groupName);
    await axios.post('https://etex9zchp4.execute-api.us-east-1.amazonaws.com/default/groupClerk-roomie', 
        {
            "userId": userId
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
      } 
    ) 
    .catch(error => {
      // Handle error
      console.error('Axios request error:', error);
  });
  };

  const handleJoinGroup = () => {
    // Handle joining a group
    console.log('Joining group:', groupCode);
    axios.post('https://etex9zchp4.execute-api.us-east-1.amazonaws.com/default/groupClerk-roomie', 
    {
        "userId": userId,
        "groupid": groupCode
    }, 
    {
        headers: {
            'Content-Type': "application/json",
            'Accept': "application/json",
        }  
    }
)  
    // Add your logic to join a group
  };

  const handleHomeClick = async () =>{
    navigation.navigate('Home')
}

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
      <Button onPress={handleHomeClick} title="Home"> Go to Home </Button>
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
