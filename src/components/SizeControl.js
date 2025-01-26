import React, { useState } from "react"
import { useBlogContext } from "../services/BlogProvider"

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
      console.log("Updated ImagesPreview:", updatedPreview) // Log the updated state
      return updatedPreview
    })
  }

  return (
    <div
      style={{
        margin: "20px 0",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h4>Modifier la taille et la position de l'image</h4>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Largeur (%):
        </label>
        <input
          type="range"
          name="width"
          min="10"
          max="100"
          value={size.width}
          onChange={handleSliderChange}
        />
        <div>{size.width}%</div>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Position X (px):
        </label>
        <input
          type="range"
          name="positionX"
          min="-500"
          max="500"
          value={size.positionX}
          onChange={handleSliderChange}
        />
        <div>{size.positionX}px</div>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Position Y (px):
        </label>
        <input
          type="range"
          name="positionY"
          min="-500"
          max="500"
          value={size.positionY}
          onChange={handleSliderChange}
        />
        <div>{size.positionY}px</div>
      </div>
    </div>
  )
}

export default SizeControl
