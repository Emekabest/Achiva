import { Modal, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useState } from "react";
import Fonts from "../constants/font";
import useThemeStore from "../repository/store";
import DarkTheme from "../theme/darkTheme";
import LightTheme from "../theme/lightTheme";

// Email verification modal
const EmailVerification = ({ visible, email, onVerified, onResendEmail }) => {
  const isDark = useThemeStore((state) => state.isDark);
  const theme = isDark ? DarkTheme : LightTheme;

  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await onResendEmail?.();
      setResendMessage("Verification email sent!");
      setTimeout(() => setResendMessage(""), 3000);
    } catch (err) {
      setResendMessage(err.message || "Failed to resend email");
      setTimeout(() => setResendMessage(""), 3000);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>Verify your email</Text>

          <View style={styles.messageContainer}>
            <Text style={[styles.message, { color: theme.textSecondary }]}>
              We sent a verification link to
            </Text>
            <Text style={[styles.emailText, { color: theme.text }]}>{email}</Text>
          </View>

          <TouchableOpacity
            onPress={onVerified}
            style={[styles.verifiedButton, { backgroundColor: theme.primary }]}
            activeOpacity={0.7}
          >
            <Text style={styles.verifiedButtonText}>I've verified</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleResendEmail}
            disabled={isResending}
            activeOpacity={0.7}
            style={styles.resendButton}
          >
            {isResending ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Text style={[styles.resendText, { color: theme.primary }]}>Resend email</Text>
            )}
          </TouchableOpacity>

          {resendMessage ? (
            <Text style={[styles.resendMessage, { color: theme.success }]}>
              {resendMessage}
            </Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontFamily: Fonts.HeaderSemiBold,
    marginBottom: 24,
    lineHeight: 32,
  },

  messageContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  message: {
    fontSize: 16,
    fontFamily: Fonts.BodyRegular,
    lineHeight: 24,
    marginBottom: 8,
  },

  emailText: {
    fontSize: 16,
    fontFamily: Fonts.BodySemiBold,
    lineHeight: 24,
  },

  verifiedButton: {
    width: "100%",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  verifiedButtonText: {
    fontSize: 16,
    fontFamily: Fonts.BodySemiBold,
    color: "#fff",
  },

  resendButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  resendText: {
    fontSize: 14,
    fontFamily: Fonts.BodySemiBold,
  },

  resendMessage: {
    fontSize: 13,
    fontFamily: Fonts.BodyRegular,
    marginTop: 16,
  },
});

export default EmailVerification;
