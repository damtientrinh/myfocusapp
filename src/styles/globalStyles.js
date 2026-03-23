import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#FF9F43', 
  secondary: '#4CAF50', 
  background: '#F5F5F5',
  text: '#333',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
});