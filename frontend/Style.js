import {StyleSheet} from 'react-native';
import { Poppins } from "@expo-google-fonts/poppins";

export const styles = StyleSheet.create({ 
	newcontainer: {
		alignItems: "center",
		justifyContent: "center", 
		width: "100%",
		backgroundColor:"#E0E0E0",
		height:"100%",
		textAlign:"center",
	},
	header: {
		paddingTop: "20%",
		fontFamily: Poppins,
		fontSize: 30,
		textAlign: "center",
		fontWeight: "bold",
		color:'#1D1617',
		
	},
	textBoxesContainer: {
		paddingTop: "20%",
		flex:1,
		flexDirection: 'column',
	},
	buttonContainer: {
		alignItems: "center",
		justifyContent: "center", 
	},
	container: { 
		flex: 1, 
		padding: 40, 
		marginTop: 40,
		alignItems: "center",
		justifyContent: "center", 
	}, 
	title: { 
		paddingTop: "20%",
		fontSize: 24, 
		fontWeight: "bold", 
		marginBottom: 20, 
	}, 
	heading: { 
		fontSize: 30, 
		fontWeight: "bold", 
		marginBottom: 7, 
		color: "green", 
	}, 
	input: { 
		borderWidth: 3, 
		borderColor: "#ccc", 
		padding: 10, 
		marginBottom: 10, 
		borderRadius: 10, 
		fontSize: 18, 
	}, 
	addButton: { 
		backgroundColor: "green", 
		padding: 10, 
		borderRadius: 5, 
		marginBottom: 10, 
	}, 
	addButtonText: { 
		color: "white", 
		fontWeight: "bold", 
		textAlign: "center", 
		fontSize: 18, 
	}, 
	task: { 
		flexDirection: "row", 
		justifyContent: "space-between", 
		alignItems: "center", 
		marginBottom: 15, 
		fontSize: 18, 
	}, 
	itemList: { 
		fontSize: 19, 
	}, 
	taskButtons: { 
		flexDirection: "row", 
	}, 
	editButton: { 
		marginRight: 10, 
		color: "green", 
		fontWeight: "bold", 
		fontSize: 18, 
	}, 
	deleteButton: { 
		color: "red", 
		fontWeight: "bold", 
		fontSize: 18, 
	}, 
}); 