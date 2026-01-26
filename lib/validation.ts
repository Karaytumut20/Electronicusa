import { AdFormData } from '@/types';

type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

export function validateAdForm(data: AdFormData, categorySlug: string): ValidationResult {
  const errors: Record<string, string> = {};

  // Basic Checks
  if (!data.title || data.title.length < 5) errors.title = "Title is too short.";
  if (data.title && data.title.length > 100) errors.title = "Title is too long.";
  if (!data.description || data.description.length < 20) errors.description = "Description is too short.";

  // Price Check
  if (!data.price || Number(data.price) <= 0) errors.price = "Please enter a valid price.";

  if (!data.city) errors.city = "Please select a city.";
  if (!data.district) errors.district = "Please select a district.";

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}