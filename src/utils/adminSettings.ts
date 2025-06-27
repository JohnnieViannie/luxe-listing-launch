
interface AdminSettings {
  adminPassword: string;
  flutterwavePublicKey: string;
  flutterwaveSecretKey: string;
  flutterwaveEncryptionKey: string;
}

export const getAdminSettings = (): AdminSettings => {
  const savedSettings = localStorage.getItem('adminSettings');
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }
  
  return {
    adminPassword: "",
    flutterwavePublicKey: "",
    flutterwaveSecretKey: "",
    flutterwaveEncryptionKey: "",
  };
};

export const updateAdminSettings = (settings: Partial<AdminSettings>): void => {
  const currentSettings = getAdminSettings();
  const updatedSettings = { ...currentSettings, ...settings };
  localStorage.setItem('adminSettings', JSON.stringify(updatedSettings));
};

export const validateAdminPassword = (password: string): boolean => {
  const settings = getAdminSettings();
  return settings.adminPassword === password;
};

export const getFlutterwaveKeys = () => {
  const settings = getAdminSettings();
  return {
    publicKey: settings.flutterwavePublicKey,
    secretKey: settings.flutterwaveSecretKey,
    encryptionKey: settings.flutterwaveEncryptionKey,
  };
};
