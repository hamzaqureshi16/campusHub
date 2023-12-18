import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  color,
} from "react-native";
import React from "react";
import { themeColors } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Constants from "expo-constants";
import RNPickerSelect from "react-native-picker-select";

export default function Studen() {
  const { manifest } = Constants;
  const navigation = useNavigation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [session, setSession] = React.useState("");
  const [reg, setReg] = React.useState("");
  const [dpt, setDpt] = React.useState("");
  const programList = [
    { label: "BCS", value: "BCS" },
    { label: "BBA", value: "BBA" },
    { label: "BDS", value: "BDS" },
    { label: "BSE", value: "BSE" },
  ];

  const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        let rg = session + "-" + dpt + "-" + reg;
        let uid = userCredential.user.uid;
        let data = JSON.stringify({
          email: email,
          password: password,
          name: name,
          department: department,
          rg: rg,
          uid: uid,
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `http://${manifest.debuggerHost
            .split(":")
            .shift()}:3000/studentsignup`,
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            navigation.navigate("Home");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );
  };

  return (
    <ScrollView>
      <View
        className="flex-1 bg-white"
        style={{ backgroundColor: themeColors.bg }}
      >
        <SafeAreaView className="flex">
          <Text className="text-white font-bold text-4xl text-center">
            For Student
          </Text>
          <View className="flex-row justify-start">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
            >
              <ArrowLeftIcon size="20" color="black" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center">
            <Image
              source={require("../assets/images/signup.png")}
              style={{ width: 165, height: 110 }}
            />
          </View>
        </SafeAreaView>
        <View
          className="flex-1 bg-white px-8 pt-8"
          style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        >
          <View className="form space-y-2">
            <Text className="text-gray-700 ml-4"> Name </Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Enter Name"
            />
            <Text className="text-gray-700 ml-4">Email Address</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter Email"
            />

            <Text className="text-gray-700 ml-4">Password</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Enter Password"
            />
            <Text className="text-gray-700 ml-4">Department</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              value={department}
              onChangeText={(text) => setDepartment(text)}
              placeholder="Department"
            />
            <Text className="text-gray-700 ml-4">Registration num</Text>

            <RNPickerSelect
              style={{
                width: 50,
              }}
              onValueChange={(value) => setSession(value)}
              items={[
                { label: "FA01", value: "FA01" },
                { label: "SP02", value: "SP02" },
                { label: "FA02", value: "FA02" },
                { label: "SP03", value: "SP03" },
                { label: "FA03", value: "FA03" },
                { label: "SP04", value: "SP04" },
                { label: "FA04", value: "FA04" },
                { label: "SP05", value: "SP05" },
                { label: "FA05", value: "FA05" },
                { label: "SP06", value: "SP06" },
                { label: "FA06", value: "FA06" },
                { label: "SP07", value: "SP07" },
                { label: "FA07", value: "FA07" },
                { label: "SP08", value: "SP08" },
                { label: "FA08", value: "FA08" },
                { label: "SP09", value: "SP09" },
                { label: "FA09", value: "FA09" },
                { label: "SP10", value: "SP10" },
                { label: "FA10", value: "FA10" },
                { label: "SP11", value: "SP11" },
                { label: "FA11", value: "FA11" },
                { label: "SP12", value: "SP12" },
                { label: "FA12", value: "FA12" },
                { label: "SP13", value: "SP13" },
                { label: "FA13", value: "FA13" },
                { label: "SP14", value: "SP14" },
                { label: "FA14", value: "FA14" },
                { label: "SP15", value: "SP15" },
                { label: "FA15", value: "FA15" },
                { label: "SP16", value: "SP16" },
                { label: "FA16", value: "FA16" },
                { label: "SP17", value: "SP17" },
                { label: "FA17", value: "FA17" },
                { label: "SP18", value: "SP18" },
                { label: "FA18", value: "FA18" },
                { label: "SP19", value: "SP19" },
                { label: "FA19", value: "FA19" },
                { label: "SP20", value: "SP20" },
                { label: "FA20", value: "FA20" },
                { label: "SP21", value: "SP21" },
                { label: "FA21", value: "FA21" },
                { label: "SP22", value: "SP22" },
                { label: "FA22", value: "FA22" },
                { label: "SP23", value: "SP23" },
                { label: "FA23", value: "FA23" },
              ]}
            />

            <RNPickerSelect
              style={{
                width: 50,
              }}
              onValueChange={(value) => setDpt(value)}
              items={programList.map((program) => program)}
            />
            <TextInput
              style={{
                height: 40,
                borderWidth: 1,
                paddingHorizontal: 10,
                borderRadius: 8,
              }}
              placeholder="Registration number"
              value={reg}
              onChangeText={(text) => setReg(text)}
            />

            <View>
              <TouchableOpacity
                className="py-3 bg-yellow-400 rounded-xl"
                onPress={handleSignUp}
              >
                <Text className="font-xl font-bold text-center text-gray-700">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text className="text-xl text-gray-700 font-bold text-center py-5">
            Or
          </Text>
          <View className="flex-row justify-center space-x-12">
            <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
              <Image
                source={require("../assets/icons/google.png")}
                className="w-10 h-10"
              />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
              <Image
                source={require("../assets/icons/apple.png")}
                className="w-10 h-10"
              />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
              <Image
                source={require("../assets/icons/facebook.png")}
                className="w-10 h-10"
              />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center mt-7">
            <Text className="text-gray-500 font-semibold">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Slogin")}>
              <Text className="font-semibold text-yellow-500"> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
