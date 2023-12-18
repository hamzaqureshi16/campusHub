import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import BottomNavigationBar from './BottomNavigationBar';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = ({route}) => { 
  const {manifest} = Constants;
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigation();
  const [users, setUsers] = useState([]);

   


  const getAllUsers = async () => {
    console.log('get all users')
    await axios.get(`http://${manifest.debuggerHost.split(':').shift()}:3000/allusers`)
    .then((response) => {
      console.log(response.data)
      setUsers(response.data)
    })
    .catch((error) => {
      console.log(error);
    });


  }

 

  useEffect(() => {  
    getAllUsers()    
  }, [])

  useEffect(() => {console.log(users)},[users])


  // Placeholder data for chat messages
  

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5', marginTop: 50 }}>
      <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
        {/* Header with profile icon and search bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
          {/* Profile image */}
          <Text style={{ marginLeft: 16, fontSize: 18, fontWeight: 'bold', fontFamily: 'Arial', color: '#333333' }}>Chats for you</Text>
          {/* Spacer */}
          <View style={{ flex: 1 }} />
          {/* Search bar */}
          <View style={{ flex: 2, height: 40, borderRadius: 20, overflow: 'hidden', borderWidth: 2, borderColor: 'gray' }}>
            <TextInput
              style={{ flex: 1, height: 40, paddingHorizontal: 10, fontFamily: 'Arial', color: '#333333', borderRadius: 20, borderWidth: 2, borderColor: 'gray' }}
              placeholder="Search"
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
            />
          </View>
        </View>


        <FlatList
          data={users}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => {
            if(item.uid != auth.currentUser.uid){
            return(
             <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: 'lightgray', borderRadius: 20, marginHorizontal: 16, marginVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}
             onPress={() => navigate.navigate('WhatsAppChat', { navigation: navigate , toid: item.uid,name: item.name})}
            >

              <Image
                source={{ uri: 'https://th.bing.com/th/id/R.bc9993d6b4ffc40622dcea75acf6c6dd?rik=w01gHU3pXz79Cg&riu=http%3a%2f%2f3.bp.blogspot.com%2f-Tfz6G_zsZkc%2fUhhnZ4aGwkI%2fAAAAAAAAEtk%2fHplbqw1xr_Y%2fs1600%2fa%2b(17).jpg&ehk=obAySeuTCDrB49SvrzOhcc%2bXxfIAxWqCd%2fwt196xX8k%3d&risl=&pid=ImgRaw&r=0' }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
              {/* Name and message */}
              <View style={{ marginLeft: 16
              , display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'
               }}>
                <Text style={{fontSize: 16, fontWeight: 'bold', fontFamily: 'Arial', color: '#333333' }}>{item.name}
                
                </Text>
                <Text style={{ backgroundColor:'red',padding:10,borderRadius:20}}>{item.role}</Text>
              </View>
            </TouchableOpacity>
          
            )
            }
          }
        }
        />

        {/* Send message button */}
        
      </GestureHandlerRootView>
      <BottomNavigationBar
        activeTab="Chat"
      />
    </View>
  );
};

export default ChatScreen;