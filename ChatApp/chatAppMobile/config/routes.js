import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import Register from "../screens/Register";
import Home from "../screens/Home";
import Chat from "../screens/Chat";
import Profile from "../screens/Profile";
import EditProfile from "../screens/EditProfile";
import { useEffect, useState } from "react";
import { Auth } from ".";
import Password from "../screens/Passowrd";

const Stack = createNativeStackNavigator();

export default function MyStack() {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    // testing purposes
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    try {
      // custom logic
      await sleep(2000);
      const user = Auth.getToken();
      setUser(user);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
    console.log(user);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user !== null ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              initialParams={{ setUser }}
            />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              initialParams={{ setUser }}
            />
            <Stack.Screen name="Password" component={Password} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              initialParams={{ setUser }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              initialParams={{ setUser }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
