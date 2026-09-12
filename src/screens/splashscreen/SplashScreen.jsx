import { useEffect } from "react";
import { Image, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native";
import appLogo from "../../../assets/app-logo.png"
import Fonts from "../../constants/font";


const SplashScreen = ()=>{

        const navigation = useNavigation();



    // useEffect(()=>{

    //     const timeout = setTimeout(()=>{

    //         navigation.replace("tasklist");

    //     }, 3000)


    //     return ()=>{

    //         clearTimeout(timeout)
    //     }
    // },[])

    

    return(
        <View style={{flex:1, width:"100%", backgroundColor:"#fff", alignItems:"center", justifyContent:"center"}}>

            <View style={{height:300, width:"100%", alignItems:'center', justifyContent:"center"}}>
                <View style={{marginBottom:10}}>
                    <Image source={appLogo} style={{height:120, width:120, }} />
                </View>
                <View>
                    <Text style={{fontSize:25, fontFamily:Fonts.HeaderSemiBold, textAlign:"center", color:"#4F46E5"}}>Achiva</Text>
                    <Text style={{fontSize:15, fontFamily:Fonts.BodySemiBold, color:"#000"}}>Plan Better. Achieve More.</Text>
                </View>


            </View>

        </View>
    )
}


export default SplashScreen;