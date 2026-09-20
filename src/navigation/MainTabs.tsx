import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { colors } from "../lib/theme";
import DashboardScreen from "../screens/DashboardScreen";
import SendScreen from "../screens/SendScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import type { MainTabParams } from "./types";

const Tab = createBottomTabNavigator<MainTabParams>();

const ICONS: Record<keyof MainTabParams, keyof typeof Feather.glyphMap> = {
  Home: "home",
  Send: "send",
  History: "clock",
  Profile: "user",
};

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { borderTopColor: colors.line, height: 64, paddingTop: 6 },
        tabBarLabelStyle: { fontWeight: "600", fontSize: 11 },
        tabBarIcon: ({ color, size }) => (
          <Feather name={ICONS[route.name]} size={size - 2} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Send" component={SendScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
