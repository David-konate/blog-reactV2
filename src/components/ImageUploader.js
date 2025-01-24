import React, { useState } from "react"
import { useBlogContext } from "../services/BlogProvider" // Import du contexte global

const ImageUploader = ({
  uploaderType, // "title" ou "section"
  currentSectionIndex,
  sections,
  setSections,
}) => {
  const [loadingTitle, setLoadingTitle] = useState(false)
  const [loadingSection, setLoadingSection] = useState(false)

  // Accès au contexte global
  const {
    setImageTitleData,
    setImagesData,
    setImagePreview,
    setImageTitlePreview,
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

        // Simulation de l'upload ou appel d'API
        const imageData = {
          url: URL.createObjectURL(uploadedFile), // Remplacer par la réponse API
        }
        const updatedSections = [...sections]
        updatedSections[currentSectionIndex] = {
          ...updatedSections[currentSectionIndex],
          image: imageData.url,
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
        }
        setSections(updatedSections)
        setImagesData(prevData => ({
          ...prevData,
          [currentSectionIndex]: imageData,
        }))
        setImagePreview(imageData.url) // Mise à jour de l'aperçu de l'image de section dans le contexte global
      } catch (error) {
        console.error("Failed to upload section image:", error)
      } finally {
        setLoadingSection(false)
      }
    }
  }

  return (
    <div>
      {/* Affiche le chargeur en fonction de uploaderType */}
      {uploaderType === "title" && (
        <div>
          <label htmlFor="titleImageUpload">Upload a title image:</label>
          <input
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
