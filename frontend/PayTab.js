
import { 
	View, 
	Text, 
	TextInput, 
	TouchableOpacity, 
	FlatList, 
	StyleSheet, 
} from "react-native"; 
import {styles} from "./Style.js";
import React, { useState, useEffect, useRef } from "react";
import { createTodo, updateTodo, deleteTodo } from "./mutations.js";
import { getTodo } from "./queries.js";
import {useMutation, useQuery, gql, selectHttpOptionsAndBody} from '@apollo/client';
import {useUser} from "@clerk/clerk-react";
import ReusableFlatList from "./UI/FlatlistStyled.js";
import { SafeAreaView } from "react-native-safe-area-context";

export function PayScreen({route}, components) {
	const [purchase, setPurchase] = useState(""); 
	const [purchases, setPurchases] = useState([]); 
	const [editIndex, setEditIndex] = useState(-1); 
	const [addPurchaseHook, { data: createData, loading: createLoading, error: createError }] = useMutation(createTodo);
	const [updatePurchaseHook, { data: updateData, loading: updateLoading, error: updateError }] = useMutation(updateTodo);
	const [deletePurchaseHook, { data: deleteData, loading: deleteLoading, error: deleteError }] = useMutation(deleteTodo);
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
					await addPurchaseHook({ variables: { input: {id: user.unsafeMetadata.groupid, payments: []} } })
				}
				addEmpty().then()
				console.log(error)
			}
	
			if (!loading && data.getTodo.payments.length != 0){
				setPurchases(data.getTodo.payments)
				console.log(data.getTodo.payments)
			}
			
			}, [data]);

			useEffect(() => {
				async function updatePurchases() {
				  await updatePurchaseHook({
					variables: { input: { id: user.unsafeMetadata.groupid, payments: purchases } },
				  });
				  if(loading) console.log("loading!");
				  if(error) console.log("error in api");
				}
				if(isMounted.current){
					updatePurchases();
				}
				else{
					isMounted.current = true;
				}
			  }, [purchases]);

	const handleAddPurchase = async () => { 
		if (purchase) { 
			if (editIndex !== -1) { 
				const updatedPurchases = [...purchases]; 
				updatedPurchases[editIndex] = purchase; 
				setPurchases(purchases => updatedPurchases); 
				console.log("Updated Purchases:", updatedPurchases);
				setPurchase(""); 
			} else { 
				await setPurchases(purchases => [...purchases, purchase]); 
				setPurchase("");  	
			} 
		} 
		console.log(purchases)
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
	}; 
    return (
		<SafeAreaView style={styles.newcontainer}>
        			<Text style={styles.title}>pay tracker 💸</Text> 
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
			<ReusableFlatList dataList={purchases} functionEdit={handleEditPurchase} functionDelete={handleDeletePurchase}/>
      </SafeAreaView>
    );
  }