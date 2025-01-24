// src/pages/index.js
import * as React from "react"
import { Link } from "gatsby" // Importez le composant Link pour la navigation

const BlogIndex = () => {
  return (
    <div>
      <h1>Hello World</h1>

      {/* Bouton pour naviguer vers la page de création d'article */}
      <Link to="/create-article">
        <button>Créer un article</button>
      </Link>
    </div>
  )
}

export default BlogIndex
