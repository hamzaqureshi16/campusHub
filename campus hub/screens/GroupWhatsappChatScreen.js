import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import icons from Expo package
import { firestore } from "../firebaseConfig";
import { auth } from "../firebaseConfig";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";

import { ActivityIndicator } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

const GroupWhatsAppChatScreen = ({ route }) => {
  const { manifest } = Constants;
  const { grpID, name } = route.params;
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [to, setTo] = useState(0); // Replace with actual user data
  const [sending, setSending] = useState(false);
  const [chatData, setChatData] = useState([]);
  const [blocked, setBlocked] = useState(false);
  const navigation = useNavigation();

  const getBlockStatus = async () =>{
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `http://${manifest.debuggerHost
        .split(":")
        .shift()}:3000/getBlockedStatus`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        blocked: auth.currentUser.uid,
        blocker: grpID,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setBlocked(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getOurMessages = async () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `http://${manifest.debuggerHost
        .split(":")
        .shift()}:3000/getgroupmessages`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        group: grpID,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setSending(false);
        console.log(response.data);

        let msgs = response.data;

        const sortedMessages = msgs.sort((a, b) => {
          const aTime =
            a.datetime._seconds * 1000 + a.datetime._nanoseconds / 1000000;
          const bTime =
            b.datetime._seconds * 1000 + b.datetime._nanoseconds / 1000000;
          return aTime - bTime;
        });

        sortedMessages.forEach((element) => {
          if (element.sender === auth.currentUser.uid) {
            element.recep = true;
          } else {
            element.recep = false;
          }
        });

        setChatData(sortedMessages);
      })
      .catch((error) => {
        setSending(false);
        console.log(error);
      });
  };

  useEffect(() => {
    getOurMessages();
    getBlockStatus();
  }, []);

  const handleSend = async () => {
    if (message === "") {
      alert("Please enter a message");
      return;
    }
    if(blocked){
      alert('your are blocked from sending messages to this group');
      
      return
    }
    console.log(grpID);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `http://${manifest.debuggerHost
        .split(":")
        .shift()}:3000/sendgroupmessages`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        message: message,
        sender: auth.currentUser.uid,
        group: grpID,
      },
    };
    setSending(true);

    setMessage("");
    axios
      .request(config)
      .then((response) => {
        getOurMessages();
        setMessage("");
        setFile(null);
      })
      .catch((error) => {
        setSending(false);
        if (error.message === "Request failed with status code 400") {
          alert("Your message contains restricted words");
        }
      });
  };

  const handleFileSelect = () => {
    DocumentPicker.getDocumentAsync({
      type: "application/*",
      copyToCacheDirectory: true,
    })
      .then((res) => {
        console.log(res);
        setFile(res.uri);
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome
            name="arrow-left"
            size={24}
            color="#25d366"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.profilePictureContainer}>
          <Image
            source={{
              uri: "https://th.bing.com/th/id/R.bc9993d6b4ffc40622dcea75acf6c6dd?rik=w01gHU3pXz79Cg&riu=http%3a%2f%2f3.bp.blogspot.com%2f-Tfz6G_zsZkc%2fUhhnZ4aGwkI%2fAAAAAAAAEtk%2fHplbqw1xr_Y%2fs1600%2fa%2b(17).jpg&ehk=obAySeuTCDrB49SvrzOhcc%2bXxfIAxWqCd%2fwt196xX8k%3d&risl=&pid=ImgRaw&r=0",
            }}
            style={styles.profileImage}
          />
        </View>
        <Text
          onPress={() => {
            console.log("djeij");
            navigation.navigate("GroupProfile", { grpID: grpID, name: name });
          }}
          style={styles.headerTitle}
        >
          {name}
        </Text>
      </View>

      {/* Chat messages */}
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.chatBubble,
              {
                alignSelf: item.recep ? "flex-end" : "flex-start",
                backgroundColor: item.recep ? "#DCF8C6" : "white",
              },
            ]}
          >
            {/* add name to the chat bubble
             */}
            <TouchableOpacity
              onPress={() => {
                console.log(item);
                navigation.navigate("WhatsAppChat", {
                  navigation: navigation,
                  toid: item.sender,
                  name: item.senderName,
                });

              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#25d366",
                  marginLeft: 10,
                }}
              >
                {item.senderName}
              </Text>
            </TouchableOpacity>

            <Text style={styles.chatText}>{item.message}</Text>
          </View>
        )}
      />

      {/* Message input bar */}
      <View style={styles.messageBar}>
        <TouchableOpacity
          onPress={() => handleFileSelect()}
          style={styles.fileIconContainer}
        >
          <FontAwesome
            name="paperclip"
            size={24}
            color="#25d366"
            style={styles.fileIcon}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
        />
        {sending && (
          <ActivityIndicator
            size="small"
            color="#25d366"
            style={styles.sendIconContainer}
          />
        )}

        <TouchableOpacity
          onPress={() => handleSend()}
          style={styles.sendIconContainer}
        >
          <FontAwesome
            name="send"
            size={24}
            color="#25d366"
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>

      {/* File sending option */}
      {file && (
        <View style={styles.fileInfoContainer}>
          <Text style={styles.fileInfoText}>Selected file: {file}</Text>
        </View>
      )}
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
});

export default GroupWhatsAppChatScreen;
