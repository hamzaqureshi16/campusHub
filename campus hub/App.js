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
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        console.log('User is signed in:', user);
        // You can perform actions for authenticated users here
      } else {
        // User is signed out.
        console.log('User is signed out');
        // You can perform actions for non-authenticated users here
      }
    });
  
    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);


  return (
    <NavigationContainer>
    <AppNavigation />
    </NavigationContainer>
  );
}
