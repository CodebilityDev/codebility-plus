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
      price: "Starting from $25/hour",
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
      price: "Starting from $3,000",
      duration: "3-6 weeks"
    },
    {
      id: "5",
      name: "E-commerce Solutions",
      description: "Complete e-commerce platform development with payment integration, inventory management, and customer management systems.",
      category: "Development",
      features: [
        "Custom e-commerce platforms",
        "Payment gateway integration",
        "Inventory management",
        "Customer management system",
        "Order tracking",
        "Admin dashboard",
        "Multi-vendor support"
      ],
      price: "Starting from $10,000",
      duration: "8-12 weeks"
    },
    {
      id: "6",
      name: "Consulting & Training",
      description: "Technical consulting and training services to help your team adopt new technologies and improve development processes.",
      category: "Consulting",
      features: [
        "Technology assessment",
        "Architecture consulting",
        "Code review and optimization",
        "Team training and workshops",
        "Best practices implementation",
        "Process improvement",
        "Ongoing mentorship"
      ],
      price: "Starting from $150/hour",
      duration: "Flexible"
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
          'E-commerce Solutions': ['Multi-vendor Store', 'B2B Platform', 'Marketplace'],
          'Consulting & Training': ['Code Review', 'Team Workshop', 'Architecture Audit']
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
      // First get all projects with valid images
      const projectsWithImages = realProjects.filter(project => {
        return project.main_image && project.main_image.trim() !== '';
      });
      
      // Filter projects based on service type and category
      const relevantProjects = projectsWithImages.filter(project => {
        const projectName = project.name.toLowerCase();
        const projectDesc = (project.description || '').toLowerCase();
        const techStack = (project.tech_stack || []).join(' ').toLowerCase();
        const searchTerms = `${projectName} ${projectDesc} ${techStack}`;
        const categoryName = project.projects_category?.name?.toLowerCase() || '';
        const categoryId = project.project_category_id;
        
        
        switch (serviceName) {
          case 'Web Application Development':
            // Category ID 1 = "Web Application" 
            const isWeb = categoryId === 1 || 
                   categoryName.includes('web') || 
                   searchTerms.includes('web') || 
                   searchTerms.includes('website') || 
                   searchTerms.includes('react') ||
                   searchTerms.includes('next') ||
                   searchTerms.includes('vue') ||
                   searchTerms.includes('angular') ||
                   (!searchTerms.includes('mobile') && !categoryName.includes('mobile') && categoryId !== 2);
            return isWeb;
          case 'Mobile Application Development':
            // Category ID 2 = "Mobile Application" - STRICT filtering for mobile only
            // First priority: exact category ID match
            if (categoryId === 2) {
              return true;
            }
            // Second priority: explicit mobile keywords
            return categoryName.includes('mobile') ||
                   searchTerms.includes('mobile') || 
                   searchTerms.includes('react native') ||
                   searchTerms.includes('flutter') ||
                   searchTerms.includes('ios') ||
                   searchTerms.includes('android');
          case 'Product Design':
            // Category ID 3 = "Product Design"
            const isDesign = categoryId === 3 ||
                   categoryName.includes('design') ||
                   searchTerms.includes('design') || 
                   searchTerms.includes('ui') || 
                   searchTerms.includes('ux') ||
                   searchTerms.includes('figma');
            return isDesign;
          case 'E-commerce Solutions':
            return categoryName.includes('ecommerce') || categoryName.includes('commerce') ||
                   searchTerms.includes('ecommerce') || 
                   searchTerms.includes('shop') || 
                   searchTerms.includes('store') ||
                   searchTerms.includes('commerce') ||
                   searchTerms.includes('marketplace');
          case 'Consulting & Training':
            return categoryName.includes('consulting') || categoryName.includes('training') ||
                   searchTerms.includes('consulting') || 
                   searchTerms.includes('training') ||
                   searchTerms.includes('tutorial') ||
                   searchTerms.includes('learning');
          default:
            return true;
        }
      });
      
      // Use relevant projects first, then fallback based on service type
      let projectsToUse = relevantProjects;
      
      // Service-specific dummy images when no real projects exist
      const getServiceDummyImages = (serviceName: string) => {
        const dummyImageMap: { [key: string]: string[] } = {
          'E-commerce Solutions': [
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop', // E-commerce dashboard
            'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop', // Online shopping
            'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600&h=400&fit=crop', // Product catalog
            'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&h=400&fit=crop', // Shopping cart
            'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600&h=400&fit=crop'  // Marketplace
          ],
          'Consulting & Training': [
            'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop', // Team meeting
            'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop', // Training session
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', // Code review
            'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop', // Workshop
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop'  // Consulting
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
      
      // If no relevant projects and it's a service without many real projects, use dummy images
      if (projectsToUse.length === 0 && ['E-commerce Solutions', 'Consulting & Training'].includes(serviceName)) {
        return getServiceDummyImages(serviceName);
      }
      
      // Use relevant projects or fallback to all projects for services with real projects
      projectsToUse = projectsToUse.length >= 3 ? projectsToUse : projectsWithImages;
      
      // Final fallback to dummy images if still no projects
      if (projectsToUse.length === 0) {
        return getServiceDummyImages(serviceName);
      }
      
      const imageUrls = projectsToUse.map(project => project.main_image!).slice(0, 6);
      return imageUrls;
    };

    // Special handling for Codev for Hire service
    const isCodevHireService = service.name === 'Codev for Hire';
    
    const images = isCodevHireService 
      ? codevProfiles.map(() => "avatar-icon") // Use ALL codevs with avatar icons
      : getServiceProjects(service.name);
    
    // Get actual project data for showcasing
    const getServiceProjectData = (serviceName: string) => {
      if (serviceName === 'Codev for Hire') {
        return codevProfiles; // Return ALL codev profiles
      }
      
      const projectsWithImages = realProjects.filter(project => project.main_image && project.main_image.trim() !== '');
      
      const relevantProjects = projectsWithImages.filter(project => {
        const projectName = project.name.toLowerCase();
        const projectDesc = (project.description || '').toLowerCase();
        const techStack = (project.tech_stack || []).join(' ').toLowerCase();
        const searchTerms = `${projectName} ${projectDesc} ${techStack}`;
        const categoryName = project.projects_category?.name?.toLowerCase() || '';
        const categoryId = project.project_category_id;
        
        switch (serviceName) {
          case 'Web Application Development':
            // Category ID 1 = "Web Application" 
            return categoryId === 1 || 
                   categoryName.includes('web') || 
                   searchTerms.includes('web') || 
                   searchTerms.includes('website') || 
                   searchTerms.includes('react') ||
                   (!searchTerms.includes('mobile') && !categoryName.includes('mobile') && categoryId !== 2);
          case 'Mobile Application Development':
            // Category ID 2 = "Mobile Application" - STRICT filtering for mobile only
            if (categoryId === 2) {
              return true;
            }
            return categoryName.includes('mobile') ||
                   searchTerms.includes('mobile') || 
                   searchTerms.includes('react native') ||
                   searchTerms.includes('flutter') ||
                   searchTerms.includes('ios') ||
                   searchTerms.includes('android');
          case 'Product Design':
            // Category ID 3 = "Product Design"
            return categoryId === 3 ||
                   categoryName.includes('design') ||
                   searchTerms.includes('design') || 
                   searchTerms.includes('ui') || 
                   searchTerms.includes('ux');
          case 'E-commerce Solutions':
            return categoryName.includes('ecommerce') || categoryName.includes('commerce') || searchTerms.includes('ecommerce') || searchTerms.includes('shop') || searchTerms.includes('store');
          default:
            return true;
        }
      });
      
      // Use relevant projects first, then fallback to all projects for better showcase
      return relevantProjects.length >= 3 ? relevantProjects.slice(0, 6) : projectsWithImages.slice(0, 6);
    };
    
    const projectData = getServiceProjectData(service.name);

    return (
      <div className="w-full min-h-[800px] bg-gradient-to-br from-gray-50 to-white relative overflow-y-auto">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-3.134-3-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23000000' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-slate-800 to-blue-900 text-white p-4">
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
        <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
          <div className="absolute inset-0">
            {isCodevHireService ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <User className="w-20 h-20 text-white/70" />
              </div>
            ) : (
              <img 
                src={images[0]} 
                alt={projectData[0]?.name || `${service.name} hero project`}
                className="w-full h-full object-cover opacity-70"
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop';
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40"></div>
          </div>
          
          {/* Service Title Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
            <div className="space-y-4">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                {service.category}
              </span>
              <h1 className="text-4xl font-bold leading-tight max-w-md">{service.name}</h1>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto"></div>
            </div>
          </div>
        </div>
        
        {/* Project Gallery Section / Codev Profiles Section */}
        <div className="p-6 bg-white">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isCodevHireService ? 'Available Codevs' : service.name === 'Mobile Application Development' ? 'Mobile App Showcase' : 'Recent Projects'}
            </h2>
            <p className="text-gray-600">
              {isCodevHireService 
                ? 'Meet our talented developers ready to join your team' 
                : service.name === 'Mobile Application Development'
                ? 'Our mobile applications designed for iOS and Android'
                : `Showcasing our expertise in ${service.category.toLowerCase()}`
              }
            </p>
          </div>
          
          {/* Special Mobile Layout with Phone Mockups - Render ALL mobile projects */}
          {service.name === 'Mobile Application Development' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {(() => {
                // Get ALL mobile projects
                const mobileProjects = realProjects.filter(project => {
                  const categoryId = project.project_category_id;
                  const categoryName = project.projects_category?.name?.toLowerCase() || '';
                  const searchTerms = `${project.name} ${project.description || ''} ${(project.tech_stack || []).join(' ')}`.toLowerCase();
                  
                  // STRICT mobile filtering - only show true mobile projects
                  return categoryId === 2 || 
                         categoryName.includes('mobile') ||
                         searchTerms.includes('mobile') || 
                         searchTerms.includes('react native') ||
                         searchTerms.includes('flutter') ||
                         searchTerms.includes('ios') ||
                         searchTerms.includes('android');
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
                        <div className="text-xs font-medium text-gray-800 truncate">{projectName}</div>
                        {project?.tech_stack && project.tech_stack.length > 0 && (
                          <div className="text-xs text-gray-500 truncate">
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
                  <div key={idx} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="w-full h-20 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 relative overflow-hidden">
                      {codevImage ? (
                        <img 
                          src={codevImage} 
                          alt={codevName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`${codevImage ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                        <User className="w-6 h-6 text-white/80" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute bottom-1 left-1 right-1 text-white">
                        <div className="text-xs font-medium truncate">{codevName}</div>
                        <div className="text-xs opacity-80 truncate">{codevSkills}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Regular Project Grid or Dummy Images */
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(() => {
                let projectsToShow = projectData;
                let imagesToShow = images;
                let isDummyContent = false;
                
                // For Web Application Development - show ALL web projects
                if (service.name === 'Web Application Development') {
                  const webProjects = realProjects.filter(project => {
                    const categoryId = project.project_category_id;
                    const categoryName = project.projects_category?.name?.toLowerCase() || '';
                    const searchTerms = `${project.name} ${project.description || ''} ${(project.tech_stack || []).join(' ')}`.toLowerCase();
                    
                    return categoryId === 1 || 
                           categoryName.includes('web') || 
                           searchTerms.includes('web') || 
                           searchTerms.includes('website') || 
                           searchTerms.includes('react') ||
                           (!searchTerms.includes('mobile') && !categoryName.includes('mobile') && categoryId !== 2);
                  });
                  projectsToShow = webProjects.filter(p => p.main_image && p.main_image.trim() !== '');
                  imagesToShow = projectsToShow.map(p => p.main_image!);
                }
                // For E-commerce Solutions - don't render images, just show text
                else if (service.name === 'E-commerce Solutions') {
                  return (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <div className="text-2xl">🛒</div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Ready to deliver exceptional e-commerce solutions
                      </p>
                    </div>
                  );
                }
                // For Consulting & Training - show dummy images
                else if (service.name === 'Consulting & Training') {
                  const dummyImages = getServiceProjects(service.name);
                  
                  return dummyImages.map((img, idx) => {
                    const serviceName = `Training Session ${idx + 1}`;
                    
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
                            <div className="text-xs opacity-80 truncate">Professional Training</div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                }
                // For Product Design - show ALL real Product Design projects
                else if (service.name === 'Product Design') {
                  const designProjects = realProjects.filter(project => {
                    const categoryId = project.project_category_id;
                    const categoryName = project.projects_category?.name?.toLowerCase() || '';
                    const searchTerms = `${project.name} ${project.description || ''} ${(project.tech_stack || []).join(' ')}`.toLowerCase();
                    
                    return categoryId === 3 || 
                           categoryName.includes('design') ||
                           searchTerms.includes('design') || 
                           searchTerms.includes('ui') || 
                           searchTerms.includes('ux') ||
                           searchTerms.includes('figma');
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
                
                const finalImages = imagesToShow.length > 0 ? imagesToShow.slice(0, 12) : images.slice(0, 12);
                
                return finalImages.map((img, idx) => {
                  const project = projectsToShow[idx];
                  const projectName = project?.name || `Project ${idx + 1}`;
                  
                  return (
                    <div key={idx} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <img 
                        src={img} 
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
              })()}
            </div>
          )}
          
          {/* Client Testimonial Card */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                "
              </div>
              <div className="flex-1">
                <p className="text-gray-700 italic mb-3">
                  "Exceptional work quality and professional delivery. The team exceeded our expectations."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Happy Client</div>
                    <div className="text-gray-600 text-xs">{service.category} Project</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-6 space-y-8 bg-gray-50">
          {/* Price and Duration */}
          {(service.price || service.duration) && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">💎</span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-2xl text-green-800 mb-1">{service.price || 'Contact for pricing'}</div>
                  {service.duration && <div className="text-green-600 font-medium">{service.duration}</div>}
                  <div className="text-sm text-green-700 mt-1">Professional service package</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📋</span>
              </div>
              About This Service
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">{service.description}</p>
          </div>
          
          {/* Technology Stack with Icons / Codev Skills */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
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
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg hover:shadow-sm transition-all">
                        <IconComponent className="w-4 h-4" />
                        <span className="text-gray-700 text-sm font-medium">{tech}</span>
                      </div>
                    );
                  } else {
                    // Fallback for technologies without icons
                    return (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                        <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-sm flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{tech.charAt(0)}</span>
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{tech}</span>
                      </div>
                    );
                  }
                });
              })()}
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✨</span>
              </div>
              What's Included
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200 hover:border-blue-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Process Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🚀</span>
              </div>
              Our Process
            </h3>
            <div className="space-y-3">
              {['Discovery & Planning', 'Design & Development', 'Testing & Deployment', 'Maintenance & Support'].map((step, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </div>
                  <span className="text-gray-700 font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-800 to-slate-800 text-white p-4">
          <div className="flex items-center justify-between">
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
      <div className="w-full h-full bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M50 50c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zM10 10c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm60 60c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-800 to-blue-900 text-white p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Image
                src="/assets/svgs/codebility-white.svg"
                alt="Codebility Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">SERVICE OVERVIEW</h1>
            <p className="text-white/80">Your Complete Solution Partner</p>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-bold">{totalServices}</span>
              </div>
              <div className="text-sm text-blue-600 font-medium">Total Services</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 shadow-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-bold">{categories.length}</span>
              </div>
              <div className="text-sm text-purple-600 font-medium">Categories</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 shadow-lg">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">🌟</span>
              </div>
              <div className="text-sm text-green-600 font-medium">Premium Quality</div>
            </div>
          </div>
          
          {/* Service Categories */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 text-center">Our Expertise</h3>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="font-medium text-gray-700">{category}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl text-center shadow-2xl">
            <h3 className="text-2xl font-bold mb-3">Ready to Transform Your Ideas?</h3>
            <p className="text-lg mb-4 text-white/90">Let's discuss your project and bring it to life</p>
            <div className="space-y-2">
              <div className="text-white/80">📧 admin@codebility.tech</div>
              <div className="text-white/80">🌐 www.codebility.tech</div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-800 to-slate-800 text-white p-4">
          <div className="text-center">
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
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl min-h-[90vh] max-h-fit flex flex-col my-2 sm:my-4">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center p-1">
                <Image
                  src="/assets/svgs/codebility-white.svg"
                  alt="Codebility Logo"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Services Catalog Preview</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Page Content with A4 proportions */}
          <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex justify-center items-start min-h-0 overflow-y-auto">
            <div 
              className="bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-[600px] my-4"
              style={{ 
                aspectRatio: '210/297', // A4 ratio
                minHeight: '800px',
                height: 'auto'
              }}
            >
              <div className="h-full overflow-y-auto">
                {getCurrentPageContent()}
              </div>
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <Button
              variant="outline"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="flex items-center gap-2 w-full sm:w-auto text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="w-full sm:w-auto text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
              >
                Close Preview
              </Button>
              <Button
                onClick={generateServicesPDF}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="flex items-center gap-2 w-full sm:w-auto text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
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
                <div className="flex gap-2">
                  <Button
                    onClick={generateServicesPDF}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
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