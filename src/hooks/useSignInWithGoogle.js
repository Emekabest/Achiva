import UserRepository from "../repository/UserRepository";
import GoogleAuthService from "../services/GoogleAuthService";


const useSignInWithGoogle = ({onClose, onCloseAll, onSignInSuccess, onSignUpSuccess, setIsSignUpVisible, setError, setIsLoading})=>{

 const signIn = async()=>{

  try{
    const response = await GoogleAuthService.signIn();

    if (response.status === 200){

        const user = response.data;

        const { displayName, emailVerified, uid} = user;

        await UserRepository.setUser({username:displayName, email:user.email, emailVerified, uid})

        onSignInSuccess?.();
        onSignUpSuccess?.();
        setIsSignUpVisible?.(false);
        onClose();
        onCloseAll?.();
    }
    else{
          // TEMPORARY: show the actual error
        setError(
            response.data?.message ||
            "Google Sign-In failed."
        );

    }
   

  }
  catch(error){

        console.log("SCREEN GOOGLE ERROR:", error);

        setError(
            error?.message ||
            "Sign in failed. Please try again."
        );

  }
  finally{
    setIsLoading(false);

  }

}


return {signIn}
}


export default useSignInWithGoogle;