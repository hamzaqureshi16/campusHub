import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, TextInput, Image } from 'react-native';
import BottomNavigationBar from './BottomNavigationBar';
import {auth} from '../firebaseConfig'
import axios from 'axios';
import Constants from 'expo-constants';
import { arrayUnion } from 'firebase/firestore';



const ChatSettingsScreen = () => {
  const { manifest } = Constants;
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [email, setEmail] = useState(auth.currentUser.email);
  const [password, setPassword] = useState('********'); // Displayed as asterisks for security
  const [phoneNumber, setPhoneNumber] = useState('123-456-7890');
  const [editableEmail, setEditableEmail] = useState(false);
  const [editablePassword, setEditablePassword] = useState(false);
  const [editablePhoneNumber, setEditablePhoneNumber] = useState(false);

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleEmailEdit = () => {
    setEditableEmail(!editableEmail);
  };

  const handlePasswordEdit = () => {
    setEditablePassword(!editablePassword);
  };

  const handlePhoneNumberEdit = () => {
    setEditablePhoneNumber(!editablePhoneNumber);
  };

  const saveEmailChanges = () => {
    // Handle saving email changes
    setEditableEmail(false);
  };

  const savePasswordChanges = () => {
    // Handle saving password changes
    setEditablePassword(false);
  };

  const savePhoneNumberChanges = () => {
    // Handle saving phone number changes
    setEditablePhoneNumber(false);
  };

  const submit = async () => {
    await axios.post(`http://${manifest.debuggerHost.split(":").shift()}:3000/editProfile`,{
      uid:auth.currentUser.uid,
      email:email,
      password:password,
      phoneNumber:phoneNumber
    }).then((res)=>{
      auth.currentUser.updatePassword(password).then(()=>{
        console.log("Password Updated");
      }).catch((err)=>console.log(err));
      console.log(res.data);
    } 
    ).catch((err)=>console.log(err))
  }

  return (
    <View style={styles.container}>
      {/* User Profile Picture */}
      <View style={styles.profilePicture}>
        <Image
          source={{ uri: 'https://th.bing.com/th/id/R.bc9993d6b4ffc40622dcea75acf6c6dd?rik=w01gHU3pXz79Cg&riu=http%3a%2f%2f3.bp.blogspot.com%2f-Tfz6G_zsZkc%2fUhhnZ4aGwkI%2fAAAAAAAAEtk%2fHplbqw1xr_Y%2fs1600%2fa%2b(17).jpg&ehk=obAySeuTCDrB49SvrzOhcc%2bXxfIAxWqCd%2fwt196xX8k%3d&risl=&pid=ImgRaw&r=0' }}
          style={styles.profileImage}
        />
      </View>

      <Text style={styles.userName}>{auth.currentUser.email}</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chat Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationsToggle}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sound Notifications</Text>
        <Switch
          value={soundEnabled}
          onValueChange={handleSoundToggle}
        />
      </View>

      <View style={styles.section}>
        {!editableEmail && <Text style={styles.sectionTitle}>Email</Text>}
        {editableEmail ? (
          <View style={styles.editableField}>
            <TextInput
              style={[styles.input, {flexDirection:'column'}]}
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity onPress={saveEmailChanges}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.staticField}>
            <Text style={styles.fieldValue}>{email}</Text>
            <TouchableOpacity onPress={handleEmailEdit}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        {!editablePassword && <Text style={styles.sectionTitle}>Password</Text>}
        {editablePassword ? (
          <View style={styles.editableField}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity onPress={savePasswordChanges}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.staticField}>
            <Text style={styles.fieldValue}>********</Text>
            <TouchableOpacity onPress={handlePasswordEdit}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        {!editablePhoneNumber && <Text style={styles.sectionTitle}>Phone Number</Text>}
        {editablePhoneNumber ? (
          <View style={styles.editableField}>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TouchableOpacity onPress={savePhoneNumberChanges}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.staticField}>
            <Text style={styles.fieldValue}>{phoneNumber}</Text>
            <TouchableOpacity onPress={handlePhoneNumberEdit}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </TouchableOpacity>

      <BottomNavigationBar
        activeTab="Settings"
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 50,
  },
  profilePicture: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make it a circle
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editableField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  saveButton: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
  staticField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldValue: {
    fontSize: 16,
  },
  editButton: {
    color: 'blue',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#25d366',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatSettingsScreen;