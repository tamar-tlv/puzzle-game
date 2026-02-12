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
  
  // Default images
  defaultImages = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/800px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg'
  ];
  
  selectedDefaultImage: string = this.defaultImages[0];
  
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
