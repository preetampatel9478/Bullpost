import React from 'react';
import { useColorScheme, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { NewsScreen } from '../screens/NewsScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

type IconName = React.ComponentProps<typeof Feather>['name'];

const TAB_ICONS: Record<string, IconName> = {
  Home: 'home',
  News: 'file-text',
  Search: 'search',
  Messages: 'message-circle',
  Profile: 'user',
};

type Props = {
  identifier: string;
  onLogout: () => void;
};

export function MainTabs({ identifier, onLogout }: Props) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const insets = useSafeAreaInsets();

  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 4);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.cardBorder,
          height: 54 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, size }) => (
          <Feather name={TAB_ICONS[route.name]} size={size - 2} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile">{() => <ProfileScreen identifier={identifier} onLogout={onLogout} />}</Tab.Screen>
    </Tab.Navigator>
  );
}
