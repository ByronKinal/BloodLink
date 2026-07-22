import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../features/auth/hooks/useAuth';
import PrimaryButton from './PrimaryButton';

export default function SessionPlaceholderScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sesión iniciada</Text>
      <Text style={styles.subtitle}>{user?.name ? `Hola, ${user.name}` : 'Bienvenido'}</Text>
      <PrimaryButton label="Cerrar sesión" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
});
