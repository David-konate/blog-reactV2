import React, { useState } from "react"
import { useBlogContext } from "../services/BlogProvider"
import "../style.css" // Import du fichier CSS global

const SizeControl = ({ sectionIndex }) => {
  const { imagesPreview, setImagesPreview, currentSectionIndex } =
    useBlogContext()

  const [size, setSize] = useState(
    imagesPreview[currentSectionIndex]?.size || {
      width: 100, // Slider values are percentages or pixels
      positionX: 0,
      positionY: 0,
    }
  )

  const handleSliderChange = event => {
    const { name, value } = event.target

    setSize(prevSize => ({
      ...prevSize,
      [name]: parseInt(value, 10),
    }))

    // Update preview in context
    setImagesPreview(prev => {
      const updatedPreview = [...prev]
      updatedPreview[currentSectionIndex] = {
        ...updatedPreview[currentSectionIndex],
        size: {
          ...updatedPreview[currentSectionIndex]?.size,
          [name]: parseInt(value, 10),
        },
      }
      return updatedPreview
    })
  }

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
