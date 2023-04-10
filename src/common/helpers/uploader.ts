import { type Uploader } from "@milkdown/plugin-upload";
import type { Node } from "@milkdown/prose/model";
import uploadImage from "~/pages/api/images/uploadImage";

export const uploader: Uploader = async (files, schema) => {
  const images: File[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (!file) {
      continue;
    }

    if (!file.type.includes("image")) {
      continue;
    }

    images.push(file);
  }

  const nodes: Node[] = await Promise.all(
    images.map(async (image) => {
      const src = await uploadImage(image);
      const alt = image.name;
      return schema.nodes.image?.createAndFill({
        src,
        alt,
      }) as Node;
    })
  );

  return nodes;
};
