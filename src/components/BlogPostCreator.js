import React, { useState, useEffect, useCallback } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useBlogContext } from "../services/BlogProvider"
import ImageUploader from "./ImageUploader"
import SizeControl from "./SizeControl"

const CreateArticleSchema = Yup.object().shape({
  title: Yup.string().required("Veuillez entrer le titre de votre article"),
  author: Yup.string().required("Veuillez entrer l'auteur de votre article"),
  date: Yup.string().required("Veuillez choisir une date d'article"),
  category: Yup.string().required("Veuillez choisir une catégorie"),
  slug: Yup.string().required("Veuillez entrer le slug de votre article"),
  resume: Yup.string().required("Veuillez entrer la description de l'article"),
})

const BlogPostCreator = () => {
  const { saveArticle, metadata, setMetadata, imageTitleData, imagesData } =
    useBlogContext()

  const [isSaving, setIsSaving] = useState(false)

  // Fonction pour générer un slug à partir du titre
  const generateSlugFromTitle = useCallback(title => {
    return title
      .toLowerCase()
      .replace(/[^ \w-]/g, "")
      .replace(/\s+/g, "-")
      .trim()
  }, [])

  // Fonction pour ajouter une nouvelle section à metadata
  const createNewSection = () => {
    if (metadata.sections.length < 4) {
      const newSection = {
        text: "", // Le texte de la nouvelle section
        image: "", // L'image de la nouvelle section
        position: { x: "", y: "" }, // Position de la nouvelle section
        size: { width: "", height: "" }, // Taille de la nouvelle section
      }

      // Ajout de la nouvelle section à la fin de sections existantes
      setMetadata(prevMetadata => ({
        ...prevMetadata,
        sections: [...prevMetadata.sections, newSection], // On ajoute simplement la nouvelle section
      }))
    } else {
      alert("Vous ne pouvez pas ajouter plus de 4 sections.")
    }
  }

  // Fonction pour supprimer la dernière section
  const removeLastSection = () => {
    if (metadata.sections.length > 1) {
      setMetadata(prevMetadata => {
        const updatedSections = prevMetadata.sections.slice(0, -1) // Supprime la dernière section
        return {
          ...prevMetadata,
          sections: updatedSections, // On met à jour sections sans la dernière
        }
      })
    }
  }

  // Sauvegarde des valeurs de l'article
  const save = async values => {
    try {
      setIsSaving(true)
      const result = await saveArticle(metadata, imagesData, imageTitleData)
      console.log(result.message)
      setIsSaving(false)
    } catch (error) {
      console.error(error.message)
      setIsSaving(false)
    }
  }

  return (
    <div className="blog-creator-container">
      <h1 className="blog-creator-title">Créer un article pour le blog</h1>

      <Formik
        initialValues={{
          title: metadata.title || "",
          author: metadata.author || "",
          date: metadata.date || "",
          category: metadata.category || "",
          slug: metadata.slug || "",
          resume: metadata.resume || "",
        }}
        validationSchema={CreateArticleSchema}
        onSubmit={save}
      >
        {({ values, setFieldValue }) => (
          <Form className="blog-form">
            <div className="form-group">
              <Field
                type="text"
                name="title"
                placeholder="Titre de l'article"
                className="form-input"
                onChange={e => {
                  const newTitle = e.target.value
                  setFieldValue("title", newTitle)
                  const newSlug = generateSlugFromTitle(newTitle)
                  setFieldValue("slug", newSlug)

                  setMetadata(prevMetadata => ({
                    ...prevMetadata,
                    title: newTitle,
                    slug: newSlug,
                  }))
                }}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="error-message"
              />

              <Field
                type="text"
                name="author"
                placeholder="Auteur"
                className="form-input"
                onChange={e => {
                  const newAuthor = e.target.value
                  setFieldValue("author", newAuthor)
                  setMetadata(prevMetadata => ({
                    ...prevMetadata,
                    author: newAuthor,
                  }))
                }}
              />
              <ErrorMessage
                name="author"
                component="div"
                className="error-message"
              />

              <Field
                type="date"
                name="date"
                className="form-input"
                onChange={e => {
                  const newDate = e.target.value
                  setFieldValue("date", newDate)
                  setMetadata(prevMetadata => ({
                    ...prevMetadata,
                    date: newDate,
                  }))
                }}
              />
              <ErrorMessage
                name="date"
                component="div"
                className="error-message"
              />

              <div className="title-uploader">
                <h2>Image du titre</h2>
                <ImageUploader uploaderType="title" />
              </div>

              <Field
                as="select"
                name="category"
                className="form-input"
                onChange={e => {
                  const newCategory = e.target.value
                  setFieldValue("category", newCategory)
                  setMetadata(prevMetadata => ({
                    ...prevMetadata,
                    category: newCategory,
                  }))
                }}
              >
                <option value="">Sélectionnez une catégorie</option>
                <option value="Events">Events</option>
                <option value="Application">Application</option>
                <option value="Divers">Divers</option>
                <option value="Playgrounds">Playgrounds</option>
                <option value="Streetball">Streetball</option>
              </Field>
              <ErrorMessage
                name="category"
                component="div"
                className="error-message"
              />

              <Field
                type="text"
                name="slug"
                placeholder="Slug"
                className="form-input"
                disabled
              />
              <ErrorMessage
                name="slug"
                component="div"
                className="error-message"
              />
            </div>

            <ReactQuill
              theme="snow"
              value={values.resume}
              onChange={value => {
                setFieldValue("resume", value)
                setMetadata(prevMetadata => ({
                  ...prevMetadata,
                  resume: value,
                }))
              }}
              className="react-quill"
            />
            <ErrorMessage
              name="resume"
              component="div"
              className="error-message"
            />

            <div className="section-editor">
              <h3>Section {metadata.sections.length}</h3>
              <ReactQuill
                theme="snow"
                value={
                  metadata.sections[metadata.sections.length - 1]?.text || ""
                }
                onChange={value => {
                  // Mettre à jour la dernière section
                  setMetadata(prevMetadata => {
                    const updatedSections = prevMetadata.sections.map(
                      (section, index) =>
                        index === prevMetadata.sections.length - 1
                          ? { ...section, text: value }
                          : section
                    )
                    return {
                      ...prevMetadata,
                      sections: updatedSections,
                    }
                  })
                }}
                className="react-quill"
              />

              <div className="section-uploader">
                <h2>Images des sections</h2>
                <ImageUploader
                  uploaderType="section"
                  currentSectionIndex={metadata.sections.length - 1}
                />
                <SizeControl />
              </div>

              <div className="section-actions">
                <button
                  type="button"
                  onClick={createNewSection}
                  className="btn btn-add-section"
                  disabled={metadata.sections.length > 3}
                >
                  Ajouter une nouvelle section
                </button>
                <button
                  type="button"
                  onClick={removeLastSection}
                  className="btn btn-remove-section"
                  disabled={metadata.sections.length <= 1}
                >
                  Supprimer la dernière section
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-submit">
              {isSaving ? "Sauvegarde en cours..." : "Sauvegarder l'article"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default BlogPostCreator
