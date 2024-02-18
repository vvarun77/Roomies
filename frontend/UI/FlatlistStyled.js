//reusable purple buttomn
import React, { useState, useEffect, useRef } from "react"; 
import { 
	View, 
	Text, 
	TextInput, 
	TouchableOpacity, 
	FlatList, 
	StyleSheet, 
	Image,
	CheckBox
} from "react-native"; 
import { Poppins, Poppins_300Light } from "@expo-google-fonts/poppins";
import Icon from "react-native-dynamic-vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";



const ReusableFlatList = (props) => {
	const [checkboxState, setCheckboxState] = useState(false);
	//let checkboxState = false;
	let bouncyCheckboxRef = null;
	//pass in parameter for if edit delete
	const renderItem = ({ item, index }) => (
		<View style={styles.task}> 
		<BouncyCheckbox
  		size={25}
  		ref={(ref) => (bouncyCheckboxRef = ref)}
		//text={item}
		isChecked={checkboxState}
		fillColor="#ccc0ef"
  		unfillColor="transparent"
  		iconStyle={{ borderColor: "red" }}
		textStyle={{fontSize: 19, color:"black",}}
  		innerIconStyle={{ borderWidth: 2 }}
		// props.functionDelete(index) added below to actually remove task, talk to varun
  		onPress={(checked) => {setCheckboxState(!checkboxState), setTimeout(() => {props.functionDelete(index)},
			300,
		);
		}}
	/>
			<View 
				style={styles.taskButtons}> 
				<Text style={
					//[
			styles.itemList
			//checkedValue ? { textDecorationLine: 'line-through' } : null
		  	//]
			}>{item}</Text>
				<TouchableOpacity 
					onPress={() => props.functionEdit(index)}> 
					<Text 
						style={styles.editButton}> Edit</Text> 
				</TouchableOpacity> 
			</View> 
		</View> 
	); 
    return (
			<FlatList 
				//contentContainerStyle={{}}
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
