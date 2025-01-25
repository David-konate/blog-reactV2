import React from "react"
import { Link } from "gatsby"
import { useBlogContext } from "../services/BlogProvider"

const BlogPreview = () => {
  const { metadata, imageTitlePreview } = useBlogContext()

  return (
    <div className="card">
      <div className="card-image">
        <img
          src={imageTitlePreview}
          alt={metadata.imageTitlePreview || metadata.title}
        />
        <div className="card-badge">{metadata.category || "Events"}</div>
      </div>

      <div className="card-content">
        <h2 className="card-title">{metadata.title}</h2>
        <p className="card-description">{metadata.resume}</p>
        <div className="card-footer">
          <span>
            Par {metadata.author} le {metadata.date}
          </span>
        </div>
        <Link to={metadata.slug} className="card-link">
          Lire plus ➝
        </Link>
      </div>
    </div>
  )
}

export default BlogPreview
