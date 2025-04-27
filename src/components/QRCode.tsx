
import { useEffect, useRef } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

const QRCode = ({ value, size = 200 }: QRCodeProps) => {
  const qrContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!qrContainerRef.current) return;

    // Simulate QR code rendering with placeholders
    const renderQRCode = async () => {
      const container = qrContainerRef.current;
      if (!container) return;

      // Clear previous content
      container.innerHTML = '';
      
      // Create a mock QR code with SVG
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute('width', size.toString());
      svg.setAttribute('height', size.toString());
      svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
      
      // Background
      const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      background.setAttribute('width', size.toString());
      background.setAttribute('height', size.toString());
      background.setAttribute('fill', '#ffffff');
      svg.appendChild(background);
      
      // Draw a mock QR code pattern (grid of squares)
      const gridSize = 10;
      const cellSize = size / gridSize;
      
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          // Don't fill corners fully to create a QR code-like appearance
          if ((i < 3 && j < 3) || (i < 3 && j > gridSize - 4) || (i > gridSize - 4 && j < 3)) {
            // Position detection patterns (corners)
            const cornerSquare = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            cornerSquare.setAttribute('x', (j * cellSize).toString());
            cornerSquare.setAttribute('y', (i * cellSize).toString());
            cornerSquare.setAttribute('width', cellSize.toString());
            cornerSquare.setAttribute('height', cellSize.toString());
            cornerSquare.setAttribute('fill', '#000000');
            svg.appendChild(cornerSquare);
          } else {
            // Random pattern for the rest of the QR code
            if (Math.random() > 0.6) {
              const square = document.createElementNS("http://www.w3.org/2000/svg", "rect");
              square.setAttribute('x', (j * cellSize).toString());
              square.setAttribute('y', (i * cellSize).toString());
              square.setAttribute('width', cellSize.toString());
              square.setAttribute('height', cellSize.toString());
              square.setAttribute('fill', '#000000');
              svg.appendChild(square);
            }
          }
        }
      }
      
      // Add mock finder patterns (the "eyes" of the QR code)
      // Top-left
      drawFinderPattern(svg, 0, 0, cellSize);
      // Top-right
      drawFinderPattern(svg, gridSize - 3, 0, cellSize);
      // Bottom-left
      drawFinderPattern(svg, 0, gridSize - 3, cellSize);
      
      container.appendChild(svg);
    };
    
    const drawFinderPattern = (svg: SVGSVGElement, x: number, y: number, cellSize: number) => {
      // Outer square
      const outer = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      outer.setAttribute('x', (x * cellSize).toString());
      outer.setAttribute('y', (y * cellSize).toString());
      outer.setAttribute('width', (3 * cellSize).toString());
      outer.setAttribute('height', (3 * cellSize).toString());
      outer.setAttribute('fill', '#000000');
      svg.appendChild(outer);
      
      // Middle square
      const middle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      middle.setAttribute('x', ((x + 0.5) * cellSize).toString());
      middle.setAttribute('y', ((y + 0.5) * cellSize).toString());
      middle.setAttribute('width', (2 * cellSize).toString());
      middle.setAttribute('height', (2 * cellSize).toString());
      middle.setAttribute('fill', '#ffffff');
      svg.appendChild(middle);
      
      // Inner square
      const inner = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      inner.setAttribute('x', ((x + 1) * cellSize).toString());
      inner.setAttribute('y', ((y + 1) * cellSize).toString());
      inner.setAttribute('width', cellSize.toString());
      inner.setAttribute('height', cellSize.toString());
      inner.setAttribute('fill', '#000000');
      svg.appendChild(inner);
    };
    
    renderQRCode();
  }, [value, size]);

  return <div ref={qrContainerRef}></div>;
};

export default QRCode;
