import React from "react";
import BottomNavigationBar from "./BottomNavigationBar";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import axios from "axios";
import { auth } from "../firebaseConfig";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";

const AddBlog = () => {
  const { manifest } = Constants;
  const navigation = useNavigation();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const reset = () => {
    setTitle("");
    setContent("");
    navigation.navigate('blogs');

  }
  const addBlog = async () => {
    await axios
      .post(`http://${manifest.debuggerHost.split(":").shift()}:3000/addBlog`, {
        title: title,
        content: content,
        author: auth.currentUser.uid,
      })
      .then((res) => {
        if(res.status === 200){
          alert("Blog Added Successfully");
          reset();
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold", padding: 10 }}>
        Add Blog
      </Text>

      <Text className="text-gray-700 ml-4">Title</Text>
      <TextInput
        className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <Text className="text-gray-700 ml-4">Content</Text>
      <TextInput
        className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
        placeholder="Content"
        value={content}
        style={{ height: 200, borderWidth: 1, paddingHorizontal: 10 }}
        onChangeText={(text) => setContent(text)}
        multiline={true}
      />

      <TouchableOpacity
        onPress={() => addBlog()}
        className="py-3 bg-yellow-400 rounded-xl mt-5"
      >
        <Text className="text-xl font-bold text-center text-gray-700">
          Add Blog
        </Text>
      </TouchableOpacity>
      
      <BottomNavigationBar activeTab="Blog" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50,
  },
  listContainer: {
    padding: 16,
  },
  blogItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  blogImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  blogInfo: {
    marginLeft: 16,
    flex: 1,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  blogDescription: {
    fontSize: 14,
    color: "gray",
  },
});

export default AddBlog;
