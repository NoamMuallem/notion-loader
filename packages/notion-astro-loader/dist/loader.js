import { Client, isFullPage, iteratePaginatedAPI } from "@notionhq/client";
import { propertiesSchemaForDatabase } from "./database-properties.js";
import { richTextToPlainText } from "./format.js";
import { handleImageFileProperty } from "./image-handler.js";
import { buildProcessor, renderNotionEntry, } from "./render.js";
import { notionPageSchema } from "./schemas/page.js";
/**
 * Notion loader for the Astro Content Layer API.
 *
 * It allows you to load pages from a Notion database then render them as pages in a collection.
 *
 * @param options Takes in same options as `notionClient.databases.query` and `Client` constructor.
 *
 * @example
 * // src/content/config.ts
 * import { defineCollection } from "astro:content";
 * import { notionLoader } from "notion-astro-loader";
 *
 * const database = defineCollection({
 *   loader: notionLoader({
 *     auth: import.meta.env.NOTION_TOKEN,
 *     database_id: import.meta.env.NOTION_DATABASE_ID,
 *     filter: {
 *       property: "Hidden",
 *       checkbox: { equals: false },
 *     }
 *   }),
 * });
 */
export function notionLoader({ saveImagesAsStrings = false, database_id, filter_properties, sorts, filter, archived, rehypePlugins = [], ...clientOptions }) {
    const notionClient = new Client(clientOptions);
    function pageNameForLogger(page) {
        const title = page.properties.Name && "title" in page.properties.Name
            ? richTextToPlainText(page.properties.Name.title)
            : undefined;
        return `page ${page.id} (Name ${title ?? "unknown"})`;
    }
    const resolvedRehypePlugins = Promise.all(rehypePlugins.map(async (config) => {
        let plugin;
        let options;
        if (Array.isArray(config)) {
            [plugin, options] = config;
        }
        else {
            plugin = config;
        }
        if (typeof plugin === "string") {
            plugin = (await import(plugin)).default;
        }
        return [plugin, options];
    }));
    const processor = buildProcessor(resolvedRehypePlugins);
    return {
        name: "notion-loader",
        schema: async () => notionPageSchema({
            properties: await propertiesSchemaForDatabase(notionClient, database_id),
        }),
        async load({ store, logger, parseData, config }) {
            logger.info("Loading notion pages");
            console.log("config", config.markdown);
            const existingPageIds = new Set(store.keys());
            const renderPromises = [];
            const pages = iteratePaginatedAPI(notionClient.databases.query, {
                database_id,
                filter_properties,
                sorts,
                filter,
                archived,
            });
            for await (const page of pages) {
                if (!isFullPage(page)) {
                    continue;
                }
                existingPageIds.delete(page.id);
                const existingPage = store.get(page.id);
                // If the page has been updated, re-render it
                if (existingPage?.digest !== page.last_edited_time) {
                    const data = await parseData({
                        id: page.id,
                        data: {
                            icon: page.icon,
                            cover: page.cover,
                            archived: page.archived,
                            in_trash: page.in_trash,
                            url: page.url,
                            public_url: page.public_url,
                            properties: page.properties,
                        },
                    });
                    logger.debug(`Rendering ${pageNameForLogger(page)}`);
                    const renderPromise = renderNotionEntry(notionClient, processor, page.id, saveImagesAsStrings)
                        .catch((error) => {
                        const errorMessage = error instanceof Error
                            ? error.message
                            : typeof error === "string"
                                ? error
                                : "Unknown error";
                        logger.error(`Failed to render ${pageNameForLogger(page)}: ${errorMessage}`);
                        console.error(error);
                        return undefined;
                    })
                        .then(async (rendered) => {
                        if (rendered !== undefined) {
                            logger.debug(`Rendered ${pageNameForLogger(page)}`);
                        }
                        if (saveImagesAsStrings) {
                            await handleImageFileProperty(data);
                        }
                        store.set({
                            id: page.id,
                            digest: page.last_edited_time,
                            data,
                            rendered,
                        });
                    });
                    renderPromises.push(renderPromise);
                }
            }
            // Remove any pages that have been deleted
            for (const deletedPageId of existingPageIds) {
                store.delete(deletedPageId);
            }
            // Wait for rendering to complete
            await Promise.all(renderPromises);
        },
    };
}
