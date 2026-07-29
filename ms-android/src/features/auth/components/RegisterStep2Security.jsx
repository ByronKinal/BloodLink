import React from 'react';
import { View } from 'react-native';
import AuthTextField from './AuthTextField';
import AuthSelectField from './AuthSelectField';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RegisterStep2Security({
  control,
  password,
  bloodType,
  onChangeBloodType,
  bloodTypeError,
}) {
  return (
    <View>
      <AuthTextField
        control={control}
        name="password"
        placeholder="Contraseña"
        icon="lock-closed-outline"
        secureTextEntry
        autoCapitalize="none"
        rules={{
          required: 'La contraseña es obligatoria',
          minLength: { value: 8, message: 'Debe tener al menos 8 caracteres' },
        }}
      />

      <AuthTextField
        control={control}
        name="confirmPassword"
        placeholder="Confirmar contraseña"
        icon="lock-closed-outline"
        secureTextEntry
        autoCapitalize="none"
        rules={{
          required: 'Confirma tu contraseña',
          validate: (value) => value === password || 'Las contraseñas no coinciden',
        }}
      />

      <AuthTextField
        control={control}
        name="phone"
        placeholder="Teléfono"
        icon="call-outline"
        keyboardType="number-pad"
        rules={{
          required: 'El teléfono es obligatorio',
          pattern: { value: /^\d{8}$/, message: 'Debe tener exactamente 8 dígitos' },
        }}
      />

      <AuthTextField
        control={control}
        name="zone"
        placeholder="Zona"
        icon="location-outline"
        rules={{ required: 'La zona es obligatoria' }}
      />

      <AuthSelectField
        icon="water-outline"
        placeholder="Tipo de sangre"
        value={bloodType}
        onChange={onChangeBloodType}
        options={BLOOD_TYPES}
        error={bloodTypeError}
      />
    </View>
  );
}
