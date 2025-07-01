
export interface ImageValidationResult {
  url: string;
  isValid: boolean;
  error?: string;
  statusCode?: number;
}

export const validateImageUrl = async (url: string): Promise<ImageValidationResult> => {
  try {
    console.log('Validating image URL:', url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      method: 'HEAD', // Only check headers, don't download the image
      signal: controller.signal,
      headers: {
        'User-Agent': 'Receipt-App-Image-Validator/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    
    const isValid = response.ok && response.status < 400;
    
    return {
      url,
      isValid,
      statusCode: response.status,
      error: isValid ? undefined : `HTTP ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    console.error('Image validation failed for URL:', url, error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      url,
      isValid: false,
      error: errorMessage
    };
  }
};

export const validateMultipleImages = async (urls: string[]): Promise<ImageValidationResult[]> => {
  console.log('Validating multiple images:', urls.length);
  
  // Use Promise.allSettled to handle all validations, even if some fail
  const results = await Promise.allSettled(
    urls.map(url => validateImageUrl(url))
  );
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        url: urls[index],
        isValid: false,
        error: result.reason?.message || 'Validation failed'
      };
    }
  });
};

export const getInvalidImageUrls = (results: ImageValidationResult[]): string[] => {
  return results
    .filter(result => !result.isValid)
    .map(result => result.url);
};
