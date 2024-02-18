import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useMutation, useQuery } from "@apollo/client";
import { createTodo, updateTodo, getTodo } from "./mutations.js";
import { useUser, useClerk } from "@clerk/clerk-react";
import * as Linking from "expo-linking";
import queryString from "query-string";
import ReusableTextField from "./UI/ReusableTextField.js";
import ReusableButton from "./UI/ReusableButton.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./Style.js";

const GroupingScreen = () => {
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [
    addTodoHook,
    { data: createData, loading: createLoading, error: createError },
  ] = useMutation(createTodo);
  const [
    updateTodoHook,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(updateTodo);
  const navigation = useNavigation();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();

  const { signOut } = useClerk();
  var autoJoin = false;
  var url = Linking.useURL();
  var groupNameText = "";
  var groupCodeText = "";


  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);

  useEffect(() => {
    const handleURL = async (url) => {
      //parse URL for parameter
      const { hostname, path, queryParams } = Linking.parse(url);
      if (path === "signup") {
        const parsed = queryString.parseUrl(url);
        setGroupCode(parsed.query.groupId);
        // setGroupName(parsed.query.groupName);
        // setAutoJoin(true);
        groupCodeText = parsed.query.groupId;
        groupNameText = parsed.query.groupName;
        autoJoin = true;
      }
    };
    const autoJoinGroup = async () => {
      //const groupid = user.unsafeMetadata.groupid;
      console.log("Joining group:", groupCodeText);
      //automatically send join from url parameters
      await axios
        .post(
          "https://etex9zchp4.execute-api.us-east-1.amazonaws.com/default/groupClerk-roomie",
          {
            userId: userId,
            groupId: groupCodeText,
            groupName: groupNameText,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
          navigation.navigate("Loading", {
            groupid: groupCodeText,
          });
        });
    };
    if (url) {
      handleURL(url);
    } else {
      console.log("No URL");
    }
    console.log("autoJoin is set to", autoJoin);
    if (autoJoin) {
      console.log("calling function");

      autoJoinGroup();
    }
  }, [url]);

  const handleCreateGroup = async () => {
    // Handle creating a group
    // add group id to meta data and create lambada function using AWS
    console.log("Creating group:", groupName);
    await axios
      .post(
        "https://etex9zchp4.execute-api.us-east-1.amazonaws.com/default/groupClerk-roomie",
        {
          userId: userId,
          groupName: groupName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        addTodoHook({
          variables: {
            input: {
              id: response.data,
              todos: [],
              payments: [],
              groupMembers: [
                { id: user.firstName + " " + user.lastName, status: "happy" },
              ],
              groceries: [],
              events: "{}",
            },
          },
        });
      })
      .then((response) => {
        signOut();
        navigation.navigate("SignIn");
      })
      .catch((error) => {
        // Handle error
        console.error("Axios request error:", error);
      });
  };


  const handleSignInClick = async () => {
    navigation.navigate("SignIn");
  };

  return (
    <SafeAreaView style={styles.newcontainer}>
      <Text style={styles.header}>Create a Group 🕺</Text>
      <TextInput
        style={{
          width: "70",
          borderBottomWidth: 4,
          textAlign: "center",
          fontSize: 24,
          marginTop: "20%",
        }}
        placeholder="Group Name"
        value={groupName}
        onChangeText={(text) => setGroupName(text)}
      />
      <ReusableButton function={handleCreateGroup} name="Create" width={"100%"} height={"40%"}/>
    </SafeAreaView>
  );
};


/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: "80%",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
  const handleJoinGroup = async () => {
    // Handle joining a group

    const groupid = user.unsafeMetadata.groupid;
    await axios
      .post(
        "https://etex9zchp4.execute-api.us-east-1.amazonaws.com/default/groupClerk-roomie",
        {
          userId: userId,
          groupId: groupCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        var newData = data.getTodo.groupMembers;
        newData.push({ id: userId, status: "happy" });
        updateTodoHook({
          variables: { input: { id: groupCode, groupMembers: newData } },
        });
      })
      .then((response) => {
        signOut();
        navigation.navigate("SignIn");
      });
  };s
*/
export default GroupingScreen;
