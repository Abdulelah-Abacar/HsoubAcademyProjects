const subscribe_url = import.meta.env.VITE_APP_SUBSCRIBE_URL;
const vapied_public_key = import.meta.env.VITE_APP_VAPIED_PUBLIC_KEY;
const SubscriptionButton = () => {
  const publicKey = vapied_public_key;

  async function Subscribe() {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        alert("المتصفح لا يدعم الإشعارات أو عامل الخدمة Service Workers");
        return;
      }

      const registration = await navigator.serviceWorker.getRegistration();

      if (!registration) {
        alert("لم يتم تسجيل عامل خدمة لهذا الموقع.");
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        console.error("Rejected permission");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await fetch(subscribe_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      console.log(subscription);

      alert("تم الاشتراك بنجاح.");
    } catch (error) {
      console.log("Failed subscription: ", error);
    }
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return <button onClick={() => Subscribe()}>الاشتراك بالإشعارات</button>;
};

export default SubscriptionButton;
