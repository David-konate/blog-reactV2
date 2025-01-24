import React, { useState, useEffect, useCallback } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useBlogContext } from "../services/BlogProvider"
import ImageUploader from "../components/ImageUploader"

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
  } = useBlogContext()

  const generateSlugFromTitle = useCallback(title => {
    return title
      .toLowerCase()
      .replace(/[^ \w-]/g, "")
      .replace(/\s+/g, "-")
      .trim()
  }, [])

  const createNewSection = setFieldValue => {
    if (sections.length >= 4) {
      alert("Vous ne pouvez pas ajouter plus de 4 sections.")
      return
    }
    const newSections = [
      ...sections,
      {
        text: "",
        image: "",
        imageHeight: null,
        imageWidth: null,
        imagePosition: "top",
      },
    ]
    setSections(newSections)
    setCurrentSectionIndex(newSections.length - 1)
    setFieldValue("sections", newSections)
  }

  const goBackToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prevIndex => prevIndex - 1)
    }
  }

  const save = async values => {
    try {
      const result = await saveArticle(values, imagesData, imageTitleData)
      console.log(result.message)
    } catch (error) {
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
                  setFieldValue("slug", generateSlugFromTitle(e.target.value))
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
              />
              <ErrorMessage
                name="author"
                component="div"
                className="error-message"
              />

              <Field type="date" name="date" className="form-input" />
              <ErrorMessage
                name="date"
                component="div"
                className="error-message"
              />
              {/* Module pour l'image du titre */}
              <div className="title-uploader">
                <h2>Image du titre</h2>
                <ImageUploader
                  uploaderType="title"
                  currentSectionIndex={null}
                  sections={[]}
                  setSections={() => {}}
                />
              </div>
              <Field as="select" name="category" className="form-input">
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
              onChange={value => setFieldValue("resume", value)}
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
                value={sections[currentSectionIndex]?.text || ""}
                onChange={value => {
                  const updatedSections = [...sections]
                  updatedSections[currentSectionIndex] = {
                    ...updatedSections[currentSectionIndex],
                    text: value,
                  }
                  setSections(updatedSections)
                  setFieldValue("sections", updatedSections)
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
              </div>
              <div className="section-actions">
                <button
                  type="button"
                  onClick={() => createNewSection(setFieldValue)}
                  className="btn btn-add-section"
                  disabled={sections.length >= 4}
                >
                  Créer une nouvelle section
                </button>
                <button
                  type="button"
                  onClick={goBackToPreviousSection}
                  className="btn btn-prev-section"
                  disabled={currentSectionIndex <= 0}
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
