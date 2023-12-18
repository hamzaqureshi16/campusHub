import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BottomNavigationBar from "./BottomNavigationBar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Constants from "expo-constants";
import { auth } from "../firebaseConfig";

const BlogScreen = () => {
  const { manifest } = Constants;
  const navigation = useNavigation();
  const [role, setRole] = React.useState("student");
  const [blogs, setBlogs] = React.useState([]);


  const getRole = async () => {
    await axios
      .get(
        `http://${manifest.debuggerHost.split(":").shift()}:3000/getRole/${auth.currentUser.uid}`
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getRole();
  }, []);

  const getBlogs = async () => {
    await axios
      .get(`http://${manifest.debuggerHost.split(":").shift()}:3000/blogs`)
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getBlogs();
  }, []);

  const blogData = [
    {
      id: "1",
      title: "Lorem Ipsum Dolor",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: "2",
      title: "Praesent Eget Eros",
      description: "Praesent eget eros ut nisl euismod tristique a a ante.",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: "3",
      title: "Suspendisse Potenti",
      description:
        "Suspendisse potenti. Fusce nec odio ac justo ultricies cursus.",
      imageUrl: "https://via.placeholder.com/150",
    },
    // Add more blog posts as needed
  ];

  const renderItem = ({ item }) => (
    <View style={styles.blogItem}>
      <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.blogImage} />
      <View style={styles.blogInfo}>
        <Text style={styles.blogTitle}>{item.title}</Text>
        <Text style={styles.blogDescription}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={blogs}
        renderItem={renderItem} 
        contentContainerStyle={styles.listContainer}
      />
      {role === 'faculty' && <TouchableOpacity
        style={{
          backgroundColor: "red",
          padding: 16,
          borderRadius: 8,
          marginBottom: 100,
          width: 160,
        }}
        onPress={() => navigation.navigate("AddBlog")}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: 20,
            padding: 5,
          }}
        >
          Add blog
          <Ionicons name="add-circle-outline" size={25} color="white" />
        </Text>
      </TouchableOpacity>}

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

export default BlogScreen;
