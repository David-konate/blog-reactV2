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
  const {
    saveArticle,
    imageTitleData,
    imagesData,
    currentSectionIndex,
    setCurrentSectionIndex,
    sections,
    setSections,
    setMetadata,
  } = useBlogContext()

  const [isSaving, setIsSaving] = useState(false)

  const generateSlugFromTitle = useCallback(title => {
    return title
      .toLowerCase()
      .replace(/[^ \w-]/g, "")
      .replace(/\s+/g, "-")
      .trim()
  }, [])

  const syncMetadata = useCallback(
    values => {
      setMetadata({
        title: values.title,
        author: values.author,
        date: values.date,
        category: values.category,
        slug: generateSlugFromTitle(values.title), // Générer un slug basé sur le titre
        image: imageTitleData || "", // Image du titre
        cardImage: "", // Ajouter la logique pour gérer la "cardImage" si nécessaire
        resume: values.resume,
        sections: sections.map(section => ({
          text: section.text || "", // S'assurer que 'text' est défini
          image: section.image || "", // S'assurer que 'image' est défini
          position: section.position || "", // S'assurer que 'position' est défini
          size: section.size || "", // S'assurer que 'size' est défini
        })),
      })
    },
    [imageTitleData, setMetadata, sections, generateSlugFromTitle]
  )

  const createNewSection = setFieldValue => {
    if (sections.length >= 4) {
      alert("Vous ne pouvez pas ajouter plus de 4 sections.")
      return
    }

    const lastSection = sections[sections.length - 1]
    if (!lastSection?.text && !lastSection?.image) {
      alert(
        "Veuillez ajouter du texte ou une image à la section avant d'ajouter une nouvelle."
      )
      return
    }

    const newSections = [
      ...sections,
      {
        text: "",
        image: "",
        position: null,
        size: null,
      },
    ]

    setSections(newSections)
    setCurrentSectionIndex(prevIndex => prevIndex + 1)
    setFieldValue("sections", newSections)
  }

  const goBackToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      const updatedSections = [...sections]
      updatedSections.pop()
      setSections(updatedSections)
      setCurrentSectionIndex(prevIndex => prevIndex - 1)
    }
  }

  const save = async values => {
    try {
      setIsSaving(true) // Set isSaving to true when saving begins
      syncMetadata(values) // Synchronize with metadata
      const result = await saveArticle(values, imagesData, imageTitleData)
      console.log(result.message)
      setIsSaving(false) // Set isSaving to false after the article is saved
    } catch (error) {
      setIsSaving(false) // Set isSaving to false if an error occurs
      console.error(error.message)
    }
  }

  return (
    <div className="blog-creator-container">
      <h1 className="blog-creator-title">Créer un article pour le blog</h1>

      <Formik
        initialValues={{
          title: "",
          author: "",
          date: "",
          category: "",
          slug: "",
          resume: "",
          sections: [],
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
                  setFieldValue("title", e.target.value)
                  const newSlug = generateSlugFromTitle(e.target.value)
                  setFieldValue("slug", newSlug)
                  syncMetadata({
                    ...values,
                    title: e.target.value,
                    slug: newSlug,
                  })
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
                  setFieldValue("author", e.target.value)
                  syncMetadata({ ...values, author: e.target.value })
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
                  setFieldValue("date", e.target.value)
                  syncMetadata({ ...values, date: e.target.value })
                }}
              />
              <ErrorMessage
                name="date"
                component="div"
                className="error-message"
              />

              <div className="title-uploader">
                <h2>Image du titre</h2>
                <ImageUploader
                  uploaderType="title"
                  currentSectionIndex={null}
                  sections={[]}
                  setSections={() => {}}
                />
              </div>

              <Field
                as="select"
                name="category"
                className="form-input"
                onChange={e => {
                  setFieldValue("category", e.target.value)
                  syncMetadata({ ...values, category: e.target.value })
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
                syncMetadata({ ...values, resume: value })
              }}
              className="react-quill"
            />
            <ErrorMessage
              name="resume"
              component="div"
              className="error-message"
            />

            <div className="section-editor">
              <h3>Section {currentSectionIndex + 1}</h3>
              <ReactQuill
                value={sections[currentSectionIndex]?.text || ""} // Affiche une chaîne vide si pas de texte
                onChange={value => {
                  const updatedSections = [...sections]
                  updatedSections[currentSectionIndex] = {
                    ...updatedSections[currentSectionIndex],
                    text: value,
                  }
                  setSections(updatedSections)
                  setFieldValue("sections", updatedSections)
                  syncMetadata({ ...values, sections: updatedSections })
                }}
                className="react-quill"
              />

              <div className="section-uploader">
                <h2>Images des sections</h2>
                <ImageUploader
                  uploaderType="section"
                  currentSectionIndex={currentSectionIndex}
                  sections={sections}
                  setSections={setSections}
                />
                {/* Contrôles pour la position et la taille */}
                <SizeControl />
              </div>
              <br />
              <div className="section-actions">
                <button
                  type="button"
                  onClick={() => createNewSection(setFieldValue)}
                  className="btn btn-add-section"
                  disabled={sections.length >= 4} // Désactive le bouton si sections.length >= 4
                  style={{
                    cursor: sections.length >= 4 ? "not-allowed" : "pointer",
                    opacity: sections.length >= 4 ? 0.6 : 1,
                  }}
                >
                  Créer une nouvelle section
                </button>

                <button
                  type="button"
                  onClick={goBackToPreviousSection}
                  className="btn btn-prev-section"
                  disabled={sections.length <= 1} // Désactive le bouton si sections.length <= 1
                  style={{
                    cursor: sections.length <= 1 ? "not-allowed" : "pointer",
                    opacity: sections.length <= 1 ? 0.6 : 1,
                  }}
                >
                  Retour à la section précédente
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-submit">
              Sauvegarder l'article
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default BlogPostCreator
