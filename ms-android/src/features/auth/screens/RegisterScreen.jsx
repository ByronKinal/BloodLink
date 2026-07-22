import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import * as authApi from '../api/auth.api';
import FormField from '../../../shared/components/FormField';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import Banner from '../../../shared/components/Banner';
import BloodTypeSelector from '../../../shared/components/BloodTypeSelector';
import ProfilePicturePicker from '../../../shared/components/ProfilePicturePicker';

export default function RegisterScreen({ navigation }) {
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [bloodTypeError, setBloodTypeError] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureError, setProfilePictureError] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      zone: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (values) => {
    setServerError('');
    setSuccessMessage('');
    setBloodTypeError('');
    setProfilePictureError('');

    let hasError = false;

    if (!bloodType) {
      setBloodTypeError('Selecciona un tipo de sangre');
      hasError = true;
    }

    if (!profilePicture) {
      setProfilePictureError('La foto de perfil es obligatoria');
      hasError = true;
    }

    if (hasError) return;

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('surname', values.surname);
    formData.append('username', values.username);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('phone', values.phone);
    formData.append('bloodType', bloodType);
    formData.append('zone', values.zone);
    formData.append('profilePicture', {
      uri: profilePicture.uri,
      name: profilePicture.fileName || 'profile.jpg',
      type: profilePicture.mimeType || 'image/jpeg',
    });

    try {
      await authApi.register(formData);
      setSuccessMessage('Registro exitoso. Revisa tu correo para verificar tu cuenta e inicia sesión.');
    } catch (error) {
      setServerError(error?.response?.data?.message || 'No se pudo completar el registro. Intenta de nuevo.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <FormField
        control={control}
        name="name"
        label="Nombre"
        placeholder="María"
        rules={{
          required: 'El nombre es obligatorio',
          maxLength: { value: 25, message: 'Máximo 25 caracteres' },
          pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: 'Solo letras y espacios' },
        }}
      />

      <FormField
        control={control}
        name="surname"
        label="Apellido"
        placeholder="García"
        rules={{
          required: 'El apellido es obligatorio',
          maxLength: { value: 25, message: 'Máximo 25 caracteres' },
          pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: 'Solo letras y espacios' },
        }}
      />

      <FormField
        control={control}
        name="username"
        label="Usuario"
        placeholder="mgarcia"
        autoCapitalize="none"
        rules={{
          required: 'El nombre de usuario es obligatorio',
          maxLength: { value: 50, message: 'Máximo 50 caracteres' },
        }}
      />

      <FormField
        control={control}
        name="email"
        label="Correo electrónico"
        placeholder="maria@correo.com"
        autoCapitalize="none"
        keyboardType="email-address"
        rules={{
          required: 'El correo es obligatorio',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' },
        }}
      />

      <FormField
        control={control}
        name="password"
        label="Contraseña"
        placeholder="********"
        secureTextEntry
        autoCapitalize="none"
        rules={{
          required: 'La contraseña es obligatoria',
          minLength: { value: 8, message: 'Debe tener al menos 8 caracteres' },
        }}
      />

      <FormField
        control={control}
        name="confirmPassword"
        label="Confirmar contraseña"
        placeholder="********"
        secureTextEntry
        autoCapitalize="none"
        rules={{
          required: 'Confirma tu contraseña',
          validate: (value) => value === password || 'Las contraseñas no coinciden',
        }}
      />

      <FormField
        control={control}
        name="phone"
        label="Teléfono"
        placeholder="55550000"
        keyboardType="number-pad"
        rules={{
          required: 'El teléfono es obligatorio',
          pattern: { value: /^\d{8}$/, message: 'Debe tener exactamente 8 dígitos' },
        }}
      />

      <FormField
        control={control}
        name="zone"
        label="Zona"
        placeholder="Zona 10"
        rules={{ required: 'La zona es obligatoria' }}
      />

      <BloodTypeSelector value={bloodType} onChange={setBloodType} error={bloodTypeError} />

      <ProfilePicturePicker value={profilePicture} onChange={setProfilePicture} error={profilePictureError} />

      <Banner message={serverError} />
      <Banner message={successMessage} tone="success" />

      <PrimaryButton label="Registrarme" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />

      <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  linkText: {
    color: '#D42040',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
  },
});
