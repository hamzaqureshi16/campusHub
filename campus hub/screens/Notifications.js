import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { auth } from "../firebaseConfig";
import { FlatList } from "react-native";
import BottomNavigationBar from "./BottomNavigationBar";

const Notifications = () => {
  const { manifest } = Constants;
  const [notifications, setNotifications] = useState([]);

  const getNotifications = async () => {
    await axios
      .get(
        `http://${manifest.debuggerHost
          .split(":")
          .shift()}:3000/notifications/${auth.currentUser.uid}`
      )
      .then((res) => {
        
        const uniqueReceivers = [...new Set(res.data.map((item) => item.receiver))];
        console.log(uniqueReceivers);
        setNotifications(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <View style={{ height:750, width:360 }} >
      <Text style={{ 
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
        color:'green'
       }}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => {
          return (
            <>
              {auth.currentUser.uid === item.receiver ? (
                <>
                  <View
                    style={{
                      padding: 10,
                      borderBottomColor: "black",
                      borderWidth: 1,
                      display: "flex",
                      justifyContent: "center",
                      width:300,
                      marginLeft:30,
                      borderRadius:10,
                      marginTop:20,
                      height:60,
                      backgroundColor:'lightgreen'
                    }}
                  >
                    <Text>{item.message}</Text>
                  </View>
                </>
              ) : (
                <></>
              )}
            </>
          );
        }}
      />
      <BottomNavigationBar activeTab={'Notifications'}/>

    </View>
  );
};

export default Notifications;
