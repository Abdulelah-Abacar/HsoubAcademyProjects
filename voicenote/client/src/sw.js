import { precacheAndRoute } from "workbox-precaching";

import { registerRoute } from "workbox-routing";
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import DbActions from "./components/database_actions/MongoActions";
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => true, //request.destination === "document",
  new NetworkFirst({ cacheName: "html-cache" })
);

self.addEventListener("sync", syncHandler);

async function syncHandler(event) {
  if (event.tag === "Waiting...") {
    console.log("Syncing..");

    try {
      await DbActions.Sync();
      console.log("Sync operation successful!");
      await DbActions.Push({
        title: "حدث تغيرات بالملاحظات",
        message: "تم إجراء بعض التغييرات في الملاحظات",
      });
    } catch (error) {
      console.log("Sync failed, retrying sync after 10 seconds...", error);

      setTimeout(async () => {
        try {
          await self.registration.sync.register("Waiting...");
          console.log("Sync re-registered successfully!");
        } catch (regError) {
          console.error("Failed to re-register sync:", regError);
        }
      }, 10000);
    }
  }
}

self.addEventListener("push", pushHandler);

function pushHandler(event) {
  let data = { title: "اشعار جديد", message: "تم نشر بيانات جديدة" };

  if (event.data) {
    data = JSON.parse(event.data.text());
  }

  self.registration.showNotification(data.title, {
    body: data.message,
    icon: "/icons/figma.png",
  });
}
