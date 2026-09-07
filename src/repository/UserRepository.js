import AsyncStorage from "@react-native-async-storage/async-storage";


class UserRepository{

    STORAGE_KEY = "user_";

    async setUser(user){



    }

    async getUser(){
        const user =  await AsyncStorage.getItem(this.STORAGE_KEY);


        return user ? JSON(user) : null;
    }


}


export default new UserRepository();