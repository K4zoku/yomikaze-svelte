/// <reference types="@sveltejs/kit" />
/// <reference types="@types/service_worker_api" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

const app = initializeApp({
    apiKey: "AIzaSyAwyUISr1yPSHVjaZ6wXaioAzyTyJcjboQ",
    authDomain: "yomikaze-fcm.firebaseapp.com",
    projectId: "yomikaze-fcm",
    storageBucket: "yomikaze-fcm.appspot.com",
    messagingSenderId: "664668404741",
    appId: "1:664668404741:web:1e0d145913810d9c97306c"
});
const messaging = getMessaging(app);

const broadcast = new BroadcastChannel('yomikaze-worker');
const sw = self as unknown as ServiceWorkerGlobalScope;

onBackgroundMessage(messaging, payload => {
    console.log("Received push notification", payload);
    if (!payload.data) return;
    const { title, body, ...data } = payload.data;
    const options = {
        body,
        data: { ...data }
    }
    broadcast.postMessage({ type: 'notification', data: payload });
    return sw.registration.showNotification(title, options);
});

sw.addEventListener('notificationclick', (event: NotificationEvent) => {
    event.notification.close()
    const { path } = event.notification.data;
    if (!path) return;
    const url = new URL(path, sw.location.origin).href

    event.waitUntil(
        sw.clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((clients) => {
                const hadWindowToFocus = clients.some((client) => client.url === url ? (client.focus(), true) : false)
                if (!hadWindowToFocus) {
                    sw.clients.openWindow(url);
                }
            })
    );
});