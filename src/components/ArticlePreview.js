import React from "react"
import "../style.css" // Ajoutez un fichier CSS pour styliser le composant si nécessaire.
import { useBlogContext } from "../services/BlogProvider" // Import du contexte

/**
 * Composant qui affiche un aperçu visuel de l'article.
 * Il se branche directement sur `metadata` fourni par le contexte.
 */
const ArticlePreview = () => {
  const { metadata, imageTitlePreview, imagePreview } = useBlogContext() // Récupération de metadata, imageTitlePreview et imagePreview depuis le contexte

  return (
    <div className="article-preview">
      {/* Titre principal */}
      <header
        className="article-preview-header"
        style={{
          backgroundImage: `url(${imageTitlePreview || imageTitlePreview})`, // Utilise imageTitlePreview du contexte
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="article-preview-overlay">
          <h1 className="article-preview-title">
            {metadata.title || "Titre de l'article"}
          </h1>
          <p className="article-preview-author">
            Par <strong>{metadata.author || "Auteur"}</strong> -{" "}
            {metadata.date || "Date"}
          </p>
        </div>
      </header>

      {/* Résumé */}
      <section className="article-preview-resume">
        <h2>Résumé</h2>
        <div
          className="article-preview-resume-text"
          dangerouslySetInnerHTML={{
            __html: metadata.resume || "<em>Aucun résumé disponible</em>",
          }}
        />
      </section>

      {/* Catégorie */}
      <section className="article-preview-category">
        <h3>Catégorie : {metadata.category || "Non spécifiée"}</h3>
      </section>

      {/* Sections */}
      <section className="article-preview-sections">
        <h2>Sections</h2>
        {metadata.sections && metadata.sections.length > 0 ? (
          metadata.sections.map((section, index) => (
            <div key={index} className="article-preview-section">
              <h3>Section {index + 1}</h3>
              <div
                className="article-preview-section-text"
                dangerouslySetInnerHTML={{
                  __html:
                    section.text || "<em>Aucun contenu pour cette section</em>",
                }}
              />
              {section.image && (
                <img
                  src={imagePreview || section.image} // Utilise imagePreview du contexte ou section.image
                  alt={`Section ${index + 1}`}
                  style={{
                    width: section.imageWidth || "100%",
                    height: section.imageHeight || "auto",
                    objectFit: "cover",
                    position: "relative",
                  }}
                  className={`image-position-${section.imagePosition}`}
                />
              )}
            </div>
          ))
        ) : (
          <p className="article-preview-no-sections">
            Aucune section n'a encore été ajoutée.
          </p>
        )}
      </section>
    </div>
  )
}

export default ArticlePreview
