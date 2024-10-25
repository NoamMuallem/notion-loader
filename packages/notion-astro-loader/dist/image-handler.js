import { awaitAll, listBlocks } from "./render.js";
export const imageURLToBase64 = async (url) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = response.headers.get("content-type");
    return `data:${mimeType};base64,${base64}`;
};
export const handleImageFileProperty = async (data) => {
    const properties = data.properties;
    if (properties) {
        await Promise.all(Object.keys(properties).map(async (key) => {
            if (properties[key]?.type === "files") {
                const propertyFiles = properties[key].files;
                await Promise.all(propertyFiles.map(async (file, index) => {
                    let url = file.type === "file"
                        ? file.file.url
                        : file.type === "external"
                            ? file.external.url
                            : undefined;
                    if (url) {
                        // workaround notion poor typing
                        if (key in properties &&
                            properties[key] &&
                            "files" in properties[key] &&
                            properties[key].files &&
                            properties[key].files[index] &&
                            "file" in properties[key].files[index] &&
                            properties[key].files[index].file) {
                            properties[key].files[index].file.url =
                                await imageURLToBase64(url);
                        }
                    }
                }));
            }
        }));
    }
};
export const handleImageBlocks = async (blocks) => {
    const blocksArray = await awaitAll(blocks);
    await Promise.all(blocksArray.map(async (block, index) => {
        if (!block || block.type !== "image" || block.image.type !== "file")
            return;
        const url = block.image.file.url;
        if (!url)
            return;
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const mimeType = response.headers.get("content-type");
        blocksArray[index] = {
            ...block,
            image: {
                type: block.image.type,
                [block.image.type]: `data:${mimeType};base64,${base64}`,
            },
        };
    }));
    return blocksArray;
};
