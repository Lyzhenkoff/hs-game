import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://hs-game.ru",
            lastModified: new Date(),
        },
        {
            url: "https://hs-game.ru/offer",
            lastModified: new Date(),
        },
    ];
}