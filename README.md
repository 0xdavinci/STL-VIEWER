# STL Viewer

A modern web-based STL file viewer built with Three.js. This application allows you to upload and view 3D STL files in your browser with an intuitive interface.

## Features

- Drag and drop STL file upload
- Interactive 3D model viewing with orbit controls
- Model information display (vertices and faces count)
- Responsive design
- Modern UI with smooth animations
- Automatic camera positioning
- Grid helper for better spatial awareness

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone this repository or download the source code
2. Open a terminal in the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Click the upload area or drag and drop an STL file
2. Use your mouse to interact with the 3D model:
   - Left click + drag to rotate
   - Right click + drag to pan
   - Scroll to zoom
3. Click the "Reset Camera" button to return to the default view
4. The information panel shows details about the loaded model

## Development

The project uses:
- Three.js for 3D rendering
- Vite for development and building
- Modern JavaScript (ES6+)

## License

MIT License 