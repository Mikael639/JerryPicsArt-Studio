import { cookies } from "next/headers";

import AdminPhotosClient from "../../../components/admin/AdminPhotosClient";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "../../../lib/adminAuth";
import { listContactMessages } from "../../../lib/contactStore";
import { getAdminPhotos } from "../../../lib/photoRepository";
import {
  defaultAboutCopy,
  defaultHomeCopy,
  getAboutCopy,
  getCategories,
  getHomeCopy,
  getMaintenanceMode,
} from "../../../lib/siteSettings";

export const metadata = {
  title: "Administration | JerryPicsArt",
  robots: { index: false, follow: false },
};

export default async function AdminPhotosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value || "";
  const isAuthenticated = verifyAdminSessionToken(token);
  let initialPhotos = [];
  let initialMessages = [];
  let initialCategories = [];
  let initialHomeCopy = defaultHomeCopy;
  let initialAboutCopy = defaultAboutCopy;
  let initialMaintenanceMode = false;

  if (isAuthenticated) {
    try {
      const [photos, messages, categories, homeCopy, aboutCopy, maintenanceMode] = await Promise.all([
        getAdminPhotos(),
        listContactMessages(),
        getCategories(),
        getHomeCopy(),
        getAboutCopy(),
        getMaintenanceMode(),
      ]);
      initialPhotos = photos;
      initialMessages = messages;
      initialCategories = categories;
      initialHomeCopy = homeCopy;
      initialAboutCopy = aboutCopy;
      initialMaintenanceMode = maintenanceMode;
    } catch {
      initialPhotos = [];
      initialMessages = [];
    }
  }

  return (
    <AdminPhotosClient
      initialAuthenticated={isAuthenticated}
      initialPhotos={initialPhotos}
      initialMessages={initialMessages}
      initialCategories={initialCategories}
      initialHomeCopy={initialHomeCopy}
      initialAboutCopy={initialAboutCopy}
      initialMaintenanceMode={initialMaintenanceMode}
    />
  );
}
