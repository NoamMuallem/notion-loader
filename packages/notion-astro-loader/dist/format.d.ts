/**
 * Extract a plain string from a list of rich text items.
 *
 * @see https://developers.notion.com/reference/rich-text
 *
 * @example
 * richTextToPlainText(page.properties.Name.title)
 */
export declare function richTextToPlainText(data: ReadonlyArray<{
    plain_text: string;
}>): string;
/**
 * Extract the URL from a file property.
 *
 * @see https://developers.notion.com/reference/file-object
 */
export declare function fileToUrl(file: {
    type: "external";
    external: {
        url: string;
    };
} | {
    type: "file";
    file: {
        url: string;
    };
} | null): string | undefined;
/**
 * Replace date strings with date objects.
 *
 * @see https://developers.notion.com/reference/page-property-values#date
 */
export declare function dateToDateObjects(dateResponse: {
    start: string;
    end: string | null;
    time_zone: string | null;
} | null): {
    start: Date;
    end: Date | null;
    time_zone: string | null;
} | null;
//# sourceMappingURL=format.d.ts.map