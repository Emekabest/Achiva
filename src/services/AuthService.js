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


            await this.sendEmailVerification(user);

            

            return user;

        } catch (error) {
            console.log(error.code, error.message)
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

    

    async sendEmailVerification(user){

        try {
            const res = await sendEmailVerification(user);


        } catch (error) {
            console.log(error.message, error.code)
        }


    }




}


export default new AuthService();