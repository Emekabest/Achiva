import { Modal, Text, TouchableOpacity, View } from "react-native"
import useThemeStore from "../repository/store";
import DarkTheme from "../theme/darkTheme";
import LightTheme from "../theme/lightTheme";
import Constants from 'expo-constants';
import { Ionicons } from "@expo/vector-icons";
import Fonts from "../constants/font";
import { useEffect, useState } from "react";
import UserRepository from "../repository/UserRepository";
import { getFirstLetter } from "../utils/extractFirstname";


const statusBarHeight = Constants.statusBarHeight;


const Profile = ({visible, onClose})=>{
  
  const isDark = useThemeStore((state) => state.isDark);
  const theme = isDark ? DarkTheme : LightTheme;

  const [user, setUser] = useState(null);
  

  useEffect(()=>{
        const fetchUser = async()=>{
        const user = await UserRepository.getUser();
        setUser(user);

        }
        fetchUser();


        return()=>{

            
        }
  },[visible])





    return(
        <Modal visible={visible} animationType="none" onRequestClose={onClose}>
            <View style={{flex:1, width:"100%", backgroundColor:theme.background}}>
                <View style={{flex:0.4, borderBottomEndRadius:30, borderBottomLeftRadius:30, width:"100%", backgroundColor:theme.primary}}>
                    <View style={{flexDirection:"row", paddingHorizontal:10, width:"100%", marginTop:statusBarHeight}}>

                        <View style={{width:"10%"}}>
                            <TouchableOpacity activeOpacity={1} onPress={()=> onClose()}>
                                <Ionicons name="arrow-back-outline" size={30} color={"#fff"} />
                            </TouchableOpacity>
                            
                        </View>
                        <View style={{width:"80%", alignItems:"center"}}>
                            <Text style={{color:"#fff", fontSize:20, fontFamily:Fonts.HeaderRegular}}>Profile</Text>
                        </View>
                        <View style={{width:"10%"}}>
                            
                        </View>
                    </View>


                    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                        <View style={{marginBottom:10, alignItems:"center", justifyContent:"center", height:120, width:120, backgroundColor:theme.danger, borderRadius:"100%"}}>
                            <Text style={{fontFamily:Fonts.HeaderSemiBold, fontSize:60, color:"#333"}}>{getFirstLetter(user?.username)}</Text>
                        </View>

                        <View>
                            <Text style={{color:"#fff", fontSize:20, fontFamily:Fonts.HeaderSemiBold}}>{user?.username}</Text>
                        </View>

                    </View>
                </View>

                <View style={{flex:0.6, paddingHorizontal:20, paddingTop:30}}>
                    <View style={{height:70, width:"100%", flexDirection:"row" }}>
                        <View style={{display:"flex", flexDirection:"row", width:"70%", height:"100%", alignItems:"center"}}>
                            <View style={{height:"100%"}}>
                                <Ionicons name="mail-outline" color={theme.icon} size={30} />
                            </View>
                            <View style={{height:"100%", width:"100%",  paddingLeft:10, margin:0}}>
                                <Text style={{fontSize:15, fontFamily:Fonts.BodyRegular, color:theme.text}}>Email</Text>
                                <View style={{minWidth:0, flex:1}}>
                                    <Text numberOfLines={2} style={{fontSize:12, paddingTop:10,  fontFamily:Fonts.BodySemiBold,  color:theme.text}}>{user?.email}</Text>
                                </View>
                            </View>
                        </View>


                        <View style={{backgroundColor:"lightgeen", width:"30%"}}>

                            {
                                user?.emailVerified ? ( 
                                <View style={{flex:1, backgroundColor:"lightbue", alignItems:"center", justifyContent:"flex-end", flexDirection:"row"}}>
                                    <Text style={{paddingRight:5, color:theme.text, fontSize:13, fontFamily:Fonts.BodyMedium}}>Verified</Text>
                                    <Ionicons name="checkmark-circle" color={"green"} size={17} />
                                </View>) 
                                
                                :
                            
                                <View style={{flex:1, backgroundColor:"lightbue", justifyContent:"space-evenly", alignItems:'center'}}>
                                    <View style={{flex:1,  alignItems:"center", justifyContent:"flex-end", flexDirection:"row"}}>
                                        <Text style={{paddingRight:5, color:theme.text, fontSize:12, fontFamily:Fonts.BodyMedium}}>Not Verified</Text>
                                        <Ionicons name="close-circle" color={"red"} size={15} />
                                    </View>

                                    <TouchableOpacity activeOpacity={1}  style={{flex:0.8, width:"90%", backgroundColor:theme.button, alignItems:"center", justifyContent:"center", borderRadius:20}}>
                                        <Text style={{fontSize:12, color:theme.text, fontFamily:Fonts.BodySemiBold}}>Verify Now</Text>
                                    </TouchableOpacity>
                                </View>                                
                            }
                            
                        </View>
                        

                    </View>

                </View>
            </View>
        </Modal>
    )
}





export default Profile;