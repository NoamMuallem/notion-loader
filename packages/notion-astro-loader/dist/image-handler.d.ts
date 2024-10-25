import { listBlocks } from "./render.js";
import type { PageProperty } from "./types.js";
export declare const imageURLToBase64: (url: string) => Promise<string>;
export declare const handleImageFileProperty: (data: {
    properties: Record<string, PageProperty>;
}) => Promise<void>;
type Blocks = Awaited<ReturnType<typeof listBlocks>>;
export declare const handleImageBlocks: (blocks: Blocks) => Promise<(import("@notionhq/client/build/src/api-endpoints.js").ParagraphBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").Heading1BlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").Heading2BlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").Heading3BlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").BulletedListItemBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").NumberedListItemBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").QuoteBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").ToDoBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").ToggleBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").TemplateBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").SyncedBlockBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").ChildPageBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").ChildDatabaseBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").EquationBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").CodeBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").CalloutBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").DividerBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").BreadcrumbBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").TableOfContentsBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").ColumnListBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").ColumnBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").LinkToPageBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").TableBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").TableRowBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").EmbedBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").BookmarkBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").VideoBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").PdfBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").FileBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").AudioBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").LinkPreviewBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").UnsupportedBlockObjectResponse | {
    image: {
        [x: string]: string;
        type: "file" | "external";
    };
    type: "image";
    parent: {
        type: "database_id";
        database_id: string;
    } | {
        type: "page_id";
        page_id: string;
    } | {
        type: "block_id";
        block_id: string;
    } | {
        type: "workspace";
        workspace: true;
    };
    object: "block";
    id: string;
    created_time: string;
    created_by: import("@notionhq/client/build/src/api-endpoints.js").PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: import("@notionhq/client/build/src/api-endpoints.js").PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
    in_trash: boolean;
})[]>;
export {};
//# sourceMappingURL=image-handler.d.ts.map