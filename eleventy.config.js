import matter from "gray-matter";

export default function (eleventyConfig) {
  // Copy static assets straight through
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

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

  // Journey timeline entries, newest first (supports multiple entries per
  // year/month). Each entry is a single Markdown file in src/journey-entries/
  // with a `date` of "YYYY", "YYYY-MM", or "YYYY-MM-DD" — add a file to add
  // an entry, no code changes needed.
  eleventyConfig.addCollection("journeyEntries", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("journeyEntry")
      .sort((a, b) => String(b.data.date).localeCompare(String(a.data.date)));
  });

  // Work grid items, in owner-defined order. Each item is a single
  // Markdown file in src/work-items/ with a numeric `order` — add a file
  // to add a project, no code changes needed.
  eleventyConfig.addCollection("workItems", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("workItem")
      .sort((a, b) => Number(a.data.order) - Number(b.data.order));
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
