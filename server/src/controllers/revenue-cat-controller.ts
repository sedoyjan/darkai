import Elysia from "elysia";
import { get } from "lodash";
import { db } from "../db";

export const RevenueCatController = (app: Elysia) => {
  app.post("/hooks/revenue-cat", async (context) => {
    // console.log("RevenueCat Hook", JSON.stringify(context.body, null, 2));
    const appUserID = get(context.body, "event.app_user_id", "");
    const expirationAtMs = get(context.body, "event.expiration_at_ms", 0);
    const productId = get(context.body, "event.product_id", "");
    const type = get(context.body, "event.type", "");

    console.log("************ Handling RevenueCat Event ************");
    // console.log(JSON.stringify(context.body, null, 1));

    if (
      appUserID &&
      expirationAtMs &&
      productId &&
      ["INITIAL_PURCHASE", "RENEWAL"].includes(type)
    ) {
      console.log("Handling RevenueCat Event");
      console.log("App User ID", appUserID);
      console.log("Expiration At", new Date(expirationAtMs).toISOString());
      console.log("Product ID", productId);
      console.log("Type", type);

      const user = await db.user.findUnique({
        where: {
          appUserId: appUserID,
        },
      });
      console.log("User", user);
      if (user) {
        db.user.update({
          where: {
            id: user.id,
          },
          data: {
            expirationAtMs,
          },
        });
      }
    }
  });

  return Promise.resolve(app);
};
