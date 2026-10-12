export const profileData = {
  displayName: 'AYUSH KUMAR',
  name: 'AYUSH',
  role: 'DEVELOPER',
  bio: 'I build playful web experiences and like exploring the space between code, design, and games.',
  portrait: {
    src: '/profile-pic.png',
    alt: 'Ayush',
  },
  github: {
    url: 'https://github.com/ayush60728',
    handle: '@ayush60728',
    label: 'github.com/ayush60728',
    avatarAlt: 'ayush60728',
  },
  email: 'ayushkumar44344@gmail.com',
};

export const projectsData = [
  {
    id: 'agent',
    title: 'Desktop Agent',
    type: 'Local AI',
    stack: 'Python • Ollama • Qwen3',
    desc: 'Self-learning desktop resolver converting natural language to JSON actions.',
    features: [
      'Tiered search & JSON caching for instant local path/folder retrieval.',
      'Integrated local Qwen3 LLM via Ollama for natural language to strict JSON schema execution.',
      'Optimized latency by ~10x using decoding constraints and persistent warm-loading.',
    ],
    github: 'https://github.com/ayush60728/Agent',
  },
  {
    id: 'aquatrace',
    title: 'AquaTrace',
    type: 'Chrome Ext',
    stack: 'Manifest V3 • Tokenizer',
    desc: 'Tracks and estimates water/energy/CO2 footprint of AI conversations.',
    features: [
      'Local token counting via GPT Tokenizer for ChatGPT, Claude, Gemini, and DeepSeek.',
      'Calculates real-time environmental footprints based on research estimates.',
      'Includes daily budget alerts, local data exports, and persistent statistics.',
    ],
    github: 'https://github.com/ayush60728/AquaTrace',
    launch: 'https://chromewebstore.google.com/detail/aquatrace/lmjgniffadnhnpphojncpmaojpiflbcn',
  },
  {
    id: 'synapse',
    title: 'Synapse',
    type: 'P2P Platform',
    stack: 'React 19 • Node.js • WebRTC',
    desc: 'Real-time skill exchange with virtual escrow wallets and 1:1 meeting rooms.',
    features: [
      'Engineered a virtual SKILL_CREDIT escrow wallet with MongoDB Transactions.',
      'Built dynamic 1:1 meeting rooms via WebRTC/Jitsi and Socket.io.',
      'Implemented strict Zod validation, rate limiting, and Multer/ImageKit uploads.',
    ],
    github: 'https://github.com/ayush60728',
  },
  {
    id: 'mf',
    title: 'Mind & Fitness',
    type: 'AI Web App',
    stack: 'React • Gemini API • MediaPipe',
    desc: 'AI coaching assistant with computer vision-based exercise posture analysis.',
    features: [
      'Integrated Gemini API for AI-driven nutrition analysis and personalized coaching.',
      'Developed posture validation and rep tracking using MediaPipe Pose.',
      'Combined real-time computer vision geometry with rule-based form evaluation.',
    ],
    github: 'https://github.com/ayush60728/Tracker-with-posture-detection-',
    launch: 'https://mf-frontend-qs7c.onrender.com',
  },
];

export const skillsData = [
  {
    category: 'Languages',
    skills: ['JavaScript', 'TypeScript', 'Python', 'C++', 'Java', 'SQL'],
  },
  {
    category: 'Frontend',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'HTML/CSS', 'Framer Motion'],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Firebase'],
  },
  {
    category: 'Tools',
    skills: ['Git', 'Docker', 'Linux', 'VS Code', 'Figma'],
  },
  {
    category: 'AI/ML',
    skills: ['MediaPipe', 'Gemini API', 'Ollama', 'LangChain'],
  },
];
