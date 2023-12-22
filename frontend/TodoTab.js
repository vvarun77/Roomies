
import { 
	View, 
	Text, 
	TextInput, 
	TouchableOpacity, 
	FlatList, 
	StyleSheet, 
} from "react-native"; 
import {styles} from "./Style.js";
import React, { useState, useEffect } from "react"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTodo, updateTodo, deleteTodo } from "./mutations.js";
import { getTodo } from "./queries.js";
import {useMutation, useQuery, gql} from '@apollo/client';
import {useUser} from "@clerk/clerk-react";

export function TodoScreen({route}, components) {
	const [task, setTask] = useState(""); 
	const [tasks, setTasks] = useState([]); 
	const [editIndex, setEditIndex] = useState(-1); 
	const [addTodoHook, { data: createData, loading: createLoading, error: createError }] = useMutation(createTodo);
	const [updateTodoHook, { data: updateData, loading: updateLoading, error: updateError }] = useMutation(updateTodo);
	const [deleteTodoHook, { data: deleteData, loading: deleteLoading, error: deleteError }] = useMutation(deleteTodo);
	const { user } = useUser();
	const groupid = user.unsafeMetadata.groupid;
	
	const { data , loading , error } = useQuery(getTodo, 
		{
			variables: {id: groupid}, 
			pollInterval: 500,
		});
	
	useEffect(() => {
		if(!loading && error){
			async function addEmpty() {
				//await addTodoHook({ variables: { input: {id: user.unsafeMetadata.groupid, todos: ["hh"]} } })
			}
			console.log(error)
		}
		if (!loading){
			setTasks(data.getTodo.todos)
			console.log(data.getTodo.todos)
		}
		
		}, []);
		
	  
	const storeData = async (value) => {
		try {
		  //await AsyncStorage.setItem('tasks', value);
		  //const val = JSON.parse(value).tasks
		  await updateTodoHook({ variables: { input: {id: user.unsafeMetadata.groupid, todos: tasks} } });
		  
		  /*
		  addTodo({ variables: { input: {name: value, id: user.unsafeMetadata} } }); template for usage
		  */
		} catch (e) {
		  console.log(JSON.stringify(e, null, 2))
		}
	  };

	const handleAddTask = async () => { 
		if (task) { 
			if (editIndex !== -1) { 
				const updatedTasks = [...tasks]; 
				updatedTasks[editIndex] = task; 
				await storeData(JSON.stringify({"tasks": updatedTasks}))
				setTasks(updatedTasks); 
				setEditIndex(-1); 
			} else { 
				setTasks([...tasks, task]); 
				await storeData(JSON.stringify({"tasks": [...tasks, task]}))
			} 
			if (!loading){
				console.log(data.getTodo.todos)
				setTask(""); 
			}
			
		} 
	}; 

	const handleEditTask = (index) => { 
		const taskToEdit = tasks[index]; 
		setTask(taskToEdit); 
		setEditIndex(index); 
	}; 

	const handleDeleteTask = async (index) => { 
		const updatedTasks = [...tasks]; 
		updatedTasks.splice(index, 1); 
		setTasks(updatedTasks); 
		await storeData(JSON.stringify({"tasks": updatedTasks}))
	}; 

	const renderItem = ({ item, index }) => ( 
		<View style={styles.task}> 
			<Text 
				style={styles.itemList}>{item}</Text> 
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
        			<Text style={styles.title}>ToDo</Text> 
			<TextInput 
				style={styles.input} 
				placeholder="Enter task"
				value={task} 
				onChangeText={(text) => setTask(text)} 
			/> 
			<TouchableOpacity 
				style={styles.addButton} 
				onPress={handleAddTask}> 
				<Text style={styles.addButtonText}> 
					{editIndex !== -1 ? "Update Task" : "Add Task"} 
				</Text> 
			</TouchableOpacity> 
			<FlatList 
				data={tasks} 
				renderItem={renderItem} 
				keyExtractor={(item, index) => index.toString()} 
			/> 
      </View>
    );
  }