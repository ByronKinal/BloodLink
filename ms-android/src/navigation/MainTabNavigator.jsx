import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../features/dashboard/screens/DashboardScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';
import TriageStepperScreen from '../features/triage/screens/TriageStepperScreen';
import AppointmentsScreen from '../features/appointments/screens/AppointmentsScreen';
import WalletScreen from '../features/rewards/screens/WalletScreen';
import AssistantScreen from '../features/assistant/screens/AssistantScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#D42040',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Triage') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Citas') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Billetera') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Asistente') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={focused ? 24 : 22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Inicio', headerShown: false }}
      />
      <Tab.Screen
        name="Triage"
        component={TriageStepperScreen}
        options={{ title: 'Triage', headerShown: false }}
      />
      <Tab.Screen
        name="Citas"
        component={AppointmentsScreen}
        options={{ title: 'Citas', headerShown: false }}
      />
      <Tab.Screen
        name="Billetera"
        component={WalletScreen}
        options={{ title: 'Billetera', headerShown: false }}
      />
      <Tab.Screen
        name="Asistente"
        component={AssistantScreen}
        options={{ title: 'IA Asistente', headerShown: false }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}
