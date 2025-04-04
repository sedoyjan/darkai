import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

const save = async () => {
  db.user
    .findMany()
    .then((users) => {
      console.log(users);
    })
    .catch((error) => {
      console.log(error);
    });
};

save();
