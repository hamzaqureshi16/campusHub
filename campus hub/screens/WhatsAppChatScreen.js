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
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import { ActivityIndicator } from "react-native-paper";

const WhatsAppChatScreen = ({ route }) => {
  const { manifest } = Constants;
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [to, setTo] = useState(0);
  const [isNew, setIsNew] = useState(false);
  const [sending, setSending] = useState(false);
  const user = { name: route.params.name };
  const [blocked, setBlocked] = useState(false);
  const [blocker, setBlocker] = useState(null);

  const [chatData, setChatData] = useState([]);
  const navigation = useNavigation();

  const getOurMessages = async () => {
    const user = auth.currentUser;
    console.log("jdj");
    console.log(route.params);
    console.log("user.uid");
    const { navigation, toid } = route.params;
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `http://${manifest.debuggerHost
        .split(":")
        .shift()}:3000/getmessages`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        sender: user.uid,
        receiver: toid,
      },
    };

    await axios
      .request(config)
      .then((response) => {
        console.log(response.data.length);

        let msgs = response.data;
        if (msgs.length === 1 && msgs[0].receiver === auth.currentUser.uid) {
          setIsNew(true);
        } else {
          setIsNew(false);
        }

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
        console.log(sortedMessages[0], user.uid);

        setChatData(sortedMessages);
        setSending(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const unblock = async () => {
    const { toid } = route.params;
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `http://${manifest.debuggerHost.split(":").shift()}:3000/unblock`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        blocker: blocker,
        blocked: toid,
      },
    };

    await axios
      .request(config)
      .then((response) => {
        if (response.data.status) {
          getBlockedStatus();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const block = async () => {
    const { toid } = route.params;
    console.log(toid);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `http://${manifest.debuggerHost.split(":").shift()}:3000/block`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        blocker: auth.currentUser.uid,
        blocked: toid,
      },
    };

    await axios
      .request(config)
      .then((response) => {
        setMessage("");
        setIsNew(false);
      })
      .catch((error) => {
        console.error(error);

        alert("contains restricitve workds");
      });

    // getOurMessages();
    console.log("oeoe");
  };
  useEffect(() => {
    getOurMessages();
    getBlockedStatus();
  }, []);

  const getBlockedStatus = async () => {
    const { toid } = route.params;

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
        blocker: auth.currentUser.uid,
        blocked: toid,
      },
    };

    await axios
      .request(config)
      .then((response) => {
        setBlocked(response.data.message);
        setBlocker(response.data.blocker);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleSend = async () => {
    const { toid } = route.params;
    if(blocker !== auth.currentUser.uid && blocked){
      alert('youve been blocked')
      return
    }
    if (message === "") {
      alert("please enter some message");
      return;
    }
    console.log(toid);
    setSending(true);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `http://${manifest.debuggerHost
        .split(":")
        .shift()}:3000/sendmessage`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        message: message,
        sender: auth.currentUser.uid,
        receiver: toid,
        file: file,
      },
    };
    setMessage("");
    setFile(null);

    await axios
      .request(config)
      .then((response) => {
        getOurMessages();
        console.log(response.data);
      })
      .catch((error) => {
        setSending(false);
        if (error.message === "Request failed with status code 400") {
          alert("Your message contains restricted words");
        }
      });
    console.log("this is here");
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
        <Text style={styles.headerTitle}>{user.name}</Text>
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
            <Text style={styles.chatText}>{item.message}</Text>
          </View>
        )}
      />
      {blocked && blocker === auth.currentUser.uid && (
        <TouchableOpacity
          onPress={unblock}
          style={[
            styles.sendIconContainer,
            {
              backgroundColor: "red",
              width: 100,
              height: 40,
              borderRadius: 10,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            },
          ]}
        >
          <Text style={styles.chatText}>Unblock</Text>
        </TouchableOpacity>
      )}
      {isNew && !blocked && (
        <TouchableOpacity
          onPress={() => block()}
          style={[
            styles.sendIconContainer,
            {
              backgroundColor: "red",
              width: 100,
              height: 40,
              borderRadius: 10,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            },
          ]}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 5,
            }}
          >
            Block
          </Text>
        </TouchableOpacity>
      )}

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
          editable={!blocked || blocker !== auth.currentUser.uid}
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

export default WhatsAppChatScreen;
