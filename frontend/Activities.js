// widget for status one day
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
import _ from 'lodash';
import ReusableButton from "./UI/ReusableButton.js";
import { handleError } from "@apollo/client/link/http/parseAndCheckHttpResponse.js";

export function ActivityScreen({route}, components) {
    const [addStatusHook, { data: createData, loading: createLoading, error: createError }] = useMutation(createTodo);
	const [updateStatusHook, { data: updateData, loading: updateLoading, error: updateError }] = useMutation(updateTodo);
	const [deleteStatusHook, { data: deleteData, loading: deleteLoading, error: deleteError }] = useMutation(deleteTodo);
    const [status, setStatus] = useState(""); 
	const [statuses, setStatuses] = useState([]); 
	const [editIndex, setEditIndex] = useState(-1);
    const { user } = useUser();
	const isMounted = useRef(false);
	const { isLoaded, userId, sessionId, getToken } = useAuth();

    const groupid = user.unsafeMetadata.groupid;
    const { data , loading , error } = useQuery(getTodo, 
		{
			variables: {id: groupid}, 
			pollInterval: 500,
		});

	const [currentUser, setCurrentUser] = useState({id: user.firstName + " " + user.lastName, status: []}); 
	const [groupMembers, setGroupMembers] = useState([]); 

        useEffect(() => {
			if(!loading && error) {
				async function addEmpty() {
					if(user.unsafeMetadata.groupid != null) {
						await addStatusHook({ variables: { input: {id: user.unsafeMetadata.groupid, groupMembers: []} } })
					}
				}
				addEmpty().then()
				console.log(error)
			}
			if (!loading && data.getTodo.groupMembers.length != 0){
				setGroupMembers(JSON.parse(JSON.stringify(data.getTodo.groupMembers)));
			}
		}, [data]);


		useEffect(() => {
			function updateMemberStatus() {
			var newData = groupMembers.map(member => ({ id: member.id, status: member.status }));
			const statusChanged = !_.isEqual(groupMembers, JSON.parse(JSON.stringify(data.getTodo.groupMembers)));
			if(statusChanged) {
				console.log("I've changed!")
				let result = _.find(groupMembers, el => el?.id === user.firstName + " " + user.lastName);
				if(result.id) {
					setCurrentUser(result); 
					setStatuses(result.status);
					//setEditIndex(index);
				}
				console.log("Current user is: " + currentUser.id + " " + currentUser.status);		
				updateStatusHook({
				  variables: { input: { id: groupid, groupMembers: newData } },});
			}
			if(loading) console.log("loading!");
			if(error) console.log("error in api");
			}
			if(isMounted.current) {
				updateMemberStatus();
			} else {
				isMounted.current = true;
			}
		  }, [groupMembers]);
		

		const handleAddStatus = async () => { 
			const groupMembers2 = JSON.parse(JSON.stringify(data.getTodo.groupMembers));
			var newData = groupMembers2.map(member => ({ id: member.id, status: member.status}));
			let index = _.findIndex(groupMembers2, el => el?.id === user.firstName + " " + user.lastName);
			console.log(index);
			console.log("the group is " + groupMembers);
			setEditIndex(index);
			//this needs to be changed
			if (status) { 
				newData[index].status[0] = status;
				setGroupMembers(newData);
				setStatus(""); 
			} 
		}; 
	
		//edit adn delete status
	

		//last step
		const renderItem = ({ item, index }) => 
		(	
			<View style={styles.task}> 
				<Text style={styles.itemList}>{ item.id}</Text> 
				<Text style={styles.itemList}>{ item.status}</Text> 
			</View> 
		); 
		return (
		  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<Text style={styles.title}>Activities</Text> 
						<Text style={styles.header2}>Welcome {currentUser.id}</Text>
						<Text style={styles.header2}>What are you up to?</Text>
				<TextInput 
					style={styles.input} 
					placeholder="Edit your current status"
					value={status} 
					onChangeText={(text) => setStatus(text)}  
				/> 
				<TouchableOpacity 
					style={styles.addButton} 
					onPress={handleAddStatus}> 
					<Text style={styles.addButtonText}> 
						Edit Status
					</Text> 
				</TouchableOpacity> 
				<FlatList 
					data={groupMembers} 
					renderItem={renderItem} 
					keyExtractor={(item, index) => index.toString()} 
					horizontal={false}
				/> 
		  </View>
		);
	  }