import React from "react"
import BlogPostCreator from "../components/BlogPostCreator"
import ArticlePreview from "../components/ArticlePreview"
import { useBlogContext } from "../services/BlogProvider"
import "../style.css"
import BlogPreview from "../components/BlogPreview"
import SizeControl from "../components/SizeControl"
const BlogEditorWithPreview = () => {
  const { metadata } = useBlogContext()

  return (
    <div className="blog-editor-preview-container">
      <div className="blog-editor">
        <BlogPostCreator />
      </div>
      <div className="blog-preview">
        <div className="blog-creator-container">
          <BlogPreview />
          <ArticlePreview />
        </div>
      </div>
    </div>
  )
}

export default BlogEditorWithPreview
