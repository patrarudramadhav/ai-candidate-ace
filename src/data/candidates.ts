export type Candidate = {
  id: string;
  name: string;
  currentRole: string;
  yearsExperience: number;
  seniority: "Junior" | "Mid" | "Senior" | "Staff" | "Manager";
  location: string;
  skills: string[];
};

export const CANDIDATES: Candidate[] = [
  {
    id: "c1",
    name: "Aarav Sharma",
    currentRole: "Senior Backend Engineer @ Razorpay",
    yearsExperience: 8,
    seniority: "Senior",
    location: "Bengaluru, India",
    skills: ["Go", "Python", "PostgreSQL", "Kafka", "Microservices", "AWS", "gRPC"],
  },
  {
    id: "c2",
    name: "Priya Iyer",
    currentRole: "Full-Stack Engineer @ Freshworks",
    yearsExperience: 4,
    seniority: "Mid",
    location: "Chennai, India",
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL", "Docker"],
  },
  {
    id: "c3",
    name: "Rohan Mehta",
    currentRole: "Frontend Developer @ early-stage startup",
    yearsExperience: 2,
    seniority: "Junior",
    location: "Pune, India",
    skills: ["React", "TypeScript", "TailwindCSS", "Next.js", "Figma"],
  },
  {
    id: "c4",
    name: "Dr. Ananya Verma",
    currentRole: "ML Research Engineer @ Google DeepMind",
    yearsExperience: 7,
    seniority: "Senior",
    location: "London, UK",
    skills: ["PyTorch", "LLMs", "RAG", "Transformers", "Python", "CUDA", "Distributed Training"],
  },
  {
    id: "c5",
    name: "Karthik Reddy",
    currentRole: "Engineering Manager @ Swiggy",
    yearsExperience: 11,
    seniority: "Manager",
    location: "Hyderabad, India",
    skills: ["Leadership", "System Design", "Java", "Kubernetes", "Hiring", "Mentoring"],
  },
  {
    id: "c6",
    name: "Neha Kapoor",
    currentRole: "DevOps / SRE @ Zomato",
    yearsExperience: 6,
    seniority: "Senior",
    location: "Gurugram, India",
    skills: ["Kubernetes", "Terraform", "AWS", "Prometheus", "CI/CD", "Linux", "Python"],
  },
  {
    id: "c7",
    name: "Vikram Singh",
    currentRole: "Staff Software Engineer @ Atlassian",
    yearsExperience: 12,
    seniority: "Staff",
    location: "Sydney, Australia",
    skills: ["Java", "Spring", "AWS", "System Design", "React", "Mentoring"],
  },
];
