const tools = [
  'Photoshop',
  'Illustrator',
  'InDesign',
  'Lightroom',
  'Premiere Pro',
  'After Effects',
  'Canva',
  'Figma',
]

function ToolsMarquee() {
  const track = [...tools, ...tools]

  return (
    <div className="tools-marquee" aria-hidden="true">
      <div className="tools-track">
        {track.map((tool, i) => (
          <span key={`${tool}-${i}`}>{tool}</span>
        ))}
      </div>
    </div>
  )
}

export default ToolsMarquee
