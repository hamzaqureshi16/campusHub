import React,{useState,useEffect} from 'react'
import { View, Text } from 'react-native'
import axios from 'axios'
import Constants from 'expo-constants'
import {auth} from '../firebaseConfig'


const Notifications = () => {
    const { manifest } = Constants;
    const [notifications,setNotifications] = useState([])

    const getNotifications = async () => {
        await axios
          .get(`http://${manifest.debuggerHost.split(":").shift()}:3000/notifications/${auth.currentUser.uid}`)
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => console.log(err));
      }

        useEffect(() => {
            getNotifications();
        }, []);

  return (
    <View>
      <Text></Text>
    </View>

  )
}

export default Notifications
