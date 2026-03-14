import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.title}>Destinaation254</Text>

      <Link href="/(auth)/signup">SignuP Page</Link>
      <Link href="/(auth)">Login Page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {color: "black"},
});