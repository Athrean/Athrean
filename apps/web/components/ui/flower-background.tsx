"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float time;
  uniform vec2 resolution;

  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= resolution.x / resolution.y;

    float t = time * 0.15;

    // Flowing wave distortion
    vec2 q = vec2(fbm(p + t * 0.4), fbm(p + vec2(1.0)));
    vec2 r = vec2(fbm(p + q + vec2(1.7, 9.2) + t * 0.3), fbm(p + q + vec2(8.3, 2.8) + t * 0.2));

    float f = fbm(p + r * 1.5);

    // Color palette - teal greens
    vec3 tealDark = vec3(0.06, 0.28, 0.22);
    vec3 tealMid = vec3(0.1, 0.42, 0.35);
    vec3 tealLight = vec3(0.16, 0.52, 0.42);

    // Color palette - pinks/corals
    vec3 pinkLight = vec3(0.96, 0.75, 0.72);
    vec3 pinkMid = vec3(0.94, 0.65, 0.65);
    vec3 coral = vec3(0.98, 0.82, 0.68);

    // Create layered color mixing
    vec3 color = tealDark;

    // Add flowing teal variations
    color = mix(color, tealMid, smoothstep(-0.5, 0.5, f));
    color = mix(color, tealLight, smoothstep(0.0, 0.8, f * q.x));

    // Add pink petal-like shapes
    float petal1 = smoothstep(0.2, 0.6, f + r.x * 0.5);
    float petal2 = smoothstep(0.3, 0.7, f + r.y * 0.4);

    color = mix(color, pinkLight, petal1 * 0.7);
    color = mix(color, pinkMid, petal2 * 0.5);

    // Add warm coral highlights in center
    float center = 1.0 - length(p) * 0.5;
    center = smoothstep(0.0, 1.0, center);
    float highlight = smoothstep(0.3, 0.8, f + center * 0.3);
    color = mix(color, coral, highlight * center * 0.6);

    // Add subtle vignette
    float vignette = 1.0 - length(uv - 0.5) * 0.8;
    vignette = smoothstep(0.2, 1.0, vignette);
    color *= vignette * 0.3 + 0.7;

    // Subtle brightness variation
    color *= 0.9 + 0.1 * sin(f * 3.0 + t);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function FlowerBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Create shaders
    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    gl.shaderSource(vs, vertexShader);
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(vs);
    gl.compileShader(fs);

    // Create program
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Create buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "time");
    const resolutionLocation = gl.getUniformLocation(program, "resolution");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const startTime = Date.now();
    const ANIMATION_DURATION = 5000; // Stop animation after 5 seconds
    let isStopped = false;
    let finalTime = 0;

    const draw = (time: number) => {
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const render = () => {
      const elapsed = Date.now() - startTime;

      // After 5 seconds, freeze the time value
      if (elapsed >= ANIMATION_DURATION && !isStopped) {
        isStopped = true;
        finalTime = elapsed / 1000;
      }

      const time = isStopped ? finalTime : elapsed / 1000;
      draw(time);

      // Only continue animation loop if not stopped
      if (!isStopped) {
        animationRef.current = requestAnimationFrame(render);
      }
    };

    const handleResize = () => {
      resize();
      // Redraw with the frozen time if animation has stopped
      if (isStopped) {
        draw(finalTime);
      }
    };

    resize();
    window.addEventListener("resize", handleResize);
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
