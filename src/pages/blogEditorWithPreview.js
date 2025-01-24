import React from "react"
import BlogPostCreator from "../components/BlogPostCreator"
import ArticlePreview from "../components/ArticlePreview"
import { useBlogContext } from "../services/BlogProvider"
import "../style.css"
const BlogEditorWithPreview = () => {
  const { metadata } = useBlogContext()

  return (
    <div className="blog-editor-preview-container">
      <div className="blog-editor">
        <BlogPostCreator />
      </div>
      <div className="blog-preview">
        <ArticlePreview />
      </div>
    </div>
  )
}

export default BlogEditorWithPreview
