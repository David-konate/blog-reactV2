import React, { useState, useRef } from "react"
import { useBlogContext } from "../services/BlogProvider" // Import du contexte global

const ImageUploader = ({
  uploaderType, // "title" ou "section"
}) => {
  const [loadingTitle, setLoadingTitle] = useState(false)
  const [loadingSection, setLoadingSection] = useState(false)

  // Référence à l'input de fichier pour réinitialiser
  const fileInputRef = useRef(null)

  // Accès au contexte global
  const {
    setImageTitleData,
    setImagesData,
    setImagesPreview,
    setImageTitlePreview,
    currentSectionIndex,
    imagesPreview,
    metadata, // Récupérer metadata directement depuis le contexte
    setMetadata, // Fonction pour mettre à jour metadata
  } = useBlogContext()

  // Fonction pour uploader une image de titre
  const handleTitleImageUpload = async event => {
    const { files } = event.target
    if (files && files[0]) {
      const uploadedFile = files[0]
      setLoadingTitle(true)
      try {
        const formData = new FormData()
        formData.append("image", uploadedFile)

        // Simulation de l'upload ou appel d'API
        const imageData = {
          url: URL.createObjectURL(uploadedFile), // Remplacer par la réponse API
        }
        setImageTitleData(imageData) // Mettre à jour les données globales
        setImageTitlePreview(imageData.url) // Mise à jour de l'aperçu de l'image de titre dans le contexte global
      } catch (error) {
        console.error("Failed to upload title image:", error)
      } finally {
        setLoadingTitle(false)
      }
    }
  }

  // Fonction pour uploader une image de section
  const handleSectionImageUpload = async event => {
    const { files } = event.target
    if (files && files[0]) {
      const uploadedFile = files[0]
      setLoadingSection(true)

      try {
        const formData = new FormData()
        formData.append("image", uploadedFile)

        // Créer un objet Image pour obtenir les dimensions
        const img = new Image()
        img.src = URL.createObjectURL(uploadedFile)

        img.onload = () => {
          const defaultWidth = img.width // Largeur de l'image
          const defaultHeight = img.height // Hauteur de l'image

          const imageData = {
            url: img.src, // URL de l'image
            position: { x: 0, y: 0 }, // Position par défaut
            size: { width: "100%", height: "auto" }, // Taille basée sur l'image
          }

          // Mettre à jour la section spécifique dans metadata.sections
          setMetadata(prevMetadata => {
            const updatedSections = [...prevMetadata.sections]
            updatedSections[currentSectionIndex] = {
              ...updatedSections[currentSectionIndex], // Garde le texte et les autres données de la section
              image: imageData.url, // Ajoute l'image dans la section
              size: imageData.size, // Ajoute la taille de l'image
            }

            return {
              ...prevMetadata,
              sections: updatedSections, // Mettre à jour les sections avec la nouvelle image
            }
          })

          // Mettre à jour les données d'images dans le contexte global
          setImagesData(prevData => {
            return {
              ...prevData,
              [currentSectionIndex]: imageData, // Enregistrer l'image de cette section avec position et taille
            }
          })

          // Mettre à jour l'aperçu des images dans le contexte global
          setImagesPreview(prev => {
            const updatedPreview = Array.isArray(prev) ? [...prev] : []
            updatedPreview[currentSectionIndex] = {
              url: imageData.url,
              size: imageData.size, // Ajout de la taille
            }
            return updatedPreview
          })
        }
      } catch (error) {
        console.error("Failed to upload section image:", error)
      } finally {
        setLoadingSection(false)
      }
    }
  }

  // Réinitialiser le champ d'upload après l'upload
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "" // Réinitialise l'input de fichier
    }
  }

  return (
    <div>
      {/* Affiche le chargeur en fonction de uploaderType */}
      {uploaderType === "title" && (
        <div>
          <label htmlFor="titleImageUpload">Upload a title image:</label>
          <input
            ref={fileInputRef} // Référence à l'input
            type="file"
            id="titleImageUpload"
            accept="image/*"
            onChange={handleTitleImageUpload}
            disabled={loadingTitle}
          />
          {loadingTitle && <div>Uploading Title Image...</div>}
        </div>
      )}

      {uploaderType === "section" && (
        <div>
          <label htmlFor="sectionImageUpload">
            Upload an image for the section:
          </label>
          <input
            ref={fileInputRef} // Référence à l'input
            type="file"
            id="sectionImageUpload"
            accept="image/*"
            onChange={handleSectionImageUpload}
            disabled={loadingSection}
          />
          {loadingSection && <div>Uploading Section Image...</div>}
        </div>
      )}
    </div>
  )
}

export default ImageUploader
