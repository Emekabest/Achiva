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
   

  }
  catch(error){

      setError("Sign in failed. Please try again.");

  }
  finally{
    setIsLoading(false);

  }

}


return {signIn}
}


export default useSignInWithGoogle;