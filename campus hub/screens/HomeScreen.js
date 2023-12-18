import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export default function HomeScreen() {
  const navigation = useNavigation();
  const handleGroupButtonPress = () => {
    // Handle group button press
    console.log('Group button pressed!');
  };

  const handleChatButtonPress = () => {
    // Handle chat button press
    alert('Chat button pressed!');
  };

  return (
    
    <SafeAreaView style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.conversationText}>Conversation 1</Text>
        <Text style={styles.conversationText}>Conversation 2</Text>
        <Text style={styles.conversationText}>Conversation 3</Text>
        {/* Add more conversation components here */}
      </ScrollView>
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('blogs')}>
          <Text style={styles.buttonText}>blogs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('chat')}>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('GroupChat')}>
          <Text style={styles.buttonText}>Group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('ChatSettings')}>
          <Text style={styles.buttonText}>setting</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
  },
  header: {
    padding: 16,
    paddingTop: 8, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'yellow',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContainer: {
    padding: 16,
  },
  conversationText: {
    marginBottom: 8,
    fontSize: 16,
    color: 'white',
  },
});
