import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FullScreenLoader } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { colors } from '../lib/theme';
import BeneficiariesScreen from '../screens/BeneficiariesScreen';
import CardsScreen from '../screens/CardsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SecurityScreen from '../screens/SecurityScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import type { RootStackParams } from './types';

const Root = createNativeStackNavigator<RootStackParams>();

export function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullScreenLoader />;

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Root.Navigator
          screenOptions={{
            headerTintColor: colors.text,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.bg },
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Root.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />
          <Root.Screen name="Beneficiaries" component={BeneficiariesScreen} />
          <Root.Screen name="Cards" component={CardsScreen} options={{ title: 'My Cards' }} />
          <Root.Screen name="Security" component={SecurityScreen} />
          <Root.Screen name="Settings" component={SettingsScreen} />
          <Root.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit profile' }} />
          <Root.Screen name="Notifications" component={NotificationsScreen} />
        </Root.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
