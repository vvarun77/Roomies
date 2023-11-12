
import { 
	View, 
	Text, 
	TextInput, 
	TouchableOpacity, 
	FlatList, 
	StyleSheet, 
} from "react-native"; 
import {styles} from "./Style.js";
import React, { useState } from "react"; 
export function PayScreen({route}, components) {
	const [task, setTask] = useState(""); 
	const [tasks, setTasks] = useState([]); 
	const [editIndex, setEditIndex] = useState(-1); 
	const handleAddTask = () => { 
		if (task) { 
			if (editIndex !== -1) { 
				const updatedTasks = [...tasks]; 
				updatedTasks[editIndex] = task; 
				setTasks(updatedTasks); 
				setEditIndex(-1); 
			} else { 
				setTasks([...tasks, task]); 
			} 
			setTask(""); 
		} 
	}; 

	const handleEditTask = (index) => { 
		const taskToEdit = tasks[index]; 
		setTask(taskToEdit); 
		setEditIndex(index); 
	}; 

	const handleDeleteTask = (index) => { 
		const updatedTasks = [...tasks]; 
		updatedTasks.splice(index, 1); 
		setTasks(updatedTasks); 
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
        			<Text style={styles.title}>Pay Tracker</Text> 
			<TextInput 
				style={styles.input} 
				placeholder="Enter purchase"
				value={task} 
				onChangeText={(text) => setTask(text)} 
			/> 
			<TouchableOpacity 
				style={styles.addButton} 
				onPress={handleAddTask}> 
				<Text style={styles.addButtonText}> 
					{editIndex !== -1 ? "Update Purchase" : "Add Purchase"} 
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