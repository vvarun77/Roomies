import React, { useState, useEffect, useRef } from "react";
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
import {useMutation, useQuery, gql, selectHttpOptionsAndBody} from '@apollo/client';
import { Button } from "react-native";
import { createTodo, updateTodo, deleteTodo } from "./mutations.js";
import { getTodo } from "./queries.js";


export function ActivityScreen({route}, components) {
    const [addStatusHook, { data: createData, loading: createLoading, error: createError }] = useMutation(createTodo);
	const [updateStatusHook, { data: updateData, loading: updateLoading, error: updateError }] = useMutation(updateTodo);
	const [deleteStatuseHook, { data: deleteData, loading: deleteLoading, error: deleteError }] = useMutation(deleteTodo);
    const [groupMembers, setGroupMembers] = useState([]); 
    const [status, setStatus] = useState(""); 
	const [statuses, setStatuses] = useState([]); 
	const [editIndex, setEditIndex] = useState(-1); 
    const { user } = useUser();
	const isMounted = useRef(false);

    const groupid = user.unsafeMetadata.groupid;
    const { data , loading , error } = useQuery(getTodo, 
		{
			variables: {id: groupid}, 
			pollInterval: 500
		});


        useEffect(() => {
			if(!loading && error){
				async function addEmpty() {
					await addStatusHook({ variables: { input: {id: user.unsafeMetadata.groupid, groupMembers: []} } })
				}
				addEmpty().then()
				console.log(error)
			}
	
			if (!loading && data.getTodo.groupMembers.length != 0){
				setGroupMembers(data.getTodo.groupMembers)
				console.log(data.getTodo.groupMembers)
                console.log(data.getTodo.groupMembers.length)
			}
			
		}, [data]);

        return(
            <Text></Text>

        );

}