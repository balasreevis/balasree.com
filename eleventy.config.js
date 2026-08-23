import matter from "gray-matter";
import pluginRss from "@11ty/eleventy-plugin-rss";
import Image from "@11ty/eleventy-img";
import path from "node:path";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);

  // Copy static assets straight through
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  // Let .md files work as global data files (src/_data/**/*.md), so the
  // owner can edit front matter instead of JSON syntax.
  eleventyConfig.addDataExtension("md", (contents) => matter(contents).data);

  // Format a date for the Now page. An empty/missing value falls back to today.
  // Accepts an ISO date string like "2026-06-23".
  eleventyConfig.addFilter("nowDate", (value) => {
    const date = value ? new Date(value) : new Date();
    if (isNaN(date)) return value; // leave non-ISO text untouched
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  });

  // Format a journey entry's date. Accepts "YYYY", "YYYY-MM", or "YYYY-MM-DD".
  // Shows only as much precision as was given (a bare year stays a bare year).
  eleventyConfig.addFilter("journeyDate", (value) => {
    if (!value) return value;
    const parts = String(value).split("-");
    if (parts.length === 1) return parts[0];
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2] || 1));
    if (isNaN(date)) return value;
    const options = { year: "numeric", month: "long" };
    if (parts.length === 3) options.day = "numeric";
    return date.toLocaleDateString("en-US", options);
  });

  // Trim text to a max length for meta tags, breaking on a word boundary.
  eleventyConfig.addFilter("truncate", (value, maxLength = 160) => {
    if (!value || value.length <= maxLength) return value;
    const cut = value.slice(0, maxLength + 1);
    return cut.slice(0, cut.lastIndexOf(" ")).trim() + "…";
  });

  // Resizes and converts owner-supplied photos at build time so the browser
  // never downloads more pixels than it'll actually show (source photos are
  // often full camera-resolution, several MB each). Outputs WebP + a
  // same-format fallback across a few widths, as a responsive <picture>.
  // Local paths (e.g. "/assets/images/x.jpg") and remote URLs both work;
  // if the source can't be fetched (e.g. a placeholder URL mid-edit), the
  // shortcode falls back to a plain <img> instead of failing the build.
  eleventyConfig.addAsyncShortcode("photo", async (src, alt, options = {}) => {
    if (!src) return "";
    const { className, loading = "lazy", sizes = "100vw", widths = [480, 800, 1200, 1800], objectPosition } = options;
    const isRemote = /^https?:\/\//.test(src);
    const inputPath = isRemote ? src : path.join("src", src);

    let metadata;
    try {
      // Capped widths only (no `null`/original-resolution entry) — the
      // point is to never ship a multi-MB camera-original to the browser.
      // Quality is set explicitly above eleventy-img's defaults (which look
      // visibly soft for photography) — still a large size win over
      // untouched camera originals, just not at the cost of looking muddy.
      metadata = await Image(inputPath, {
        widths,
        formats: ["webp", "jpeg"],
        outputDir: "_site/assets/images/optimized",
        urlPath: "/assets/images/optimized/",
        sharpWebpOptions: { quality: 82 },
        sharpJpegOptions: { quality: 85 },
      });
    } catch (e) {
      return `<img src="${src}" alt="${alt || ""}" loading="${loading}"${className ? ` class="${className}"` : ""} />`;
    }

    const imageAttributes = {
      alt: alt || "",
      sizes,
      loading,
      decoding: loading === "eager" ? "sync" : "async",
    };
    if (className) imageAttributes.class = className;
    if (objectPosition) imageAttributes.style = `object-position: ${objectPosition}`;

    return Image.generateHTML(metadata, imageAttributes);
  });

  // Journey timeline entries, newest first (supports multiple entries per
  // year/month). Each entry is a single Markdown file in src/journey-entries/
  // with a `date` of "YYYY", "YYYY-MM", or "YYYY-MM-DD" — add a file to add
  // an entry, no code changes needed.
  eleventyConfig.addCollection("journeyEntries", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("journeyEntry")
      .sort((a, b) => String(b.data.date).localeCompare(String(a.data.date)));
  });

  // Moments grid items, in owner-defined order. Each item is a single
  // Markdown file in src/moment-items/ with a numeric `order` — add a file
  // to add a project, no code changes needed.
  eleventyConfig.addCollection("momentItems", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("momentItem")
      .sort((a, b) => Number(a.data.order) - Number(b.data.order));
  });

  // Blog posts, newest first. Each post is a single Markdown file in
  // src/blog-posts/ with a `date` of "YYYY-MM" or "YYYY-MM-DD" and its own
  // `permalink` — add a file to add a post, no code changes needed.
  eleventyConfig.addCollection("blogPosts", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("blogPost")
      .sort((a, b) => String(b.data.date).localeCompare(String(a.data.date)));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
