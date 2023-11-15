
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
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';

export function PayScreen({route}, components) {
	const [purchase, setPurchase] = useState(""); 
	const [purchases, setPurchases] = useState([]); 
	const [editIndex, setEditIndex] = useState(-1); 
	const purchaseStorage = useAsyncStorage('purchase')

	useEffect(() => {
		getData().then((retrievedPurchases) => {
		  setPurchases(retrievedPurchases);
		});
	  }, []);

	const storeData = async (value) => {
		try {
		  await purchaseStorage.setItem(value)	
		} catch (e) {
		  console.log(JSON.stringify(e, null, 2))
		}
	  };

	  async function getData () {
		try {
			const jsonValue = await purchaseStorage.getItem()
			const jsonTasks = jsonValue != null ? JSON.parse(jsonValue) : null;
			return jsonTasks !== null ? jsonTasks.tasks : [];
		} catch (error) {
			console.log(JSON.stringify(error, null, 2));
			return []; // Return an empty array or handle the error as needed
		}
	  };

	const handleAddPurchase = async () => { 
		if (purchase) { 
			if (editIndex !== -1) { 
				const updatedPurchases = [...purchases]; 
				updatedPurchases[editIndex] = purchase; 
				await storeData(JSON.stringify({"tasks": updatedPurchases}))
				setPurchases(updatedPurchases); 
				setEditIndex(-1); 
				await getData().then( (retrievedpurchases) => console.log(retrievedpurchases))
			} else { 
				setPurchases([...purchases, purchase]); 
				await storeData(JSON.stringify({"tasks": [...purchases, purchase]}))
				await getData().then( (retrievedpurchases) => console.log(retrievedpurchases))
			} 
			setPurchase(""); 
		} 
	}; 

	const handleEditPurchase = (index) => { 
		const purchaseToEdit = purchases[index]; 
		setPurchase(purchaseToEdit); 
		setEditIndex(index); 
	}; 

	const handleDeletePurchase = async (index) => { 
		const updatedPurchases = [...purchases]; 
		updatedPurchases.splice(index, 1); 
		setPurchases(updatedPurchases); 
		await storeData(JSON.stringify({"tasks": updatedPurchases}))
	}; 

	const renderItem = ({ item, index }) => ( 
		<View style={styles.task}> 
			<Text 
				style={styles.itemList}>{item}</Text> 
			<View 
				style={styles.taskButtons}> 
				<TouchableOpacity 
					onPress={() => handleEditPurchase(index)}> 
					<Text 
						style={styles.editButton}> Edit</Text> 
				</TouchableOpacity> 
				<TouchableOpacity 
					onPress={() => handleDeletePurchase(index)}> 
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
				value={purchase} 
				onChangeText={(text) => setPurchase(text)} 
			/> 
			<TouchableOpacity 
				style={styles.addButton} 
				onPress={handleAddPurchase}> 
				<Text style={styles.addButtonText}> 
					{editIndex !== -1 ? "Update Purchase" : "Add Purchase"} 
				</Text> 
			</TouchableOpacity> 
			<FlatList 
				data={purchases} 
				renderItem={renderItem} 
				keyExtractor={(item, index) => index.toString()} 
			/> 
      </View>
    );
  }