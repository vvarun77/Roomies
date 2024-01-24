//reusable purple buttomn
import React from "react";
import { 
	View, 
	Text, 
	TextInput, 
	TouchableOpacity, 
	FlatList, 
	StyleSheet, 
} from "react-native"; 
import { Poppins } from "@expo-google-fonts/poppins";

const ReusableFlatList = (props) => {
	//pass in parameter for if edit delete
	const renderItem = ({ item, index }) => (
		<View style={styles.task}> 
			<Text 
				style={styles.itemList}>{item}</Text> 
			<View 
				style={styles.taskButtons}> 
				<TouchableOpacity 
					onPress={() => props.functionEdit(index)}> 
					<Text 
						style={styles.editButton}> Edit</Text> 
				</TouchableOpacity> 
				<TouchableOpacity 
					onPress={() => props.functionDelete(index)}> 
					<Text 
						style={styles.deleteButton}>Delete</Text> 
				</TouchableOpacity> 
			</View> 
		</View> 
	); 
    return (
			<FlatList 
				//contentContainerStyle={{justifyContent: 'center',}}
				data={props.dataList} 
				renderItem={renderItem} 
				keyExtractor={(item, index) => index.toString()} 
				horizontal={false}
			/> 
    );
}

const styles = StyleSheet.create({
	task: { 
		flexDirection: "row", 
		justifyContent: "space-between", 
		alignItems: "center", 
		paddingVertical: 20, 
		fontSize: 18, 
		borderColor:"#b3b3b3",
		borderBottomWidth:0.5, 
	}, 
	itemList: { 
		fontSize: 19, 
		width:"60%",
	}, 
	taskButtons: { 
		flexDirection: "row", 
	}, 
	editButton: { 
		marginRight: 10, 
		color: "#ccc0ef", 
		fontWeight: "bold", 
		fontSize: 18, 
	}, 
	deleteButton: { 
		color: "red", 
		fontWeight: "bold", 
		fontSize: 18, 
	}, 
});

export default ReusableFlatList;
