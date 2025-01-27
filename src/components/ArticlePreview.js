import React, { useEffect } from "react"
import "../style.css"
import { useBlogContext } from "../services/BlogProvider"

const ArticlePreview = () => {
  const { metadata, imageTitlePreview, imagesPreview, currentSectionIndex } =
    useBlogContext()

  console.log({ imagesPreview })

  const renderImage = (src, alt, width = "100%", index) => {
    const isValidImage =
      src && (src.startsWith("blob:") || src.startsWith("http"))

    // Vérifier si une taille spécifique est définie dans imagesPreview
    const sectionSize = imagesPreview && imagesPreview[index]?.size
    const imgWidth = sectionSize ? sectionSize.width : width // Largeur dynamique
    const { positionX = 0, positionY = 0 } = sectionSize || {}

    return isValidImage ? (
      <div
        style={{
          display: "inline-block", // Assurer l'affichage en ligne (pour flotter avec le texte)
          width: `${imgWidth}%`, // Largeur dynamique
          // Espacement en bas
          position: "relative", // Positionner l'image relativement au conteneur
          marginLeft: `${positionX}px`, // Déplacement horizontal
          marginTop: `${positionY}px`, // Déplacement vertical
          maxWidth: "100%", // Empêcher l'image de sortir du conteneur
          overflow: "hidden", // Cacher l'image qui sort du conteneur
          boxSizing: "border-box", // Inclure les bordures dans la largeur totale
        }}
      >
        <img
          src={src}
          alt={alt || "Image"}
          style={{
            width: "100%", // Largeur de l'image (100% du conteneur)
            height: "auto", // Hauteur auto pour conserver le ratio
            objectFit: "cover", // Maintenir le ratio sans déformation
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>
    ) : (
      <div
        style={{
          width: "100%",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          border: "1px solid #f5c6cb",
          borderRadius: "8px",
        }}
      >
        <p>Image non valide</p>
      </div>
    )
  }

  // Effet pour écouter les changements dans imagesPreview et forcer la mise à jour
  useEffect(() => {
    if (imagesPreview && imagesPreview.length > 0) {
      // Si imagesPreview est disponible et contient des données, on déclenche une mise à jour
      console.log("Mise à jour des images preview:", imagesPreview)
    }
  }, [imagesPreview]) // L'effet sera déclenché chaque fois que imagesPreview changera

  return (
    <div className="article-preview">
      <header
        className="article-preview-header"
        style={{
          backgroundImage: `url(${imageTitlePreview || imageTitlePreview})`,
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

      <section className="article-preview-resume">
        <div
          className="article-preview-resume-text"
          dangerouslySetInnerHTML={{
            __html: metadata.resume || "<em>Aucun résumé disponible</em>",
          }}
        />
      </section>

      <section className="article-preview-sections">
        {metadata.sections &&
          metadata.sections.map((section, index) => (
            <div
              key={index}
              className="article-preview-section"
              style={{
                position: "relative",
                marginBottom: "20px",
              }}
            >
              {imagesPreview && imagesPreview[index]?.url && (
                <div
                  style={{
                    float: "left", // Permet l'enroulement du texte autour de l'image
                  }}
                >
                  {renderImage(
                    imagesPreview[index].url, // URL de l'image
                    `Section ${index + 1} - Preview Image`, // Texte alternatif
                    "50%", // Largeur par défaut (modifiable dynamiquement)
                    index // Index pour récupérer les dimensions et positions
                  )}
                </div>
              )}

              <div
                className="article-preview-section-text"
                dangerouslySetInnerHTML={{
                  __html:
                    section.text || "<em>Aucun contenu pour cette section</em>",
                }}
              />
            </div>
          ))}
      </section>
    </div>
  )
}

export default ArticlePreview
