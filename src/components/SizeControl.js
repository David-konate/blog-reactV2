import React, { useState, useEffect } from "react"
import { useBlogContext } from "../services/BlogProvider"
import "../style.css" // Import du fichier CSS global

const SizeControl = ({ sectionIndex }) => {
  const { imagesPreview, setImagesPreview } = useBlogContext()

  // Initialiser la taille et la position de la section actuelle
  const [size, setSize] = useState({
    width: imagesPreview[sectionIndex]?.size?.width || 100,
    positionX: imagesPreview[sectionIndex]?.size?.positionX || 0,
    positionY: imagesPreview[sectionIndex]?.size?.positionY || 0,
  })

  // Mettre à jour la taille et la position dans l'état local et dans imagesPreview
  const handleSliderChange = event => {
    const { name, value } = event.target

    setSize(prevSize => ({
      ...prevSize,
      [name]: parseInt(value, 10),
    }))

    // Mettre à jour les données de taille et position dans imagesPreview
    setImagesPreview(previmagesPreview => {
      const updatedimagesPreview = [...previmagesPreview]
      updatedimagesPreview[sectionIndex] = {
        ...updatedimagesPreview[sectionIndex],
        size: {
          ...updatedimagesPreview[sectionIndex]?.size,
          [name]: parseInt(value, 10),
        },
      }
      return updatedimagesPreview
    })
  }

  useEffect(() => {
    const currentSection = imagesPreview[sectionIndex]
    if (currentSection && currentSection.size) {
      setSize({
        width: currentSection.size.width || 100,
        positionX: currentSection.size.positionX || 0,
        positionY: currentSection.size.positionY || 0,
      })
    } else {
      setSize({
        width: "100%",
        positionX: 0,
        positionY: 0,
      })
    }
  }, [sectionIndex, imagesPreview])

  return (
    <div className="size-control-container">
      <h4 className="size-control-heading">
        Modifier la taille et la position de l'image
      </h4>

      <div className="size-control-slider">
        <label className="slider-label">Largeur (%):</label>
        <input
          className="slider"
          type="range"
          name="width"
          min="10"
          max="100"
          value={size.width}
          onChange={handleSliderChange}
        />
        <div className="slider-value">{size.width}%</div>
      </div>

      <div className="size-control-slider">
        <label className="slider-label">Position X (px):</label>
        <input
          className="slider"
          type="range"
          name="positionX"
          min="-500"
          max="500"
          value={size.positionX}
          onChange={handleSliderChange}
        />
        <div className="slider-value">{size.positionX}px</div>
      </div>

      <div className="size-control-slider">
        <label className="slider-label">Position Y (px):</label>
        <input
          className="slider"
          type="range"
          name="positionY"
          min="-500"
          max="500"
          value={size.positionY}
          onChange={handleSliderChange}
        />
        <div className="slider-value">{size.positionY}px</div>
      </div>
    </div>
  )
}

export default SizeControl
