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
	const [deleteStatusHook, { data: deleteData, loading: deleteLoading, error: deleteError }] = useMutation(deleteTodo);
    const [groupMembers, setGroupMembers] = useState([]); 
    const [status, setStatus] = useState(""); 
	const [statuses, setStatuses] = useState([]); 
	const [editIndex, setEditIndex] = useState(-1);
	const [currentUser, setCurrentUser] = useState([]); 
    const { user } = useUser();
	const isMounted = useRef(false);
	const { isLoaded, userId, sessionId, getToken } = useAuth();

    const groupid = user.unsafeMetadata.groupid;
    const { data , loading , error } = useQuery(getTodo, 
		{
			variables: {id: groupid}, 
			pollInterval: 500,
			fetchPolicy: "network-only",
		});
		// example of gettign status (adding)
		/*
		      var newData = groupMembers.map(member => ({ id: member.id, status: member.status }));
      if(newData[newData.length - 1].id !== userId ){
        newData.push({id: user.firstName + " " + user.lastName, status: "happy"})
        console.log(newData)
  
        await updateTodoHook({
          variables: { input: { id: groupid, groupMembers: newData } },
      });
      }
		
		*/	
		// yoink the Todo page code. From there, repurpose it such that
		// the code takes in the list of groupmembers and statuses, 
        useEffect(() => {
			if(!loading && error){
				async function addEmpty() {
					if(user.unsafeMetadata.groupid != null) {
					await addStatusHook({ variables: { input: {id: user.unsafeMetadata.groupid, groupMembers: []} } })
					}
				}
				addEmpty().then()
				console.log(error)
			}
	
			if (!loading && data.getTodo.groupMembers.length != 0){
				setGroupMembers(JSON.parse(JSON.stringify(data.getTodo.groupMembers)))
				console.log(groupMembers)
				//var userName = groupMembers.find(e => e.id === "one");
				//console.log("current user is " + );
                console.log(data.getTodo.groupMembers.length)
			}
			
		}, [data]);
		useEffect(() => {
			async function updateMemberStatus() {
			  var newData = groupMembers.map(member => ({ id: member.id, status: member.status }));
			  var statusChanged = JSON.stringify(groupMembers) !== JSON.stringify(data.getTodo.groupMembers);
			  console.log(statusChanged)
			if(statusChanged) {
				await updateStatusHook({
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
		  }, [groupMembers, data]);
		

		const handleAddTask = async () => { 
			//this needs to be changed
			if (status) { 
				if (editIndex !== -1) { 
					const updatedStatuses = [groupMembers[editIndex].status]; 
					updatedStatuses[0] = status ; 
					var arr = [];
					arr = updatedStatuses[0];
					setStatuses(groupMembers[editIndex].status = arr); 
					console.log("Updated tasks:", groupMembers);
					setStatus(""); 
				} else { 
					await setStatuses(groupMembers => [...groupMembers[editIndex].status, status]); 
					setStatus("");  	
				} 
			} 
		}; 
	
		//edit adn delete status
		const handleEditTask = (index) => { 
			const statusToEdit = groupMembers[index].status[0]; 
			setStatus(statusToEdit); 
			setEditIndex(index); 
			console.log("editing status " + statusToEdit)
		}; 
	
		const handleDeleteTask = async (index) => { 
			const updatedStatuses = [...groupMembers]; 
			updatedStatuses.splice(index, 1); 
			setStatuses(updatedStatuses); 
		}; 
	

		//last step
		const renderItem = ({ item, index }) => 
		(	
			<View style={styles.task}> 
				<Text 
					style={styles.itemList}>{ item.id + " " + item.status}</Text> 
				<View 
					style={styles.taskButtons}> 
					<TouchableOpacity 
						onPress={() => handleEditTask(index)}> 
						<Text 
							style={styles.editButton}> Edit</Text> 
					</TouchableOpacity> 
					<TouchableOpacity 
						onPress={() => handleDeleteTask(index)}> 
						<Text 
							style={styles.deleteButton}>Delete</Text> 
					</TouchableOpacity> 
				</View> 
			</View> 
		); 
		return (
		  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<Text style={styles.title}>Activities</Text> 
				<TextInput 
					style={styles.input} 
					placeholder="Add status"
					value={status} 
					onChangeText={(text) => setStatus(text)} 
				/> 
				<TouchableOpacity 
					style={styles.addButton} 
					onPress={handleAddTask}> 
					<Text style={styles.addButtonText}> 
						{editIndex !== -1 ? "Update Task" : "Add Task"} 
					</Text> 
				</TouchableOpacity> 
				<FlatList 
					data={groupMembers} 
					renderItem={renderItem} 
					keyExtractor={(item, index) => index.toString()} 
				/> 
		  </View>
		);
	  }