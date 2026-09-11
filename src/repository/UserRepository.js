import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebaseConfig";


class UserRepository{

    STORAGE_KEY = "user_";

    async setUser(user){
        await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        console.log("updated from set!")

    }

    async getUser(){
        const user =  await AsyncStorage.getItem(this.STORAGE_KEY);


        return user ? JSON.parse(user) : null;
    }

    async updateUser(user){
        
        const {displayName, email, emailVerified, uid  } = user;

        await this.setUser({username:displayName, email, emailVerified, uid});
    }


    async removeUser(){
        await AsyncStorage.removeItem(this.STORAGE_KEY);
        
    }

}


export default new UserRepository();