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
    const imgWidth = sectionSize ? sectionSize.width : width // Si sectionSize.width est défini, on l'utilise, sinon on prend la valeur par défaut
    console.log(imgWidth)
    const { positionX, positionY } = sectionSize || {
      positionX: 0,
      positionY: 0,
    }

    return isValidImage ? (
      <img
        src={src}
        alt={alt || "Image"}
        style={{
          width: `${imgWidth}%` || "100%", // Appliquer la largeur dynamique
          height: "auto",
          objectFit: "cover", // Garder l'image bien ajustée tout en conservant son ratio
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          position: "relative",
          left: `${positionX}px`,
          top: `${positionY}px`,
          maxWidth: "100%", // Limiter la largeur au maximum du conteneur
        }}
      />
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
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <div
                className="article-preview-section-text"
                dangerouslySetInnerHTML={{
                  __html:
                    section.text || "<em>Aucun contenu pour cette section</em>",
                }}
                style={{
                  marginBottom: "20px",
                }}
              />

              {imagesPreview && imagesPreview[index]?.url ? (
                <div
                  style={{
                    position: "relative",
                    marginTop: "20px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    overflow: "hidden",
                  }}
                >
                  {renderImage(
                    imagesPreview[index].url,
                    `Section ${index + 1} - Preview Image`,
                    "100%", // Largeur par défaut
                    index // Ajoutez l'index pour forcer le rerendu
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
