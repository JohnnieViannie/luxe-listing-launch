
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Save } from "lucide-react";

interface AdminSettingsProps {
  onSettingsUpdate?: () => void;
}

const AdminSettings = ({ onSettingsUpdate }: AdminSettingsProps) => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [settings, setSettings] = useState({
    adminPassword: "",
    flutterwavePublicKey: "",
    flutterwaveSecretKey: "",
    flutterwaveEncryptionKey: "",
  });

  useEffect(() => {
    // Load existing settings from localStorage or API
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveSettings = () => {
    try {
      // Save to localStorage (in production, this should be saved to a secure backend)
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      toast.success("Settings saved successfully!");
      onSettingsUpdate?.();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="adminPassword">Admin Password</Label>
            <div className="relative">
              <Input
                id="adminPassword"
                type={showPasswords ? "text" : "password"}
                value={settings.adminPassword}
                onChange={(e) => handleInputChange("adminPassword", e.target.value)}
                placeholder="Enter admin password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flutterwave Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="flutterwavePublicKey">Public Key</Label>
            <Input
              id="flutterwavePublicKey"
              type={showPasswords ? "text" : "password"}
              value={settings.flutterwavePublicKey}
              onChange={(e) => handleInputChange("flutterwavePublicKey", e.target.value)}
              placeholder="Enter Flutterwave public key"
            />
          </div>

          <div>
            <Label htmlFor="flutterwaveSecretKey">Secret Key</Label>
            <Input
              id="flutterwaveSecretKey"
              type={showPasswords ? "text" : "password"}
              value={settings.flutterwaveSecretKey}
              onChange={(e) => handleInputChange("flutterwaveSecretKey", e.target.value)}
              placeholder="Enter Flutterwave secret key"
            />
          </div>

          <div>
            <Label htmlFor="flutterwaveEncryptionKey">Encryption Key</Label>
            <Input
              id="flutterwaveEncryptionKey"
              type={showPasswords ? "text" : "password"}
              value={settings.flutterwaveEncryptionKey}
              onChange={(e) => handleInputChange("flutterwaveEncryptionKey", e.target.value)}
              placeholder="Enter Flutterwave encryption key"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPasswords(!showPasswords)}
            >
              {showPasswords ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPasswords ? "Hide" : "Show"} Keys
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            More configuration options will be added here as needed.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
