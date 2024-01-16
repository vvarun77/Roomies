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
  const navigation = useNavigation();
  var url = Linking.useURL();
  const { signOut } = useClerk();
  /*
              console.log('attempt to add status')
          var newData = data.getTodo.groupMembers
          newData.push({id: userId, status: "happy"})
          updateTodoHook({
      variables: { input: { id: groupCodeText, groupMembers: newData } },
      });
      */

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

  const { data, loading, error } = useQuery(getTodo, {
    variables: { id: groupCode },
    pollInterval: 500,
  });
  useEffect(() => {
    async function addMemberStatus() {
      console.log("The group code is " + groupCode);
      var newData = [...data.getTodo.groupMembers]
      newData.push({id: userId, status: "happy"})
      console.log(newData)
      await updateTodoHook({
        variables: { input: { id: groupCode, groupMembers: newData } },
    });
    if(loading) console.log("loading!");
    if(error) console.log("error in api");
    }
    addMemberStatus();

  }, [data]);

  return <Text>loading</Text>;
}
