
import { AzureConfig } from './types.ts';

// Helper function to parse Azure connection string
export function parseConnectionString(connectionString: string): AzureConfig {
  const parts = connectionString.split(';');
  const config: { [key: string]: string } = {};
  
  parts.forEach(part => {
    const [key, value] = part.split('=');
    if (key && value) {
      config[key] = value;
    }
  });
  
  return {
    accountName: config.AccountName,
    accountKey: config.AccountKey,
    endpointSuffix: config.EndpointSuffix || 'core.windows.net'
  };
}

// Helper function to create Azure Storage REST API signature
export async function createSharedKeySignature(
  accountName: string,
  accountKey: string,
  method: string,
  url: string,
  headers: { [key: string]: string },
  contentLength: number
): Promise<string> {
  const dateString = new Date().toUTCString();
  headers['x-ms-date'] = dateString;
  headers['x-ms-version'] = '2020-04-08';
  
  const canonicalizedHeaders = Object.keys(headers)
    .filter(key => key.startsWith('x-ms-'))
    .sort()
    .map(key => `${key}:${headers[key]}`)
    .join('\n');
  
  const urlPath = new URL(url).pathname;
  const canonicalizedResource = `/${accountName}${urlPath}`;
  
  const stringToSign = [
    method,
    '', // Content-Encoding
    '', // Content-Language
    contentLength || '', // Content-Length
    '', // Content-MD5
    headers['Content-Type'] || '', // Content-Type
    '', // Date
    '', // If-Modified-Since
    '', // If-Match
    '', // If-None-Match
    '', // If-Unmodified-Since
    '', // Range
    canonicalizedHeaders,
    canonicalizedResource
  ].join('\n');

  const keyData = Uint8Array.from(atob(accountKey), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(stringToSign));
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  return `SharedKey ${accountName}:${signatureBase64}`;
}
