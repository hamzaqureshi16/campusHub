import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons"; // Import icons from Expo package

const GroupProfileScreen = ({ route }) => {
  const { grpID, name } = route.params;
  const { manifest } = Constants;
  const navigation = useNavigation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [grpName, setGrpName] = useState(name);

  const getMembers = async () => {
    setLoading(true);
    await axios
      .get(
        `http://${manifest.debuggerHost
          .split(":")
          .shift()}:3000/getGroupParticipants/${grpID}`
      )
      .then((response) => {
        console.log(response.data.participants);
        setMembers(response.data.participants);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          animating={true}
          color="#25d366"
          size="large"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />
      )}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{grpName} Members</Text>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "#f2f2f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FlatList
          data={members}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.chatParticipantContainer}>
              <Image
                source={{
                  uri: `http://${manifest.debuggerHost
                    .split(":")
                    .shift()}:3000/${item.profilePicture}`,
                }}
                style={styles.profileImage}
              />
              <Text style={{ marginLeft: 10, fontSize: 16 }}>{item.name}</Text>
            </View>
          )}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "red",
          padding: 10,
          borderRadius: 5,
          width: 150,
          alignSelf: "center",
          marginBottom:10
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Exit Group</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#25d366",
    marginLeft: 10,
    marginTop: 30,
  },
  backIcon: {
    fontSize: 24,
    marginTop: 30,
  },
  profilePictureContainer: {
    marginRight: 10,
    marginTop: 30,
    marginLeft: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // Make it a circle
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",

    // TODO: Add styling for chat messages
  },
  messageBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 20,
  },
  fileIconContainer: {
    marginRight: 10,
  },
  fileIcon: {
    fontSize: 24,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  sendIconContainer: {
    marginLeft: 10,
  },
  sendIcon: {
    fontSize: 24,
  },
  chatBubble: {
    maxWidth: "70%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  chatText: {
    fontSize: 16,
  },
  fileInfoContainer: {
    position: "absolute",
    bottom: 80,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 8,
    borderRadius: 5,
    elevation: 2,
  },
  fileInfoText: {
    fontSize: 14,
    color: "#333",
  },
  chatParticipantContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e0e0e0",
    padding: 10,
    width: 200,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "lightgreen",
    borderColor: "#e0e0e0",
    margin: 10,
  },
});

export default GroupProfileScreen;
