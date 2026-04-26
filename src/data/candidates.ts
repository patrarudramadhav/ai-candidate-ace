export type Candidate = {
  id: string;
  name: string;
  currentRole: string;
  yearsExperience: number;
  seniority: "Junior" | "Mid" | "Senior" | "Staff" | "Manager" | "Lead" | "Expert";
  location: string;
  skills: string[];
};

export const CANDIDATES: Candidate[] = [
  {
    id: "c1",
    name: "Meera Joshi",
    currentRole: "Financial Analyst @ Aditya Birla Capital",
    yearsExperience: 5,
    seniority: "Mid",
    location: "Mumbai, India",
    skills: [
      "Excel",
      "Cost Accounting",
      "Financial Modeling",
      "Variance Analysis",
      "Power BI",
      "Tally",
      "IFRS",
    ],
  },
  {
    id: "c2",
    name: "Lakshmi Narayanan",
    currentRole: "Program Director @ Sevalaya NGO",
    yearsExperience: 12,
    seniority: "Manager",
    location: "Chennai, India",
    skills: [
      "NGO Management",
      "Trust Registration",
      "FCRA Compliance",
      "Grant Writing",
      "Community Outreach",
      "Stakeholder Engagement",
      "12A & 80G Filing",
    ],
  },
  {
    id: "c3",
    name: "Subrat Maharana",
    currentRole: "Independent Traditional Artist · Raghurajpur",
    yearsExperience: 18,
    seniority: "Expert",
    location: "Puri, Odisha, India",
    skills: [
      "Pattachitra",
      "Pencil-Colored Composition",
      "Natural Pigment Preparation",
      "Tussar Silk Painting",
      "Mythological Iconography",
      "Palm-Leaf Etching",
    ],
  },
  {
    id: "c4",
    name: "Priya Iyer",
    currentRole: "Full-Stack Software Engineer @ Freshworks",
    yearsExperience: 4,
    seniority: "Mid",
    location: "Bengaluru, India",
    skills: [
      "TypeScript",
      "React",
      "Node.js",
      "PostgreSQL",
      "GraphQL",
      "Docker",
      "AWS",
    ],
  },
  {
    id: "c5",
    name: "Aarav Sharma",
    currentRole: "Senior Backend Engineer @ Razorpay",
    yearsExperience: 8,
    seniority: "Senior",
    location: "Bengaluru, India",
    skills: ["Go", "Python", "PostgreSQL", "Kafka", "Microservices", "AWS", "gRPC"],
  },
  {
    id: "c6",
    name: "Dr. Ananya Verma",
    currentRole: "ML Research Engineer @ Google DeepMind",
    yearsExperience: 7,
    seniority: "Senior",
    location: "London, UK",
    skills: ["PyTorch", "LLMs", "RAG", "Transformers", "Python", "CUDA", "Distributed Training"],
  },
  {
    id: "c7",
    name: "Karthik Reddy",
    currentRole: "Engineering Manager @ Swiggy",
    yearsExperience: 11,
    seniority: "Manager",
    location: "Hyderabad, India",
    skills: ["Leadership", "System Design", "Java", "Kubernetes", "Hiring", "Mentoring"],
  },
  {
    id: "c8",
    name: "Neha Kapoor",
    currentRole: "DevOps / SRE @ Zomato",
    yearsExperience: 6,
    seniority: "Senior",
    location: "Gurugram, India",
    skills: ["Kubernetes", "Terraform", "AWS", "Prometheus", "CI/CD", "Linux", "Python"],
  },
];
