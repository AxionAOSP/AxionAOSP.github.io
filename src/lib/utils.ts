export function getAssetUrl(path: string) {
  const basePath = process.env.NODE_ENV === 'production' ? '/axion' : '';
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Ensure path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${cleanPath}`;
}
