const IMAGE_SPECS = [
  {
    name: 'Logo',
    path: '/images/logo.png',
    current: '1080 × 1080px (square)',
    recommended: 'Square, at least 512 × 512px, transparent background PNG',
    usedIn: 'Header, footer, admin login screen, and search engine preview (structured data)',
    behavior: 'Displayed as-is — current size is already good, no change needed.',
    status: 'good',
  },
  {
    name: 'Favicon',
    path: '/images/favicon.ico',
    current: '256 × 256px',
    recommended: 'Square, 256 × 256px (or a multi-size .ico containing 16/32/48/256px)',
    usedIn: 'Browser tab icon',
    behavior: 'Displayed as-is — current size is already good, no change needed.',
    status: 'good',
  },
  {
    name: 'Social Share Image (Open Graph)',
    path: '/images/OG.png',
    current: '1080 × 1080px (square)',
    recommended: '1200 × 630px (landscape, ~1.91:1)',
    usedIn: 'The preview image shown when your site link is shared on WhatsApp, Facebook, LinkedIn, Twitter/X, etc.',
    behavior:
      "Currently square — most platforms will crop a square image to a wide rectangle automatically, often cutting off the top or bottom. Worth re-exporting at 1200×630 so the crop is intentional instead of automatic.",
    status: 'warning',
  },
  {
    name: 'Project Images',
    path: 'public/designs-img/... (or uploaded via the Projects tab)',
    current: 'Varies',
    recommended: 'Landscape, 3:2 ratio — e.g. 1500 × 1000px or 1200 × 800px',
    usedIn: 'Projects grid cards, the lightbox viewer, and the 3 rotating photos in the Hero section',
    behavior:
      "Uses 'contain' sizing — an image that isn't exactly 3:2 will NOT be cropped, it'll just show with some empty space on the sides/top instead of filling the frame edge-to-edge. For the cleanest look, export at 3:2.",
    status: 'info',
  },
  {
    name: 'About Section Photo',
    path: 'Set in Site Settings → About → Photo',
    current: 'Varies',
    recommended: 'Portrait, 4:5 ratio — e.g. 1000 × 1250px',
    usedIn: 'The photo next to your bio in the About section',
    behavior:
      "Uses 'cover' sizing — this one DOES crop to fill the frame, so keep the important part of the photo centered. A photo that's too wide/short will get its edges cut off.",
    status: 'warning',
  },
]

function ImageGuide() {
  return (
    <div className="admin-section">
      <h2 className="admin-section-title">Image Size Guide</h2>
      <p className="admin-section-subtitle">
        Reference only — this page doesn't edit anything. Use it to know what to export
        before uploading.
      </p>

      {IMAGE_SPECS.map(spec => (
        <div className="admin-card admin-image-guide-card" key={spec.name}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">{spec.name}</h3>
            <span className={`admin-guide-badge admin-guide-badge-${spec.status}`}>
              {spec.status === 'good' && 'No change needed'}
              {spec.status === 'warning' && 'Worth fixing'}
              {spec.status === 'info' && 'Guideline'}
            </span>
          </div>
          <p className="admin-guide-path">{spec.path}</p>
          <div className="admin-guide-row">
            <span className="admin-guide-label">Current</span>
            <span>{spec.current}</span>
          </div>
          <div className="admin-guide-row">
            <span className="admin-guide-label">Recommended</span>
            <span>{spec.recommended}</span>
          </div>
          <div className="admin-guide-row">
            <span className="admin-guide-label">Used in</span>
            <span>{spec.usedIn}</span>
          </div>
          <p className="admin-hint admin-guide-behavior">{spec.behavior}</p>
        </div>
      ))}

      <div className="admin-card">
        <h3 className="admin-card-title">File size — for upload speed &amp; site speed</h3>
        <p className="admin-guide-behavior">
          There's no strict limit enforced by the site, but keep exported images
          reasonably small — ideally under ~1–2MB each. Large, uncompressed exports (10MB+)
          will be slow to upload from the admin panel given a slower connection, and slow
          for visitors to load on the live site. Most design tools (Photoshop "Export As",
          TinyPNG, Squoosh) can compress a PNG/JPG to a fraction of its size with no visible
          quality loss.
        </p>
      </div>
    </div>
  )
}

export default ImageGuide
