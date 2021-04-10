import React, { View, StyleSheet } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Apptext from "../components/AppText";
function Roubines() {
  return (
    <TouchableOpacity underlayColor={colors.white}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require("./images/ruby.png")} />
        <View>
          <AppText></AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 35,
    margin: 0,
  },
  container: {
    flexDirection: "row",
    padding: 15,
  },
});

export default Roubines;
