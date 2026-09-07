import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebaseConfig.js";

class AuthService{


    async SignUp(username, email, password){

        try {
            // Create the Firebase account
            const userCredential = await createUserWithEmailAndPassword(auth, email, password );

            const user = userCredential.user;

            // Save the username as the user's Firebase display name
            await updateProfile(user, {
            displayName: username,
            });


            await sendEmailVerification(user);
            

            return user;

        } catch (error) {
            throw error;
        }
        

    }


    async SignIn(email, password){

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        return userCredential.user;

    }

}


export default new AuthService();