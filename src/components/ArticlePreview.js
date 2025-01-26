import React from "react"
import "../style.css" // Ajoutez un fichier CSS pour styliser le composant si nécessaire.
import { useBlogContext } from "../services/BlogProvider" // Import du contexte

/**
 * Composant qui affiche un aperçu visuel de l'article.
 * Il se branche directement sur `metadata` fourni par le contexte.
 */
const ArticlePreview = () => {
  const { metadata, setMetadata, imageTitlePreview, imagesPreview } =
    useBlogContext() // Récupération de metadata, setMetadata et autres données depuis le contexte
  console.log({ imagesPreview })

  const handleWidthChange = (index, newWidth) => {
    // Mettre à jour la largeur dans metadata.sections
    setMetadata(prevMetadata => {
      const updatedSections = [...prevMetadata.sections]
      updatedSections[index] = {
        ...updatedSections[index],
        size: {
          ...updatedSections[index].size,
          width: `${newWidth}%`, // Met à jour uniquement la largeur
        },
      }
      return { ...prevMetadata, sections: updatedSections }
    })
  }

  const renderImage = (src, alt, width) => {
    // Vérifier si l'image est une URL Blob ou une URL valide
    if (src && (src.startsWith("blob:") || src.startsWith("http"))) {
      return (
        <img
          src={src}
          alt={alt}
          style={{
            width: width || "100%",
            height: "auto",
            objectFit: "cover",
          }}
        />
      )
    } else {
      return <p>Image non valide</p> // Si l'image n'est pas valide, afficher un message d'erreur.
    }
  }

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
          <h1
            className="article-preview-title"
            style={{ color: "rgb(245, 109, 68)" }}
          >
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
        <div
          className="article-preview-resume-text"
          dangerouslySetInnerHTML={{
            __html: metadata.resume || "<em>Aucun résumé disponible</em>",
          }}
        />
      </section>

      {/* Sections */}
      <section className="article-preview-sections">
        {metadata.sections &&
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
              {/* Contrôle pour ajuster la largeur */}
              <div className="width-control">
                <label htmlFor={`width-${index}`}>
                  Largeur : {section.size?.width || "100%"}
                </label>
                <input
                  id={`width-${index}`}
                  type="range"
                  min="10"
                  max="100"
                  value={parseInt(section.size?.width || "100")}
                  onChange={e => handleWidthChange(index, e.target.value)}
                />
              </div>
              {/* Afficher uniquement l'image preview correspondant à l'index de la section */}
              {imagesPreview && imagesPreview[index]?.url ? (
                <div>
                  {renderImage(
                    imagesPreview[index].url,
                    `Section ${index + 1} - Preview Image`,
                    section.size?.width
                  )}
                </div>
              ) : (
                <div>Pas d'image...</div>
              )}
            </div>
          ))}
      </section>
    </div>
  )
}

export default ArticlePreview
