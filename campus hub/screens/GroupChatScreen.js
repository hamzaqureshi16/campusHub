import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNavigationBar from './BottomNavigationBar';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Import icons from Expo package
import axios from 'axios';
import {auth} from '../firebaseConfig'
import Constants from 'expo-constants';

const GroupChatScreen = () => {
  const {manifest} = Constants;
  const [searchText, setSearchText] = useState('');
  const [tab, settab] = useState('Chats');
    const navigation = useNavigation();
  const [groups, setGroups] = useState([]);

  const getgroups = async () =>{
    //get user uid using auth
    const uid = auth.currentUser.uid; 

    //get groups from db

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://${manifest.debuggerHost.split(':').shift()}:3000/getgroups/${uid}`
  }

  axios.request(config)
  .then((response) => {
    let grps = response.data

    grps.map(
      (grp)=>{
        grp.profileImage = 'https://th.bing.com/th/id/R.bc9993d6b4ffc40622dcea75acf6c6dd?rik=w01gHU3pXz79Cg&riu=http%3a%2f%2f3.bp.blogspot.com%2f-Tfz6G_zsZkc%2fUhhnZ4aGwkI%2fAAAAAAAAEtk%2fHplbqw1xr_Y%2fs1600%2fa%2b(17).jpg&ehk=obAySeuTCDrB49SvrzOhcc%2bXxfIAxWqCd%2fwt196xX8k%3d&risl=&pid=ImgRaw&r=0'
      }
    )

    console.log(grps)


    setGroups(grps)

  })
  .catch((error) => {
    console.log(error);
  });

}



  

  useEffect(()=>{
    getgroups()
  },[])

  
  


 
  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5', marginTop: 50 }}>
      <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
        {/* Header with profile icon and search bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
          {/* Profile image */}
          <Text style={{ marginLeft: 16, fontSize: 18, fontWeight: 'bold', fontFamily: 'Arial', color: '#333333' }}>Groups</Text>
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

        {/* Chat message list */}
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: 'lightgray', borderRadius: 20, marginHorizontal: 16, marginVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}
            onPress={()=>navigation.navigate('GroupWhatsAppChat',{grpID:item.id,name:item.name})}>
              {/* Profile image */}
              <FontAwesome name="group" size={24} />
              {/* Name and message */}
              <View style={{ marginLeft: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'Arial', color: '#333333' }}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
      >
        <Text>heeh</Text>
       <FontAwesome name="cog" size={24} />
      </TouchableOpacity>

       
        
      <BottomNavigationBar 
      activetab={'Groups'}
      />
      </GestureHandlerRootView>

     
    </View>
  );
};

export default GroupChatScreen;