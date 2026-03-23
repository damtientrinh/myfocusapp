import { View, Text, StyleSheet } from 'react-native';

export default function StatsScreen() { 
  return (
    <View style={styles.container}>
      <Text>Màn hình đang chờ bạn code...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});