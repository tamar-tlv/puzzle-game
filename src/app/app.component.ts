import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
  image: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Puzzle Game';
  
  // Game settings
  difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  pieceCount: number = 9;
  customImage: string | null = null;
  
  // Default images - initialized in ngOnInit
  defaultImages: string[] = [];
  
  selectedDefaultImage: string = '';
  
  // Game state
  gameStarted = false;
  puzzlePieces: PuzzlePiece[] = [];
  draggedPiece: PuzzlePiece | null = null;
  gameCompleted = false;
  moveCount = 0;
  startTime: number = 0;
  elapsedTime: string = '00:00';
  timerInterval: any;
  shareLink: string = '';
  
  gridSize = 3; // Will be calculated based on piece count
  
  ngOnInit() {
    this.updateGridSize();
    // Initialize default images with placeholders
    this.defaultImages = [
      this.createPlaceholderImage('#667eea', '#764ba2'),
      this.createPlaceholderImage('#f093fb', '#f5576c'),
      this.createPlaceholderImage('#4facfe', '#00f2fe')
    ];
    this.selectedDefaultImage = this.defaultImages[0];
  }
  
  createPlaceholderImage(color1: string, color2: string): string {
    // Create a data URI with a colorful pattern
    const svg = `
      <svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad${color1}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="600" height="600" fill="url(#grad${color1})"/>
        <circle cx="150" cy="150" r="80" fill="rgba(255,255,255,0.2)"/>
        <circle cx="450" cy="450" r="120" fill="rgba(255,255,255,0.15)"/>
        <circle cx="450" cy="150" r="60" fill="rgba(255,255,255,0.1)"/>
        <circle cx="150" cy="450" r="90" fill="rgba(255,255,255,0.12)"/>
        <circle cx="300" cy="300" r="100" fill="rgba(255,255,255,0.08)"/>
        <rect x="100" y="500" width="400" height="20" fill="rgba(255,255,255,0.15)"/>
        <rect x="500" y="100" width="20" height="400" fill="rgba(255,255,255,0.15)"/>
      </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }
  
  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  
  onDifficultyChange() {
    switch (this.difficulty) {
      case 'easy':
        this.pieceCount = 9;
        break;
      case 'medium':
        this.pieceCount = 16;
        break;
      case 'hard':
        this.pieceCount = 25;
        break;
    }
    this.updateGridSize();
  }
  
  onPieceCountChange() {
    this.updateGridSize();
  }
  
  updateGridSize() {
    this.gridSize = Math.sqrt(this.pieceCount);
  }
  
  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.customImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  onDefaultImageSelect(image: string) {
    this.selectedDefaultImage = image;
    this.customImage = null;
  }
  
  startGame() {
    this.gameStarted = true;
    this.gameCompleted = false;
    this.moveCount = 0;
    this.startTime = Date.now();
    this.shareLink = '';
    
    const imageToUse = this.customImage || this.selectedDefaultImage;
    this.createPuzzlePieces(imageToUse);
    this.shufflePieces();
    
    // Start timer
    this.timerInterval = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      const seconds = Math.floor(elapsed / 1000);
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      this.elapsedTime = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
  }
  
  createPuzzlePieces(imageUrl: string) {
    this.puzzlePieces = [];
    const totalPieces = this.pieceCount;
    
    for (let i = 0; i < totalPieces; i++) {
      this.puzzlePieces.push({
        id: i,
        currentPosition: i,
        correctPosition: i,
        image: imageUrl
      });
    }
  }
  
  shufflePieces() {
    // Fisher-Yates shuffle
    const positions = Array.from({ length: this.pieceCount }, (_, i) => i);
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    this.puzzlePieces.forEach((piece, index) => {
      piece.currentPosition = positions[index];
    });
    
    // Sort by current position for display
    this.puzzlePieces.sort((a, b) => a.currentPosition - b.currentPosition);
  }
  
  onDragStart(piece: PuzzlePiece) {
    this.draggedPiece = piece;
  }
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  
  onDrop(targetPiece: PuzzlePiece) {
    if (this.draggedPiece && this.draggedPiece !== targetPiece) {
      // Swap positions
      const tempPosition = this.draggedPiece.currentPosition;
      this.draggedPiece.currentPosition = targetPiece.currentPosition;
      targetPiece.currentPosition = tempPosition;
      
      // Re-sort
      this.puzzlePieces.sort((a, b) => a.currentPosition - b.currentPosition);
      
      this.moveCount++;
      this.checkCompletion();
    }
    this.draggedPiece = null;
  }
  
  checkCompletion() {
    const isComplete = this.puzzlePieces.every(piece => 
      piece.currentPosition === piece.correctPosition
    );
    
    if (isComplete) {
      this.gameCompleted = true;
      clearInterval(this.timerInterval);
      this.generateShareLink();
    }
  }
  
  generateShareLink() {
    const gameData = {
      difficulty: this.difficulty,
      pieceCount: this.pieceCount,
      moveCount: this.moveCount,
      time: this.elapsedTime,
      hasCustomImage: !!this.customImage
    };
    
    const encoded = btoa(JSON.stringify(gameData));
    this.shareLink = `${window.location.origin}${window.location.pathname}?game=${encoded}`;
  }
  
  copyShareLink() {
    navigator.clipboard.writeText(this.shareLink).then(() => {
      alert('Share link copied to clipboard!');
    });
  }
  
  resetGame() {
    this.gameStarted = false;
    this.gameCompleted = false;
    this.puzzlePieces = [];
    this.moveCount = 0;
    this.elapsedTime = '00:00';
    this.shareLink = '';
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  
  getPieceStyle(piece: PuzzlePiece) {
    const row = Math.floor(piece.correctPosition / this.gridSize);
    const col = piece.correctPosition % this.gridSize;
    const size = 100 / this.gridSize;
    
    return {
      'background-image': `url(${piece.image})`,
      'background-size': `${this.gridSize * 100}% ${this.gridSize * 100}%`,
      'background-position': `-${col * 100}% -${row * 100}%`,
      'width': `${size}%`,
      'height': `${size}%`
    };
  }
}
