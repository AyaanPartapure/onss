
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

export const openNoteFile = async (fileUrl) => {
  if (!fileUrl || !/^https?:\/\//i.test(fileUrl)) {
    throw new Error('Invalid file URL');
  }

  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url: fileUrl });
    return;
  }

  // Website: navigate directly to the file URL.
  // The server determines whether to download or display it.
  window.location.assign(fileUrl);
};
