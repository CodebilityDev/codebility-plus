"use client";

import { useState, useEffect } from "react";
import { Download, DollarSign, Eye, X, ChevronLeft, ChevronRight, User, Smartphone } from "lucide-react";
import { Button } from "@codevs/ui/button";
import { H1 } from "@/components/shared/dashboard";
import PageContainer from "../../_components/PageContainer";
import { toast } from "sonner";
import jsPDF from "jspdf";
import Image from "next/image";
import { getRealProjects, RealProject, getCodevProfiles } from "./actions";
import { techstacks } from '@/constants/techstack';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  price?: string;
  duration?: string;
}

export default function ServicesPage() {
  const [realProjects, setRealProjects] = useState<RealProject[]>([]);
  const [codevProfiles, setCodevProfiles] = useState<any[]>([]);
  const [services] = useState<Service[]>([
    {
      id: "1",
      name: "Web Application Development",
      description: "Full-stack web application development using modern technologies like React, Next.js, Node.js, and database integration.",
      category: "Development",
      features: [
        "Custom web application development",
        "Responsive design for all devices",
        "Database design and integration",
        "API development and integration",
        "Modern frameworks (React, Next.js)",
        "SEO optimization",
        "Performance optimization"
      ],
      price: "Starting from $5,000",
      duration: "4-8 weeks"
    },
    {
      id: "2", 
      name: "Mobile Application Development",
      description: "Cross-platform mobile application development for iOS and Android using React Native and modern mobile technologies.",
      category: "Mobile",
      features: [
        "iOS and Android development",
        "Cross-platform compatibility",
        "Native performance",
        "App Store deployment",
        "Push notifications",
        "Offline functionality",
        "Real-time features"
      ],
      price: "Starting from $8,000",
      duration: "6-12 weeks"
    },
    {
      id: "3",
      name: "Codev for Hire",
      description: "Skilled developers available for hire to join your team or work on specific projects. Our codevs are experienced in various technologies.",
      category: "Staffing",
      features: [
        "Experienced developers",
        "Full-time or part-time availability",
        "Various technology stacks",
        "Flexible engagement models",
        "Quality assurance",
        "Team integration",
        "Ongoing support"
      ],
      price: "Starting from $8/hour",
      duration: "Flexible"
    },
    {
      id: "4",
      name: "Product Design",
      description: "Complete product design services from user research to final designs, creating intuitive and engaging digital experiences.",
      category: "Design",
      features: [
        "User research and analysis",
        "Wireframing and prototyping",
        "Visual design and branding",
        "Interactive prototypes",
        "Design system creation",
        "Usability testing",
        "Design handoff to developers"
      ],
      price: "Starting from $1,000",
      duration: "3-6 weeks"
    },
    {
      id: "5",
      name: "CMS Service",
      description: "Content Management System development and customization for easy content updates, multi-user access, and dynamic website management.",
      category: "Development",
      features: [
        "Custom CMS development",
        "WordPress & Headless CMS",
        "Content workflow management",
        "Multi-user permissions",
        "SEO-friendly structure",
        "Media library management",
        "API integration support"
      ],
      price: "Starting from $3,000",
      duration: "6-10 weeks"
    },
    {
      id: "6",
      name: "AI Development",
      description: "Artificial Intelligence and Machine Learning solutions to automate processes, enhance user experiences, and unlock data-driven insights.",
      category: "AI & ML",
      features: [
        "Machine Learning model development",
        "Natural Language Processing (NLP)",
        "Computer Vision solutions",
        "AI-powered chatbots",
        "Predictive analytics",
        "Data pipeline automation",
        "Model deployment and monitoring"
      ],
      price: "Starting from $12,000",
      duration: "8-16 weeks"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch real projects and codev profiles on component mount
  useEffect(() => {
    const fetchData = async () => {
      const [projectsResult, codevsResult] = await Promise.all([
        getRealProjects(),
        getCodevProfiles()
      ]);

      if (projectsResult.data && !projectsResult.error) {
        setRealProjects(projectsResult.data);
        console.log('✅ Fetched real projects:', projectsResult.data);
        console.log('📊 Total projects with images:', projectsResult.data.filter(p => p.main_image).length);
        console.log('📋 Projects by category:', {
          web: projectsResult.data.filter(p => p.categories?.some((c: any) => c.id === 1)).length,
          mobile: projectsResult.data.filter(p => p.categories?.some((c: any) => c.id === 2)).length,
          design: projectsResult.data.filter(p => p.categories?.some((c: any) => c.id === 3)).length,
          ai: projectsResult.data.filter(p => p.categories?.some((c: any) => c.id === 4)).length,
          cms: projectsResult.data.filter(p => p.categories?.some((c: any) => c.id === 5)).length,
        });
      } else {
        console.error('Error fetching projects:', projectsResult.error);
      }

      if (codevsResult.data && !codevsResult.error) {
        setCodevProfiles(codevsResult.data);
      } else {
        console.error('Error fetching codev profiles:', codevsResult.error);
      }
    };
    fetchData();
  }, []);

  // Calculate total pages (cover + services + summary)
  const totalPages = 1 + services.length + 1;

  const generateServicesPDF = () => {
    if (services.length === 0) {
      toast.error("No services available to export");
      return;
    }

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;

    // Create cover page
    const createCoverPage = () => {
      // Background gradient effect (using rectangles)
      pdf.setFillColor(59, 130, 246); // Blue
      pdf.rect(0, 0, pageWidth, pageHeight / 3, 'F');
      
      pdf.setFillColor(99, 102, 241); // Purple  
      pdf.rect(0, pageHeight / 3, pageWidth, pageHeight / 3, 'F');
      
      pdf.setFillColor(139, 92, 246); // Violet
      pdf.rect(0, (pageHeight / 3) * 2, pageWidth, pageHeight / 3, 'F');

      // Company logo area (simulated with text)
      pdf.setFontSize(32);
      pdf.setTextColor(255, 255, 255);
      pdf.text("CODEBILITY", pageWidth / 2, 60, { align: "center" });
      
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Professional Development Services", pageWidth / 2, 80, { align: "center" });

      // Main title
      pdf.setFontSize(36);
      pdf.setTextColor(255, 255, 255);
      pdf.text("SERVICES", pageWidth / 2, 140, { align: "center" });
      pdf.text("CATALOG", pageWidth / 2, 170, { align: "center" });

      // Year and date
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text(new Date().getFullYear().toString(), pageWidth / 2, 220, { align: "center" });
      
      // Contact info section
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(30, 240, pageWidth - 60, 30, 5, 5, 'F');
      
      pdf.setFontSize(12);
      pdf.setTextColor(59, 130, 246);
      pdf.text("Contact: admin@codebility.tech | www.codebility.tech", pageWidth / 2, 258, { align: "center" });
    };

    // Create service page with modern design
    const createServicePage = (service: Service, serviceIndex: number) => {
      pdf.addPage();
      
      // Header bar
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, 25, 'F');
      
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`Service ${serviceIndex + 1} of ${services.length}`, pageWidth - 20, 15, { align: "right" });
      pdf.text("CODEBILITY", 20, 15);

      // Service title section
      pdf.setFillColor(248, 250, 252); // Light gray background
      pdf.rect(0, 25, pageWidth, 40, 'F');
      
      pdf.setFontSize(24);
      pdf.setTextColor(30, 41, 59);
      pdf.text(service.name, pageWidth / 2, 45, { align: "center" });
      
      // Category badge
      pdf.setFillColor(99, 102, 241);
      pdf.roundedRect(pageWidth / 2 - 30, 50, 60, 12, 3, 3, 'F');
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      pdf.text(service.category, pageWidth / 2, 58, { align: "center" });

      let yPos = 85;

      // Price and duration section
      if (service.price || service.duration) {
        pdf.setFillColor(34, 197, 94);
        pdf.roundedRect(20, yPos, pageWidth - 40, 20, 5, 5, 'F');
        
        pdf.setFontSize(14);
        pdf.setTextColor(255, 255, 255);
        const priceText = service.price || 'Contact for pricing';
        const durationText = service.duration ? ` • ${service.duration}` : '';
        pdf.text(`${priceText}${durationText}`, pageWidth / 2, yPos + 12, { align: "center" });
        
        yPos += 35;
      }

      // Description section
      pdf.setFontSize(14);
      pdf.setTextColor(71, 85, 105);
      pdf.text("Description", 20, yPos);
      yPos += 8;
      
      pdf.setFontSize(11);
      pdf.setTextColor(100, 116, 139);
      const descLines = pdf.splitTextToSize(service.description, pageWidth - 40);
      pdf.text(descLines, 20, yPos);
      yPos += descLines.length * 5 + 15;

      // Project Showcase section
      pdf.setFontSize(14);
      pdf.setTextColor(71, 85, 105);
      pdf.text("Our Recent Projects", 20, yPos);
      yPos += 10;

      // Project images placeholders (3 projects per service)
      const projectsPerRow = 3;
      const projectWidth = (pageWidth - 80) / projectsPerRow;
      const projectHeight = 35;
      
      // Get project names based on service category
      const getProjectNames = (serviceName: string) => {
        const projectMap: { [key: string]: string[] } = {
          'Web Application Development': ['E-commerce Platform', 'CRM Dashboard', 'Portfolio Site'],
          'Mobile Application Development': ['Food Delivery App', 'Fitness Tracker', 'Social Chat App'],
          'Codev for Hire': ['React Developer', 'Node.js Expert', 'Full Stack Dev'],
          'UI/UX Design Services': ['Mobile App Design', 'Website Redesign', 'Brand Identity'],
          'E-commerce Solutions': ['Multi-vendor Store', 'B2B Platform', 'Marketplace']
        };
        return projectMap[serviceName] || ['Custom Project', 'Client Solution', 'Team Delivery'];
      };

      const projectNames = getProjectNames(service.name);
      
      for (let i = 0; i < 3; i++) {
        const x = 20 + (i * (projectWidth + 10));
        
        // Project image placeholder with gradient
        const gradientColors = [
          [59, 130, 246, 99, 102, 241], // Blue to Purple
          [34, 197, 94, 16, 185, 129], // Green to Emerald  
          [139, 92, 246, 168, 85, 247] // Purple to Pink
        ];
        
        const [r1, g1, b1, r2, g2, b2] = gradientColors[i];
        pdf.setFillColor(r1, g1, b1);
        pdf.roundedRect(x, yPos, projectWidth, projectHeight, 5, 5, 'F');
        
        // Add subtle overlay
        pdf.setFillColor(255, 255, 255);
        pdf.setGState({ opacity: 0.1 });
        pdf.roundedRect(x + 2, yPos + 2, projectWidth - 4, projectHeight - 4, 3, 3, 'F');
        pdf.setGState({ opacity: 1 });
        
        // Project icon/text
        pdf.setFontSize(7);
        pdf.setTextColor(255, 255, 255);
        pdf.text(projectNames[i], x + projectWidth/2, yPos + projectHeight/2 - 1, { align: "center" });
        pdf.setFontSize(6);
        pdf.setTextColor(255, 255, 255);
        pdf.text(`${service.category}`, x + projectWidth/2, yPos + projectHeight/2 + 6, { align: "center" });
      }
      
      yPos += projectHeight + 20;

      // Features section with grid layout
      pdf.setFontSize(14);
      pdf.setTextColor(71, 85, 105);
      pdf.text("What's Included", 20, yPos);
      yPos += 10;

      // Create feature boxes in grid
      const featuresPerRow = 2;
      const boxWidth = (pageWidth - 60) / featuresPerRow;
      const boxHeight = 25;
      
      service.features.forEach((feature, index) => {
        const row = Math.floor(index / featuresPerRow);
        const col = index % featuresPerRow;
        const x = 20 + (col * (boxWidth + 10));
        const y = yPos + (row * (boxHeight + 5));

        // Feature box
        pdf.setFillColor(239, 246, 255);
        pdf.setDrawColor(59, 130, 246);
        pdf.roundedRect(x, y, boxWidth, boxHeight, 3, 3, 'FD');
        
        // Checkmark
        pdf.setFillColor(34, 197, 94);
        pdf.circle(x + 8, y + 8, 3, 'F');
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255);
        pdf.text("✓", x + 8, y + 10, { align: "center" });
        
        // Feature text
        pdf.setFontSize(9);
        pdf.setTextColor(30, 41, 59);
        const featureLines = pdf.splitTextToSize(feature, boxWidth - 20);
        pdf.text(featureLines, x + 15, y + 8);
      });

      // Footer
      pdf.setFillColor(71, 85, 105);
      pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
      
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Professional Development Services by Codebility", pageWidth / 2, pageHeight - 8, { align: "center" });
    };

    // Create summary page
    const createSummaryPage = () => {
      pdf.addPage();
      
      // Header
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setFontSize(20);
      pdf.setTextColor(255, 255, 255);
      pdf.text("SERVICE SUMMARY", pageWidth / 2, 25, { align: "center" });

      let yPos = 70;

      // Summary stats
      const totalServices = services.length;
      const categories = [...new Set(services.map(s => s.category))];

      // Stats boxes
      const stats = [
        { label: "Total Services", value: totalServices.toString() },
        { label: "Categories", value: categories.length.toString() },
        { label: "Service Areas", value: categories.join(", ") }
      ];

      stats.forEach((stat, index) => {
        const boxY = yPos + (index * 40);
        
        pdf.setFillColor(248, 250, 252);
        pdf.setDrawColor(59, 130, 246);
        pdf.roundedRect(30, boxY, pageWidth - 60, 30, 5, 5, 'FD');
        
        pdf.setFontSize(12);
        pdf.setTextColor(71, 85, 105);
        pdf.text(stat.label, 40, boxY + 12);
        
        pdf.setFontSize(14);
        pdf.setTextColor(59, 130, 246);
        pdf.text(stat.value, 40, boxY + 22);
      });

      // Call to action
      yPos = 220;
      pdf.setFillColor(34, 197, 94);
      pdf.roundedRect(30, yPos, pageWidth - 60, 30, 5, 5, 'F');
      
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Ready to get started?", pageWidth / 2, yPos + 12, { align: "center" });
      pdf.setFontSize(12);
      pdf.text("Contact us today for a free consultation", pageWidth / 2, yPos + 22, { align: "center" });
    };

    // Generate the PDF
    createCoverPage();
    
    services.forEach((service, index) => {
      createServicePage(service, index);
    });
    
    createSummaryPage();

    // Download
    const filename = `codebility-services-catalog-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
    
    toast.success("Professional services catalog downloaded!");
  };

  // Preview components with A4 aspect ratio and enhanced design
  const CoverPagePreview = () => (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Code Matrix Effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Dynamic Floating Elements */}
        <div className="absolute top-1/6 left-1/5 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-2/3 right-1/5 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/2 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-xl"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/10 transform rotate-45 border border-white/30"></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 border-2 border-white/30 transform rotate-12"></div>
        
        {/* Tech Icons Background */}
        <div className="absolute top-1/5 right-1/3 text-white/10 text-4xl">⚛️</div>
        <div className="absolute bottom-1/3 left-1/5 text-white/10 text-3xl">🚀</div>
        <div className="absolute top-1/2 right-1/6 text-white/10 text-2xl">💻</div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8 text-white">
        {/* Logo section with enhanced design */}
        <div className="mb-8">
          <div className="relative mb-6">
            <div className="w-40 h-40 flex items-center justify-center mx-auto relative">
              <Image
                src="/assets/svgs/codebility-white.svg"
                alt="Codebility Logo"
                width={120}
                height={120}
                className="w-28 h-28 relative z-10"
                priority
              />
            </div>
            {/* Logo Ring */}
            <div className="absolute inset-0 w-40 h-40 mx-auto border-2 border-white/10 rounded-full animate-ping"></div>
          </div>
          
          <h1 className="text-5xl font-bold tracking-wide mb-4">CODEBILITY</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-4 rounded-full"></div>
          <p className="text-xl opacity-90 font-light mb-2">Professional Development Services</p>
          <p className="text-sm opacity-70">Transforming Ideas into Digital Excellence</p>
        </div>
        
        {/* Main Title with enhanced styling */}
        <div className="mb-10">
          <div className="relative">
            <h2 className="text-6xl font-bold mb-2 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              SERVICES
            </h2>
            <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              CATALOG
            </h2>
            {/* Subtitle */}
            <p className="text-lg mt-4 opacity-80">Complete Portfolio of Digital Solutions</p>
          </div>
        </div>
        
        {/* Enhanced Stats Section */}
        <div className="mb-8 grid grid-cols-3 gap-6 w-full max-w-md">
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold">{new Date().getFullYear()}</div>
            <div className="text-xs opacity-75">Current Year</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold">{services.length}</div>
            <div className="text-xs opacity-75">Services</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold">100+</div>
            <div className="text-xs opacity-75">Projects</div>
          </div>
        </div>
        
        {/* Enhanced Contact Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl max-w-sm w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📧</span>
            </div>
            <div className="text-white/90 font-medium">Get In Touch</div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-white/70">Email:</span>
              <span className="text-white font-medium">admin@codebility.tech</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/70">Website:</span>
              <span className="text-white font-medium">codebility.tech</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ServicePagePreview = ({ service, index }: { service: Service, index: number }) => {
    // Get real project images and data for service showcase
    const getServiceProjects = (serviceName: string) => {
      console.log(`\n🔍 Getting projects for service: ${serviceName}`);

      // First get all projects with valid images
      const projectsWithImages = realProjects.filter(project => {
        return project.main_image && project.main_image.trim() !== '';
      });
      console.log(`📦 Total projects with images: ${projectsWithImages.length}`);

      // Filter projects based on service type and category
      const relevantProjects = projectsWithImages.filter(project => {
        const projectName = project.name.toLowerCase();
        const projectDesc = (project.description || '').toLowerCase();
        const techStack = (project.tech_stack || []).join(' ').toLowerCase();
        const searchTerms = `${projectName} ${projectDesc} ${techStack}`;
        const hasCategory = (catId: number) => project.categories?.some((c: any) => c.id === catId);


        switch (serviceName) {
          case 'Web Application Development':
            // Category ID 1 = "Web Application" - STRICT filtering for web only
            return hasCategory(1);
          case 'Mobile Application Development':
            // Category ID 2 = "Mobile Application" - STRICT filtering for mobile only
            return hasCategory(2);
          case 'Product Design':
            // Category ID 3 = "Product Design" - STRICT filtering for design only
            return hasCategory(3);
          case 'CMS Service':
            // Category ID 5 = "CMS" - STRICT filtering for CMS only
            return hasCategory(5);
          case 'AI Development':
            // Category ID 4 = "AI Development" - STRICT filtering for AI only
            return hasCategory(4);
          default:
            return true;
        }
      });

      console.log(`✨ Relevant projects found: ${relevantProjects.length}`);
      if (relevantProjects.length > 0) {
        console.log('Projects:', relevantProjects.map(p => ({
          name: p.name,
          categories: p.categories?.map((c: any) => c.name).join(', ') || 'None',
          hasImage: !!p.main_image
        })));
      }

      // STRICT: Only use projects from the specific category, no fallbacks
      const projectsToUse = relevantProjects;

      // Service-specific dummy images when no real projects exist
      const getServiceDummyImages = (serviceName: string) => {
        const dummyImageMap: { [key: string]: string[] } = {
          'CMS Service': [
            'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop', // CMS dashboard
            'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&h=400&fit=crop', // Content editing
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', // Analytics dashboard
            'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop', // Website management
            'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&h=400&fit=crop'  // Team collaboration
          ],
          'AI Development': [
            'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=600&h=400&fit=crop', // AI/ML code
            'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop', // AI brain
            'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop', // Neural network
            'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400&fit=crop', // Data visualization
            'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=600&h=400&fit=crop'  // Robot/AI
          ],
          'Product Design': [
            'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop', // Design wireframes
            'https://images.unsplash.com/photo-1609902726285-00668009ebe1?w=600&h=400&fit=crop', // UI design
            'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop', // Design process
            'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop', // UX design
            'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=600&h=400&fit=crop'  // Design tools
          ]
        };
        
        return dummyImageMap[serviceName] || [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=400&fit=crop'
        ];
      };
      
      // STRICT: If no projects in this category, use dummy images
      if (projectsToUse.length === 0) {
        console.warn(`⚠️ No ${serviceName} projects found, using dummy images`);
        return getServiceDummyImages(serviceName);
      }

      // Return ONLY the real project images from this specific category
      const imageUrls = projectsToUse.map(project => project.main_image!).slice(0, 12);
      console.log(`✅ Returning ${imageUrls.length} real image URLs for ${serviceName} (category-specific)`);
      return imageUrls;
    };

    // Special handling for Codev for Hire service
    const isCodevHireService = service.name === 'Codev for Hire';
    
    const images = isCodevHireService 
      ? codevProfiles.map(() => "avatar-icon") // Use ALL codevs with avatar icons
      : getServiceProjects(service.name);
    
    // Get actual project data for showcasing
    const getServiceProjectData = (serviceName: string) => {
      console.log(`\n🎯 Getting project DATA for service: ${serviceName}`);

      if (serviceName === 'Codev for Hire') {
        console.log(`👥 Returning ${codevProfiles.length} codev profiles`);
        return codevProfiles; // Return ALL codev profiles
      }

      const projectsWithImages = realProjects.filter(project => project.main_image && project.main_image.trim() !== '');
      console.log(`📦 Projects with images: ${projectsWithImages.length}`);

      const relevantProjects = projectsWithImages.filter(project => {
        const hasCategory = (catId: number) => project.categories?.some((c: any) => c.id === catId);

        switch (serviceName) {
          case 'Web Application Development':
            // Category ID 1 = "Web Application" - STRICT filtering for web only
            return hasCategory(1);
          case 'Mobile Application Development':
            // Category ID 2 = "Mobile Application" - STRICT filtering for mobile only
            return hasCategory(2);
          case 'Product Design':
            // Category ID 3 = "Product Design" - STRICT filtering for design only
            return hasCategory(3);
          case 'CMS Service':
            // Category ID 5 = "CMS" - STRICT filtering for CMS only
            return hasCategory(5);
          case 'AI Development':
            // Category ID 4 = "AI Development" - STRICT filtering for AI only
            return hasCategory(4);
          default:
            return true;
        }
      });

      console.log(`✨ Relevant project data found: ${relevantProjects.length}`);

      // STRICT: Return ONLY projects from the specific category, no fallbacks
      const result = relevantProjects.slice(0, 12);
      console.log(`✅ Returning ${result.length} project data items for ${serviceName} (category-specific)`);
      return result;
    };

    const projectData = getServiceProjectData(service.name);

    return (
      <div className="w-full min-h-[800px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-y-auto">
        {/* Animated background with shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating gradient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        </div>

        {/* Header with vibrant gradient */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/svgs/codebility-white.svg"
                alt="Codebility Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="font-bold text-xl">CODEBILITY</span>
            </div>
            <div className="text-sm bg-white/10 px-3 py-1 rounded-full">
              {index + 1} / {services.length}
            </div>
          </div>
        </div>
        
        {/* Hero Section with Large Project Showcase or Codev Profile */}
        <div className="relative h-80 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
            {isCodevHireService ? (
              <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
                <img
                  src="https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
                  alt="Codev Placeholder"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-2xl relative z-10"
                />
              </div>
            ) : (
              <>
                <img
                  src={projectData[0]?.main_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'}
                  alt={projectData[0]?.name || `${service.name} hero project`}
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-pink-900/60"></div>
              </>
            )}
          </div>

          {/* Service Title Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6 z-10">
            <div className="space-y-4 backdrop-blur-sm bg-black/10 p-6 rounded-3xl border border-white/20">
              <span className="inline-block bg-gradient-to-r from-blue-400 to-purple-400 px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
                {service.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-md bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                {service.name}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
        
        {/* Project Gallery Section / Codev Profiles Section */}
        <div className="relative p-6 bg-gradient-to-b from-slate-800/95 via-purple-900/90 to-slate-900/95 backdrop-blur-sm">
          <div className="text-center mb-8 relative z-10">
            <div className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30 px-4 py-1 rounded-full mb-3 shadow-lg">
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                {isCodevHireService ? 'Our Team' : 'Portfolio'}
              </span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3">
              {isCodevHireService ? 'Available Codevs' : service.name === 'Mobile Application Development' ? 'Mobile App Showcase' : 'Recent Projects'}
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              {isCodevHireService
                ? 'Meet our talented developers ready to join your team'
                : service.name === 'Mobile Application Development'
                ? 'Our mobile applications designed for iOS and Android'
                : `Showcasing our expertise in ${service.category.toLowerCase()}`
              }
            </p>
          </div>
          
          {/* Mobile Layout with Phone Mockups - Render ALL mobile projects */}
          {service.name === 'Mobile Application Development' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {(() => {
                // Get ALL mobile projects
                const mobileProjects = realProjects.filter(project => {
                  // STRICT mobile filtering - only category 2 (Mobile Application)
                  return project.categories?.some((c: any) => c.id === 2);
                });
                
                const mobileProjectsWithImages = mobileProjects.filter(p => p.main_image && p.main_image.trim() !== '');
                
                // Use ALL mobile projects or fallback to placeholder if none
                const projectsToShow = mobileProjectsWithImages.length > 0 
                  ? mobileProjectsWithImages 
                  : Array.from({ length: 6 }, (_, idx) => ({
                      id: `mobile-${idx}`,
                      name: `Mobile App ${idx + 1}`,
                      main_image: `https://images.unsplash.com/photo-${1512941937669 + idx}-90a1b58e7e9c?w=300&h=600&fit=crop`,
                      tech_stack: ['React Native']
                    }));
                
                return projectsToShow.slice(0, 12).map((project, idx) => {
                  const projectName = project?.name || `Mobile App ${idx + 1}`;
                  
                  return (
                    <div key={idx} className="group flex flex-col items-center">
                      {/* Phone Mockup */}
                      <div className="relative">
                        <div className="w-28 h-56 bg-gray-900 rounded-3xl p-2 shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                          <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                            {/* Phone notch */}
                            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-900 rounded-full z-10"></div>
                            {/* Phone Screen */}
                            <img 
                              src={project.main_image!} 
                              alt={projectName}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://images.unsplash.com/photo-${1512941937669 + idx}-90a1b58e7e9c?w=300&h=600&fit=crop`;
                              }}
                            />
                            {/* Phone status bar overlay */}
                            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/30 to-transparent"></div>
                            {/* Phone navigation overlay */}
                            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/30 to-transparent"></div>
                          </div>
                          {/* Phone home indicator */}
                          <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gray-600 rounded-full"></div>
                        </div>
                        {/* Phone reflection */}
                        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-r from-white/10 via-white/5 to-transparent rounded-3xl pointer-events-none"></div>
                        {/* Phone bezel highlight */}
                        <div className="absolute top-0 left-0 w-full h-full border border-white/20 rounded-3xl pointer-events-none"></div>
                      </div>
                      {/* Project info */}
                      <div className="mt-3 text-center max-w-28">
                        <div className="text-xs font-medium text-white truncate">{projectName}</div>
                        {project?.tech_stack && project.tech_stack.length > 0 && (
                          <div className="text-xs text-slate-300 truncate">
                            {project.tech_stack.slice(0, 1).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          ) : isCodevHireService ? (
            /* Codev Grid - Render ALL codevs with images */
            <div className="grid grid-cols-4 gap-3 mb-6">
              {codevProfiles.map((codev, idx) => {
                const codevName = codev ? `${codev.first_name} ${codev.last_name}` : `Codev ${idx + 1}`;
                const codevSkills = codev?.tech_stacks ? codev.tech_stacks.slice(0, 2).join(', ') : 'Full Stack Developer';
                const codevImage = codev?.image_url || null;
                
                return (
                  <div key={idx} className="group relative flex flex-col items-center justify-center p-4">
                    <div className="relative">
                      {codevImage ? (
                        <img
                          src={codevImage}
                          alt={codevName}
                          className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`${codevImage ? 'hidden' : 'flex'} items-center justify-center`}>
                        <img
                          src="https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
                          alt="Codev Avatar Placeholder"
                          className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                        />
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <div className="text-sm font-semibold text-white truncate max-w-[120px]">{codevName}</div>
                      <div className="text-xs text-slate-300 truncate max-w-[120px]">{codevSkills}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Regular Project Grid or Dummy Images */
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(() => {
                // STRICT: Use only category-specific projects, no mixing
                const projectsToShow = projectData;
                const imagesToShow = images;

                // For Web Application Development - show ONLY category 1 projects
                if (service.name === 'Web Application Development') {
                  const webProjects = realProjects.filter(project => {
                    // STRICT: Only category 1 (Web Application)
                    return project.categories?.some((c: any) => c.id === 1);
                  });
                  const webProjectsWithImages = webProjects.filter(p => p.main_image && p.main_image.trim() !== '');

                  if (webProjectsWithImages.length > 0) {
                    return webProjectsWithImages.slice(0, 12).map((project, idx) => {
                      return (
                        <div key={idx} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                          <img
                            src={project.main_image!}
                            alt={project.name}
                            className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-1 left-1 right-1 text-white">
                              <div className="text-xs font-medium truncate">{project.name}</div>
                              {project.tech_stack && project.tech_stack.length > 0 && (
                                <div className="text-xs opacity-80 truncate">
                                  {project.tech_stack.slice(0, 1).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  }
                }
                // For CMS Service - show ONLY category 5 projects
                else if (service.name === 'CMS Service') {
                  const cmsProjects = realProjects.filter(project => {
                    // STRICT: Only category 5 (CMS)
                    return project.categories?.some((c: any) => c.id === 5);
                  });

                  const cmsProjectsWithImages = cmsProjects.filter(p => p.main_image && p.main_image.trim() !== '');

                  if (cmsProjectsWithImages.length > 0) {
                    return cmsProjectsWithImages.slice(0, 12).map((project, idx) => {
                      const projectName = project.name || `CMS Project ${idx + 1}`;

                      return (
                        <div key={idx} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                          <img
                            src={project.main_image!}
                            alt={projectName}
                            className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://images.unsplash.com/photo-${1460925895917 + idx}-afdab827c52f?w=400&h=300&fit=crop`;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="absolute bottom-1 left-1 right-1 text-white">
                              <div className="text-xs font-medium truncate">{projectName}</div>
                              {project?.tech_stack && project.tech_stack.length > 0 && (
                                <div className="text-xs opacity-80 truncate">
                                  {project.tech_stack.slice(0, 1).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  } else {
                    // Fallback to dummy CMS images if no real projects
                    const dummyImages = getServiceProjects(service.name);
                    return dummyImages.map((img, idx) => {
                      const serviceName = `CMS Project ${idx + 1}`;

                      return (
                        <div key={idx} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                          <img
                            src={img}
                            alt={serviceName}
                            className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://images.unsplash.com/photo-${1460925895917 + idx}-afdab827c52f?w=400&h=300&fit=crop`;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="absolute bottom-1 left-1 right-1 text-white">
                              <div className="text-xs font-medium truncate">{serviceName}</div>
                              <div className="text-xs opacity-80 truncate">Content Management</div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  }
                }
                // For AI Development - show ONLY category 4 projects
                else if (service.name === 'AI Development') {
                  const aiProjects = realProjects.filter(project => {
                    // STRICT: Only category 4 (AI Development)
                    return project.categories?.some((c: any) => c.id === 4);
                  });

                  const aiProjectsWithImages = aiProjects.filter(p => p.main_image && p.main_image.trim() !== '');

                  if (aiProjectsWithImages.length > 0) {
                    return aiProjectsWithImages.slice(0, 12).map((project, idx) => {
                      const projectName = project.name || `AI Project ${idx + 1}`;

                      return (
                        <div key={idx} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                          <img
                            src={project.main_image!}
                            alt={projectName}
                            className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://images.unsplash.com/photo-${1555421689 + idx}-df2759f1ff84?w=400&h=300&fit=crop`;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="absolute bottom-1 left-1 right-1 text-white">
                              <div className="text-xs font-medium truncate">{projectName}</div>
                              {project?.tech_stack && project.tech_stack.length > 0 && (
                                <div className="text-xs opacity-80 truncate">
                                  {project.tech_stack.slice(0, 1).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  } else {
                    // Fallback to dummy AI images if no real projects
                    const dummyImages = getServiceProjects(service.name);
                    return dummyImages.map((img, idx) => {
                      const serviceName = `AI Project ${idx + 1}`;

                      return (
                        <div key={idx} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                          <img
                            src={img}
                            alt={serviceName}
                            className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://images.unsplash.com/photo-${1555421689 + idx}-df2759f1ff84?w=400&h=300&fit=crop`;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="absolute bottom-1 left-1 right-1 text-white">
                              <div className="text-xs font-medium truncate">{serviceName}</div>
                              <div className="text-xs opacity-80 truncate">AI & Machine Learning</div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  }
                }
                // For Product Design - show ONLY category 3 projects
                else if (service.name === 'Product Design') {
                  const designProjects = realProjects.filter(project => {
                    // STRICT: Only category 3 (Product Design)
                    return project.categories?.some((c: any) => c.id === 3);
                  });

                  const designProjectsWithImages = designProjects.filter(p => p.main_image && p.main_image.trim() !== '');
                  
                  if (designProjectsWithImages.length > 0) {
                    return designProjectsWithImages.slice(0, 12).map((project, idx) => {
                      const projectName = project.name || `Design Project ${idx + 1}`;
                      
                      return (
                        <div key={idx} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                          <img 
                            src={project.main_image!} 
                            alt={projectName}
                            className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://images.unsplash.com/photo-${1460925895917 + idx}-afdab827c52f?w=400&h=300&fit=crop`;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="absolute bottom-1 left-1 right-1 text-white">
                              <div className="text-xs font-medium truncate">{projectName}</div>
                              {project?.tech_stack && project.tech_stack.length > 0 && (
                                <div className="text-xs opacity-80 truncate">
                                  {project.tech_stack.slice(0, 1).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  } else {
                    // Fallback to dummy design images if no real projects
                    const dummyImages = getServiceProjects(service.name);
                    return dummyImages.map((img, idx) => {
                      const serviceName = `Design Project ${idx + 1}`;
                      
                      return (
                        <div key={idx} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                          <img 
                            src={img} 
                            alt={serviceName}
                            className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://images.unsplash.com/photo-${1460925895917 + idx}-afdab827c52f?w=400&h=300&fit=crop`;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="absolute bottom-1 left-1 right-1 text-white">
                              <div className="text-xs font-medium truncate">{serviceName}</div>
                              <div className="text-xs opacity-80 truncate">UI/UX Design</div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  }
                }

                // For other services without specific projects - show dummy images
                if (!projectsToShow || projectsToShow.length === 0) {
                  const dummyImages = imagesToShow.length > 0 ? imagesToShow : [];
                  return dummyImages.slice(0, 6).map((img, idx) => {
                    return (
                      <div key={idx} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <img
                          src={typeof img === 'string' ? img : ''}
                          alt={`${service.name} ${idx + 1}`}
                          className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://images.unsplash.com/photo-${1460925895917 + idx}-afdab827c52f?w=400&h=300&fit=crop`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-1 left-1 right-1 text-white">
                            <div className="text-xs font-medium truncate">{service.name}</div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                }

                // This should not be reached for category-specific services
                return null;
              })()}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="relative p-6 space-y-6 bg-gradient-to-b from-slate-900/95 via-indigo-900/80 to-slate-900/95">
          {/* Price and Duration */}
          {(service.price || service.duration) && (
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-3xl p-6 shadow-xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl"></div>

              <div className="relative flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                  <span className="text-white text-3xl">💎</span>
                </div>
                <div className="flex-1 text-white">
                  <div className="font-bold text-3xl mb-1 drop-shadow-md">{service.price || 'Contact for pricing'}</div>
                  {service.duration && <div className="text-white/90 font-medium text-lg">{service.duration}</div>}
                  <div className="text-sm text-white/80 mt-1">Premium service package</div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group">
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <span className="text-white text-xl">📋</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
                    About This Service
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full shadow-lg shadow-purple-500/50"></div>
                </div>
              </div>
              <p className="text-slate-200 leading-relaxed text-base pl-16">{service.description}</p>
            </div>
          </div>

          {/* Technology Stack with Icons / Codev Skills */}
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 group">
            {/* Decorative glow */}
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl group-hover:bg-orange-500/30 transition-all duration-500"></div>
            <h3 className="relative z-10 text-xl font-bold bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm">⚡</span>
              </div>
              {isCodevHireService ? 'Skills & Expertise' : 'Technologies We Use'}
            </h3>
            <div className="flex flex-wrap gap-3">
              {(() => {
                let techsToShow: string[] = [];
                
                if (isCodevHireService) {
                  // Get unique tech stacks from codev profiles
                  const allTechStacks = codevProfiles
                    .filter(codev => codev?.tech_stacks && codev.tech_stacks.length > 0)
                    .flatMap(codev => codev.tech_stacks)
                    .filter((tech, index, array) => array.indexOf(tech) === index);
                  
                  techsToShow = allTechStacks.length > 0 
                    ? allTechStacks.slice(0, 8) 
                    : ['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'AWS'];
                } else {
                  // Get unique tech stack from real projects
                  const allTechStacks = projectData
                    .filter(p => p?.tech_stack && p.tech_stack.length > 0)
                    .flatMap(p => p.tech_stack!)
                    .filter((tech, index, array) => array.indexOf(tech) === index);
                  
                  techsToShow = allTechStacks.length > 0 
                    ? allTechStacks.slice(0, 8) 
                    : ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL'];
                }
                
                return techsToShow.map((tech, idx) => {
                  // Find matching tech stack icon
                  const techMatch = techstacks.find(t => 
                    t.name.toLowerCase() === tech.toLowerCase() || 
                    t.alias?.toLowerCase() === tech.toLowerCase()
                  );
                  
                  if (techMatch) {
                    const IconComponent = techMatch.icon;
                    return (
                      <div key={idx} className="relative z-10 flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/15 hover:shadow-lg hover:shadow-blue-500/20 transition-all hover:scale-105">
                        <IconComponent className="w-4 h-4 text-white" />
                        <span className="text-slate-100 text-sm font-medium">{tech}</span>
                      </div>
                    );
                  } else {
                    // Fallback for technologies without icons
                    return (
                      <div key={idx} className="relative z-10 flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/15 hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:scale-105">
                        <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-sm flex items-center justify-center shadow-md">
                          <span className="text-white text-xs font-bold">{tech.charAt(0)}</span>
                        </div>
                        <span className="text-slate-100 text-sm font-medium">{tech}</span>
                      </div>
                    );
                  }
                });
              })()}
            </div>
          </div>

          {/* Features Grid */}
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 group">
            {/* Decorative glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <span className="text-white text-xl">✨</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent mb-2">
                    What's Included
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg shadow-pink-500/50"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="group/item flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:border-emerald-400/30 hover:scale-[1.02]">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-300">
                      <span className="text-white text-lg font-bold">✓</span>
                    </div>
                    <span className="text-slate-100 font-medium text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Process Timeline */}
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
            {/* Decorative glow */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
            <h3 className="relative z-10 text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm">🚀</span>
              </div>
              Our Process
            </h3>
            <div className="relative z-10 space-y-3">
              {['Discovery & Planning', 'Design & Development', 'Testing & Deployment', 'Maintenance & Support'].map((step, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-300 hover:scale-[1.02]">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {idx + 1}
                  </div>
                  <span className="text-slate-100 font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white p-4 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-sm font-medium">Professional Development Services</span>
            <span className="text-xs opacity-75">codebility.tech</span>
          </div>
        </div>
      </div>
    );
  };

  const SummaryPagePreview = () => {
    const totalServices = services.length;
    const categories = [...new Set(services.map(s => s.category))];

    return (
      <div className="w-full min-h-[800px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
        {/* Animated background with shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating gradient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 shadow-xl">
          <div className="text-center relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-2xl">
              <Image
                src="/assets/svgs/codebility-white.svg"
                alt="Codebility Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">SERVICE OVERVIEW</h1>
            <p className="text-white/90">Your Complete Solution Partner</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="relative p-8 space-y-8 z-10">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl hover:bg-white/10 hover:shadow-blue-500/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl font-bold">{totalServices}</span>
              </div>
              <div className="text-sm text-blue-200 font-medium">Total Services</div>
            </div>

            <div className="text-center p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl hover:bg-white/10 hover:shadow-purple-500/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl font-bold">{categories.length}</span>
              </div>
              <div className="text-sm text-purple-200 font-medium">Categories</div>
            </div>

            <div className="text-center p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl hover:bg-white/10 hover:shadow-green-500/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">🌟</span>
              </div>
              <div className="text-sm text-green-200 font-medium">Premium Quality</div>
            </div>
          </div>


          {/* Service Categories */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent text-center">Our Expertise</h3>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg hover:bg-white/10 hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02]">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="font-medium text-slate-100">{category}</span>
                </div>
              ))}
            </div>
          </div>


          {/* Call to Action */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 rounded-3xl text-center shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">Ready to Transform Your Ideas?</h3>
              <p className="text-lg mb-4 text-white/90">Let's discuss your project and bring it to life</p>
              <div className="space-y-2">
                <div className="text-white/90 font-medium">📧 admin@codebility.tech</div>
                <div className="text-white/90 font-medium">🌐 www.codebility.tech</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white p-4 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 text-center">
            <span className="text-sm">© {new Date().getFullYear()} Codebility • Professional Development Services</span>
          </div>
        </div>
      </div>
    );
  };

  const PreviewModal = () => {
    if (!showPreview) return null;

    const getCurrentPageContent = () => {
      if (currentPage === 0) {
        return <CoverPagePreview />;
      } else if (currentPage <= services.length) {
        const serviceIndex = currentPage - 1;
        return <ServicePagePreview service={services[serviceIndex]} index={serviceIndex} />;
      } else {
        return <SummaryPagePreview />;
      }
    };

    const nextPage = () => {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
      }
    };

    const prevPage = () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto sm:p-4">
        <div className="bg-white dark:bg-gray-900 sm:rounded-2xl shadow-2xl w-full sm:max-w-4xl min-h-screen sm:min-h-[90vh] sm:max-h-[95vh] flex flex-col sm:my-4">
          {/* Modal Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 flex items-center justify-between p-3 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center p-1">
                <Image
                  src="/assets/svgs/codebility-white.svg"
                  alt="Codebility Logo"
                  width={20}
                  height={20}
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </div>
              <h2 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-gray-200 truncate">
                <span className="hidden sm:inline">Services Catalog Preview</span>
                <span className="sm:hidden">Preview</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 sm:px-3 rounded-full whitespace-nowrap">
                {currentPage + 1}/{totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Page Content with A4 proportions */}
          <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 flex justify-center items-start min-h-0 overflow-y-auto pb-4">
            <div
              className="bg-white shadow-2xl sm:rounded-lg overflow-hidden w-full sm:max-w-[600px] my-2 sm:my-4 mb-8"
              style={{
                aspectRatio: window.innerWidth < 640 ? 'auto' : '210/297', // A4 ratio on desktop, auto on mobile
                minHeight: window.innerWidth < 640 ? 'auto' : '800px',
                maxHeight: window.innerWidth < 640 ? 'none' : '1200px',
                height: 'auto'
              }}
            >
              <div className="h-full overflow-y-auto">
                {getCurrentPageContent()}
              </div>
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            {/* Mobile Layout */}
            <div className="sm:hidden p-3 space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="flex-1 flex items-center justify-center gap-1 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 h-10"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className="flex-1 flex items-center justify-center gap-1 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 h-10"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={generateServicesPDF}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg h-10"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between gap-4 p-6">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
                >
                  Close Preview
                </Button>
                <Button
                  onClick={generateServicesPDF}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <H1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Services
            </H1>
            <p className="text-gray-600 dark:text-gray-400">
              View all services and export to PDF
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setCurrentPage(0);
              setShowPreview(true);
            }}
            disabled={services.length === 0}
            variant="outline"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={generateServicesPDF}
            disabled={services.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  No services found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  No services available
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Total Services: {services.length}
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Categories: {[...new Set(services.map(s => s.category))].join(", ")}
                  </p>
                </div>
              </div>
            </div>

            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{service.name}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{service.description}</p>
                    <div className="flex items-center gap-4 mb-3">
                      {service.price && (
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          {service.price}
                        </span>
                      )}
                      {service.duration && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          <strong>Duration:</strong> {service.duration}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Preview Modal */}
      <PreviewModal />
    </PageContainer>
  );
}