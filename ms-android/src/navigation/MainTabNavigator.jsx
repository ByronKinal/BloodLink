import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../features/auth/store/authStore';

import DashboardScreen from '../features/dashboard/screens/DashboardScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';
import TriageStepperScreen from '../features/triage/screens/TriageStepperScreen';
import AppointmentsScreen from '../features/appointments/screens/AppointmentsScreen';
import WalletScreen from '../features/rewards/screens/WalletScreen';
import AssistantScreen from '../features/assistant/screens/AssistantScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1E293B',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerRight: () => (
          <TouchableOpacity
            style={styles.logoutHeaderBtn}
            onPress={() => clearSession()}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
          </TouchableOpacity>
        ),
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
        options={{ title: 'Inicio', headerTitle: 'BloodLink Donante' }}
      />
      <Tab.Screen
        name="Triage"
        component={TriageStepperScreen}
        options={{ title: 'Triage', headerTitle: 'Evaluación de Triage' }}
      />
      <Tab.Screen
        name="Citas"
        component={AppointmentsScreen}
        options={{ title: 'Citas', headerTitle: 'Gestión de Citas' }}
      />
      <Tab.Screen
        name="Billetera"
        component={WalletScreen}
        options={{ title: 'Billetera', headerTitle: 'Puntos y Recompensas' }}
      />
      <Tab.Screen
        name="Asistente"
        component={AssistantScreen}
        options={{ title: 'IA Asistente', headerTitle: 'Asistente Médico IA' }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ title: 'Perfil', headerTitle: 'Perfil del Donante' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  logoutHeaderBtn: {
    paddingRight: 16,
    paddingLeft: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
