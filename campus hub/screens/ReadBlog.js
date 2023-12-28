import React from "react";
import { View, Text, FlatList } from "react-native";
import { auth } from "../firebaseConfig";
import axios from "axios";

const ReadBlog = ({ route }) => {
    const { id } = route.params;
    const [blog, setBlog] = React.useState({});

    const getBlog = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/getBlog/5wux6r`);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        console.log(id);
        getBlog();
    }, [])
    
    return <View style={{ height: 1000 }}></View>;
};

export default ReadBlog;
