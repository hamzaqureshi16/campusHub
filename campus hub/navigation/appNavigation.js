import { View, Text } from 'react-native'
import React,{useEffect} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import Studen from '../screens/Studen';
import Lone from '../screens/Lone';
import ForgotPasswordScreen from '../screens/ForgotPassword';
import BlogScreen from '../screens/BlogScreen';
import Chat from '../screens/ChatScreen'
import WhatsAppChatScreen from '../screens/WhatsAppChatScreen';
import GroupChatScreen from '../screens/GroupChatScreen';
import ChatSettingsScreen from '../screens/ChatSettingScreen';
import GroupWhatsAppChatScreen from '../screens/GroupWhatsappChatScreen';
import AddBlog from '../screens/AddBlog';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import Notifications from '../screens/Notifications';
import { auth } from '../firebaseConfig';
import ReadBlog from '../screens/ReadBlog';
import GroupProfileScreen from '../screens/GroupProfileScreen';

const Stack = createNativeStackNavigator();


export default function AppNavigation() {
  const navigation = useNavigation();

  


  return (
    // <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#25d366',
          },
          headerRight: () => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 60, marginRight: 10 }}>
              
              <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                <FontAwesome name="bell" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}

      >
        <Stack.Screen name="Home"  options={{ headerShown:false }} component={Chat} />
        <Stack.Screen name="Welcome" options={{ headerShown:false }} component={WelcomeScreen} />
        <Stack.Screen name="Login" options={{ headerShown:false }} component={LoginScreen} />
        <Stack.Screen name="SignUp" options={{ headerShown:false }} component={SignUpScreen} />
        <Stack.Screen name="Student" options={{ headerShown:false }}  component={Studen} />
        <Stack.Screen name="Slogin" options={{ headerShown:false }} component={Lone} />
        <Stack.Screen name="forgotPassword" options={{ headerShown:false }} component={ForgotPasswordScreen} />
        <Stack.Screen name="blogs" options={{ headerShown:false }} component={BlogScreen} />
        <Stack.Screen name="chat" options={{ headerShown:false }} component={Chat} />
        <Stack.Screen name="WhatsAppChat" options={{ headerShown:false }}  component={WhatsAppChatScreen} />
        <Stack.Screen name="GroupChat" options={{ headerShown:false }} component={GroupChatScreen} />
        <Stack.Screen name="ChatSettings" options={{ headerShown:false }} component={ChatSettingsScreen} />
        <Stack.Screen name="GroupWhatsAppChat" options={{ headerShown:false }} component={GroupWhatsAppChatScreen} />
        <Stack.Screen name="AddBlog" options={{ headerShown:false }} component={AddBlog} />
        <Stack.Screen name="Notifications" options={{ headerShown:false }} component={Notifications} />
        <Stack.Screen name="ReadBlog" options={{ headerShown:true }} component={ReadBlog} />
        <Stack.Screen name="GroupProfile" options={{ headerShown:false }} component={GroupProfileScreen} />
      </Stack.Navigator>
    // </NavigationContainer>
  )
}