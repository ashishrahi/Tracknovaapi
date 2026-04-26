import { v2CompanyManageService } from "../services/index.js";

const HOUR_MS = 60 * 60 * 1000;

let started = false;

export function startSubscriptionExpiryJob() {
    if (started) return;
    started = true;

    const run = async () => {
        try {
            const r = await v2CompanyManageService.processSubscriptionExpiryService();
            if (r?.updated > 0) {
                console.log(`[subscription-expiry] marked ${r.updated} company subscription(s) as Expired`);
            }
        } catch (e) {
            console.error("[subscription-expiry]", e?.message || e);
        }
    };

    void run();
    setInterval(() => {
        void run();
    }, HOUR_MS);
}
