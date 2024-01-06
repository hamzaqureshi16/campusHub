import React from "react";
import { View, Text, FlatList } from "react-native";
import { auth } from "../firebaseConfig";
import axios from "axios";
import Constants from "expo-constants";

const ReadBlog = ({ route }) => {
    const { id } = route.params;
    const [blog, setBlog] = React.useState({});
    const { manifest } = Constants;

    const getBlog = async () => {
        try {
            const response = await axios.get(`http://${manifest.debuggerHost.split(":").shift()}:3000/getBlog/${id}`);
            console.log(response.data);
            setBlog(response.data.blog)
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        console.log(id);
        getBlog();
    }, [])
    
    return <View style={{ height: 1000 }}>
        <Text style={{ 
            fontSize:25
         }}>Title: {blog.title}</Text>

<Text style={{ 
            fontSize:25
         }}>Content: {blog.content}</Text>
    </View>;
};

export default ReadBlog;
