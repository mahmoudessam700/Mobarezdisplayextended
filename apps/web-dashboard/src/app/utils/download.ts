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
  // These are external links to the binaries. 
  // For this project, we prioritize the Agent/Desktop app.
  const downloads = {
    windows: 'https://github.com/mahmoudessam700/Mobarezdisplayextended/releases/download/v1.0.0/DisplayExtended-Setup.exe',
    mac: 'https://github.com/mahmoudessam700/Mobarezdisplayextended/releases/download/v1.0.0/DisplayExtended.dmg',
    linux: 'https://github.com/mahmoudessam700/Mobarezdisplayextended/releases/download/v1.0.0/DisplayExtended.AppImage',
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

export async function handleDownload() {
  const platform = detectPlatform();
  const platformName = getPlatformName(platform);
  const downloadUrl = getDownloadLink(platform);

  toast.info(`Preparing download for ${platformName}`, {
    description: 'Verifying release availability...',
  });

  // Check if the link exists before redirecting (optional but helpful for devs)
  try {
    const response = await fetch(downloadUrl, { method: 'HEAD' });
    if (response.status === 404 && downloadUrl.includes('github.com')) {
      toast.error('Release Not Found', {
        description: 'The v1.0.0 release has not been published to GitHub yet. Please check RELEASE_GUIDE.md.',
        duration: 8000,
      });
      return;
    }
  } catch (e) {
    // If CORS prevents HEAD, we'll just try to redirect anyway
    console.warn('Could not verify download link availability:', e);
  }

  toast.success(`Starting download for ${platformName}`, {
    description: 'DisplayExtended v1.0 will begin downloading shortly',
  });

  // Trigger the actual download
  setTimeout(() => {
    window.location.href = downloadUrl;
  }, 1000);
}
