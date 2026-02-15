import { toast } from 'sonner';

export type Platform = 'windows' | 'mac' | 'linux' | 'android' | 'ios' | 'unknown';

export function detectPlatform(): Platform {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();

  if (/android/.test(userAgent)) {
    return 'android';
  }
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  }
  if (/mac/.test(platform)) {
    return 'mac';
  }
  if (/win/.test(platform)) {
    return 'windows';
  }
  if (/linux/.test(platform)) {
    return 'linux';
  }
  
  return 'unknown';
}

export function getDownloadLink(platform: Platform): string {
  const downloads = {
    windows: 'https://download.displayextended.com/DisplayExtended-Setup-1.0.exe',
    mac: 'https://download.displayextended.com/DisplayExtended-1.0.dmg',
    linux: 'https://download.displayextended.com/DisplayExtended-1.0.AppImage',
    android: 'https://play.google.com/store/apps/details?id=com.displayextended',
    ios: 'https://apps.apple.com/app/displayextended/id123456789',
    unknown: '/download',
  };
  
  return downloads[platform];
}

export function getPlatformName(platform: Platform): string {
  const names = {
    windows: 'Windows',
    mac: 'macOS',
    linux: 'Linux',
    android: 'Android',
    ios: 'iOS',
    unknown: 'Your Platform',
  };
  
  return names[platform];
}

export function handleDownload() {
  const platform = detectPlatform();
  const platformName = getPlatformName(platform);
  
  toast.success(`Starting download for ${platformName}`, {
    description: 'DisplayExtended v1.0 will begin downloading shortly',
  });
  
  // In a real app, this would trigger the actual download
  // window.location.href = getDownloadLink(platform);
}
