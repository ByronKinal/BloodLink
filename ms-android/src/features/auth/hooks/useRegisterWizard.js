import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from './useAuth';
import { getErrorMessage } from '../../../shared/utils/apiError';

const STEP_1_FIELDS = ['name', 'surname', 'username', 'email'];

export function useRegisterWizard({ onSuccess } = {}) {
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [bloodTypeError, setBloodTypeError] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureError, setProfilePictureError] = useState('');

  const {
    control,
    handleSubmit,
    trigger,
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

  const handleNext = async () => {
    const stepOneValid = await trigger(STEP_1_FIELDS);
    if (!profilePicture) {
      setProfilePictureError('La foto de perfil es obligatoria');
    }
    if (stepOneValid && profilePicture) {
      setProfilePictureError('');
      setStep(2);
    }
  };

  const handlePrev = () => setStep(1);

  const onSubmit = handleSubmit(async (values) => {
    setServerError('');
    setBloodTypeError('');

    if (!bloodType) {
      setBloodTypeError('Selecciona un tipo de sangre');
      return;
    }

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
      await signUp(formData);
      onSuccess?.(values.email);
    } catch (error) {
      setServerError(getErrorMessage(error, 'No se pudo completar el registro. Intenta de nuevo.'));
    }
  });

  return {
    control,
    step,
    handleNext,
    handlePrev,
    onSubmit,
    isSubmitting,
    password,
    serverError,
    bloodType,
    setBloodType,
    bloodTypeError,
    profilePicture,
    setProfilePicture,
    profilePictureError,
  };
}
