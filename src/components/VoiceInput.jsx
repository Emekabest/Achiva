import { StyleSheet, TouchableOpacity, View, Linking, Dimensions, Animated, Text, Modal } from "react-native";
import Colors from "../constants/color";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMicrophone, faPaperPlane, faStar } from "@fortawesome/free-solid-svg-icons";
import Alert from "./Alert";
import { useEffect, useRef, useState } from "react";
import { RecordingPresets, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import useVoiceRecorder from "../hooks/useVoiceRecorder";
import Fonts from "../constants/font";
import { Ionicons } from "@expo/vector-icons";
import RecordTimerConverter from "../utils/RecordTimerConverter";
import OpenAIService from "../services/OpenAIService";
import TaskService from "../services/TaskService";
import SingleOptionAlert from "./SingleOptionAlert";
import Loader from "./Loader";
import useThemeStore from "../repository/store";
import DarkTheme from "../theme/darkTheme";
import LightTheme from "../theme/lightTheme";
import UserRepository from "../repository/UserRepository";

const { width } = Dimensions.get("window");//



// Handles voice recording, transcription, and task creation from spoken input.
const VoiceInput = ({handleRecordingModeViaExternalComponent, fetchTasks}) => {
    const isDark = useThemeStore((state) => state.isDark);
    const theme = isDark ? DarkTheme : LightTheme;

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isSingleAlertVisible, setIsSingleAlertVisible] = useState(false);
    const [alertDetails, setAlertDetails] = useState({question:"", onCancel:()=>{}, onConfirm:()=>{}, confirmText:""});


    const [isRecordingMode, setIsRecordingMode] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState("0:0");

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const recordSession = useRef(false);
    const durationInterval = useRef(null);

    const { requestPermissions, startRecording, stopRecording } = useVoiceRecorder();

  

    useEffect(() => {
        if (!isRecordingMode) {
            Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
            return;
        }

        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return ()=>{

            animation.stop();
        };
    }, [isRecordingMode, pulseAnim]);




    // Stops the current recording and returns the finalized audio result.
    const concludeRecording = async () => {


        if (recordSession.current) {
            recordSession.current = false;

            try {

                const recording = await stopRecording();

                if (!recording?.isRecording) {

                    setIsRecordingMode(false);
                    handleRecordingModeViaExternalComponent(false);

                    clearInterval(durationInterval.current);
                    durationInterval.current = null;
                    setRecordingDuration("0:0");

                    return recording.uri;

                }


                }
            catch (error) {
                console.log("Error stopping all recordings:", error);
            }
        
        }
    }

   

    
   // Starts or stops voice capture and processes the result into tasks.
   const handleVoiceInput = async () => {

    const user = await UserRepository.getUser();

    if (!user){

        setAlertDetails({
            question:"Sign In to access the AI Voice Input",
            onCancel:()=>{setIsAlertVisible(false); setAlertDetails({})},
            onConfirm:()=>{
                setIsAlertVisible(false);
                console.log("Going to Sign In Modal");
                setAlertDetails({})
            },
            confirmText:"Sign In"
        })
        setIsAlertVisible(true);
        
        return;
    }





        try{

            if (!isRecordingMode) {
                

                if (!recordSession.current) {
                    recordSession.current = true;
                    
                
                    const isPermissionGranted = await requestPermissions();

                    
                    if (!isPermissionGranted) {
                        setAlertDetails({
                            question:`Microphone access is required for voice input. Please enable microphone permissions in your device settings.`,
                            onCancel: ()=>{ setIsAlertVisible(false); },
                            onConfirm:()=>{ Linking.openSettings(); },
                            confirmText:"Open Settings"
                        })
                        setIsAlertVisible(true);
                        return;
                    }



                    const recording = await startRecording();

                    console.log("Recording started:", recording?.isRecording);

                    if (recording?.isRecording){
                        setIsRecordingMode(true);
                        handleRecordingModeViaExternalComponent(true)

                        
                        durationInterval.current = setInterval(() => {
                        
                            setRecordingDuration(RecordTimerConverter(recording?.currentTime));

                            return ()=>{
                                clearInterval(durationInterval.current);
                            }
                        }, 1000);
                    }
                    
                }

            }
            else{
                
               const audioUri = await concludeRecording();
               setIsTranscribing(true);

               const transcribe = await OpenAIService.transcribeAudio(audioUri);
               
               const rawTasks = await OpenAIService.splitTasks(transcribe);

                console.log(rawTasks)


               setIsTranscribing(false);

               console.log(rawTasks)

               
               if (rawTasks?.length > 0){

                    await TaskService.addTranscribedTask(rawTasks);

                    fetchTasks();
               }
               else{
                    setIsSingleAlertVisible(true)

               }

            }
        
        }
        catch(error){
            console.log("Error handling voice input:", error);
        }


   }






    return(
        <View>

            <TouchableOpacity activeOpacity={1}  style={[styles.container, { backgroundColor: theme.primary }]} onPress={handleVoiceInput}>

               {
                    isRecordingMode ? (
                        <View style={styles.recordingState}>
                            <Animated.View
                                style={[
                                    styles.recordingRing,
                                    {
                                        transform: [{ scale: pulseAnim }],
                                        opacity: pulseAnim.interpolate({
                                            inputRange: [1, 1.2],
                                            outputRange: [0.35, 1],
                                        }),
                                        borderColor: theme.primary,

                                    },
                                ]}
                            />
                            <View style={styles.recordingIcon}>
                                <FontAwesomeIcon icon={faPaperPlane} size={25} color="#fff" style={{ transform: [{ rotate: "-45deg" }] }} />
                            </View>
                        </View>
                    ) : (
                        <View>
                            <FontAwesomeIcon icon={faMicrophone} size={30} color="#fff" />
                        </View>
                    )
               } 
                
            
            </TouchableOpacity>


            {
                isRecordingMode && (
                        <View style={[styles.recorderDetailsContainer, { backgroundColor: theme.background, borderTopColor: theme.border, }]}>
                            <View style={{width:"50%", paddingHorizontal: 20, justifyContent:"center", height:"100%", }}>
                                <Text style={{color: theme.text, fontFamily:Fonts.BodySemiBold}}>{recordingDuration}</Text>
                            </View>

                            <View style={{width:"50%", paddingHorizontal: 20, justifyContent:"center", height:"100%",    alignItems:"flex-end"}}>
                                <TouchableOpacity activeOpacity={1} onPress={concludeRecording}>
                                    <Ionicons name="close-circle" size={30} color={theme.danger} />
                                </TouchableOpacity>
                            </View>

                        </View>
                )

            }

            

            <Alert 
                visible={isAlertVisible}
                question={alertDetails.question}
                onCancel={alertDetails.onCancel}
                onConfirm={alertDetails.onConfirm}
                confirmText={alertDetails.confirmText}
            />


            <SingleOptionAlert 
                visible={isSingleAlertVisible} 
                question={"Could not transcribe your speech, Please try again."} 
                onCancel={()=> setIsSingleAlertVisible(false)} 
                confirmText ="Ok" 
            />

            <Loader 
                visible={isTranscribing}
                text={"Transcribing"}
            />
        </View>

    )
}


  const styles = StyleSheet.create({
        container:{
            width:55,
            height:55,
            position:"absolute",
            bottom:70,
            left: width / 2 - 27.5,
            borderRadius:50,
            justifyContent:"center",
            alignItems:"center",
            zIndex:2
        },
        recordingState:{
            width:"100%",
            height:"100%",
            justifyContent:"center",
            alignItems:"center",
        },
        recordingRing:{
            position:"absolute",
            width:56,
            height:56,
            borderRadius:28,
            borderWidth:2,
            
        },
        recordingIcon:{
            width:46,
            height:46,
            borderRadius:23,
            justifyContent:"center",
            alignItems:"center",
            overflow:"hidden",
        },
        aiBadge:{
            position:"absolute",
            right: -2,
            bottom: -2,
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: "rgba(255,255,255,0.2)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.4)",
            justifyContent:"center",
            alignItems:"center",
        },
        recorderDetailsContainer:{
            position:"absolute",
            height:50,
            width:"100%",
            bottom:0,
            flexDirection:"row",
            borderTopWidth:0.5,
            
            zIndex:2,
        },
    });



export default VoiceInput;