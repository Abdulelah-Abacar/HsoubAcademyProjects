import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";

// Screens
import Home from "./screens/Home";
import Doctors from "./screens/Doctors";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import Profile from "./screens/Profile";

const Stack = createStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    NotoFont: require('./assets/fonts/NotoKufiArabic-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007bff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            textAlign: "right",
            fontFamily: "NotoFont"
          },
        }}
      >
        <Stack.Screen 
          name="Home"
          options={{headerShown: false}}
          component={Home}
        />
        <Stack.Screen 
          name="SignIn"
          options={{
            title: "تسجيل الدخول"
          }}
          component={SignIn}
        />
        <Stack.Screen 
          name="SignUp"
          options={{
            title: "حساب جديد"
          }}
          component={SignUp}
        />
        <Stack.Screen
          name="Profile"
          options={{
            title: 'الملف الشخصي',
          }}
          component={Profile}
        />
        <Stack.Screen 
          name="Doctors"
          options={{
            title: "الأطباء",
          }}
          component={Doctors}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
