import React from 'react';
import { View, StyleSheet } from 'react-native';
import AuthTextField from './AuthTextField';
import AuthPhotoPicker from './AuthPhotoPicker';

export default function RegisterStep1Info({ control, profilePicture, onChangePicture, profilePictureError }) {
  return (
    <View>
      <AuthPhotoPicker value={profilePicture} onChange={onChangePicture} error={profilePictureError} />

      <View style={styles.row}>
        <AuthTextField
          control={control}
          name="name"
          placeholder="Nombre"
          icon="person-outline"
          containerStyle={styles.halfField}
          rules={{
            required: 'El nombre es obligatorio',
            maxLength: { value: 25, message: 'Máximo 25 caracteres' },
            pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: 'Solo letras y espacios' },
          }}
        />

        <AuthTextField
          control={control}
          name="surname"
          placeholder="Apellido"
          icon="person-outline"
          containerStyle={styles.halfField}
          rules={{
            required: 'El apellido es obligatorio',
            maxLength: { value: 25, message: 'Máximo 25 caracteres' },
            pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: 'Solo letras y espacios' },
          }}
        />
      </View>

      <AuthTextField
        control={control}
        name="username"
        placeholder="Usuario"
        icon="person-outline"
        autoCapitalize="none"
        rules={{
          required: 'El nombre de usuario es obligatorio',
          maxLength: { value: 50, message: 'Máximo 50 caracteres' },
        }}
      />

      <AuthTextField
        control={control}
        name="email"
        placeholder="Correo electrónico"
        icon="mail-outline"
        autoCapitalize="none"
        keyboardType="email-address"
        rules={{
          required: 'El correo es obligatorio',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    flex: 0.48,
  },
});
