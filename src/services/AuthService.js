import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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

            console.log(user)

            // return user;

        } catch (error) {
            throw error;
        }
        

    }

}


export default new AuthService();