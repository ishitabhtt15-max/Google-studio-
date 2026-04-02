import { Github, Linkedin, Mail, ExternalLink, Code2, Palette, Zap, Layout } from 'lucide-react';

export const PROJECTS = [
  {
    id: 1,
    title: "THE NEWS",
    type: "UI",
    category: "Digital Platform",
    client: "Global Media Group",
    year: "2024",
    services: ["UI/UX Design", "Brand Identity", "Motion"],
    description: "A modern news platform designed for the digital age, focusing on readability and immersive storytelling.",
    longDescription: "The News is a comprehensive redesign of a global media platform. Our goal was to create a reading experience that feels as tactile as a physical newspaper while leveraging the full power of digital interactivity. We focused on typography, whitespace, and a modular grid system that allows for dynamic content layout without sacrificing consistency.",
    image: "https://picsum.photos/seed/news/1920/1080",
    gallery: [
      "https://picsum.photos/seed/news1/1200/800",
      "https://picsum.photos/seed/news2/1200/800",
      "https://picsum.photos/seed/news3/1200/800"
    ],
    color: "#1d1d1f",
    tags: ["Media", "Typography", "Web Design"],
    link: "#"
  },
  {
    id: 2,
    title: "ECOTRACK",
    type: "UX",
    category: "Sustainability",
    client: "Green Horizon",
    year: "2023",
    services: ["Product Strategy", "Mobile Design"],
    description: "Helping users reduce their carbon footprint through real-time energy monitoring and gamified challenges.",
    longDescription: "EcoTrack empowers individuals to take control of their environmental impact. By integrating with smart home devices, the app provides real-time feedback on energy consumption and suggests actionable steps to reduce waste.",
    image: "https://picsum.photos/seed/eco/1920/1080",
    gallery: [
      "https://picsum.photos/seed/eco1/1200/800",
      "https://picsum.photos/seed/eco2/1200/800"
    ],
    color: "#1d1d1f",
    tags: ["Mobile App", "Data Viz", "Product Design"],
    link: "#"
  },
  {
    id: 3,
    title: "AURA MUSIC",
    type: "UI",
    category: "Entertainment",
    client: "Aura Labs",
    year: "2024",
    services: ["UI Design", "Motion Graphics"],
    description: "An immersive music streaming experience that adapts its visual language to the mood of the track.",
    longDescription: "Aura Music redefines how we interact with sound. The interface uses generative art algorithms to create a unique visual landscape for every song, making the listening experience truly multi-sensory.",
    image: "https://picsum.photos/seed/music/1920/1080",
    gallery: [
      "https://picsum.photos/seed/music1/1200/800",
      "https://picsum.photos/seed/music2/1200/800"
    ],
    color: "#1d1d1f",
    tags: ["UI Design", "Motion", "Web Audio"],
    link: "#"
  },
  {
    id: 4,
    title: "NEXUS FLOW",
    type: "UX",
    category: "Productivity",
    client: "Nexus Corp",
    year: "2024",
    services: ["UX Research", "Information Architecture"],
    description: "Streamlining complex enterprise workflows through intuitive information architecture and user-centric flows.",
    longDescription: "Nexus Flow is a deep dive into enterprise complexity. We interviewed 50+ stakeholders to identify bottlenecks in their daily operations, resulting in a 40% increase in task completion speed.",
    image: "https://picsum.photos/seed/nexus/1920/1080",
    gallery: [
      "https://picsum.photos/seed/nexus1/1200/800",
      "https://picsum.photos/seed/nexus2/1200/800"
    ],
    color: "#1d1d1f",
    tags: ["Enterprise", "UX Research", "SaaS"],
    link: "#"
  },
  {
    id: 5,
    title: "ZNANYE",
    type: "UX",
    category: "E-Commerce Case Study",
    client: "Academic Project",
    year: "2024",
    services: ["UX Research", "3D Visualization", "E-Commerce Strategy"],
    description: "A comprehensive 3D e-commerce case study exploring the future of immersive shopping experiences.",
    longDescription: "Znanye is an academic deep-dive into the intersection of 3D visualization and e-commerce. The project explores how spatial computing and high-fidelity 3D assets can reduce return rates and increase user engagement in digital retail environments. This study covers everything from initial user personas to final interactive prototypes.",
    image: "https://picsum.photos/seed/znanye/1920/1080",
    gallery: [
      "https://picsum.photos/seed/znanye1/1200/800",
      "https://picsum.photos/seed/znanye2/1200/800",
      "https://picsum.photos/seed/znanye3/1200/800"
    ],
    caseStudy: {
      problem: "Traditional 2D e-commerce lacks the tactile feedback and spatial understanding required for high-confidence purchasing, leading to high return rates and fragmented user journeys.",
      solution: "Implementing a 3D-first approach where products are treated as interactive assets, allowing users to inspect, customize, and place items in their own space using AR/WebXR.",
      research: [
        "Analyzed 500+ e-commerce interactions.",
        "Identified 65% drop-off rate during static product viewing.",
        "Conducted user interviews with 20 frequent online shoppers."
      ],
      results: [
        "85% increase in product understanding.",
        "40% reduction in perceived purchase risk.",
        "3x longer session duration compared to 2D alternatives."
      ],
      sections: {
        ux: {
          title: "User Experience Strategy",
          description: "Deep dive into user pain points and behavioral patterns in digital retail.",
          images: ["https://picsum.photos/seed/znanye_ux1/1200/800", "https://picsum.photos/seed/znanye_ux2/1200/800"],
          points: ["User Persona Development", "Empathy Mapping", "Pain Point Identification"]
        },
        ui: {
          title: "Visual Interface Design",
          description: "Crafting a futuristic yet accessible aesthetic for the next generation of shoppers.",
          images: ["https://picsum.photos/seed/znanye_ui1/1200/800", "https://picsum.photos/seed/znanye_ui2/1200/800"],
          points: ["Glassmorphism UI System", "Dynamic Lighting Engine", "Micro-interaction Library"]
        },
        architecture: {
          title: "Information Architecture & Flows",
          description: "Mapping the complex journey from discovery to 3D inspection and checkout.",
          images: ["https://picsum.photos/seed/znanye_flow1/1200/800", "https://picsum.photos/seed/znanye_flow2/1200/800"],
          points: ["3D Interaction Flow", "Checkout Optimization", "Spatial Navigation Map"]
        }
      }
    },
    color: "#0a0a0a",
    tags: ["3D Design", "E-Commerce", "UX Case Study"],
    link: "https://www.behance.net/gallery/205348317/Znanye-3D-Case-Study"
  }
];

export const SKILLS = [
  { name: "Visual Design", icon: Palette, description: "Crafting pixel-perfect interfaces with a focus on hierarchy and balance." },
  { name: "Interaction", icon: Zap, description: "Creating fluid motion and micro-interactions that feel natural." },
  { name: "Prototyping", icon: Code2, description: "Building high-fidelity prototypes to test and validate ideas." },
  { name: "UX Strategy", icon: Layout, description: "Defining product vision through research and user-centric thinking." }
];

export const SOCIALS = [
  { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com" },
  { name: "GitHub", icon: Github, url: "https://github.com" },
  { name: "Email", icon: Mail, url: "mailto:hello@example.com" }
];
