// src/pages/index.js
import * as React from "react"
import BlogPostCreator from "../components/BolgPostCreator" // Import du composant BlogPostCreator

const BlogIndex = () => {
  const [showCreator, setShowCreator] = React.useState(false) // État pour contrôler l'affichage du créateur d'articles

  const handleCreatePostClick = () => {
    setShowCreator(true) // Afficher le créateur d'articles
  }

  const handleCloseCreator = () => {
    setShowCreator(false) // Fermer le créateur d'articles
  }

  return (
    <div>
      <h1>Hello World</h1>

      {/* Affichage du bouton pour ouvrir le BlogPostCreator */}
      <button onClick={handleCreatePostClick}>Créer un article</button>

      {/* Si showCreator est true, afficher le composant BlogPostCreator */}
      {showCreator && <BlogPostCreator onClose={handleCloseCreator} />}
    </div>
  )
}

export default BlogIndex
