import { StyleSheet, Text, View } from 'react-native';

export default function SocialScreen() { 
  return (
    <View style={styles.container}>
      <Text>Màn hình đang chờ bạn code...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});