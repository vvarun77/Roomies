// loading screen for signup
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import {
  useMutation,
  useQuery,
  gql,
  selectHttpOptionsAndBody,
} from "@apollo/client";
import { createTodo, updateTodo } from "./mutations.js";
import { useUser, useClerk } from "@clerk/clerk-react";
import { getTodo } from "./queries.js";
import * as Linking from "expo-linking";
import queryString from "query-string";

export function LoadingScreen({ route }, components) {
  const [
    addTodoHook,
    { data: createData, loading: createLoading, error: createError },
  ] = useMutation(createTodo);
  const [
    updateTodoHook,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(updateTodo);
  const { user } = useUser();
  const [groupCode, setGroupCode] = useState("");
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const isMounted = useRef(false);
  const isRan = useRef(false);
  const navigation = useNavigation();
  var url = Linking.useURL();
  const { signOut } = useClerk();
  const { groupid } = route.params;
  let count = 0;

  const { data, loading, error } = useQuery(getTodo, {
    variables: { id: groupid },
    pollInterval: 500,
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    const handleURL = async (url) => {
      //parse URL for parameter
      const { hostname, path, queryParams } = Linking.parse(url);
      if (path === "signup") {
        const parsed = queryString.parseUrl(url);
        setGroupCode(parsed.query.groupId);
        // setGroupName(parsed.query.groupName);
        // setAutoJoin(true);
        autoJoin = true;
      }
    };
    handleURL(url);
  }, [url]);

  useEffect(() => {
    console.log(count)
    function addMemberStatus() {
      //signOut();
      // change graphql schema to use "name" instead of "id"
      console.log("users first name is " + user.firstName + " " + user.lastName);
      const groupMembers = JSON.parse(JSON.stringify(data.getTodo.groupMembers));
      var newData = groupMembers.map(member => ({ id: member.id, status: member.status }));
      if(newData[newData.length - 1].id !== userId ){
        newData.push({id: user.firstName + " " + user.lastName, status: "happy"})
        console.log(newData)
  
        updateTodoHook({
          variables: { input: { id: groupid, groupMembers: newData } },
      });
      }

    if(loading) console.log("loading!");
    if(error) console.log("error in api");
    }


      if(isMounted.current && !isRan.current) {
        if(data && data.getTodo){
          addMemberStatus()
            signOut();
            navigation.navigate('SignIn')
            isRan.current = true;
        }
			} else {
				isMounted.current = true;
			}

  }, [data]);

  //adding loading shit circle here

  return <Text>loading</Text>;
}
