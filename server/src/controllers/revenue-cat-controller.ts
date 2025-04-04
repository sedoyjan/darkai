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

const sample = {
  event: {
    event_timestamp_ms: 1716485890150,
    product_id: "test_product",
    period_type: "NORMAL",
    purchased_at_ms: 1716485890150,
    expiration_at_ms: 1716493090150,
    environment: "SANDBOX",
    entitlement_id: null,
    entitlement_ids: null,
    presented_offering_id: null,
    transaction_id: null,
    original_transaction_id: null,
    is_family_share: null,
    country_code: "US",
    app_user_id: "c621efb7-2860-44af-9c82-0890ee5fc804",
    aliases: [
      "c621efb7-2860-44af-9c82-0890ee5fc804",
      "0fe3b5a6-e981-4d4c-97cf-f7583378c866",
    ],
    original_app_user_id: "c621efb7-2860-44af-9c82-0890ee5fc804",
    currency: null,
    price: null,
    price_in_purchased_currency: null,
    subscriber_attributes: {
      $email: {
        value: "tuxedo@revenuecat.com",
        updated_at_ms: 1716485890150,
      },
      $displayName: {
        value: "Mister Mistoffelees",
        updated_at_ms: 1716485890150,
      },
      $phoneNumber: {
        value: "+19795551234",
        updated_at_ms: 1716485890150,
      },
      my_custom_attribute_1: {
        value: "catnip",
        updated_at_ms: 1716485890150,
      },
    },
    store: "APP_STORE",
    takehome_percentage: null,
    offer_code: null,
    tax_percentage: null,
    commission_percentage: null,
    type: "TEST",
    id: "5195C61B-277C-497A-8AC4-37C6B3AD606F",
    app_id: "app22223041de",
  },
  api_version: "1.0",
};
