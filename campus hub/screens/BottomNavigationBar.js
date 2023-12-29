import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import icons from Expo package
import { useNavigation } from '@react-navigation/native';
import {auth} from '../firebaseConfig'
import { signOut } from 'firebase/auth';
const BottomNavigationBar = ({ activeTab }) => {
  const navigate = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Chat' && styles.activeTab]}
        onPress={()=>navigate.navigate('Home')}
      >
        <FontAwesome name="comments" size={24} color={activeTab === 'Chat' ? '#25d366' : 'gray'} />
        <Text style={activeTab === 'Chat' ? styles.activeTabText : styles.tabText}>Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'Groups' && styles.activeTab]}
        onPress={()=>navigate.navigate('GroupChat')}
      >
        <FontAwesome name="group" size={24} color={activeTab === 'Groups' ? '#25d366' : 'gray'} />
        <Text style={activeTab === 'Groups' ? stygrouples.activeTabText : styles.tabText}>Groups</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'Blog' && styles.activeTab]}
        onPress={()=>navigate.navigate('blogs')}
      >
        <FontAwesome name="newspaper-o" size={24} color={activeTab === 'Blog' ? '#25d366' : 'gray'} />
        <Text style={activeTab === 'Blog' ? styles.activeTabText : styles.tabText}>Blog</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'Notifications' && styles.activeTab]}
        onPress={()=>navigate.navigate('Notifications')}
      >
        <FontAwesome name="bell" size={24} color={activeTab === 'Notifications' ? '#25d366' : 'gray'} />
        <Text style={activeTab === 'Notifications' ? styles.activeTabText : styles.tabText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'Settings' && styles.activeTab]}
        onPress={()=>navigate.navigate('ChatSettings')}
      >
        <FontAwesome name="cog" size={24} color={activeTab === 'Settings' ? '#25d366' : 'gray'} />
        <Text style={activeTab === 'Settings' ? styles.activeTabText : styles.tabText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={()=>{
          signOut(auth)
          navigate.navigate('Welcome')
        }}
      >
        <Text style={activeTab === 'Logout' ? styles.activeTabText : styles.tabText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 10,
    position: 'absolute',
    bottom: 0, // Position at the bottom of the screen
    width: '100%', // Take the full width
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: 'gray',
  },
  activeTab: {
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#25d366',
  },
  activeTabText: {
    fontSize: 12,
    color: '#25d366',
    fontWeight: 'bold',
  },
});

export default BottomNavigationBar;