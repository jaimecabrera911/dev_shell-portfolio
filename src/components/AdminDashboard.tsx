'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
import React, { useState, useEffect, FormEvent } from 'react';
import { 
  getContactMessages, deleteContactMessage, setAdminAuthenticated,
  getProjects, saveProject, deleteProject, getResumeData, saveResumeData,
  DEFAULT_RESUME_DATA
} from '../utils/storage';
import { ContactMessage, Project, ArchitectureNode, ArchitectureLink, ResumeData, CertificationItem, ExperienceItem } from '../types';
import { 
  Terminal, LogOut, Trash2, Mail, RefreshCw, Database, ArrowLeft,
  Menu, X, Plus, FolderGit2, Calendar, Link, Globe, Code, Layers,
  FileText, Check, CheckCircle2, ChevronRight, HelpCircle, Upload, Image as ImageIcon,
  Pencil, Save, Briefcase, Building, Code2, Rocket,
  Trophy, GraduationCap, Cpu, Server, Users, Sparkles
} from 'lucide-react';
import { getDeviconClass } from './TechMarquee';

const DEVICON_PRESETS = [
  // Languages
  { value: 'Javascript', label: 'JavaScript' },
  { value: 'Typescript', label: 'TypeScript' },
  { value: 'Java', label: 'Java' },
  { value: 'Python', label: 'Python' },
  { value: 'Php', label: 'PHP' },
  { value: 'Ruby', label: 'Ruby' },
  { value: 'Go', label: 'Go / Golang' },
  { value: 'Rust', label: 'Rust' },
  { value: 'Cplusplus', label: 'C++' },
  { value: 'Csharp', label: 'C#' },
  { value: 'Swift', label: 'Swift' },
  { value: 'Kotlin', label: 'Kotlin' },
  { value: 'Scala', label: 'Scala' },
  { value: 'Dart', label: 'Dart' },
  { value: 'Elixir', label: 'Elixir' },
  { value: 'Haskell', label: 'Haskell' },
  { value: 'Lua', label: 'Lua' },
  { value: 'R', label: 'R' },
  { value: 'Shell', label: 'Shell / Bash' },
  
  // Frontend Frameworks & Libraries
  { value: 'React', label: 'React' },
  { value: 'ReactNative', label: 'React Native' },
  { value: 'Next', label: 'Next.js' },
  { value: 'Vue', label: 'Vue.js' },
  { value: 'Angular', label: 'Angular' },
  { value: 'Svelte', label: 'Svelte' },
  { value: 'Tailwind', label: 'Tailwind CSS' },
  { value: 'Bootstrap', label: 'Bootstrap' },
  { value: 'Sass', label: 'Sass / SCSS' },
  { value: 'HTML', label: 'HTML5' },
  { value: 'CSS', label: 'CSS3' },
  
  // Backend & Servers
  { value: 'Node', label: 'Node.js' },
  { value: 'Express', label: 'Express.js' },
  { value: 'Nestjs', label: 'NestJS' },
  { value: 'Django', label: 'Django' },
  { value: 'Flask', label: 'Flask' },
  { value: 'Spring', label: 'Spring Boot' },
  { value: 'Laravel', label: 'Laravel' },
  { value: 'Rails', label: 'Ruby on Rails' },
  
  // Databases & Cache
  { value: 'Postgres', label: 'PostgreSQL' },
  { value: 'Mysql', label: 'MySQL' },
  { value: 'Mongodb', label: 'MongoDB' },
  { value: 'Redis', label: 'Redis' },
  { value: 'Sqlite', label: 'SQLite' },
  { value: 'Mariadb', label: 'MariaDB' },
  { value: 'Oracle', label: 'Oracle DB' },
  { value: 'Firebase', label: 'Firebase' },
  { value: 'Supabase', label: 'Supabase' },
  { value: 'Graphql', label: 'GraphQL' },
  
  // DevOps & Cloud
  { value: 'Docker', label: 'Docker' },
  { value: 'Kubernetes', label: 'Kubernetes' },
  { value: 'Aws', label: 'AWS' },
  { value: 'Azure', label: 'Azure' },
  { value: 'Gcp', label: 'Google Cloud Platform' },
  { value: 'Terraform', label: 'Terraform' },
  { value: 'Ansible', label: 'Ansible' },
  { value: 'Jenkins', label: 'Jenkins' },
  { value: 'Nginx', label: 'Nginx' },
  { value: 'Apache', label: 'Apache' },
  
  // Tools & Platforms
  { value: 'Git', label: 'Git' },
  { value: 'Github', label: 'GitHub' },
  { value: 'Gitlab', label: 'GitLab' },
  { value: 'Vscode', label: 'VS Code' },
  { value: 'Webpack', label: 'Webpack' },
  { value: 'Vite', label: 'Vite' },
  { value: 'Figma', label: 'Figma' },
  { value: 'Linux', label: 'Linux' },
  { value: 'wordpress', label: 'WordPress' }
];

interface AdminDashboardProps {
  onLogout: () => void;
}

const ARCHITECTURE_TEMPLATES = {
  'serverless': {
    name: 'Serverless Web App',
    nodes: [
      { id: 'client', label: 'Web Client', type: 'client', status: 'active' },
      { id: 'gateway', label: 'API Gateway', type: 'gateway', status: 'active' },
      { id: 'lambda', label: 'AWS Lambda (Ingest)', type: 'service', status: 'loading' },
      { id: 'sqs', label: 'SQS Buffer', type: 'queue', status: 'active' },
      { id: 'db', label: 'DynamoDB', type: 'database', status: 'idle' }
    ] as ArchitectureNode[],
    links: [
      { source: 'client', target: 'gateway', label: 'HTTPS POST', animated: true },
      { source: 'gateway', target: 'lambda', label: 'Proxy', animated: true },
      { source: 'lambda', target: 'sqs', label: 'Buffer Stream', animated: true },
      { source: 'sqs', target: 'db', label: 'Batch Write', animated: false }
    ] as ArchitectureLink[]
  },
  'p2p-cache': {
    name: 'Distributed P2P Cache',
    nodes: [
      { id: 'app', label: 'App Nodes', type: 'client', status: 'active' },
      { id: 'router', label: 'Consistent Hashing Ring', type: 'gateway', status: 'active' },
      { id: 'redis-a', label: 'Cache Node A', type: 'cache', status: 'active' },
      { id: 'redis-b', label: 'Cache Node B', type: 'cache', status: 'active' },
      { id: 'sync', label: 'SWIM Gossip Protocol', type: 'service', status: 'loading' }
    ] as ArchitectureNode[],
    links: [
      { source: 'app', target: 'router', label: 'Lookup Key', animated: true },
      { source: 'router', target: 'redis-a', label: 'Route (Hash Match)', animated: true },
      { source: 'router', target: 'redis-b', label: 'Route (Hash Backup)', animated: false },
      { source: 'redis-a', target: 'sync', label: 'Gossip Status', animated: true },
      { source: 'redis-b', target: 'sync', label: 'Gossip Status', animated: true }
    ] as ArchitectureLink[]
  },
  'ecommerce': {
    name: 'E-Commerce Checkout Pipeline',
    nodes: [
      { id: 'mobile', label: 'Mobile Client', type: 'client', status: 'active' },
      { id: 'gateway', label: 'GraphQL API Gateway', type: 'gateway', status: 'active' },
      { id: 'db', label: 'PostgreSQL DB', type: 'database', status: 'loading' },
      { id: 'stripe', label: 'Stripe Gateway', type: 'service', status: 'idle' }
    ] as ArchitectureNode[],
    links: [
      { source: 'mobile', target: 'gateway', label: 'WebSocket / GraphQL', animated: true },
      { source: 'gateway', target: 'db', label: 'Row-Lock Transaction', animated: true },
      { source: 'gateway', target: 'stripe', label: 'Capture Payment', animated: false }
    ] as ArchitectureLink[]
  },
  'analytics': {
    name: 'Microservices Analytics Pipeline',
    nodes: [
      { id: 'iot', label: 'IoT Sensors', type: 'client', status: 'active' },
      { id: 'kafka', label: 'Kafka Ingest Stream', type: 'queue', status: 'active' },
      { id: 'spark', label: 'Spark Stream Processor', type: 'service', status: 'loading' },
      { id: 'snowflake', label: 'Snowflake Warehouse', type: 'database', status: 'idle' }
    ] as ArchitectureNode[],
    links: [
      { source: 'iot', target: 'kafka', label: 'Telemetry POST', animated: true },
      { source: 'kafka', target: 'spark', label: 'Stream Consume', animated: true },
      { source: 'spark', target: 'snowflake', label: 'Bulk Copy', animated: true }
    ] as ArchitectureLink[]
  }
};

