# Before &amp; After Junk Removal, LLC

Website for Before and After Junk Removal, LLC — fast, affordable, eco-friendly junk
removal serving East Texas out of Huntsville, TX.

Built with vanilla HTML, CSS and JavaScript. No build step: serve the repository root
as a static site.

## Structure

```
index.html            Home — hero, services, why choose us, process, service areas, quote form
about-us/index.html   About Us — story, values, stats, contact form
assets/styles.css     Design system and all page styles
assets/main.js        Mobile nav, scroll reveal, form submission handling
assets/favicon.svg    Favicon
images/source/        Business logo
```

## Contact

- Phone: (936) 755-0700
- Hours: 6:00 AM – 8:00 PM, 7 days a week
- Location: Huntsville, TX
- Service area: Walker, Trinity, Montgomery, Houston, Madison, Grimes, San Jacinto,
  Brazos, Polk and Harris Counties

## Forms

Both forms POST to the LeadrVision endpoint. They submit via `fetch()` when JavaScript
is available and fall back to a plain HTML POST otherwise; on return with `?submitted=1`
a confirmation message is shown. Each form carries hidden `_form`, `_page` and `_gotcha`
(honeypot) fields.

## Local preview

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.
