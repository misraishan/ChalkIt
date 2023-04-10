import { v4 as uuidv4 } from "uuid";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});

export default async function uploadImage(file: File) {
  const base64Data = Buffer.from(await file.arrayBuffer());
  const type = file?.type?.split("/")[1];

  const image = await imagekit
    .upload({
      fileName: `${uuidv4()}}.${type || "jpeg"}`,
      // file: base64Data.toString("base64"),
      file: base64Data.toString("base64"),
      folder: "/chalkit/notes/",
    })
    .then((res) => {
      console.log(res);
      return res;
    });

  return image["url"];
}
