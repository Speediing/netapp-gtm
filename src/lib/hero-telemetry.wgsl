struct Params {
  time: f32,
  texel: vec2f,
}

@group(0) @binding(0) var<uniform> params: Params;

fn hash21(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

fn ribbons(p: vec2f, t: f32) -> f32 {
  var acc = 0.0;
  for (var i = 0; i < 5; i = i + 1) {
    let fi = f32(i);
    let y0 = -0.26 + fi * 0.12;
    let amp = 0.026 + fi * 0.006;
    let freq = 5.0 + fi * 1.5;
    let speed = 0.22 + fi * 0.07;
    let y = y0 + amp * sin(p.x * freq + t * speed + fi);
    let distance = abs(p.y - y);
    acc += (1.0 - smoothstep(0.0, 0.003, distance)) * (0.24 - fi * 0.025);
  }
  return acc;
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = params.texel.y / max(params.texel.x, 1.0e-6);
  let p = (uv - vec2f(0.5)) * vec2f(aspect, 1.0);
  let traces = ribbons(p, params.time);
  let cell = floor(uv * vec2f(32.0, 18.0));
  let noise = hash21(cell);
  let pulse = 0.5 + 0.5 * sin(params.time * 1.4 + noise * 36.0);
  let spark = step(0.974, noise) * pulse;
  let edgeFade = smoothstep(0.02, 0.22, uv.x) * smoothstep(0.98, 0.74, uv.x);
  let topFade = smoothstep(0.02, 0.18, uv.y) * smoothstep(0.84, 0.58, uv.y);

  let blue = vec3f(0.309804, 0.525490, 0.776471);
  let coral = vec3f(0.831373, 0.462745, 0.407843);
  let color = mix(blue, coral, spark * 0.7);
  var alpha = traces * 0.26 + spark * 0.08;
  alpha *= edgeFade * topFade;
  alpha = clamp(alpha, 0.0, 0.22);

  return vec4f(color * alpha, alpha);
}
