export const VALID_BLOOD_TYPES = Object.freeze([
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
]);

export const BLOOD_COMPATIBILITY_MATRIX = Object.freeze({
  'O-': Object.freeze({
    canReceiveFrom: Object.freeze(['O-']),
    canDonateTo: Object.freeze(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']),
  }),
  'O+': Object.freeze({
    canReceiveFrom: Object.freeze(['O+', 'O-']),
    canDonateTo: Object.freeze(['O+', 'A+', 'B+', 'AB+']),
  }),
  'A-': Object.freeze({
    canReceiveFrom: Object.freeze(['A-', 'O-']),
    canDonateTo: Object.freeze(['A+', 'A-', 'AB+', 'AB-']),
  }),
  'A+': Object.freeze({
    canReceiveFrom: Object.freeze(['A+', 'A-', 'O+', 'O-']),
    canDonateTo: Object.freeze(['A+', 'AB+']),
  }),
  'B-': Object.freeze({
    canReceiveFrom: Object.freeze(['B-', 'O-']),
    canDonateTo: Object.freeze(['B+', 'B-', 'AB+', 'AB-']),
  }),
  'B+': Object.freeze({
    canReceiveFrom: Object.freeze(['B+', 'B-', 'O+', 'O-']),
    canDonateTo: Object.freeze(['B+', 'AB+']),
  }),
  'AB-': Object.freeze({
    canReceiveFrom: Object.freeze(['AB-', 'A-', 'B-', 'O-']),
    canDonateTo: Object.freeze(['AB+', 'AB-']),
  }),
  'AB+': Object.freeze({
    canReceiveFrom: Object.freeze([
      'AB+',
      'AB-',
      'A+',
      'A-',
      'B+',
      'B-',
      'O+',
      'O-',
    ]),
    canDonateTo: Object.freeze(['AB+']),
  }),
});

export const normalizeBloodType = (bloodType) =>
  String(bloodType || '').trim().toUpperCase();

export const isValidBloodType = (bloodType) =>
  VALID_BLOOD_TYPES.includes(normalizeBloodType(bloodType));

export const getCompatibleDonorTypes = (requiredBloodType) => {
  const normalizedRequiredType = normalizeBloodType(requiredBloodType);
  return BLOOD_COMPATIBILITY_MATRIX[normalizedRequiredType]?.canReceiveFrom || [];
};

export const canDonateToRecipient = (donorBloodType, recipientBloodType) => {
  const normalizedDonorType = normalizeBloodType(donorBloodType);
  const normalizedRecipientType = normalizeBloodType(recipientBloodType);

  const donorRules = BLOOD_COMPATIBILITY_MATRIX[normalizedDonorType];
  if (!donorRules) {
    return false;
  }

  return donorRules.canDonateTo.includes(normalizedRecipientType);
};
