import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AppNavigation from './navigation/appNavigation';
import { useEffect } from 'react';
import {auth} from './firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
export default function App() {

  const checkAsync = async () => {
    try {
      const value = await AsyncStorage.getItem('uid')
      if(value !== null) {
        console.log(value)
      }
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(()=>{checkAsync()},[])
  


  return (
    <NavigationContainer>
    <AppNavigation />
    </NavigationContainer>
  );
}
