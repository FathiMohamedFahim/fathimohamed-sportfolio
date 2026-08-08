import { TOOLS } from '../data/taxonomies'

function ToolsMarquee() {
  const track = [...TOOLS, ...TOOLS]

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
