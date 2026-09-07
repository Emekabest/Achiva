import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useState } from "react";
import Fonts from "../constants/font";
import useThemeStore from "../repository/store";
import DarkTheme from "../theme/darkTheme";
import LightTheme from "../theme/lightTheme";
import UserRepository from "../repository/UserRepository";

// Sign-in modal with email and password forms
const SignIn = ({ visible, onClose, onSignInSuccess }) => {
  const isDark = useThemeStore((state) => state.isDark);
  const theme = isDark ? DarkTheme : LightTheme;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    try {
      await UserRepository.signInWithEmail(email, password);
      setEmail("");
      setPassword("");
      onSignInSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: theme.background, borderColor: theme.border }]}>
          
          <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.button,
                color: theme.text,
                borderColor: error ? theme.danger : theme.border,
              },
            ]}
            placeholder="Enter your email"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>Password</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.button,
                color: theme.text,
                borderColor: error ? theme.danger : theme.border,
              },
            ]}
            placeholder="Enter your password"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
            secureTextEntry
          />

          {error ? (
            <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
          ) : null}

          <View style={styles.actions}>

            //Add "Sign Up"

            <TouchableOpacity
              onPress={handleClose}
              style={styles.cancelButton}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text style={[styles.cancelText, { color: theme.primary }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignIn}
              style={[styles.signInButton, { backgroundColor: theme.primary, opacity: isLoading ? 0.6 : 1 }]}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.signInText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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

  title: {
    fontSize: 20,
    fontFamily: Fonts.HeaderSemiBold,
    marginBottom: 20,
    lineHeight: 28,
  },

  label: {
    fontSize: 14,
    fontFamily: Fonts.BodySemiBold,
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: Fonts.BodyRegular,
  },

  errorText: {
    fontSize: 13,
    fontFamily: Fonts.BodyRegular,
    marginTop: 8,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
  },

  cancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  cancelText: {
    fontSize: 14,
    fontFamily: Fonts.BodySemiBold,
  },

  signInButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 8,
    minWidth: 90,
    alignItems: "center",
    justifyContent: "center",
  },

  signInText: {
    fontSize: 14,
    fontFamily: Fonts.BodySemiBold,
    color: "#fff",
  },
});

export default SignIn;
