import { StyleSheet, Dimensions } from "react-native"
import { Spacing, Fonts, FontWeight, Shadows } from '../../../constants/theme';


const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  modeRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.15)', 
    borderRadius: 25,
    height: 50,
    alignSelf: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginTop: Spacing.xs,
    width: width * 0.9, 
  },
  activeIndicator: {
    position: 'absolute',
    height: '90%', 
    top: '5%',
    backgroundColor: '#FFF', 
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  modeButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, 
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Fonts.rounded,
  },
  modeTextActive: {
    color: '#000', 
    fontWeight: '700',
  },
});