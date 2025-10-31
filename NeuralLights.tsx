import React, { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const NeuralLights: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodes: Node[] = [];

  const createNodes = (width: number, height: number) => {
    for (let i = 0; i < 40; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
      });
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Draw neuron links
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = 1 - dist / 120;
          ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#00ffff";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#00ffff";
      ctx.fill();

      // Move
      n.x += n.vx;
      n.y += n.vy;

      // Bounce off edges
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    createNodes(width, height);

    const animate = () => {
      draw(ctx, width, height);
      requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
      <div className="absolute inset-0 flex items-center justify-center text-cyan-400 font-bold text-3xl tracking-widest">
        Neural Lights ⚡
      </div>
    </div>
  );
};

export default NeuralLights;
