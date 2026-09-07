import AsyncStorage from "@react-native-async-storage/async-storage";


class UserRepository{

    STORAGE_KEY = "user_";

    async setUser(user){
        await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));

    }

    async getUser(){
        // await AsyncStorage.clear()
        const user =  await AsyncStorage.getItem(this.STORAGE_KEY);


        return user ? JSON.parse(user) : null;
    }


}


export default new UserRepository();