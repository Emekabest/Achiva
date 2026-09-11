import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../firebaseConfig";

GoogleSignin.configure({
    webClientId: "28578854020-5kjpdj33p6dmpccjb7vjflk8ptdmk397.apps.googleusercontent.com",
});




class GoogleAuthService{

    async signIn(){
        try {
            await GoogleSignin.hasPlayServices();

            const response = await GoogleSignin.signIn();
            

            const idToken = response.data?.idToken;

            if (!idToken) {
                throw new Error("Google Sign-In failed: No ID token received.");
            }

            const credential = GoogleAuthProvider.credential(idToken);

            const userCredential = await signInWithCredential(auth, credential);


            


            return userCredential.user;
            
        } catch (error) {

            return {status:error.status, message:error.message}
            
        }
    }


}



export default new GoogleAuthService();