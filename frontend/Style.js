import {StyleSheet} from 'react-native';
import { Poppins } from "@expo-google-fonts/poppins";

export const styles = StyleSheet.create({ 
	newcontainer: {
		alignItems: "center",
		justifyContent: "center", 
		width: "100%",
		backgroundColor:'transparent',
		textAlign:"center",
		fontFamily: Poppins,
	},
	homeContainer: {
		width: "100%",
		backgroundColor:'transparent',
		textAlign:"center",
		fontFamily: Poppins,
		alignItems:"center"
	},
	header: {
		paddingTop: "20%",
		fontFamily: Poppins,
		fontSize: 30,
		textAlign: "center",
		fontWeight: "bold",
		color:'#1D1617',
	},
	header2: {
		paddingTop: "15%",
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
		paddingTop: "15%",
		fontSize: 24,
		fontFamily: Poppins, 
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
		backgroundColor: "#ccc0ef", 
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
	avoid: {
		flex:1, 
	},
	homeTitle: {
		fontSize: 32,
		fontFamily: Poppins, 
		fontWeight: "bold",
		textAlign:"left",
		paddingTop:"15%",
		paddingBottom:"10%",
		alignSelf:"flex-start",
		left: 50,
		position: 'absolute',
		alignSelf:'flex-end',
		top:20, 
		height: 30,
		width:"100%",
		zIndex:1,
		
	},
	card: {
		backgroundColor: 'white',
		width: 350,
		borderRadius: 12,
		height:"auto",
		marginBottom:"12%",
	},
	cardTitle: {
		fontFamily: Poppins, 
		color: "#ccc0ef",
		fontSize: 24,
		fontWeight: "bold",
		left: 10,
		top: 15,
	},
	groupButton: {
		flexDirection:"row",
		width: 350,
		justifyContent:"space-between",
		backgroundColor: "#ccc0ef", 
		height:100,
		marginBottom:"12%",
		borderRadius:12,
		alignItems:"center",
		paddingHorizontal: 20,
	}
	
}); 