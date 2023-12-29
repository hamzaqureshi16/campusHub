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
import { auth } from "../firebaseConfig";

const GroupProfileScreen = ({ route }) => {
  const { grpID, name } = route.params;
  const { manifest } = Constants;
  const navigation = useNavigation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [grpName, setGrpName] = useState(name);
  const [role, setRole] = useState("");
  const [blocked, setBlocked] = useState(false);

  const block = async (uid) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `http://${manifest.debuggerHost.split(":").shift()}:3000/block`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        blocker: grpID,
        blocked: uid,
      },
    };

    await axios
      .request(config)
      .then((response) => {
        alert(response.data.message);
        let tempPart = members;
        tempPart.map((item) => {
          if (item.uid === uid) {
            item.blocked = true;
          }
        });
        setMembers(tempPart);
        setBlocked(uid);
      })
      .catch((error) => {
        console.error(error);

        alert("contains restricitve workds");
      });
  };

  const getBlockedStatus = async (uid) => {
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
        blocker: grpID,
        blocked: uid,
      },
    };



    await axios
      .request(config)
      .then((response) => {
        return response.data.message;
      })
      .catch((error) => {
        console.error(error);
      });

      return false;
  };

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
        let mems = response.data.participants

        mems.map((item)=>{
          console.log(getBlockedStatus(item.uid));
          // let stat = getBlockedStatus(item.uid);
          // console.log(stat);
          // item.blocked = stat;
        })


        setMembers(mems);
        setLoading(false);


      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRole = async () => {
    await axios
      .get(
        `http://${manifest.debuggerHost.split(":").shift()}:3000/getRole/${
          auth.currentUser.uid
        }`
      )
      .then((res) => {
        console.log(res.data);
        setRole(res.data.role);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getMembers();
    getRole();


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
              {(role === "faculty" && !item?.blocked) ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: "red",
                    width: 150,
                    height: 50,
                    borderRadius: 10,
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    block(item.uid);
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Block from Group
                  </Text>
                </TouchableOpacity>
              ):(
                <TouchableOpacity
                  style={{
                    backgroundColor: "red",
                    width: 150,
                    height: 50,
                    borderRadius: 10,
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    block(item.uid);
                  }}
                  disabled={true}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Unblock
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>
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
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    borderColor: "#e0e0e0",
    width: 200,
    padding: 20,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "lightgreen",
    borderColor: "#e0e0e0",
    margin: 10,
  },
});

export default GroupProfileScreen;
