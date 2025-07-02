import api from "@/lib/api";
import { toast } from "sonner";

// Interface for checkout settings to ensure type safety
interface CheckoutSettings {
  shippingRate: number;
  taxRate: number;
  usdToUgxRate: number;
  flutterwavePublicKey: string;
  flutterwaveSecretKey: string;
  flutterwaveEncryptionKey: string;
  adminPassword: string;
}

// Fallback values in case API call fails
const FALLBACK_SETTINGS: CheckoutSettings = {
  shippingRate: 0, // Default shipping cost in USD
  taxRate: 0, // Default tax rate (10%)
  usdToUgxRate: 3700, // Default USD to UGX conversion rate
  flutterwavePublicKey: "",
  flutterwaveSecretKey: "",
  flutterwaveEncryptionKey: "",
  adminPassword: "",
};

/**
 * Fetches checkout settings from the API
 * @returns {Promise<CheckoutSettings>} Checkout settings with shipping rate, tax rate, and USD to UGX rate
 */
export const getAdminSettings = async (): Promise<CheckoutSettings> => {
  try {
    const response = await api.get("/api/checkout-settings/", {
      timeout: 5000,
    });
    const data = response.data;

    // Map snake_case to camelCase and ensure numbers
    const shippingRate = Number(data.shippingRate ?? data.SHIPPING_RATE ?? 0);
    const taxRateRaw = data.taxRate ?? data.TAX_RATE ?? 0;
    // If taxRate is a percent (e.g., 12), convert to decimal (0.12)
    const taxRate = taxRateRaw > 1 ? taxRateRaw / 100 : Number(taxRateRaw);
    const usdToUgxRate = Number(data.usdToUgxRate ?? data.USD_TO_UGX_RATE ?? 3700);

    // Get keys from API response
    const flutterwavePublicKey = data.flutterwavePublicKey ?? data.FLUTTERWAVE_PUBLIC_KEY ?? "";
    const flutterwaveSecretKey = data.flutterwaveSecretKey ?? data.FLUTTERWAVE_SECRET_KEY ?? "";
    const flutterwaveEncryptionKey = data.flutterwaveEncryptionKey ?? data.FLUTTERWAVE_ENCRYPTION_KEY ?? "";
    const adminPassword = data.adminPassword ?? data.ADMIN_PASSWORD ?? "";

    if (
      typeof shippingRate !== "number" ||
      typeof taxRate !== "number" ||
      typeof usdToUgxRate !== "number" ||
      shippingRate < 0 ||
      taxRate < 0 ||
      usdToUgxRate <= 0
    ) {
      throw new Error("Invalid checkout settings received from API");
    }

    return {
      shippingRate,
      taxRate,
      usdToUgxRate,
      flutterwavePublicKey,
      flutterwaveSecretKey,
      flutterwaveEncryptionKey,
      adminPassword,
    };
  } catch (error: any) {
    console.error("Error fetching checkout settings:", error.message || error);
    toast.error("Failed to load checkout settings. Using default values.", {
      description: "Please contact support if this issue persists.",
    });

    return FALLBACK_SETTINGS;
  }
};
