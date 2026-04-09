import { StyleSheet, Dimensions, Platform } from "react-native"
import { Spacing, Fonts, FontWeight, Shadows } from '../../../constants/theme';


const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  statsContainer: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  statsText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: FontWeight.medium,
    fontFamily: Fonts.sans,
  },
  quoteContainer: {
    paddingHorizontal: Spacing.xs,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Fonts.sans,
    lineHeight: 24,
  }
});