const fs = require("fs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const dateFns = require("date-fns");

// Replace these values with your actual data
const keyId = "3X8FFDXJP3";
const issuerId = "daeb9d0e-673f-47cf-82c2-43bead2c0c38";
const privateKey = fs.readFileSync("./keys/AuthKey_3X8FFDXJP3.p8");

const payload = {
  iss: issuerId,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 20 * 60,
  aud: "appstoreconnect-v1",
};

const headers = { kid: keyId };

const token = jwt.sign(payload, privateKey, {
  algorithm: "ES256",
  header: headers,
});

// Replace with your actual data
const APP_ID = "6502628526";
const AUTH_TOKEN = token;

const fetchData = async () => {
  try {
    const response = await axios.get(
      `https://api.appstoreconnect.apple.com/v1/apps/${APP_ID}/appStoreVersions`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        params: {
          include: "appStoreVersionLocalizations",
          "fields[apps]": "appInfos,appClips",
          "fields[appStoreVersions]": "versionString,createdDate",
          "fields[appStoreVersionLocalizations]": "locale,description,keywords",
        },
      }
    );

    const inforesponse = await axios.get(
      `https://api.appstoreconnect.apple.com/v1/apps/${APP_ID}/appInfos`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        params: {
          limit: 200,
          include: "app,appInfoLocalizations",
          "fields[apps]": "appStoreVersions",
          "fields[appInfoLocalizations]": "name,subtitle,locale,appInfo",
        },
      }
    );

    const data = response.data;
    const dataInfos = inforesponse.data;
    fs.writeFileSync("data.json", JSON.stringify(data, null, 1));
    // // console.log(JSON.stringify(dataInfos,null,1))
    fs.writeFileSync("app_info.json", JSON.stringify(dataInfos, null, 1));
    // for (const item of dataInfos.data) {
    //   const locales = item.relationships.appInfoLocalizations.data
    //   for (const locale of locales) {
    //     console.log(locale.id)
    //   }

    // }

    const versions: string[] = [];
    const dates: string[] = [];
    const d = data.data as any[];

    d.forEach((item) => {
      // console.log(JSON.stringify(item,null,1))
      versions.unshift(item.attributes.versionString);
      dates.unshift(item.attributes.createdDate);
    });

    const items = data.included as {
      attributes: { locale: string; keywords: string; description: string };
    }[];

    const lines: string[] = [];

    items
      .filter((item) => {
        return item.attributes.locale === "en-US";
      })
      .reverse()
      .forEach((item, index) => {
        // console.log(JSON.stringify(item,null,1))
        lines.push(`## Version ${versions[index]}`);
        // lines.push(`### Date`);
        // lines.push(dateFns.format(new Date(dates[index]), "yyyy-MM-dd"));
        // lines.push("");

        // lines.push(`### Description`);
        // lines.push(item.attributes.description.replace(/\n/g, ""));
        // lines.push("");

        lines.push(`### Keywords`);
        lines.push(item.attributes.keywords);
        lines.push("");
      });

    fs.writeFileSync("app_history.md", lines.join("\n"));
    console.log("Data has been written to app_history.md");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

fetchData();
