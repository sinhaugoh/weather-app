import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=e502ee0395a67375598a8180d06938c0`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((json) => {
          setLocation(json);
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  if (errorMsg !== null) {
    // there is error
    return (
      <View style={styles.container}>
        <Text>There's been an error: {errorMsg}</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else if (location !== null) {
    // success
    return (
      <View style={styles.container}>
        <Image 
          source={{uri: `http://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`}}
          style={{width: 150, height: 150}}
        />
        <Text>{location.name}</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    // waiting (still waiting for gps to locate)
    return (
      <View style={styles.container}>
        <Text>Waiting...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#999",
    alignItems: "center",
    justifyContent: "center",
  },
});
