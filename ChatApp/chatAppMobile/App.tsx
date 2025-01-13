import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { useFonts } from 'expo-font';
import MyStack from './config/routes';
import { Auth } from './config';
import { ChatProvider } from './context/ChatProvider';
import { NavigationContainer } from "@react-navigation/native";
import { useCallback } from 'react';
// import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  // const isAuth = async () => await Auth.auth()
  const [fontsLoaded] = useFonts({
    'noto-font': require('./assets/fonts/NotoKufiArabic-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null; // Prevent rendering until fonts are loaded

  return (
    <ChatProvider>
      <GluestackUIProvider config={config}>
        
          <MyStack /> 
        
      </GluestackUIProvider>
    </ChatProvider>
  );
}
