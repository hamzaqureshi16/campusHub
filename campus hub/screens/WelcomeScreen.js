import { View, Text, Image, TouchableOpacity } from 'react-native'
import React,{useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { themeColors } from '../theme'
import { useNavigation } from '@react-navigation/native'
import {auth} from '../firebaseConfig' 

export default function WelcomeScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            // User is signed in.
            console.log('User is signed in:', user);
            navigation.navigate('Chat');
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
    <SafeAreaView className="flex-1" style={{backgroundColor: themeColors.bg}}>
        <View className="flex-1 flex justify-around my-4">
            <Text 
                className="text-white font-bold text-4xl text-center">
                Campus Hub
            </Text>
            <View className="flex-row justify-center">
                <Image source={require("../assets/images/welcome.png")}
                    style={{width: 350, height: 350}} />
            </View>
            <View className="space-y-4">
                <TouchableOpacity
                    onPress={()=> navigation.navigate('SignUp')}
                    className="py-3 bg-yellow-400 mx-7 rounded-xl">
                        <Text 
                            className="text-xl font-bold text-center text-gray-700"
                        >
                             Faculty Signup
                        </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=> navigation.navigate('Student')}
                    className="py-3 bg-yellow-400 mx-7 rounded-xl">
                        <Text 
                            className="text-xl font-bold text-center text-gray-700"
                        >
                            Student Signup
                        </Text>
                </TouchableOpacity>
                <View className="flex-row justify-center">
                    <Text className="text-white font-semibold">Already have an account?</Text>
                    <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
                        <Text className="font-semibold text-yellow-400"> Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </SafeAreaView>
  )
}