const PRESET_IMAGES = [
  {
    name: 'Analytics/Data',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Decentralized Server Network',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Developer Workspace & Code',
    url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Mobile Devices & Storefront',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80'
  }
];

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'skills' | 'page_content' | 'resume'>('messages');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Project Editing and Delete Confirmation States
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);
  const [messageToDeleteId, setMessageToDeleteId] = useState<string | null>(null);

  // Resume Editing States
  const [resumeForm, setResumeForm] = useState<ResumeData>(DEFAULT_RESUME_DATA);
  const [resumeFormSuccess, setResumeFormSuccess] = useState('');

  // Skills Editing States
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillIcon, setNewSkillIcon] = useState('Javascript');
  const [iconSearchQuery, setIconSearchQuery] = useState('JavaScript');
  const [showIconSuggestions, setShowIconSuggestions] = useState(false);
  const [newSkillCategory, setNewSkillCategory] = useState<'frontend' | 'backend' | 'database' | 'devops'>('frontend');
  const [newSkillIsCore, setNewSkillIsCore] = useState(false);
  const [newSkillColor, setNewSkillColor] = useState('');
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
  const [skillsFormSuccess, setSkillsFormSuccess] = useState('');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill = {
      name: newSkillName.trim(),
      icon: newSkillIcon,
      category: newSkillCategory,
      isCore: newSkillIsCore,
      color: newSkillColor.trim() || undefined
    };

    const currentSkills = resumeForm.skills || [];
    let updatedSkills;

    if (editingSkillIndex !== null) {
      updatedSkills = [...currentSkills];
      updatedSkills[editingSkillIndex] = newSkill;
      setEditingSkillIndex(null);
    } else {
      updatedSkills = [...currentSkills, newSkill];
    }

    setResumeForm({
      ...resumeForm,
      skills: updatedSkills
    });

    setNewSkillName('');
    setNewSkillIcon('Javascript');
    setIconSearchQuery('JavaScript');
    setNewSkillCategory('frontend');
    setNewSkillIsCore(false);
    setNewSkillColor('');
  };

  const handleDeleteSkill = (index: number) => {
    const currentSkills = resumeForm.skills || [];
    const updatedSkills = currentSkills.filter((_, i) => i !== index);
    setResumeForm({
      ...resumeForm,
      skills: updatedSkills
    });
    if (editingSkillIndex === index) {
      setEditingSkillIndex(null);
      setNewSkillName('');
      setNewSkillIcon('Javascript');
      setIconSearchQuery('JavaScript');
      setNewSkillCategory('frontend');
      setNewSkillIsCore(false);
      setNewSkillColor('');
    }
  };

  const handleEditSkillClick = (index: number) => {
    const currentSkills = resumeForm.skills || [];
    const skill = currentSkills[index];
    if (!skill) return;

    setEditingSkillIndex(index);
    setNewSkillName(skill.name);
    setNewSkillIcon(skill.icon);
    
    // Find matching preset label for the search input
    const preset = DEVICON_PRESETS.find(p => p.value.toLowerCase() === skill.icon.toLowerCase());
    setIconSearchQuery(preset ? preset.label : skill.icon);
    
    setNewSkillCategory(skill.category);
    setNewSkillIsCore(skill.isCore);
    setNewSkillColor(skill.color || '');
  };

  const handleSaveSkills = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveResumeData(resumeForm);
      setSkillsFormSuccess('Skill Ecosystem dynamic configurations compiled live!');
      setTimeout(() => setSkillsFormSuccess(''), 4000);
    } catch (err) {
      alert('Failed to save skills: ' + err);
    }
  };
  
  // New sub-items inputs for resume
  const [newCertName, setNewCertName] = useState('');
  const [newCertDetails, setNewCertDetails] = useState('');
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpPeriod, setNewExpPeriod] = useState('');
  const [newExpBulletPoints, setNewExpBulletPoints] = useState('');

  // New sub-items inputs for education list
  const [newEduDegree, setNewEduDegree] = useState('');
  const [newEduSchool, setNewEduSchool] = useState('');
  const [newEduDetails, setNewEduDetails] = useState('');

  // Form states for adding/editing a project
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectChallenges, setProjectChallenges] = useState('');
  const [projectSolutions, setProjectSolutions] = useState('');
  const [projectBusinessImpact, setProjectBusinessImpact] = useState('');
  const [projectImage, setProjectImage] = useState(PRESET_IMAGES[0].url);
  const [projectTags, setProjectTags] = useState('');
  const [projectYear, setProjectYear] = useState('2026');
  const [projectDemoUrl, setProjectDemoUrl] = useState('#');
  const [projectGithubUrl, setProjectGithubUrl] = useState('#');
  const [projectCodeSnippet, setProjectCodeSnippet] = useState('');
  const [projectCodeLanguage, setProjectCodeLanguage] = useState('typescript');
  const [projectTemplate, setProjectTemplate] = useState<keyof typeof ARCHITECTURE_TEMPLATES>('serverless');
  
  const [formSuccess, setFormSuccess] = useState('');
  
  // Custom cover image file uploading states & handlers
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file (PNG, JPG, WEBP, GIF).');
      return;
    }
    if (file.size > 2000000) { // 2MB limit
      setUploadError('Image size exceeds 2MB. Please select a smaller image.');
      return;
    }
    
    setUploadError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setProjectImage(e.target.result as string);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // PDF upload states & handlers
  const [pdfDragActive, setPdfDragActive] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const handlePdfFile = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setPdfError('Please upload a valid PDF document.');
      return;
    }
    if (file.size > 5000000) { // 5MB limit
      setPdfError('PDF size exceeds 5MB. Please select a smaller file.');
      return;
    }

    setPdfError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setResumeForm(prev => ({
          ...prev,
          pdfBase64: e.target.result as string,
          pdfFileName: file.name
        }));
      }
    };
    reader.onerror = () => {
      setPdfError('Failed to read PDF file.');
    };
    reader.readAsDataURL(file);
  };

  const handlePdfDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setPdfDragActive(true);
    } else if (e.type === 'dragleave') {
      setPdfDragActive(false);
    }
  };

  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPdfDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePdfFile(e.dataTransfer.files[0]);
    }
  };

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePdfFile(e.target.files[0]);
    }
  };

  const loadData = () => {
    setIsRefreshing(true);
    Promise.all([getContactMessages(), getProjects(), getResumeData()])
      .then(([msgs, projs, resume]) => {
        setMessages(msgs);
        setProjects(projs);
        setResumeForm(resume);
        setIsRefreshing(false);
      })
      .catch((err) => {
        console.error('Error loading admin dashboard data:', err);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    loadData();

    // Listen to contact messages updates
    const handleMessagesUpdate = () => {
      getContactMessages().then(setMessages).catch((err) => console.error(err));
    };
    // Listen to projects updates
    const handleProjectsUpdate = () => {
      getProjects().then(setProjects).catch((err) => console.error(err));
    };
    // Listen to resume updates
    const handleResumeUpdate = () => {
      getResumeData().then(setResumeForm).catch((err) => console.error(err));
    };

    window.addEventListener('devshell_messages_updated', handleMessagesUpdate);
    window.addEventListener('devshell_projects_updated', handleProjectsUpdate);
    window.addEventListener('devshell_resume_updated', handleResumeUpdate);

    return () => {
      window.removeEventListener('devshell_messages_updated', handleMessagesUpdate);
      window.removeEventListener('devshell_projects_updated', handleProjectsUpdate);
      window.removeEventListener('devshell_resume_updated', handleResumeUpdate);
    };
  }, []);

  const handleDeleteMessage = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteContactMessage(id);
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } catch (err) {
        alert('Failed to delete message: ' + err);
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project? This will remove it from your main portfolio display.')) {
      try {
        await deleteProject(id);
      } catch (err) {
        alert('Failed to delete project: ' + err);
      }
    }
  };

  const handleLogoutAction = () => {
    setAdminAuthenticated(false);
    onLogout();
  };

  const handleAddProjectSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!projectTitle.trim() || !projectDescription.trim() || !projectChallenges.trim() || !projectSolutions.trim()) {
      alert('Please fill out all the primary project information fields (Title, Description, Challenges, and Solutions).');
      return;
    }

    const originalProject = editingProjectId ? projects.find(p => p.id === editingProjectId) : null;
    const templateData = ARCHITECTURE_TEMPLATES[projectTemplate];
    const newProjectId = editingProjectId || projectTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    const newProject: Project = {
      id: newProjectId,
      title: projectTitle,
      description: projectDescription,
      challenges: projectChallenges,
      solutions: projectSolutions,
      image: projectImage,
      tags: projectTags ? projectTags.split(',').map(t => t.trim()).filter(Boolean) : ['System Architecture'],
      year: projectYear,
      demoUrl: projectDemoUrl,
      githubUrl: projectGithubUrl,
      architectureNodes: originalProject?.architectureNodes || templateData.nodes,
      architectureLinks: originalProject?.architectureLinks || templateData.links,
      codeSnippet: projectCodeSnippet || `// ${projectTitle} initialization snippet\nconsole.log("Initializing systems...");`,
      codeLanguage: projectCodeLanguage,
      businessImpact: projectBusinessImpact
    };

    try {
      await saveProject(newProject);
      setFormSuccess(editingProjectId ? 'Project updated successfully!' : 'Project registered and deployed successfully!');
      setEditingProjectId(null);

      // Reset simple form fields (but keep placeholders/year)
      setProjectTitle('');
      setProjectDescription('');
      setProjectChallenges('');
      setProjectSolutions('');
      setProjectBusinessImpact('');
      setProjectTags('');
      setProjectCodeSnippet('');
      setProjectImage(PRESET_IMAGES[0].url);
      
      setTimeout(() => {
        setFormSuccess('');
      }, 4000);
    } catch (err) {
      alert('Failed to save project: ' + err);
    }
  };

  const handleEditProjectClick = (proj: Project) => {
    setEditingProjectId(proj.id);
    setProjectTitle(proj.title);
    setProjectDescription(proj.description || '');
    setProjectChallenges(proj.challenges || '');
    setProjectSolutions(proj.solutions || '');
    setProjectBusinessImpact(proj.businessImpact || '');
    setProjectImage(proj.image || PRESET_IMAGES[0].url);
    setProjectTags(proj.tags ? proj.tags.join(', ') : '');
    setProjectYear(proj.year || '2026');
    setProjectDemoUrl(proj.demoUrl || '#');
    setProjectGithubUrl(proj.githubUrl || '#');
    setProjectCodeSnippet(proj.codeSnippet || '');
    setProjectCodeLanguage(proj.codeLanguage || 'typescript');
    
    // Find matching template if possible, or keep default
    // Scroll the form into view
    const formElement = document.getElementById('projects-tab-panel');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setProjectTitle('');
    setProjectDescription('');
    setProjectChallenges('');
    setProjectSolutions('');
    setProjectTags('');
    setProjectYear('2026');
    setProjectDemoUrl('#');
    setProjectGithubUrl('#');
    setProjectCodeSnippet('');
    setProjectCodeLanguage('typescript');
    setProjectImage(PRESET_IMAGES[0].url);
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim()) return;
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: newCertName.trim(),
      details: newCertDetails.trim()
    };
    const updated = {
      ...resumeForm,
      certifications: [...(resumeForm.certifications || []), newCert]
    };
    setResumeForm(updated);
    setNewCertName('');
    setNewCertDetails('');
  };

  const handleDeleteCert = (id: string) => {
    const updated = {
      ...resumeForm,
      certifications: (resumeForm.certifications || []).filter(c => c.id !== id)
    };
    setResumeForm(updated);
  };

  const handleAddExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpRole.trim() || !newExpCompany.trim() || !newExpPeriod.trim()) return;
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: newExpRole.trim(),
      company: newExpCompany.trim(),
      period: newExpPeriod.trim(),
      bulletPoints: newExpBulletPoints ? newExpBulletPoints.split('\n').map(b => b.trim()).filter(Boolean) : []
    };
    const updated = {
      ...resumeForm,
      experience: [...(resumeForm.experience || []), newExp]
    };
    setResumeForm(updated);
    setNewExpRole('');
    setNewExpCompany('');
    setNewExpPeriod('');
    setNewExpBulletPoints('');
  };

  const handleDeleteExp = (id: string) => {
    const updated = {
      ...resumeForm,
      experience: (resumeForm.experience || []).filter(e => e.id !== id)
    };
    setResumeForm(updated);
  };

  const handleAddEdu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEduDegree.trim() || !newEduSchool.trim()) return;
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: newEduDegree.trim(),
      school: newEduSchool.trim(),
      details: newEduDetails.trim()
    };
    const updated = {
      ...resumeForm,
      education: [...(resumeForm.education || []), newEdu]
    };
    setResumeForm(updated);
    setNewEduDegree('');
    setNewEduSchool('');
    setNewEduDetails('');
  };

  const handleDeleteEdu = (id: string) => {
    const updated = {
      ...resumeForm,
      education: (resumeForm.education || []).filter(e => e.id !== id)
    };
    setResumeForm(updated);
  };

  const handleAddTelemetryNode = () => {
    const newStat = {
      id: `stat-${Date.now()}`,
      label: 'Nuevo Contador',
      target: 0,
      suffix: '+',
      description: 'Descripción de la métrica.',
      iconName: 'Code2' as const
    };
    setResumeForm({
      ...resumeForm,
      telemetryStats: [...(resumeForm.telemetryStats || DEFAULT_RESUME_DATA.telemetryStats || []), newStat]
    });
  };

  const handleDeleteTelemetryNode = (id: string) => {
    setResumeForm({
      ...resumeForm,
      telemetryStats: (resumeForm.telemetryStats || DEFAULT_RESUME_DATA.telemetryStats || []).filter(s => s.id !== id)
    });
  };

  const handleSaveResume = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await saveResumeData(resumeForm);
      setResumeFormSuccess('Resume data compiled and persistent across sessions!');
      setTimeout(() => setResumeFormSuccess(''), 4000);
    } catch (err) {
      alert('Failed to save resume: ' + err);
    }
  };

  // Autocomplete mock fields for fun testing
  const handleAutoFill = () => {
    const randomNum = Math.floor(Math.random() * 1000);
    setProjectTitle(`System Phoenix-X${randomNum}`);
    setProjectDescription(`Next-generation high-availability service container pipeline processing logs and secure messages.`);
    setProjectChallenges(`Ensuring strict memory boundaries and instant replication under high-latency nodes without transaction loss.`);
    setProjectSolutions(`Integrated distributed consensus protocols combined with write-ahead memory logging inside custom Docker containers.`);
    setProjectTags('Docker, Go, Redis, System Architecture');
    setProjectYear('2026');
    setProjectCodeSnippet(`package main

import "fmt"

func main() {
    fmt.Println("Phoenix-X${randomNum} cluster is fully operational.")
}`);
    setProjectCodeLanguage('go');
    setProjectTemplate('p2p-cache');
  };

  const sidebarItems = [
    { id: 'messages', label: 'Ingress Queue', icon: Database, badge: messages.length },
    { id: 'projects', label: 'Projects Directory', icon: FolderGit2 },
    { id: 'skills', label: 'Skill Ecosystem', icon: Layers },
    { id: 'page_content', label: 'Page Content', icon: Globe },
    { id: 'resume', label: 'Resume Editor', icon: FileText }
  ] as const;

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row h-screen overflow-hidden" id="admin-dashboard-root">
      
      {/* ========================================================= */}
      {/* SIDEBAR NAVIGATION (Desktop) */}
      {/* ========================================================= */}
      <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant/20 hidden md:flex flex-col justify-between h-full shrink-0 z-20" id="desktop-sidebar">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-outline-variant/20 flex items-center gap-3 bg-gradient-to-r from-surface-container-lowest to-surface-container-low">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
              <Terminal className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold tracking-tight text-on-surface">
                JaiCab Admin
              </h1>
              <p className="text-[10px] font-mono text-primary uppercase font-bold tracking-widest">
                Dashboard
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedMessage(null);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono transition-all duration-150 cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-primary text-on-primary font-bold shadow-md'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {'badge' in item && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-sans font-bold ${
                      activeTab === item.id ? 'bg-on-primary text-primary' : 'bg-primary/10 text-primary'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono text-xs text-primary font-bold">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-on-surface truncate">Administrator</p>
              <p className="text-[10px] font-mono text-on-surface-variant truncate">root@devshell.io</p>
            </div>
          </div>

          <button
            onClick={handleLogoutAction}
            className="w-full inline-flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* SIDEBAR NAVIGATION (Mobile Overlay) */}
      {/* ========================================================= */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <aside 
            className="w-64 bg-surface-container-lowest border-r border-outline-variant/20 h-full flex flex-col justify-between p-4 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4.5 h-4.5 text-primary" />
                  <span className="font-display font-bold text-xs uppercase text-on-surface">JaiCab PANEL</span>
                </div>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 space-y-1.5">
                {sidebarItems.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSelectedMessage(null);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono transition-all duration-150 cursor-pointer ${
                        activeTab === item.id
                          ? 'bg-primary text-on-primary font-bold shadow-md'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComp className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {'badge' in item && item.badge > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-sans font-bold ${
                          activeTab === item.id ? 'bg-on-primary text-primary' : 'bg-primary/10 text-primary'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-outline-variant/10">
              <button
                onClick={handleLogoutAction}
                className="w-full inline-flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ========================================================= */}
      {/* MAIN VIEWPORT PANELS */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Control Bar / Toolbar */}
        <header className="bg-surface-container-low border-b border-outline-variant/30 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {/* Burger toggle for Mobile */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 hover:bg-surface-container text-on-surface-variant md:hidden rounded-lg cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div className="hidden sm:block">
                <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Administrator console: <span className="text-primary font-bold">online</span>
                </span>
              </div>
              <div className="sm:hidden">
                <span className="font-mono text-xs text-primary font-bold uppercase">
                  {sidebarItems.find(i => i.id === activeTab)?.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="p-2 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-lg border border-outline-variant/20 cursor-pointer active:scale-95 transition-all"
              title="Sync core storage"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1 bg-surface-container hover:bg-surface-container-high text-on-surface hover:text-primary px-3 py-1.5 rounded-lg border border-outline-variant/10 font-mono text-[10px] font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              View Portfolio
            </button>
          </div>
        </header>

        {/* Scrollable Container with tabs content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-background p-6">
          
          {/* TAB 1: INGRESS MESSAGES QUEUE */}
          {activeTab === 'messages' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[550px]" id="messages-tab-panel">
              {/* Messages Ingress Queue List */}
              <div className="lg:col-span-2 flex flex-col h-full min-h-[450px]">
                <div className="bg-surface-container-low px-5 py-3 border border-outline-variant/30 rounded-t-xl flex justify-between items-center bg-gradient-to-r from-surface-container-low to-surface-container">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    <h2 className="font-display text-xs uppercase tracking-wider font-bold text-on-surface">
                      Inbound Message Registry
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-on-surface-variant">
                    {messages.length} Messages Logged
                  </span>
                </div>

                <div className="flex-1 border border-t-0 border-outline-variant/20 rounded-b-xl overflow-y-auto custom-scrollbar bg-background/50 space-y-2.5 p-4 min-h-[380px]">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-10 text-center border border-dashed border-outline-variant/20 rounded-xl">
                      <Mail className="w-8 h-8 text-on-surface-variant mb-2 opacity-55 animate-pulse" />
                      <p className="font-mono text-xs text-on-surface-variant uppercase">
                        Queue Empty
                      </p>
                      <p className="text-xs text-on-surface-variant/80 mt-1 max-w-xs leading-relaxed">
                        Submit a contact query on the portfolio page to populate the local database queue.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div 
                        key={msg.id}
                        onClick={() => setSelectedMessage(msg)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-start gap-4 hover:-translate-y-0.5 ${
                          selectedMessage?.id === msg.id 
                            ? 'bg-surface-container border-primary/50 shadow-md' 
                            : 'bg-surface-container-low border-outline-variant/10 hover:border-outline-variant/40'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display text-sm font-bold text-on-surface truncate">
                              {msg.name}
                            </span>
                            <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded border border-outline-variant/10">
                              {msg.email}
                            </span>
                          </div>
                          <p className="font-sans text-xs text-on-surface font-semibold truncate">
                            {msg.subject}
                          </p>
                          <p className="font-sans text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                            {msg.message}
                          </p>
                          <p className="font-mono text-[9px] text-on-surface-variant/80 pt-1">
                            Received: {msg.timestamp}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {messageToDeleteId === msg.id ? (
                            <div className="flex items-center gap-1.5 animate-scale-up" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  deleteContactMessage(msg.id);
                                  if (selectedMessage?.id === msg.id) {
                                    setSelectedMessage(null);
                                  }
                                  setMessageToDeleteId(null);
                                }}
                                className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[9px] font-mono font-bold cursor-pointer transition-all active:scale-95 uppercase tracking-wider"
                                title="Confirm delete message"
                              >
                                Sure?
                              </button>
                              <button
                                onClick={() => setMessageToDeleteId(null)}
                                className="p-1 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface rounded cursor-pointer"
                                title="Cancel delete"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMessageToDeleteId(msg.id);
                              }}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 cursor-pointer active:scale-95 transition-all"
                              title="Delete message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Inspect packet detail card */}
              <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 p-5 flex flex-col h-full shadow-sm min-h-[450px]">
                <div className="border-b border-outline-variant/20 pb-3 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                    Message Inspector
                  </span>
                  <h2 className="font-display text-sm font-bold text-on-surface mt-0.5">
                    Payload Details
                  </h2>
                </div>

                {selectedMessage ? (
                  <div className="flex-1 flex flex-col justify-between space-y-4 min-h-0">
                    <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
                      {/* Headers */}
                      <div className="bg-background/60 p-3.5 rounded-xl border border-outline-variant/10 space-y-2 text-xs font-mono">
                        <div className="flex justify-between border-b border-outline-variant/10 pb-1">
                          <span className="text-on-surface-variant font-bold">Sender</span>
                          <span className="text-on-surface truncate ml-2">{selectedMessage.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-outline-variant/10 pb-1">
                          <span className="text-on-surface-variant font-bold">Email</span>
                          <span className="text-on-surface truncate ml-2">{selectedMessage.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-outline-variant/10 pb-1">
                          <span className="text-on-surface-variant font-bold">Timestamp</span>
                          <span className="text-on-surface truncate ml-2">{selectedMessage.timestamp}</span>
                        </div>
                        <div className="flex justify-between pb-0">
                          <span className="text-on-surface-variant font-bold">Subject</span>
                          <span className="text-on-surface truncate ml-2">{selectedMessage.subject}</span>
                        </div>
                      </div>

                      {/* Body Content */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant font-bold">
                          Message Body
                        </span>
                        <div className="bg-background/40 p-4 rounded-xl border border-outline-variant/10 font-sans text-xs text-on-surface-variant leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto custom-scrollbar">
                          {selectedMessage.message}
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="pt-4 border-t border-outline-variant/20 space-y-2">
                      <a
                        href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject}`}
                        className="w-full bg-primary text-on-primary font-mono text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 hover:opacity-95 transition-all cursor-pointer text-center"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Reply by Email
                      </a>
                      {messageToDeleteId === selectedMessage.id ? (
                        <div className="flex gap-2 animate-scale-up">
                          <button
                            onClick={() => {
                              deleteContactMessage(selectedMessage.id);
                              setSelectedMessage(null);
                              setMessageToDeleteId(null);
                            }}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-mono text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setMessageToDeleteId(null)}
                            className="px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-mono text-xs font-bold transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setMessageToDeleteId(selectedMessage.id)}
                          className="w-full bg-red-500/10 text-red-400 border border-red-500/20 font-mono text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 hover:bg-red-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Entry
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
                    <Mail className="w-10 h-10 mb-2.5 opacity-30" />
                    <p className="font-mono text-xs uppercase font-bold text-on-surface-variant">
                      Select Message
                    </p>
                    <p className="text-xs text-on-surface-variant/80 mt-1 max-w-xs leading-relaxed">
                      Click on any incoming message in the directory queue to read and reply.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS DIRECTORY - ADD & MANAGE PROJECTS */}
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="projects-tab-panel">
              
              {/* Form to add a project */}
              <div className="lg:col-span-7 bg-surface-container-low rounded-2xl border border-outline-variant/20 p-6 flex flex-col shadow-sm">
                <div className="border-b border-outline-variant/20 pb-4 mb-6 flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h2 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
                      {editingProjectId ? (
                        <>
                          <Pencil className="w-5 h-5 text-secondary animate-pulse" />
                          Edit Portfolio Project: <span className="text-secondary">{projectTitle}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 text-primary" />
                          Add New Portfolio Project
                        </>
                      )}
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {editingProjectId 
                        ? 'Modify active database links, tags, cover assets, and code highlights live.' 
                        : 'Create beautiful custom projects that immediately go live on your main page.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 border border-secondary/20 rounded-lg text-[10px] font-mono font-bold uppercase transition-all duration-150 cursor-pointer"
                    title="Pre-populate mock system details automatically"
                  >
                    ⚡ Auto-Fill Mock Data
                  </button>
                </div>

                {formSuccess && (
                  <div className="mb-6 p-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl flex items-center gap-2.5 text-xs font-mono animate-scale-up">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleAddProjectSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. Lumina Analytics Engine"
                        className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2.5 text-xs font-sans text-on-surface transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                        Release Year *
                      </label>
                      <input
                        type="text"
                        required
                        value={projectYear}
                        onChange={(e) => setProjectYear(e.target.value)}
                        placeholder="e.g. 2026"
                        className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2.5 text-xs font-sans text-on-surface transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                      Short Description *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Give a brief summary of what the system does (displayed on card grids)."
                      className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2.5 text-xs font-sans text-on-surface transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                        Aesthetic Tech Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={projectTags}
                        onChange={(e) => setProjectTags(e.target.value)}
                        placeholder="Next.js, Node.js, AWS, Redis"
                        className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2.5 text-xs font-sans text-on-surface transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                        Distributed System Architecture Template
                      </label>
                      <select
                        value={projectTemplate}
                        onChange={(e) => setProjectTemplate(e.target.value as keyof typeof ARCHITECTURE_TEMPLATES)}
                        className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2.5 text-xs font-mono text-on-surface transition-all"
                      >
                        {Object.entries(ARCHITECTURE_TEMPLATES).map(([key, value]) => (
                          <option key={key} value={key} className="bg-surface-container-high text-on-surface">
                            {value.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                        Technical Challenge *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={projectChallenges}
                        onChange={(e) => setProjectChallenges(e.target.value)}
                        placeholder="Describe the architectural core problem or lock contention..."
                        className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2.5 text-xs font-sans text-on-surface transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                        Architectural Solution *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={projectSolutions}
                        onChange={(e) => setProjectSolutions(e.target.value)}
                        placeholder="Detail how you engineered around or patched this problem..."
                        className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2.5 text-xs font-sans text-on-surface transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Business & Operational Impact */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                      Business & Operational Impact (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={projectBusinessImpact}
                      onChange={(e) => setProjectBusinessImpact(e.target.value)}
                      placeholder="Detail the metrics, server cost reduction, page load speedups, or conversion hikes resulting from this solution..."
                      className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2.5 text-xs font-sans text-on-surface transition-all resize-y"
                    />
                  </div>

                  {/* Cover Design Image Selection and File Upload */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold">
                        Project Cover Image
                      </label>
                      <span className="text-[10px] font-mono text-primary font-medium">
                        Default Presets & Upload Enabled
                      </span>
                    </div>

                    {/* Tabs to toggle between presets and file uploader */}
                    <div className="bg-background/40 p-1 rounded-xl border border-outline-variant/10 flex gap-1.5 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => {
                          setUploadError('');
                          // Set default back if they don't have one selected
                          if (!PRESET_IMAGES.some(img => img.url === projectImage) && !projectImage.startsWith('data:image/')) {
                            setProjectImage(PRESET_IMAGES[0].url);
                          }
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all duration-150 cursor-pointer text-center ${
                          PRESET_IMAGES.some(img => img.url === projectImage) 
                            ? 'bg-surface-container text-primary border border-outline-variant/10 shadow-sm' 
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        🎨 Preset Defaults
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadError('');
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all duration-150 cursor-pointer text-center ${
                          !PRESET_IMAGES.some(img => img.url === projectImage) 
                            ? 'bg-surface-container text-primary border border-outline-variant/10 shadow-sm' 
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        📤 Upload Custom Cover
                      </button>
                    </div>

                    {/* Preset tab content */}
                    {PRESET_IMAGES.some(img => img.url === projectImage) ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {PRESET_IMAGES.map((img) => (
                          <button
                            key={img.url}
                            type="button"
                            onClick={() => setProjectImage(img.url)}
                            className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 group transition-all cursor-pointer ${
                              projectImage === img.url ? 'border-primary shadow-md scale-95' : 'border-outline-variant/10 hover:border-outline-variant/40'
                            }`}
                          >
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-2 opacity-100 group-hover:bg-black/60 transition-all">
                              <span className="text-[9px] font-sans font-bold text-white truncate text-left">{img.name}</span>
                            </div>
                            {projectImage === img.url && (
                              <div className="absolute top-1 right-1 bg-primary text-on-primary rounded-full p-0.5">
                                <Check className="w-3 h-3 font-extrabold" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      /* File upload / Custom URL content */
                      <div className="space-y-3">
                        {/* Drag and Drop Container */}
                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          className={`relative border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center transition-all ${
                            dragActive
                              ? 'border-primary bg-primary/10 scale-[0.99]'
                              : 'border-outline-variant/20 bg-background/30 hover:border-outline-variant/40'
                          }`}
                        >
                          <input
                            type="file"
                            id="cover-file-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFile(e.target.files[0]);
                              }
                            }}
                          />
                          <label
                            htmlFor="cover-file-upload"
                            className="cursor-pointer flex flex-col items-center justify-center space-y-2 w-full h-full"
                          >
                            <div className="p-2.5 bg-primary/10 rounded-full text-primary">
                              <Upload className="w-5 h-5 animate-bounce" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-display text-xs font-bold text-on-surface">
                                Click to select or drag & drop cover image
                              </p>
                              <p className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">
                                PNG, JPG, WEBP, GIF up to 2MB
                              </p>
                            </div>
                          </label>
                        </div>

                        {uploadError && (
                          <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-[11px] font-mono">
                            ⚠️ {uploadError}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Custom URL input option & Live Preview */}
                    <div className="space-y-3 bg-background/20 p-4 rounded-xl border border-outline-variant/10">
                      <div className="flex gap-4 items-center">
                        {/* Mini live preview card */}
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-outline-variant/20 shrink-0 bg-background flex items-center justify-center relative">
                          {projectImage ? (
                            <img
                              src={projectImage}
                              alt="Cover preview"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-on-surface-variant" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <span className="text-[10px] font-mono text-on-surface-variant font-bold uppercase block">
                            Active Cover Selection
                          </span>
                          <span className="text-xs text-on-surface font-sans line-clamp-1 opacity-80 break-all">
                            {projectImage.startsWith('data:image/') ? 'Custom uploaded image (Base64 Binary)' : projectImage}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <input
                          type="url"
                          value={projectImage.startsWith('data:image/') ? '' : projectImage}
                          onChange={(e) => {
                            setUploadError('');
                            setProjectImage(e.target.value || PRESET_IMAGES[0].url);
                          }}
                          placeholder="Or paste an external landscape image URL directly..."
                          className="flex-1 bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2 text-xs font-sans text-on-surface transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                        Demo URL (optional)
                      </label>
                      <input
                        type="text"
                        value={projectDemoUrl}
                        onChange={(e) => setProjectDemoUrl(e.target.value)}
                        placeholder="#"
                        className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2.5 text-xs font-mono text-on-surface transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                        GitHub Repository URL (optional)
                      </label>
                      <input
                        type="text"
                        value={projectGithubUrl}
                        onChange={(e) => setProjectGithubUrl(e.target.value)}
                        placeholder="#"
                        className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2.5 text-xs font-mono text-on-surface transition-all"
                      />
                    </div>
                  </div>



                  <div className="pt-2 border-t border-outline-variant/10 flex gap-3">
                    {editingProjectId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex-1 bg-surface-container hover:bg-surface-container-high text-on-surface font-mono text-xs font-bold py-3 rounded-xl transition-all cursor-pointer active:scale-95 text-center"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      className={`flex-[2] text-on-primary font-mono text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer shadow-md active:scale-95 ${editingProjectId ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary'}`}
                    >
                      {editingProjectId ? (
                        <>
                          <Save className="w-4 h-4" />
                          Save & Update Portfolio Project
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Compile & Deploy Project To Live Portfolio
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Projects List sidebar */}
              <div className="lg:col-span-5 flex flex-col h-full space-y-4">
                <div className="bg-surface-container-low px-5 py-3 border border-outline-variant/20 rounded-t-xl flex justify-between items-center bg-gradient-to-r from-surface-container-low to-surface-container shrink-0">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-primary" />
                    <h2 className="font-display text-xs uppercase tracking-wider font-bold text-on-surface">
                      Current Portfolio Directory
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-on-surface-variant font-bold">
                    {projects.length} Registered
                  </span>
                </div>

                <div className="border border-t-0 border-outline-variant/20 rounded-b-xl overflow-y-auto custom-scrollbar p-4 space-y-3 bg-background/50 max-h-[700px] lg:max-h-screen">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-outline-variant/30 flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-10 h-10 rounded-lg object-cover border border-outline-variant/10"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="font-display text-xs font-bold text-on-surface truncate">
                            {proj.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[9px] text-primary">{proj.year}</span>
                            <span className="text-[9px] text-on-surface-variant/40">•</span>
                            <span className="text-[9px] font-mono text-on-surface-variant truncate">
                              {proj.tags.slice(0, 2).join(', ')}
                              {proj.tags.length > 2 && '...'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {projectToDeleteId === proj.id ? (
                          <div className="flex items-center gap-1.5 animate-scale-up">
                            <button
                              onClick={() => {
                                deleteProject(proj.id);
                                setProjectToDeleteId(null);
                              }}
                              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[9px] font-mono font-bold cursor-pointer transition-all active:scale-95 uppercase tracking-wider"
                              title="Confirm deletion"
                            >
                              Sure?
                            </button>
                            <button
                              onClick={() => setProjectToDeleteId(null)}
                              className="p-1 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface rounded cursor-pointer"
                              title="Cancel deletion"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditProjectClick(proj)}
                              className={`p-2 rounded-lg border cursor-pointer transition-all active:scale-95 ${editingProjectId === proj.id ? 'bg-secondary text-on-secondary border-secondary' : 'bg-secondary/10 hover:bg-secondary/20 text-secondary border-secondary/20'}`}
                              title="Edit project details"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setProjectToDeleteId(proj.id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 cursor-pointer transition-all active:scale-95"
                              title="Delete from portfolio"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: RESUME EDITOR */}
          {activeTab === 'resume' && (
            <div className="space-y-6 max-w-4xl mx-auto" id="resume-tab-panel">
              <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-6 shadow-sm animate-scale-up">
                <div className="border-b border-outline-variant/20 pb-4 mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Modify Page Content & CV
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Customize landing page sections, telemetry statistics, executive summaries, and professional timeline.
                    </p>
                  </div>
                </div>

                {resumeFormSuccess && (
                  <div className="mb-6 p-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl flex items-center gap-2.5 text-xs font-mono animate-scale-up">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{resumeFormSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSaveResume} className="space-y-6">
                  {/* General / Contact Info Group */}
                  <div className="bg-background/30 p-4 rounded-xl border border-outline-variant/10 space-y-4">
                    <h3 className="font-display text-xs uppercase tracking-wider font-bold text-primary">
                      Contact Header & Info
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={resumeForm.name}
                          onChange={(e) => setResumeForm({ ...resumeForm, name: e.target.value })}
                          className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2 text-xs font-sans text-on-surface"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                          Professional Title
                        </label>
                        <input
                          type="text"
                          required
                          value={resumeForm.title}
                          onChange={(e) => setResumeForm({ ...resumeForm, title: e.target.value })}
                          className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2 text-xs font-sans text-on-surface"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={resumeForm.email}
                          onChange={(e) => setResumeForm({ ...resumeForm, email: e.target.value })}
                          className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2 text-xs font-sans text-on-surface"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                          Base Location
                        </label>
                        <input
                          type="text"
                          required
                          value={resumeForm.base}
                          onChange={(e) => setResumeForm({ ...resumeForm, base: e.target.value })}
                          className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2 text-xs font-sans text-on-surface"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                          Availability Status
                        </label>
                        <input
                          type="text"
                          required
                          value={resumeForm.availability}
                          onChange={(e) => setResumeForm({ ...resumeForm, availability: e.target.value })}
                          className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2 text-xs font-sans text-on-surface"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PDF Resume Attachment Group */}
                  <div className="bg-background/30 p-4 rounded-xl border border-outline-variant/10 space-y-4">
                    <h3 className="font-display text-xs uppercase tracking-wider font-bold text-primary flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      PDF Resume Attachment (Optional)
                    </h3>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Attach your master PDF resume. This allows visitors on the main page to download your original PDF document.
                    </p>

                    <div className="space-y-4">
                      {resumeForm.pdfBase64 ? (
                        <div className="flex items-center justify-between gap-4 bg-primary/5 p-4 rounded-xl border border-primary/20">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-on-surface truncate">
                                {resumeForm.pdfFileName || 'resume.pdf'}
                              </p>
                              <p className="text-[10px] font-mono text-on-surface-variant">
                                PDF Document Attached (Ready for download)
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setResumeForm({ ...resumeForm, pdfBase64: undefined, pdfFileName: undefined })}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 cursor-pointer transition-all active:scale-95 text-xs font-mono font-bold"
                          >
                            Remove File
                          </button>
                        </div>
                      ) : (
                        <div
                          onDragEnter={handlePdfDrag}
                          onDragOver={handlePdfDrag}
                          onDragLeave={handlePdfDrag}
                          onDrop={handlePdfDrop}
                          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                            pdfDragActive 
                              ? 'border-primary bg-primary/5' 
                              : 'border-outline-variant/30 bg-background/25 hover:border-primary/40'
                          }`}
                          onClick={() => document.getElementById('pdf-file-input')?.click()}
                        >
                          <input
                            id="pdf-file-input"
                            type="file"
                            accept=".pdf"
                            onChange={handlePdfFileChange}
                            className="hidden"
                          />
                          <Upload className="w-8 h-8 text-on-surface-variant/50 mx-auto mb-2" />
                          <p className="text-xs font-bold text-on-surface">
                            Drag & drop your PDF resume here, or <span className="text-primary hover:underline">browse</span>
                          </p>
                          <p className="text-[10px] text-on-surface-variant mt-1">
                            Only standard PDF documents up to 5MB are supported.
                          </p>
                        </div>
                      )}
                      
                      {pdfError && (
                        <p className="text-[11px] text-red-400 font-mono">
                          Error: {pdfError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Executive Summary Group */}
                  <div className="bg-background/30 p-4 rounded-xl border border-outline-variant/10 space-y-4">
                    <h3 className="font-display text-xs uppercase tracking-wider font-bold text-secondary">
                      Executive Summary
                    </h3>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Customize the executive summary displayed on your interactive CV.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                          Executive Summary Text
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={resumeForm.summaryStandard}
                          onChange={(e) => setResumeForm({ ...resumeForm, summaryStandard: e.target.value })}
                          className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2 text-xs font-sans text-on-surface resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Certifications Manager Group */}
                  <div className="bg-background/30 p-4 rounded-xl border border-outline-variant/10 space-y-4">
                    <h3 className="font-display text-xs uppercase tracking-wider font-bold text-secondary">
                      Manage Certifications
                    </h3>

                    {/* Certifications list */}
                    <div className="space-y-2">
                      {(resumeForm.certifications || []).map((cert) => (
                        <div key={cert.id} className="flex justify-between items-center gap-4 bg-background/40 p-2.5 rounded-lg border border-outline-variant/10 text-xs">
                          <div className="min-w-0">
                            <p className="font-bold text-on-surface truncate">{cert.name}</p>
                            <p className="font-mono text-[10px] text-on-surface-variant truncate">{cert.details}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteCert(cert.id)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded cursor-pointer shrink-0"
                            title="Delete certification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {(resumeForm.certifications || []).length === 0 && (
                        <p className="text-xs text-on-surface-variant/70 italic">No certifications listed.</p>
                      )}
                    </div>

                    {/* Sub-form to add a certification */}
                    <div className="border border-outline-variant/10 rounded-xl p-3 bg-surface-container-low space-y-3">
                      <span className="text-[10px] font-mono text-on-surface-variant font-bold uppercase block">
                        Add Certification Item
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Name (e.g. AWS Certified Solutions Architect)"
                          value={newCertName}
                          onChange={(e) => setNewCertName(e.target.value)}
                          className="bg-background/40 border border-outline-variant/10 focus:border-primary/30 outline-none rounded-lg px-3 py-2 text-xs text-on-surface"
                        />
                        <input
                          type="text"
                          placeholder="Details (e.g. Professional (SAP-C02) • ID: AWS-982)"
                          value={newCertDetails}
                          onChange={(e) => setNewCertDetails(e.target.value)}
                          className="bg-background/40 border border-outline-variant/10 focus:border-primary/30 outline-none rounded-lg px-3 py-2 text-xs text-on-surface"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCert}
                        disabled={!newCertName.trim()}
                        className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-150 cursor-pointer"
                      >
                        + Push Certification
                      </button>
                    </div>
                  </div>

                  {/* Professional Experience Group */}
                  <div className="bg-background/30 p-4 rounded-xl border border-outline-variant/10 space-y-4">
                    <h3 className="font-display text-xs uppercase tracking-wider font-bold text-primary">
                      Manage Professional Experience Timeline
                    </h3>

                    {/* Experience list */}
                    <div className="space-y-3">
                      {(resumeForm.experience || []).map((exp) => (
                        <div key={exp.id} className="bg-background/40 p-3.5 rounded-lg border border-outline-variant/10 text-xs space-y-2">
                          <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0">
                              <p className="font-bold text-on-surface text-sm truncate">{exp.role}</p>
                              <p className="text-primary font-semibold truncate">{exp.company}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono text-[10px] text-on-surface-variant">{exp.period}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteExp(exp.id)}
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded cursor-pointer"
                                title="Delete experience"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <ul className="pl-4 list-disc space-y-1 text-[11px] text-on-surface-variant leading-relaxed">
                            {exp.bulletPoints.map((bp, bpIdx) => (
                              <li key={bpIdx}>{bp}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {(resumeForm.experience || []).length === 0 && (
                        <p className="text-xs text-on-surface-variant/70 italic">No professional experience listed.</p>
                      )}
                    </div>

                    {/* Sub-form to add experience */}
                    <div className="border border-outline-variant/10 rounded-xl p-4 bg-surface-container-low space-y-3">
                      <span className="text-[10px] font-mono text-on-surface-variant font-bold uppercase block">
                        Add Professional Role
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Role (e.g. Senior Solutions Architect)"
                          value={newExpRole}
                          onChange={(e) => setNewExpRole(e.target.value)}
                          className="bg-background/40 border border-outline-variant/10 focus:border-primary/30 outline-none rounded-lg px-3 py-2 text-xs text-on-surface"
                        />
                        <input
                          type="text"
                          placeholder="Company (e.g. TechNexus Systems)"
                          value={newExpCompany}
                          onChange={(e) => setNewExpCompany(e.target.value)}
                          className="bg-background/40 border border-outline-variant/10 focus:border-primary/30 outline-none rounded-lg px-3 py-2 text-xs text-on-surface"
                        />
                        <input
                          type="text"
                          placeholder="Period (e.g. 2022 - Present)"
                          value={newExpPeriod}
                          onChange={(e) => setNewExpPeriod(e.target.value)}
                          className="bg-background/40 border border-outline-variant/10 focus:border-primary/30 outline-none rounded-lg px-3 py-2 text-xs text-on-surface"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-on-surface-variant uppercase mb-1.5">
                          Role accomplishments / bullet points (one per line)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Led the complete migration of legacy microservices to serverless...&#10;Decreased database lock times by 35%...&#10;Speeded up deployment cycles down to 4 minutes..."
                          value={newExpBulletPoints}
                          onChange={(e) => setNewExpBulletPoints(e.target.value)}
                          className="w-full bg-background/40 border border-outline-variant/10 focus:border-primary/30 outline-none rounded-lg p-3 text-xs text-on-surface resize-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddExp}
                        disabled={!newExpRole.trim() || !newExpCompany.trim() || !newExpPeriod.trim()}
                        className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-150 cursor-pointer"
                      >
                        + Push Professional Role
                      </button>
                    </div>
                  </div>

                  {/* Education credentials */}
                  <div className="bg-background/30 p-4 rounded-xl border border-outline-variant/10 space-y-4">
                    <h3 className="font-display text-xs uppercase tracking-wider font-bold text-secondary">
                      Education Credentials
                    </h3>
                    
                    {/* List of existing education items */}
                    <div className="space-y-3">
                      {(() => {
                        const displayEducation = Array.isArray(resumeForm.education) && resumeForm.education.length > 0
                          ? resumeForm.education
                          : [
                              {
                                id: 'edu-default',
                                degree: resumeForm.educationDegree || 'B.S. Computer Science & Engineering',
                                school: resumeForm.educationSchool || 'University of California, Berkeley',
                                details: resumeForm.educationDetails || 'Graduated with Honors • GPA: 3.82/4.00'
                              }
                            ];
                        return displayEducation.map((edu) => (
                          <div key={edu.id} className="p-3 bg-background/20 rounded-lg border border-outline-variant/5 flex justify-between items-start gap-4 animate-scale-up">
                            <div>
                              <p className="text-xs font-bold text-on-surface">{edu.degree}</p>
                              <p className="text-[11px] text-on-surface-variant">{edu.school}</p>
                              <p className="text-[10px] text-primary font-mono mt-0.5">{edu.details}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteEdu(edu.id)}
                              className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ));
                      })()}
                    </div>

                    {/* Form to add a new education item */}
                    <div className="pt-3 border-t border-outline-variant/10 space-y-3">
                      <p className="font-mono text-[9px] text-primary uppercase font-bold">Add Education Entry</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8px] font-mono uppercase text-on-surface-variant mb-1">Degree Title</label>
                          <input
                            type="text"
                            value={newEduDegree}
                            onChange={(e) => setNewEduDegree(e.target.value)}
                            placeholder="e.g. B.S. Computer Science"
                            className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-lg px-2.5 py-1.5 text-xs text-on-surface"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono uppercase text-on-surface-variant mb-1">University / Institution</label>
                          <input
                            type="text"
                            value={newEduSchool}
                            onChange={(e) => setNewEduSchool(e.target.value)}
                            placeholder="e.g. UC Berkeley"
                            className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-lg px-2.5 py-1.5 text-xs text-on-surface"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono uppercase text-on-surface-variant mb-1">Details / Honors</label>
                        <input
                          type="text"
                          value={newEduDetails}
                          onChange={(e) => setNewEduDetails(e.target.value)}
                          placeholder="e.g. Graduated with Honors • GPA: 3.82/4.00"
                          className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-lg px-2.5 py-1.5 text-xs text-on-surface"
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleAddEdu}
                        disabled={!newEduDegree.trim() || !newEduSchool.trim()}
                        className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-150 cursor-pointer text-left"
                      >
                        + Push Education Entry
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-outline-variant/20">
                    <button
                      type="submit"
                      className="w-full bg-primary text-on-primary font-mono text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      Save & Compile Dynamic Resume
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: PAGE CONTENT EDITOR */}
          {activeTab === 'page_content' && (
            <div className="space-y-6 max-w-4xl mx-auto" id="page-content-tab-panel">
              <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-6 shadow-sm animate-scale-up">
                <div className="border-b border-outline-variant/20 pb-4 mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Modify Landing Page Content
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Customize landing page descriptions, section headers, and add/remove telemetry counters.
                    </p>
                  </div>
                </div>

                {resumeFormSuccess && (
                  <div className="mb-6 p-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl flex items-center gap-2.5 text-xs font-mono animate-scale-up">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{resumeFormSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSaveResume} className="space-y-6">
                  {/* Page Sections Copywriting Group */}
                  <div className="bg-background/30 p-4 rounded-xl border border-outline-variant/10 space-y-4">
                    <h3 className="font-display text-xs uppercase tracking-wider font-bold text-primary">
                      Landing Page Section Descriptions
                    </h3>
                    
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                        Hero Subtitle Description
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={resumeForm.heroSubtitle || ''}
                        onChange={(e) => setResumeForm({ ...resumeForm, heroSubtitle: e.target.value })}
                        className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2 text-xs font-sans text-on-surface resize-none leading-relaxed"
                        placeholder="Enter the subtitle shown in the hero section..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                        Work History (Workstory) Section Description
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={resumeForm.workstoryDescription || ''}
                        onChange={(e) => setResumeForm({ ...resumeForm, workstoryDescription: e.target.value })}
                        className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2 text-xs font-sans text-on-surface resize-none leading-relaxed"
                        placeholder="Enter the description text shown under the Work History title..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                        Contact Section Description
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={resumeForm.contactDescription || ''}
                        onChange={(e) => setResumeForm({ ...resumeForm, contactDescription: e.target.value })}
                        className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2 text-xs font-sans text-on-surface resize-none leading-relaxed"
                        placeholder="Enter the description text shown under the Get In Touch title..."
                      />
                    </div>
                  </div>

                  {/* Telemetry Stats Editing Group */}
                  <div className="bg-background/30 p-4 rounded-xl border border-outline-variant/10 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-outline-variant/10">
                      <h3 className="font-display text-xs uppercase tracking-wider font-bold text-secondary">
                        Telemetry Nodes (Stats Counters)
                      </h3>
                      <button
                        type="button"
                        onClick={handleAddTelemetryNode}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg text-xs font-mono font-bold uppercase transition-all duration-150 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Node
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(resumeForm.telemetryStats || DEFAULT_RESUME_DATA.telemetryStats || []).map((stat, statIdx) => (
                        <div key={stat.id} className="bg-background/20 p-4 rounded-xl border border-outline-variant/10 space-y-3 relative group/stat animate-scale-up">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[9px] text-primary uppercase font-bold">
                              Node #{statIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteTelemetryNode(stat.id)}
                              className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete Telemetry Node"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[8px] font-mono uppercase text-on-surface-variant mb-1">Value (Number)</label>
                              <input
                                type="number"
                                required
                                value={stat.target}
                                onChange={(e) => {
                                  const newStats = [...(resumeForm.telemetryStats || DEFAULT_RESUME_DATA.telemetryStats || [])];
                                  newStats[statIdx] = { ...stat, target: parseInt(e.target.value) || 0 };
                                  setResumeForm({ ...resumeForm, telemetryStats: newStats });
                                }}
                                className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-lg px-2.5 py-1.5 text-xs text-on-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono uppercase text-on-surface-variant mb-1">Suffix</label>
                              <input
                                type="text"
                                required
                                value={stat.suffix || ''}
                                onChange={(e) => {
                                  const newStats = [...(resumeForm.telemetryStats || DEFAULT_RESUME_DATA.telemetryStats || [])];
                                  newStats[statIdx] = { ...stat, suffix: e.target.value };
                                  setResumeForm({ ...resumeForm, telemetryStats: newStats });
                                }}
                                className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-lg px-2.5 py-1.5 text-xs text-on-surface"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[8px] font-mono uppercase text-on-surface-variant mb-1">Title / Label</label>
                              <input
                                type="text"
                                required
                                value={stat.label || ''}
                                onChange={(e) => {
                                  const newStats = [...(resumeForm.telemetryStats || DEFAULT_RESUME_DATA.telemetryStats || [])];
                                  newStats[statIdx] = { ...stat, label: e.target.value };
                                  setResumeForm({ ...resumeForm, telemetryStats: newStats });
                                }}
                                className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-lg px-2.5 py-1.5 text-xs text-on-surface"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono uppercase text-on-surface-variant mb-1">Icon Representation</label>
                              <div className="flex gap-2 items-center">
                                <div className="p-1.5 bg-background/50 border border-outline-variant/20 rounded-lg text-primary shrink-0">
                                  {(() => {
                                    const IconComponent = stat.iconName === 'Briefcase' ? Briefcase :
                                                         stat.iconName === 'Code2' ? Code2 :
                                                         stat.iconName === 'Building' ? Building :
                                                         stat.iconName === 'Rocket' ? Rocket :
                                                         stat.iconName === 'Trophy' ? Trophy :
                                                         stat.iconName === 'GraduationCap' ? GraduationCap :
                                                         stat.iconName === 'Cpu' ? Cpu :
                                                         stat.iconName === 'Globe' ? Globe :
                                                         stat.iconName === 'Server' ? Server :
                                                         stat.iconName === 'Database' ? Database :
                                                         stat.iconName === 'Users' ? Users :
                                                         stat.iconName === 'Sparkles' ? Sparkles : HelpCircle;
                                    return <IconComponent className="w-4 h-4" />;
                                  })()}
                                </div>
                                <select
                                  value={stat.iconName || 'Code2'}
                                  onChange={(e) => {
                                    const newStats = [...(resumeForm.telemetryStats || DEFAULT_RESUME_DATA.telemetryStats || [])];
                                    newStats[statIdx] = { ...stat, iconName: e.target.value as any };
                                    setResumeForm({ ...resumeForm, telemetryStats: newStats });
                                  }}
                                  className="flex-1 bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-lg px-2.5 py-1.5 text-xs text-on-surface cursor-pointer"
                                >
                                  <option value="Briefcase" className="bg-surface-container-high text-on-surface">Briefcase (Portfolio / Work)</option>
                                  <option value="Code2" className="bg-surface-container-high text-on-surface">Code (Experience / Engineering)</option>
                                  <option value="Building" className="bg-surface-container-high text-on-surface">Building (Companies / Clients)</option>
                                  <option value="Rocket" className="bg-surface-container-high text-on-surface">Rocket (Performance / Throughput)</option>
                                  <option value="Trophy" className="bg-surface-container-high text-on-surface">Trophy (Awards / Achievements)</option>
                                  <option value="GraduationCap" className="bg-surface-container-high text-on-surface">Graduation Cap (Education / Degrees)</option>
                                  <option value="Cpu" className="bg-surface-container-high text-on-surface">CPU (System / Core logic)</option>
                                  <option value="Globe" className="bg-surface-container-high text-on-surface">Globe (Web / Global Systems)</option>
                                  <option value="Server" className="bg-surface-container-high text-on-surface">Server (Backend / Infrastructure)</option>
                                  <option value="Database" className="bg-surface-container-high text-on-surface">Database (Data / Caching)</option>
                                  <option value="Users" className="bg-surface-container-high text-on-surface">Users (Team / Clients)</option>
                                  <option value="Sparkles" className="bg-surface-container-high text-on-surface">Sparkles (Special Highlights)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[8px] font-mono uppercase text-on-surface-variant mb-1">Description</label>
                            <input
                              type="text"
                              required
                              value={stat.description || ''}
                              onChange={(e) => {
                                const newStats = [...(resumeForm.telemetryStats || DEFAULT_RESUME_DATA.telemetryStats || [])];
                                newStats[statIdx] = { ...stat, description: e.target.value };
                                setResumeForm({ ...resumeForm, telemetryStats: newStats });
                              }}
                              className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-lg px-2.5 py-1.5 text-xs text-on-surface"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-outline-variant/20">
                    <button
                      type="submit"
                      className="w-full bg-primary text-on-primary font-mono text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      Save & Publish Page Content
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: SKILLS MANAGER */}
          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-scale-up" id="skills-tab-panel">
              {/* Form to Add/Edit Skill */}
              <div className="lg:col-span-5 bg-surface-container-low rounded-2xl border border-outline-variant/20 p-6 flex flex-col shadow-sm">
                <div className="border-b border-outline-variant/20 pb-4 mb-6">
                  <h2 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
                    {editingSkillIndex !== null ? (
                      <>
                        <Pencil className="w-5 h-5 text-secondary animate-pulse" />
                        Edit Skill Configuration
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 text-primary" />
                        Add New Technology
                      </>
                    )}
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Define name, category, brand icon representation, and whether this is a core stack skill.
                  </p>
                </div>

                <form onSubmit={handleAddSkill} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                      Technology Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="e.g. Next.js, Go, Kubernetes"
                      className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2.5 text-xs font-sans text-on-surface transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                        Brand Icon Search
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="Search icon (e.g. React, WordPress, Go...)"
                          value={iconSearchQuery}
                          onChange={(e) => {
                            const val = e.target.value;
                            setIconSearchQuery(val);
                            setNewSkillIcon(val); // Custom typed name goes directly to newSkillIcon
                            setShowIconSuggestions(true);
                          }}
                          onFocus={() => setShowIconSuggestions(true)}
                          onBlur={() => {
                            setTimeout(() => setShowIconSuggestions(false), 200);
                          }}
                          className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2.5 text-xs font-sans text-on-surface transition-all"
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-primary">
                          <i className={`${getDeviconClass(newSkillIcon)} text-base`} />
                        </div>
                      </div>

                      {showIconSuggestions && (
                        <div className="absolute left-0 right-0 mt-1.5 max-h-48 overflow-y-auto bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-xl z-50 custom-scrollbar-hide animate-scale-up">
                          {(() => {
                            const filteredPresets = DEVICON_PRESETS.filter(p => 
                              p.label.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
                              p.value.toLowerCase().includes(iconSearchQuery.toLowerCase())
                            );
                            if (filteredPresets.length > 0) {
                              return filteredPresets.map((p) => (
                                <button
                                  key={p.value}
                                  type="button"
                                  onMouseDown={() => {
                                    setNewSkillIcon(p.value);
                                    setIconSearchQuery(p.label);
                                    setShowIconSuggestions(false);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs font-sans text-on-surface hover:bg-surface-container-highest cursor-pointer flex items-center gap-2 transition-all border-b border-outline-variant/5 last:border-b-0"
                                >
                                  <i className={`${getDeviconClass(p.value)} text-sm`} />
                                  <span>{p.label}</span>
                                  <span className="text-[10px] font-mono text-on-surface-variant/50 ml-auto">({p.value})</span>
                                </button>
                              ));
                            } else {
                              return (
                                <div className="px-3.5 py-2.5 text-xs font-sans text-on-surface-variant italic bg-surface-container-low/50">
                                  Pressing save will use custom name "{iconSearchQuery}"
                                </div>
                              );
                            }
                          })()}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                        Ecosystem Category
                      </label>
                      <select
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value as any)}
                        className="w-full bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2.5 text-xs font-mono text-on-surface transition-all cursor-pointer"
                      >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Database</option>
                        <option value="devops">Cloud / DevOps</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-on-surface-variant font-bold mb-1.5">
                      Custom Icon Color (Optional)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="e.g. #ffb783 (leave empty for default Devicon color)"
                        value={newSkillColor}
                        onChange={(e) => setNewSkillColor(e.target.value)}
                        className="flex-1 bg-background/50 border border-outline-variant/20 focus:border-primary/50 outline-none rounded-xl px-3.5 py-2.5 text-xs font-sans text-on-surface transition-all"
                      />
                      <input
                        type="color"
                        value={newSkillColor.startsWith('#') && newSkillColor.length === 7 ? newSkillColor : '#ffffff'}
                        onChange={(e) => setNewSkillColor(e.target.value)}
                        className="w-10 h-10 rounded-xl border border-outline-variant/20 bg-transparent cursor-pointer p-1 shrink-0"
                        title="Pick color"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      id="skill-is-core"
                      checked={newSkillIsCore}
                      onChange={(e) => setNewSkillIsCore(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded cursor-pointer"
                    />
                    <label htmlFor="skill-is-core" className="text-xs text-on-surface font-sans select-none cursor-pointer">
                      Flag as <span className="text-primary font-bold">Core Stack</span> technology (highlight badge in marquee)
                    </label>
                  </div>

                  <div className="pt-2 flex gap-3">
                    {editingSkillIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSkillIndex(null);
                          setNewSkillName('');
                          setNewSkillIcon('Javascript');
                          setNewSkillCategory('frontend');
                          setNewSkillIsCore(false);
                          setNewSkillColor('');
                        }}
                        className="flex-1 bg-surface-container hover:bg-surface-container-high text-on-surface font-mono text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer active:scale-95 text-center"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!newSkillName.trim()}
                      className={`flex-[2] text-on-primary font-mono text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-40 ${editingSkillIndex !== null ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary'}`}
                    >
                      {editingSkillIndex !== null ? (
                        <>
                          <Check className="w-4 h-4" />
                          Update Skill Item
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Push to Skill List
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Stack Directory */}
              <div className="lg:col-span-7 flex flex-col h-full space-y-4">
                <div className="bg-surface-container-low px-5 py-3 border border-outline-variant/20 rounded-t-xl flex justify-between items-center bg-gradient-to-r from-surface-container-low to-surface-container shrink-0">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    <h2 className="font-display text-xs uppercase tracking-wider font-bold text-on-surface">
                      Dynamic Skill Ecosystem Registry
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-on-surface-variant font-bold">
                    {(resumeForm.skills || []).length} Technologies
                  </span>
                </div>

                <div className="border border-t-0 border-outline-variant/20 rounded-b-xl overflow-y-auto custom-scrollbar p-4 space-y-4 bg-background/50 max-h-[500px]">
                  {skillsFormSuccess && (
                    <div className="p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl flex items-center gap-2 text-xs font-mono animate-scale-up">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{skillsFormSuccess}</span>
                    </div>
                  )}

                  {/* Skills display grids grouped by categories */}
                  {['frontend', 'backend', 'database', 'devops'].map((cat) => {
                    const categorySkills = (resumeForm.skills || []).filter(s => s.category === cat);
                    if (categorySkills.length === 0) return null;

                    return (
                      <div key={cat} className="space-y-2">
                        <h3 className="font-mono text-[10px] uppercase text-primary font-bold tracking-wider pl-1">
                          {cat === 'frontend' && 'Frontend Development'}
                          {cat === 'backend' && 'Backend Logic & Services'}
                          {cat === 'database' && 'Databases & Cache stores'}
                          {cat === 'devops' && 'DevOps, Hosting & Automation'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {(resumeForm.skills || []).map((skill, originalIdx) => {
                            if (skill.category !== cat) return null;

                            return (
                              <div
                                key={originalIdx}
                                className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-outline-variant/30 flex items-center justify-between gap-4 transition-all"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="font-mono text-[10px] text-on-surface-variant bg-background/50 p-1.5 rounded border border-outline-variant/10 flex items-center justify-center shrink-0 w-8 h-8">
                                    <i className={`${getDeviconClass(skill.icon)} text-base`} title={skill.icon} />
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-sans text-xs font-bold text-on-surface truncate flex items-center gap-1.5">
                                      {skill.name}
                                      {skill.isCore && (
                                        <span className="text-[8px] font-mono bg-primary/10 text-primary border border-primary/20 px-1 rounded uppercase font-semibold">
                                          Core
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleEditSkillClick(originalIdx)}
                                    className={`p-1.5 rounded-lg border cursor-pointer transition-all active:scale-95 ${editingSkillIndex === originalIdx ? 'bg-secondary text-on-secondary border-secondary' : 'bg-secondary/10 hover:bg-secondary/20 text-secondary border-secondary/20'}`}
                                    title="Edit skill details"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSkill(originalIdx)}
                                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 cursor-pointer transition-all active:scale-95"
                                    title="Delete skill"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {(resumeForm.skills || []).length === 0 && (
                    <div className="text-center p-8 border border-dashed border-outline-variant/20 rounded-xl">
                      <Layers className="w-8 h-8 text-on-surface-variant mb-2 opacity-55" />
                      <p className="font-mono text-xs text-on-surface-variant uppercase">Ecosystem Empty</p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSkills}
                    className="w-full bg-primary text-on-primary font-mono text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    Save & Compile Skill Ecosystem
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
