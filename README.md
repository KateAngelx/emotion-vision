# EmotionVision Studio

An interactive, privacy-first web application that tracks facial expressions in real-time right inside your web browser. You can customize your video feed layout, apply photo filters, turn on dynamic privacy masks, and print vintage-style photobooth cards.

## Core Features

* Live Screen Aspect Ratios: Instantly reframe the webcam preview canvas using 4:3 standard, 16:9 widescreen, or 1:1 square layouts without image distortion.
* Local Emotion Recognition: Processes your expressions frame-by-frame on-device using a smart classifier, displaying your top mood and prediction confidence.
* Vintage Filter System: Apply live picture color adjustments like Monochrome Black & White, Retro Red, or Electric Blue profiles.
* Privacy Masking Controls: Keep your identity protected using customized face blurs or graphic cutout overlays.
* Photobooth Strip Printing: Snap an automated sequence of photos with built-in timers and flash effects to compile a downloadable verticle strip or grid card.
* Customizable Layout Overlays: Choose whether to bake the expression label pills or the target face bracket boxes into your final image save files.

## Privacy and Security Shield

This project is built from the ground up to respect user security. 

* 100% Client-Side Inferences: Your camera feed stays entirely local. The machine learning models process your facial expressions inside your browser memory loop.
* Local Sandboxing: Photobooth collage strip generation and final print compilations are made using custom local image data URLs. 
* No Data Collection: No images, video frames, or metrics are ever uploaded, saved, or sent over a network to an external server or database anchor. Everything flushes completely when you close the tab.

## Built With

* React 18 - User interface framework
* Vite - Fast local development environment and build compiler
* Tailwind CSS - Responsive layout and interface styling
* face-api.js - On-device facial tracking and expression classification
* react-webcam - Hardware camera interface access
* Lucide React - Clean and simple iconography

## Getting Started

Follow these steps to run the studio environment locally on your machine.

### Prerequisites

Make sure you have Node.js installed on your computer.

### Installation

1. Clone the repository down to your local directory:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/emotion-vision.git](https://github.com/YOUR_USERNAME/emotion-vision.git)