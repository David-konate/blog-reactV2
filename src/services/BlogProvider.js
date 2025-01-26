// src/context/store.js
import React, { createContext, useState, useContext } from "react"
import axiosInstance from "./axios"
const BlogContext = createContext()

export const BlogProvider = ({ children }) => {
  const [imagesPreview, setImagesPreview] = useState({})
  const [imageTitlePreview, setImageTitlePreview] = useState(null)

  const [imageTitleData, setImageTitleData] = useState({})
  const [imagesData, setImagesData] = useState([])

  const [metadata, setMetadata] = useState({
    title: "",
    author: "",
    date: "",
    category: "",
    slug: "",
    image: "",
    cardImage: "",
    resume: "",
    sections: [
      {
        text: "", // Le texte de la section
        image: "", // L'image de la section
        position: { x: "", y: "" },
        size: { width: "", height: "" },
      },
    ],
  })

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [sections, setSections] = useState(metadata.sections)
  // Fonction pour mettre à jour les prévisualisations d'images
  const updateImagesPreview = newImagesPreview => {
    setImagesPreview(newImagesPreview)
  }
  // Enregistrer un article
  const saveArticle = async (metadata, imagesData = [], imageTitleData) => {
    try {
      // Étape 1 : Vérification ou génération d'un slug unique
      const uniqueSlug = await checkOrGenerateSlug(metadata.slug)

      // Mise à jour des métadonnées avec le slug unique
      const updatedMetadata = {
        ...metadata,
        slug: uniqueSlug,
        sections: metadata.sections.map(section => ({
          ...section,
          image: "", // Initialisation des images dans les sections
          position: { x: 0, y: 0 },
          size: { width: "100%", height: "auto" },
        })),
      }

      // Étape 2 : Téléchargement des images, si disponibles
      const imageUrls = imagesData.length
        ? await saveImages(imagesData, uniqueSlug, imageTitleData)
        : []

      // Mise à jour des sections avec les URLs des images
      const finalMetadata = {
        ...updatedMetadata,
        image: imageUrls[0] || "",
        sections: updatedMetadata.sections.map((section, index) => ({
          ...section,
          image: imageUrls[index] || "", // Associer les images aux sections
        })),
      }

      // Étape 3 : Générer le contenu Markdown
      const markdownContent = generateMarkdown(finalMetadata)

      // Étape 4 : Envoi des données Markdown au backend
      const formData = new FormData()
      formData.append(
        "markdown",
        new Blob([markdownContent], { type: "text/markdown" })
      )

      const response = await axiosInstance.post(
        `/routes/markdown/save/${uniqueSlug}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )

      if (response.status !== 200) {
        throw new Error("Erreur lors de l'enregistrement de l'article.")
      }

      return {
        status: "success",
        message: "Article enregistré avec succès !",
        data: response.data,
      }
    } catch (error) {
      console.error("Erreur dans saveArticle:", error)
      throw new Error(
        error.message ||
          "Une erreur est survenue lors de l'enregistrement de l'article."
      )
    }
  }

  // Enregistrer les images
  const saveImages = async (imagesData, slug, imageTitleData) => {
    try {
      const formData = new FormData()
      imagesData.forEach(image => {
        formData.append("imagesSections", image.file)
        formData.append("imageTitleData", JSON.stringify(imageTitleData)) // Sérialisation pour éviter des erreurs
      })

      const response = await axiosInstance.post(
        `/routes/markdown/upload/images/${slug}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (response.status === 200) {
        return response.data.secure_urls
      } else {
        throw new Error("Erreur lors du téléchargement des images.")
      }
    } catch (error) {
      console.error("Erreur dans saveImages:", error.message)
      throw error
    }
  }

  // Vérifier ou générer un slug unique
  const checkOrGenerateSlug = async slug => {
    try {
      const response = await axiosInstance.get(
        `/routes/markdown/check-or-generate-slug/${slug}`
      )
      if (response.data && response.data.uniqueSlug) {
        return response.data.uniqueSlug
      } else {
        throw new Error(
          response.data.message || "Erreur lors de la vérification du slug."
        )
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification ou génération du slug:",
        error
      )
      throw new Error("Erreur lors de la vérification du slug.")
    }
  }

  // Générer le contenu Markdown
  const generateMarkdown = metadata => {
    const metadataString = `---
title: "${metadata.title}"
author: "${metadata.author}"
date: "${metadata.date}"
category: "${metadata.category || ""}"
resume: "${metadata.resume || ""}"
slug: "${metadata.slug || ""}"
image: "${metadata.image || ""}"
cardImage: "${metadata.cardImage || ""}"
sections:
${metadata.sections
  .map(
    (section, index) => `  - text: "${section.text || ""}"
  index: ${index}
  image: "${section.image || ""}"
  imageHeight: ${section.imageHeight || "null"}
  imageWidth: ${section.imageWidth || "null"}
  imagePosition: "${section.imagePosition || "top"}"`
  )
  .join("\n")}
---`

    const sectionsContent = metadata.sections
      .map((section, index) => {
        const imageName = section.image || ""
        return `### Section ${index + 1}
        
${imageName ? `![Image de la section](${imageName})` : ""}
${section.text || ""}`
      })
      .join("\n")

    return `${metadataString}\n\n${sectionsContent}`
  }

  return (
    <BlogContext.Provider
      value={{
        metadata,
        setMetadata,
        currentSectionIndex,
        setCurrentSectionIndex,
        sections,
        setSections,
        imageTitleData,
        setImageTitleData,
        imagesData,
        setImagesData,
        saveArticle,
        saveImages,
        checkOrGenerateSlug,
        updateImagesPreview,
        imageTitlePreview,
        setImageTitlePreview,
        imagesPreview,
        setImagesPreview,
      }}
    >
      {children}
    </BlogContext.Provider>
  )
}

export const useBlogContext = () => useContext(BlogContext)
