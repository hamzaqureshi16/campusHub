import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import RNPickerSelect from "react-native-picker-select";
import { firestore } from "../firebaseConfig";
import { collection } from "firebase/firestore";
import axios from "axios";
import Constants from "expo-constants";
import { CommonActions } from "@react-navigation/native";

export default function Lone() {
  const navigation = useNavigation();
  const { manifest } = Constants;
  const [session, setSession] = React.useState("");
  const [reg, setReg] = React.useState("");
  const [dpt, setDpt] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const programList = [
    { label: "BCS", value: "BCS" },
    { label: "BBA", value: "BBA" },
    { label: "BDS", value: "BDS" },
    { label: "BSE", value: "BSE" },
  ];

  useEffect(() => console.log(reg), [reg]);
  const handleLogin = async () => {
    const registration = `${session}-${dpt}-${reg}`;

    await axios
      .post(
        `http://${manifest.debuggerHost.split(":").shift()}:3000/stuLogin`,
        {
          registration: registration,
          password: password,
        }
      )
      .then(async (res) => {
        if (res.status === 200) {
          console.log(res.data);
          await signInWithEmailAndPassword(auth, res.data.email, password)
            .then((userCredential) => {
              console.log(userCredential.user);
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Home" }],
                })
              );
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              alert(errorMessage);
            });
        } else {
          alert("Invalid Credentials");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View
      className="flex-1 bg-white"
      style={{ backgroundColor: themeColors.bg }}
    >
      <SafeAreaView className="flex ">
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
            source={require("../assets/images/login.png")}
            style={{ width: 200, height: 200 }}
          />
        </View>
      </SafeAreaView>
      <View
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        className="flex-1 bg-white px-8 pt-8"
      >
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4">Registration num</Text>
          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}> */}
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
          <RNPickerSelect
            style={{
              width: 50,
            }}
            onValueChange={(value) => setReg(value)}
            items={Array.from({ length: 100 }, (_, index) => {
              const paddedIndex = String(index + 1).padStart(3, "0");
              return { label: `${paddedIndex}`, value: `${paddedIndex}` };
            })}
          />

          {/* <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
            placeholder="reg"
            value={reg}
            onChangeText={(text) => setReg(text)}
            keyboardType="numeric"
            style={{
              height: 50,
              borderWidth: 1,
              paddingHorizontal: 10,
              borderRadius: 8,
            }}
          /> */}
          {/* </View> */}

          <Text className="text-gray-700 ml-4">Password</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
            secureTextEntry
            placeholder="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity className="flex items-end">
            <Text className="text-gray-700 mb-5">Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleLogin()}
            className="py-3 bg-yellow-400 rounded-xl"
          >
            <Text className="text-xl font-bold text-center text-gray-700">
              Login
            </Text>
          </TouchableOpacity>
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
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Student")}>
            <Text className="font-semibold text-yellow-500"> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
