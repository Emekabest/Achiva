import React, { useEffect, useState } from "react";
import { Animated, Easing, Modal, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import Constants from 'expo-constants';
import Fonts from "../constants/font";
import useThemeStore from "../repository/store";
import DarkTheme from "../theme/darkTheme";
import LightTheme from "../theme/lightTheme";
import UserRepository from "../repository/UserRepository";
import { extractFirstname, getFirstLetter } from "../utils/extractFirstname";
import { Ionicons } from "@expo/vector-icons";
import Profile from "./Profile";
import GoogleAuthService from "../services/GoogleAuthService";
import Alert from "./Alert";
import SignIn from "./SignIn";
import SingleOptionAlert from "./SingleOptionAlert";

const statusBarHeight = Constants.statusBarHeight;

// Shows the app drawer as a sliding panel with the theme toggle.
const DrawerNavigation = ({ visible, onClose }) => {
  const isDark = useThemeStore((state) => state.isDark);
  const theme = isDark ? DarkTheme : LightTheme;
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const [user, setUser] = useState(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertDetails, setAlertDetails] = useState({question:"", onCancel:()=>{}, onConfirm:()=>{}, confirmText:""});
  const [isSignInVisible, setIsSignInVisible] = useState(false);
  const [isSingleAlertVisible, setIsSingleAlertVisible] = useState(false);
  const [singleAlertDetails, setSingleAlertDetails] = useState({question:"", onCancel:()=>{}, confirmText:""})

  const [slideAnim] = useState(new Animated.Value(-300));



  useEffect(() => {
    if (visible) {
      slideAnim.setValue(-300);
    }

    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -300,
      duration: 260,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [slideAnim, visible]);


    useEffect(()=>{
      const fetchUser = async()=>{
        const user = await UserRepository.getUser();
        setUser(user);

      }
      fetchUser();
    },[visible])




    const handleSignOut = async()=>{

      try {
        await UserRepository.removeUser();

        await GoogleAuthService.signOut();

        onClose();

      } catch (error) {
        console.log(error)
      }
      finally{
        setIsAlertVisible(false);
      }
     
    }


    const activateAlert = ({question, onConfirm, onCancel, confirmText})=>{

      setAlertDetails({
        question,
        onConfirm,
        onCancel,
        confirmText
      })

      setIsAlertVisible(true)   
    }


    const closeAllDrawerModals = ()=>{

      onClose();
      setIsProfileVisible(false);
      setIsSignInVisible(false)
      setIsAlertVisible(false)
      setIsSingleAlertVisible(false)
    }
    


  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} onPress={closeAllDrawerModals} style={styles.overlay}>
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
              backgroundColor: theme.background,
              borderRightWidth: 1,
              borderColor: theme.border,
            },
          ]}
        >
    

          {
            user && (<View style={[styles.menuItem, { height:130, borderBottomColor: theme.border, borderBottomWidth: 1, flexDirection:"column" }]}>
              <View style={{height:70, width:70, backgroundColor:"lightblue", borderRadius:"50%", alignItems:"center", justifyContent:"center"}}>
                <Text style={{fontFamily:Fonts.HeaderSemiBold, fontSize:40, color:"#333"}}>{getFirstLetter(extractFirstname(user?.username))}</Text>
              </View>
              <Text style={{paddingVertical:10, fontFamily:Fonts.BodySemiBold, color:theme.text}}>Hi {extractFirstname(user?.username)}</Text>
            </View>)
          }
          
          <View style={[styles.menuItem]}>
            <Text style={[styles.menuText, { color: theme.text }]}>Dark mode</Text>
            <Switch
              value={isDark}
              onValueChange={(value) => toggleTheme(value)}
              trackColor={{ false: "#d1d5db", true: theme.primary }}
              thumbColor="#fff"
            />
          </View>


          {
            user && (
              <TouchableOpacity onPress={()=> setIsProfileVisible(true)} activeOpacity={1} style={[styles.menuItem]}>
                <Text style={[styles.menuText, { color: theme.text }]}>Profile</Text>
                <Ionicons name="person-outline" size={23} color={theme.icon}/>
              </TouchableOpacity>
            )  
          }


          {
              user ? (
                <TouchableOpacity onPress={()=>
                  activateAlert({
                    question:"Are you sure you want to Sign Out?",
                    onConfirm:handleSignOut,
                    onCancel:()=>{setIsAlertVisible(false)},
                    confirmText:"Yes"
                  })
                } activeOpacity={1}  style={[styles.menuItem]}>
                  <Text style={[styles.menuText, { color: theme.text }]}>Sign Out</Text>
                  <Ionicons name="log-out-outline" size={23} color={theme.danger}/>
                </TouchableOpacity>
              )  

              :

              <TouchableOpacity activeOpacity={1} onPress={()=> setIsSignInVisible(true)}  style={[styles.menuItem]}>
                  <Text style={[styles.menuText, { color: theme.text }]}>Sign In</Text>
                  <Ionicons name="log-in-outline" size={23} color={"green"}/>
              </TouchableOpacity>
          }

          
        </Animated.View>
      </TouchableOpacity>


      <Profile 
        visible={isProfileVisible}
        onClose={()=> setIsProfileVisible(false)}
      />


      <Alert 
        visible={isAlertVisible}
        question={alertDetails.question}
        onConfirm={alertDetails.onConfirm}
        onCancel={alertDetails.onCancel}
        confirmText={alertDetails.confirmText}
      />


      <SingleOptionAlert
          visible={isSingleAlertVisible} 
          question={singleAlertDetails.question} 
          onCancel={singleAlertDetails.onCancel} 
          confirmText ={singleAlertDetails.confirmText}
      />


      <SignIn
          visible={isSignInVisible}
          onClose={() => setIsSignInVisible(false)}
          onSignInSuccess={() => {
              
            setSingleAlertDetails({
              question:"You have successfully Signed In",
              onCancel:()=>{
                setIsSingleAlertVisible(false);
                onClose();
              },
              confirmText:"Ok"
            })

          setIsSingleAlertVisible(true);
          }}
      />

    </Modal>
  );
};




const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "75%",
    paddingHorizontal: 16,
    paddingTop: statusBarHeight,
    zIndex: 2,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 24,
  },
  drawerTitle: {
    fontSize: 20,
    fontFamily: Fonts.HeaderSemiBold,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    
  },
  menuText: {
    fontSize: 16,
    fontFamily: Fonts.BodyMedium,
  },
});

export default DrawerNavigation;