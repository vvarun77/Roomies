// GroupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
    // need to create lookup for users
    // tasks[groupId[email]]
    // https://f0ik5w7k41.execute-api.us-east-1.amazonaws.com/default/emailToGroupId
    // /default/emailToGroupId

const GroupingScreen = () => {
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');

  const handleCreateGroup = () => {
    // Handle creating a group
    console.log('Creating group:', groupName);
    // Add your logic to create a group
  };

  const handleJoinGroup = () => {
    // Handle joining a group
    console.log('Joining group:', groupCode);
    // Add your logic to join a group
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Group App</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Group Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter group name"
          value={groupName}
          onChangeText={(text) => setGroupName(text)}
        />
        <Button title="Create Group" onPress={handleCreateGroup} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Group Code:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter group code"
          value={groupCode}
          onChangeText={(text) => setGroupCode(text)}
        />
        <Button title="Join Group" onPress={handleJoinGroup} />
      </View>
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
