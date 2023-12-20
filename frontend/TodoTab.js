
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
import { createTodo } from "./mutations.js";
import {useMutation, gql} from '@apollo/client';

export function TodoScreen({route}, components) {
	const [task, setTask] = useState(""); 
	const [tasks, setTasks] = useState([]); 
	const [editIndex, setEditIndex] = useState(-1); 
	const [addTodo, { data, loading, error }] = useMutation(createTodo);

	useEffect(() => {
		getData().then((retrievedTasks) => {
		  setTasks(retrievedTasks);
		});
	  }, []);
	  
	const storeData = async (value) => {
		try {
		  await AsyncStorage.setItem('tasks', value);
		  /*
		  if (loading) return 'Submitting...';
		  if (error) return `Submission error! ${error.message}`;
		  addTodo({ variables: { input: {name: "heyyyy"} } }); template for usage
		  */
		} catch (e) {
		  console.log(JSON.stringify(e, null, 2))
		}
	  };

	  async function getData () {
		try {
			const jsonValue = await AsyncStorage.getItem('tasks');
			const jsonTasks = jsonValue != null ? JSON.parse(jsonValue) : null;
			return jsonTasks !== null ? jsonTasks.tasks : [];
		} catch (error) {
			console.log(JSON.stringify(error, null, 2));
			return []; // Return an empty array or handle the error as needed
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
				await getData().then( (retrievedtasks) => console.log(retrievedtasks))
			} else { 
				setTasks([...tasks, task]); 
				await storeData(JSON.stringify({"tasks": [...tasks, task]}))
				await getData().then( (retrievedtasks) => console.log(retrievedtasks))
			} 
			setTask(""); 
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