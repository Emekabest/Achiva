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


            


            return {status: 200, data:userCredential.user};
            
        } catch (error) {

            return {status:error?.status === "undefined" ? 500 : error.status, data:error.message}
        }
    }



    async signOut(){
        try {

            const response = await GoogleSignin.signOut();

            console.log(response);
            
        } catch (error) {
            throw new Error("Error Signing Out");
            
        }

    }


}



export default new GoogleAuthService();