import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Fonts from "../constants/font";
import useThemeStore from "../repository/store";
import DarkTheme from "../theme/darkTheme";
import LightTheme from "../theme/lightTheme";

// Shows a simple one-action alert for lightweight feedback messages.
const SingleOptionAlert = ({visible, question, onCancel, confirmText="Ok" })=>{
  const isDark = useThemeStore((state) => state.isDark);
  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <Modal visible={visible} transparent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Text style={[styles.question, { color: theme.text }]}>{question}</Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onCancel} style={[styles.confirmButton, { backgroundColor: theme.primary }]} activeOpacity={0.7}>
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  dialog: {
    width: "100%",
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
  },

  question: {
    fontSize: 16,
    fontFamily: Fonts.BodyMedium,
    lineHeight: 23,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
  },

  confirmButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
  },

  confirmText: {
    fontSize: 14,
    fontFamily: Fonts.BodySemiBold,
    color: "#fff",
  },
});

export default SingleOptionAlert;