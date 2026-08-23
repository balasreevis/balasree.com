---
# `label` is safe to edit freely — it's just the text shown in the menu.
#
# `href` is NOT free text for the "/#..." links below. Each one must match
# an `id="..."` set on that section's own file in src/_includes/partials/,
# so renaming a label does not move the link — only editing `href` does,
# and only if the new value matches an existing section id:
#   /#moments       -> src/_includes/partials/moments.njk
#   /#about         -> src/_includes/partials/about.njk
#   /#testimonials  -> src/_includes/partials/testimonials.njk
#   /#contact       -> src/_includes/partials/contact.njk
# "/blog/" is a real page, not an anchor, and needs no matching id.
items:
  - label: Moments
    href: "/#moments"
  - label: About Me
    href: "/#about"
  - label: Testimonials
    href: "/#testimonials"
  - label: Blog
    href: "/blog/"
  - label: Work with me
    href: "/#contact"
---
