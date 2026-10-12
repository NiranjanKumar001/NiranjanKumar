/**
 * Shared page transition handler.
 * Include this script (via a <script> tag) in every HTML page.
 * Each page must have a <div class="page-transition"></div> element in the body.
 *
 * - On click: animates the overlay up, then navigates.
 * - On load:  animates the overlay back down (out of view) to reveal the page.
 */
(function () {
  // Run as soon as DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.querySelector(".page-transition");
    if (!overlay) return;

    /* ── ENTRANCE: slide overlay out on page load ───────────────────────── */
    // Start with overlay covering the full viewport
    gsap.set(overlay, { height: "100%", top: 0 });

    gsap.to(overlay, {
      height: "0%",
      duration: 0.6,
      ease: "power2.inOut",
      delay: 0.05, // tiny delay so paint is complete
    });

    /* ── EXIT: intercept nav clicks → animate then navigate ─────────────── */
    document.querySelectorAll("nav a").forEach((link) => {
      link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        // Skip hash-only, mailto:, tel:, target=_blank links
        if (
          !href ||
          href.startsWith("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:") ||
          this.getAttribute("target") === "_blank"
        )
          return;

        e.preventDefault();

        // Animate overlay upward to cover page
        gsap.fromTo(
          overlay,
          { height: "0%", bottom: 0, top: "auto" },
          {
            height: "100%",
            duration: 0.55,
            ease: "power2.inOut",
            onComplete: () => {
              window.location.href = href;
            },
          }
        );
      });
    });
  });
})();
