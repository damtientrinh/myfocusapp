import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({ 
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    borderRadius: 20,
    overflow: 'hidden',
    paddingRight: 10, // Tránh mất nhãn trục Y
  },
});