import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Image } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Fonts from "../constants/font";
import useThemeStore from "../repository/store";
import DarkTheme from "../theme/darkTheme";
import LightTheme from "../theme/lightTheme";
import UserRepository from "../repository/UserRepository";
import SignUp from "./SignUp";
import AuthService from "../services/AuthService";
import SingleOptionAlert from "./SingleOptionAlert";
import googleLogo from "../../assets/google-logo.png"
import GoogleAuthService from "../services/GoogleAuthService";
import useSignInWithGoogle from "../hooks/useSignInWithGoogle";

// Sign-in modal with email and password forms
const SignIn = ({ visible, onClose, onSignInSuccess }) => {
  const isDark = useThemeStore((state) => state.isDark);
  const theme = isDark ? DarkTheme : LightTheme;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);



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
     const user = await AuthService.SignIn(email, password);
     
     const { displayName, emailVerified, uid} = user

     await UserRepository.setUser({username:displayName, email:user.email, emailVerified, uid})

        
      setEmail("");
      setPassword("");
      setIsSignUpVisible(false);
      onSignInSuccess?.();
      onClose();

    } catch (err) {
        console.log(err.code)
      if (err.code === "auth/invalid-credential"){
            setError("Invalid Email or Password");

        }
        else if (err.code === "auth/network-request-failed"){
            setError("Network Error. Check your internet connection")
        }
    else{
            setError("Sign in failed. Please try again.");
        }
      
    } finally {
      setIsLoading(false);
    }
  };


  const handleSignInWithGoogle = async()=>{

   await useSignInWithGoogle({
    onClose, 
    onSignInSuccess,
    setIsSignUpVisible, 
    setError, 
    setIsLoading}).signIn()

  }



  const handleClose = () => {

    setEmail("");
    setPassword("");
    setError("");
    setIsSignUpVisible(false);
    onClose();
  };



  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: theme.background, borderColor: theme.border }]}>
          

          <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
          <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>


            <TouchableOpacity onPress={handleSignInWithGoogle} activeOpacity={1} style={{display:"flex", flexDirection:"row", borderWidth:2, borderColor:theme.primary, justifyContent:"center", alignItems:"center", paddingHorizontal:10, borderRadius:50}}>
                <Image source={googleLogo} style={{height:25, width:25, marginRight:5}} />
                <Text style={{fontFamily:Fonts.BodySemiBold, fontSize:13, color:theme.text}}>Continue with Google</Text>
            </TouchableOpacity>
            
          </View>



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
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
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
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isPasswordVisible ? "eye" : "eye-off"}
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {error ? (
            <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
          ) : null}

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => {
                setIsSignUpVisible(true);
                setEmail("");
                setPassword("");
                setError("");
              }}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text style={[styles.signUpLinkText, { color: theme.primary }]}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.rightActions}>
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
      </View>


      <SignUp
        visible={isSignUpVisible}
        onClose={() => setIsSignUpVisible(false)}
        onSignUpSuccess={onSignInSuccess}
        onSwitchToSignIn={() => setIsSignUpVisible(false)}
        onCloseAll={() => {
          setIsSignUpVisible(false);
          onClose();
        }}
      />

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

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  passwordInput: {
    flex: 1,
    paddingRight: 40,
  },

  eyeIcon: {
    position: "absolute",
    right: 12,
    paddingVertical: 10,
  },

  errorText: {
    fontSize: 13,
    fontFamily: Fonts.BodyRegular,
    marginTop: 8,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },

  rightActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  signUpLinkText: {
    fontSize: 14,
    fontFamily: Fonts.BodySemiBold,
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
