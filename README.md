# Puzzle Game

An interactive puzzle game built with Angular 18 featuring an attractive visual interface and customizable gameplay.

## Features

✨ **Attractive Visual Interface** - Modern, responsive design with smooth animations and gradients

🎮 **Difficulty Levels** - Choose between Easy (3x3), Medium (4x4), and Hard (5x5) puzzle grids

🧩 **Customizable Pieces** - Adjust the number of puzzle pieces from 4 to 36 (2x2 to 6x6 grids)

📸 **Custom Image Upload** - Upload your own images to create personalized puzzles

🎨 **Default Patterns** - Select from beautiful gradient patterns:
- Purple/Blue gradient with geometric shapes
- Pink/Red gradient with decorative elements
- Cyan/Turquoise gradient with modern design

🔗 **Share Links** - Generate shareable links to show off your puzzle completion stats

⏱️ **Game Stats** - Track your moves and time to complete each puzzle

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tamar-tlv/puzzle-game.git
cd puzzle-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

### Building for Production

Build the project for production deployment:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## How to Play

1. **Choose Your Settings**:
   - Select a difficulty level (Easy, Medium, or Hard)
   - Adjust the number of pieces using the slider
   - Upload a custom image OR select a default gradient pattern

2. **Start the Game**:
   - Click the "Start Game" button
   - The puzzle pieces will be shuffled

3. **Solve the Puzzle**:
   - Drag and drop pieces to rearrange them
   - Pieces that are in the correct position will be highlighted
   - Watch your move count and time

4. **Complete and Share**:
   - Once completed, a congratulations modal will appear
   - Copy the share link to share your achievement
   - Click "Play Again" to start a new puzzle

## Technology Stack

- **Angular 18** - Modern web framework
- **TypeScript** - Type-safe programming
- **CSS3** - Styling with gradients and animations
- **HTML5** - Semantic markup
- **Drag & Drop API** - Native browser drag and drop

## Project Structure

```
puzzle-game/
├── src/
│   ├── app/
│   │   ├── app.component.ts       # Main component logic
│   │   ├── app.component.html     # Template
│   │   ├── app.component.css      # Styles
│   │   └── app.routes.ts          # Routing configuration
│   ├── assets/                    # Static assets
│   ├── index.html                 # Main HTML file
│   ├── main.ts                    # Application entry point
│   └── styles.css                 # Global styles
├── angular.json                   # Angular configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
