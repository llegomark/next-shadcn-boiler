"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, HelpCircle, ChevronLeft, ChevronRight, CheckCircle2, BarChart3, PieChart } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

// Define the assessment domains based on PPSSH
const domains = [
  {
    id: "domain1",
    name: "Leading Strategically",
    description: "Setting the direction, goals and objectives of the school and ensuring these are understood and embraced by all stakeholders.",
    strands: [
      {
        id: "strand1.1",
        name: "Vision, mission and core values",
        indicator: "Demonstrate knowledge of the DepEd vision, mission and core values to foster shared understanding and alignment of school policies, programs, projects and activities.",
        difficulty: 0.5 // Rasch difficulty parameter (in logits)
      },
      {
        id: "strand1.2",
        name: "School planning and implementation",
        indicator: "Demonstrate knowledge and understanding of the phases of development and implementation of school plans aligned with institutional goals and policies.",
        difficulty: 0.8
      },
      {
        id: "strand1.3",
        name: "Policy implementation and review",
        indicator: "Demonstrate knowledge and understanding of policy implementation and review to ensure that school operations are consistent with national and local laws, regulations and issuances.",
        difficulty: 1.2
      },
      {
        id: "strand1.4",
        name: "Research and innovation",
        indicator: "Identify relevant research findings from reliable sources in facilitating data-driven and evidence-based innovations to improve school performance.",
        difficulty: 1.6
      },
      {
        id: "strand1.5",
        name: "Program design and implementation",
        indicator: "Display understanding of the implementation of programs in the school that support the development of learners.",
        difficulty: 1.1
      }
    ]
  },
  {
    id: "domain2",
    name: "Managing School Operations and Resources",
    description: "Managing systems and processes in schools to establish a culture of transparency and accountability in the continuous delivery of basic education services.",
    strands: [
      {
        id: "strand2.1",
        name: "Records management",
        indicator: "Demonstrate skills in managing school data and information using technology, including ICT.",
        difficulty: 0.4
      },
      {
        id: "strand2.2",
        name: "Financial management",
        indicator: "Demonstrate knowledge and understanding of policies, guidelines and issuances in managing finances such as allocation, procurement, disbursement and liquidation aligned with the school plan.",
        difficulty: 1.3
      },
      {
        id: "strand2.3",
        name: "School facilities and equipment",
        indicator: "Demonstrate knowledge and understanding of policies, guidelines and issuances on acquisition, recording, utilization, repair and maintenance, storage, and disposal in managing school facilities and equipment.",
        difficulty: 0.9
      },
      {
        id: "strand2.4",
        name: "Management of staff",
        indicator: "Demonstrate knowledge and understanding of laws, policies, guidelines and issuances on managing school staff.",
        difficulty: 1.1
      },
      {
        id: "strand2.5",
        name: "School safety for disaster preparedness",
        indicator: "Demonstrate knowledge and understanding of laws, policies, guidelines and issuances on managing school safety for disaster preparedness, mitigation and resiliency in ensuring continuous delivery of instruction.",
        difficulty: 0.7
      }
    ]
  },
  {
    id: "domain3",
    name: "Focusing on Teaching and Learning",
    description: "Promoting quality teaching and learning by providing technical assistance on instruction that relates to curriculum, practice, and performance.",
    strands: [
      {
        id: "strand3.1",
        name: "School-based review, contextualization and implementation of learning standards",
        indicator: "Demonstrate knowledge and understanding of school-based review, contextualization and implementation of learning standards.",
        difficulty: 1.0
      },
      {
        id: "strand3.2",
        name: "Teaching standards and pedagogies",
        indicator: "Demonstrate knowledge and understanding of teaching standards and pedagogies within and across learning areas to provide technical assistance to teachers to improve their teaching practice.",
        difficulty: 1.4
      },
      {
        id: "strand3.3",
        name: "Teacher performance feedback",
        indicator: "Demonstrate understanding of the use of feedback obtained from learners, parents and other stakeholders to help teachers improve their performance.",
        difficulty: 0.9
      },
      {
        id: "strand3.4",
        name: "Learner achievement and other performance indicators",
        indicator: "Set achievable and challenging learning outcomes to support learner achievement and the attainment of other performance indicators.",
        difficulty: 1.1
      },
      {
        id: "strand3.5",
        name: "Learning assessment",
        indicator: "Demonstrate knowledge and understanding of learning assessment tools, strategies and utilization of results consistent with curriculum requirements.",
        difficulty: 1.2
      }
    ]
  },
  {
    id: "domain4",
    name: "Developing Self and Others",
    description: "Nurturing themselves and others to enhance their competencies in leading and developing people as they support personnel's professional development and welfare.",
    strands: [
      {
        id: "strand4.1",
        name: "Personal and professional development",
        indicator: "Conduct self-assessment of personal and professional development needs using the Philippine Professional Standards for School Heads.",
        difficulty: 0.5
      },
      {
        id: "strand4.2",
        name: "Professional reflection and learning",
        indicator: "Demonstrate understanding of how professional reflection and learning can be used in improving practice.",
        difficulty: 0.8
      },
      {
        id: "strand4.3",
        name: "Professional networks",
        indicator: "Seek opportunities to improve one's practice as a school leader through professional networks.",
        difficulty: 0.7
      },
      {
        id: "strand4.4",
        name: "Performance management",
        indicator: "Demonstrate knowledge and understanding of the implementation of the performance management system in improving school personnel and office performance.",
        difficulty: 1.0
      },
      {
        id: "strand4.5",
        name: "Professional development of school personnel",
        indicator: "Demonstrate knowledge and understanding of professional development in enhancing strengths and in addressing performance gaps among school personnel.",
        difficulty: 1.2
      }
    ]
  },
  {
    id: "domain5",
    name: "Building Connections",
    description: "Engaging stakeholders in initiatives towards the improvement of school communities and advocating that education is everyone's responsibility.",
    strands: [
      {
        id: "strand5.1",
        name: "Management of diverse relationships",
        indicator: "Demonstrate skills in dealing with authorities, colleagues, parents and other stakeholders to encourage an enabling and supportive environment for learners.",
        difficulty: 0.9
      },
      {
        id: "strand5.2",
        name: "Management of school organizations",
        indicator: "Demonstrate knowledge and understanding of policies and guidelines on managing school organizations, such as learner organizations, faculty clubs and parent-teacher associations, in support of the attainment of institutional goals.",
        difficulty: 0.8
      },
      {
        id: "strand5.3",
        name: "Inclusive practice",
        indicator: "Demonstrate knowledge and understanding of inclusive practices, such as gender sensitivity, physical and mental health awareness and culture responsiveness, to foster awareness, acceptance and respect.",
        difficulty: 1.1
      },
      {
        id: "strand5.4",
        name: "Communication",
        indicator: "Demonstrate competent skills in speaking and writing, as well as in utilizing communication platforms, in communicating with teachers, learners, parents and other stakeholders.",
        difficulty: 0.6
      },
      {
        id: "strand5.5",
        name: "Community engagement",
        indicator: "Involve the community, such as parents, alumni, authorities, industries and other stakeholders, in school programs, projects and activities to gain support for learner development, as well as school and community improvement.",
        difficulty: 1.0
      }
    ]
  }
];

// Define rating scale options
const ratingOptions = [
  { value: "1", label: "1 - Limited awareness or knowledge", probability: 0.2 },
  { value: "2", label: "2 - Basic understanding but limited application", probability: 0.4 },
  { value: "3", label: "3 - Adequate knowledge and some application", probability: 0.6 },
  { value: "4", label: "4 - Strong knowledge and consistent application", probability: 0.8 },
  { value: "5", label: "5 - Expert knowledge and innovative application", probability: 0.95 }
];

// Define stage boundaries for assessment results based on logit measures
const stageThresholds = {
  stage1: { min: -2.0, max: -0.5 },
  stage2: { min: -0.5, max: 0.5 },
  stage3: { min: 0.5, max: 1.5 },
  stage4: { min: 1.5, max: 3.0 }
};

// Career stage descriptions for results
const careerStageDescriptions = {
  stage1: {
    title: "Career Stage 1 - Aspiring School Head",
    description: "You demonstrate basic knowledge and understanding of the authority, responsibility, and accountability expected of school heads. Continue developing your skills by focusing on areas where you scored lower.",
    probability: 0.65
  },
  stage2: {
    title: "Career Stage 2 - Beginning School Head",
    description: "You apply the required knowledge and understanding to perform functions as instructional leaders and administrative managers. Work on developing professional independence in your role.",
    probability: 0.75
  },
  stage3: {
    title: "Career Stage 3 - Experienced School Head",
    description: "You display an in-depth knowledge and understanding with advanced skills in performing your functions. Continue establishing shared governance with the wider school community.",
    probability: 0.85
  },
  stage4: {
    title: "Career Stage 4 - Expert School Head",
    description: "You exhibit mastery in your application of the authority, responsibility, and accountability expected of school heads. Continue modeling highest standards of practice and empowering the wider school community.",
    probability: 0.95
  }
};

// Rasch measurement utility functions
const raschUtils = {
  // Convert raw scores to logit measures using a simple Rasch transformation
  // This is a simplified version - in a real application, you'd use calibrated values
  rawScoreToLogit: (rawScore, maxScore) => {
    // Avoid division by zero and log(0)
    if (rawScore === 0) rawScore = 0.1;
    if (rawScore === maxScore) rawScore = maxScore - 0.1;
    
    // Simple raw-to-logit transformation
    const probability = rawScore / maxScore;
    return Math.log(probability / (1 - probability));
  },
  
  // Calculate probability of success using Rasch model formula
  calculateProbability: (personAbility, itemDifficulty) => {
    const exponent = personAbility - itemDifficulty;
    return Math.exp(exponent) / (1 + Math.exp(exponent));
  },
  
  // Calculate standard error of measurement
  calculateSEM: (personAbility, strandDifficulties) => {
    // Calculate information as sum of P * (1 - P) for each item
    let information = 0;
    
    for (const difficulty of strandDifficulties) {
      // Calculate probability of success using Rasch model
      const exponent = personAbility - difficulty;
      const probability = Math.exp(exponent) / (1 + Math.exp(exponent));
      
      // Add this item's information
      information += probability * (1 - probability);
    }
    
    // SEM = 1 / sqrt(Information)
    return information > 0 ? 1 / Math.sqrt(information) : 1; // Avoid division by zero
  },
  
  // Calculate person reliability (simplified)
  calculateReliability: (personVariance, errorVariance) => {
    return personVariance / (personVariance + errorVariance);
  },
  
  // Generate Wright Map data for visualization
  generateWrightMapData: (personMeasures, itemDifficulties) => {
    // Person data points
    const personData = personMeasures.map((measure, index) => ({
      id: `person${index}`,
      x: 0,
      y: measure,
      type: 'person'
    }));
    
    // Item data points
    const itemData = itemDifficulties.map((item, index) => ({
      id: item.id,
      x: 1,
      y: item.difficulty,
      name: item.name,
      type: 'item'
    }));
    
    return [...personData, ...itemData];
  }
};

// Main component
const PPSSHRaschAssessment = () => {
  const [currentPage, setCurrentPage] = useState("landing");
  const [activeDomain, setActiveDomain] = useState("domain1");
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [raschMeasures, setRaschMeasures] = useState(null);
  const [reliabilityStats, setReliabilityStats] = useState(null);

  // Calculate total number of questions
  const totalQuestions = domains.reduce((acc, domain) => acc + domain.strands.length, 0);
  
  // Calculate current progress
  const calculateProgress = () => {
    const answeredQuestions = Object.keys(answers).length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    setProgress(progressPercentage);
  };

  // Handle radio selection
  const handleRadioChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: parseInt(value)
    });
    calculateProgress();
  };

  // Calculate results using Rasch principles
  const calculateResults = () => {
    // Calculate raw scores per domain
    const domainResults = domains.map(domain => {
      const strandScores = domain.strands.map(strand => 
        answers[strand.id] || 0
      );
      
      const rawScore = strandScores.reduce((a, b) => a + b, 0);
      const maxPossibleScore = domain.strands.length * 5; // 5 is max rating
      
      // Convert raw score to logit measure using Rasch transformation
      const logitMeasure = raschUtils.rawScoreToLogit(rawScore, maxPossibleScore);
      
      // Calculate standard error of measurement using item information
      const strandDifficulties = domain.strands.map(strand => strand.difficulty);
      const sem = raschUtils.calculateSEM(logitMeasure, strandDifficulties);
      
      // Calculate confidence interval (95%)
      const confidenceInterval = {
        lower: logitMeasure - 1.96 * sem,
        upper: logitMeasure + 1.96 * sem
      };
      
      // Calculate individual strand measures and probabilities
      const strandDetails = domain.strands.map((strand, index) => {
        const score = strandScores[index];
        const probability = raschUtils.calculateProbability(logitMeasure, strand.difficulty);
        
        return {
          strandId: strand.id,
          strandName: strand.name,
          score: score,
          difficulty: strand.difficulty,
          probability: probability,
          expectedScore: probability * 5 // Expected score based on Rasch model
        };
      });
      
      return {
        domainId: domain.id,
        domainName: domain.name,
        rawScore: rawScore,
        maxPossibleScore: maxPossibleScore,
        percentageScore: (rawScore / maxPossibleScore) * 100,
        logitMeasure: logitMeasure,
        standardError: sem,
        confidenceInterval: confidenceInterval,
        strandDetails: strandDetails
      };
    });
    
    // Calculate overall person ability (average of domain measures)
    const overallLogitMeasure = domainResults.reduce((acc, domain) => acc + domain.logitMeasure, 0) / domainResults.length;
    
    // Calculate person variance and error variance for reliability
    const measures = domainResults.map(d => d.logitMeasure);
    const meanMeasure = measures.reduce((a, b) => a + b, 0) / measures.length;
    const personVariance = measures.reduce((acc, m) => acc + Math.pow(m - meanMeasure, 2), 0) / measures.length;
    const errorVariance = domainResults.reduce((acc, d) => acc + Math.pow(d.standardError, 2), 0) / domainResults.length;
    
    // Calculate cross-domain consistency index (not a true Person Separation Reliability,
    // but an indicator of this person's consistency across domains relative to measurement error)
    const reliability = raschUtils.calculateReliability(personVariance, errorVariance);
    
    // Determine career stage based on overall logit measure
    let careerStage = "stage1";
    if (overallLogitMeasure >= stageThresholds.stage4.min) {
      careerStage = "stage4";
    } else if (overallLogitMeasure >= stageThresholds.stage3.min) {
      careerStage = "stage3";
    } else if (overallLogitMeasure >= stageThresholds.stage2.min) {
      careerStage = "stage2";
    }
    
    // Prepare Wright Map data for visualization
    const allStrands = domains.flatMap(domain => 
      domain.strands.map(strand => ({
        id: strand.id,
        name: strand.name,
        difficulty: strand.difficulty,
        domain: domain.name
      }))
    );
    
    const wrightMapData = raschUtils.generateWrightMapData(
      [overallLogitMeasure], 
      allStrands
    );
    
    // Set results
    setResults({
      domainResults,
      overallLogitMeasure,
      careerStage,
      careerStageProb: careerStageDescriptions[careerStage].probability
    });
    
    // Set Rasch measures
    setRaschMeasures({
      wrightMapData,
      domainMeasures: domainResults.map(d => ({
        name: d.domainName,
        logit: d.logitMeasure,
        standardError: d.standardError,
        ciLower: d.confidenceInterval.lower,
        ciUpper: d.confidenceInterval.upper
      }))
    });
    
    // Set reliability statistics
    setReliabilityStats({
      personReliability: reliability,
      personVariance: personVariance,
      errorVariance: errorVariance,
      separationIndex: Math.sqrt(reliability / (1 - reliability))
    });
    
    setCurrentPage("results");
  };

  // Generate recommendations based on Rasch analysis
  const generateRecommendations = () => {
    if (!results) return [];
    
    // Sort domains by logit measure (ascending)
    const sortedDomains = [...results.domainResults].sort((a, b) => a.logitMeasure - b.logitMeasure);
    const lowestDomains = sortedDomains.slice(0, 2);
    
    // Generate recommendations
    return lowestDomains.map(domain => {
      // Find the strands with lowest probability of success
      const lowestStrands = [...domain.strandDetails]
        .sort((a, b) => a.probability - b.probability)
        .slice(0, 2);
      
      return {
        domainName: domain.domainName,
        domainMeasure: domain.logitMeasure.toFixed(2),
        strands: lowestStrands.map(strand => ({
          strandName: strand.strandName,
          probability: (strand.probability * 100).toFixed(1),
          recommendation: getRecommendation(domain.domainId, strand.strandId),
          difficulty: strand.difficulty.toFixed(2)
        }))
      };
    });
  };

  // Sample recommendations based on domain and strand
  const getRecommendation = (domainId, strandId) => {
    const recommendations = {
      "domain1": {
        "strand1.1": "Study and internalize the DepEd vision, mission, and core values. Create a personal statement on how these align with your own leadership philosophy.",
        "strand1.2": "Participate in workshops or training on strategic planning. Offer to help with developing a section of your school's improvement plan.",
        "strand1.3": "Review key educational policies. Practice analyzing a policy's impact on school operations.",
        "strand1.4": "Subscribe to educational research journals. Begin a small action research project at your school.",
        "strand1.5": "Volunteer to assist in program implementation. Document the process and outcomes to build understanding."
      },
      "domain2": {
        "strand2.1": "Improve your digital literacy skills. Practice using management information systems to organize school data.",
        "strand2.2": "Take a course on basic financial management for schools. Shadow your principal during budget planning sessions.",
        "strand2.3": "Create an inventory of school facilities. Learn about maintenance schedules and procurement processes.",
        "strand2.4": "Study human resource management principles. Volunteer to assist in organizing staff development activities.",
        "strand2.5": "Participate in disaster preparedness training. Help develop or review your school's emergency response plan."
      },
      "domain3": {
        "strand3.1": "Join curriculum review committees. Learn how to contextualize learning standards to meet local needs.",
        "strand3.2": "Observe master teachers. Document effective teaching practices across different learning areas.",
        "strand3.3": "Design feedback mechanisms. Practice giving constructive feedback to peers.",
        "strand3.4": "Analyze learning outcome data. Identify factors that influence student achievement.",
        "strand3.5": "Learn about different assessment methods. Design assessments that measure various types of learning."
      },
      "domain4": {
        "strand4.1": "Create a personal development plan. Identify specific leadership competencies to develop.",
        "strand4.2": "Keep a reflective journal of your leadership experiences. Join or create a professional learning community.",
        "strand4.3": "Attend educational leadership conferences. Connect with other aspiring school heads through social media or professional associations.",
        "strand4.4": "Study the DepEd performance management system. Practice setting SMART goals for yourself and others.",
        "strand4.5": "Design professional development activities for teachers. Learn to identify training needs through observation and data analysis."
      },
      "domain5": {
        "strand5.1": "Practice conflict resolution skills. Develop strategies for managing difficult conversations with stakeholders.",
        "strand5.2": "Learn about effective organization management. Volunteer to advise a student or teacher organization.",
        "strand5.3": "Take courses on inclusive education. Implement inclusive practices in your classroom or department.",
        "strand5.4": "Improve your public speaking and writing skills. Practice using different communication platforms for school announcements.",
        "strand5.5": "Organize a community engagement activity. Build relationships with local businesses, alumni, and community organizations."
      }
    };
    
    return recommendations[domainId]?.[strandId] || "Focus on developing skills in this area through professional development opportunities.";
  };

  // Reset assessment
  const resetAssessment = () => {
    setAnswers({});
    setResults(null);
    setRaschMeasures(null);
    setReliabilityStats(null);
    setProgress(0);
    setActiveDomain("domain1");
    setCurrentPage("assessment");
  };

  // Render landing page
  const renderLandingPage = () => (
    <div className="flex flex-col items-center p-4 sm:p-6 mx-auto max-w-3xl">
      <Card className="w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <CardHeader className="bg-yellow-400 text-black border-b-4 border-black p-6">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-2xl sm:text-3xl font-black leading-tight">Philippine Professional Standards for School Heads</CardTitle>
            <CardDescription className="text-black font-medium text-base">Leadership Assessment with Psychometric Algorithm</CardDescription>
            <div className="text-black text-sm font-bold mt-2 border-t-2 border-black pt-2">
              by Mark Anthony Llego | <a href="https://nqesh.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">nqesh.com</a>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 bg-white">
          <div className="space-y-6">
          <div className="rounded-md bg-blue-100 border-4 border-blue-500 p-4 mb-6">
            <h2 className="text-xl font-black text-blue-800 mb-2">Welcome to the Advanced PPSSH Assessment</h2>
            <p className="text-black font-medium">
              This assessment tool applies Rasch measurement principles to evaluate your leadership competencies based on the Philippine Professional Standards for School Heads (PPSSH).
            </p>
          </div>
            
            <div className="border-4 border-black bg-pink-300 p-4 rounded-md mb-6">
              <div className="flex gap-3 items-start">
                <Info className="h-6 w-6 flex-shrink-0 mt-1" strokeWidth={2.5} />
                <div>
                  <h3 className="text-lg font-black mb-1 text-black">Enhanced with Advanced Psychometrics</h3>
                  <p className="text-black font-medium">
                    This assessment uses proprietary psychometric algorithms to provide more precise estimates of your abilities across the PPSSH domains, with confidence intervals and probability-based feedback.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-black mb-3 inline-block bg-green-300 px-3 py-1 -rotate-1 border-2 border-black">The Five Domains of PPSSH:</h3>
              <ul className="space-y-4 mb-6">
                {domains.map((domain, index) => (
                  <li key={domain.id} className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-md border-2 border-black flex items-center justify-center text-lg font-black ${
                      ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400'][index]
                    }`}>
                      {domain.id.replace('domain', '')}
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-base">{domain.name}</span>
                      <p className="text-sm mt-1">{domain.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-4 border-black p-4 bg-cyan-100 rotate-1">
              <h3 className="text-lg font-black mb-2">Benefits of This Assessment:</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                  <span>Precise leadership measurement</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                  <span>Domain-specific analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                  <span>Probabilistic competency estimates</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                  <span>Targeted recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                  <span>Visual leadership mapping</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 bg-gray-100 border-t-4 border-black">
          <Button 
            onClick={() => setCurrentPage("assessment")}
            className="w-full py-6 text-lg font-black bg-black hover:bg-gray-800 border-4 border-black transform hover:-translate-y-1 transition-transform"
          >
            START ASSESSMENT
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Render assessment page
  const renderAssessmentPage = () => (
    <div className="flex flex-col items-center p-4 sm:p-6 mx-auto max-w-3xl">
      <Card className="w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
        <CardHeader className="p-5 border-b-4 border-black bg-orange-400">
          <div className="flex flex-col gap-3">
            <CardTitle className="text-xl font-black">PPSSH Leadership Assessment</CardTitle>
            <CardDescription className="text-black font-medium">
              Rate yourself on each indicator based on your current knowledge and practice
            </CardDescription>
            
            <div className="mt-2">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Progress</span>
                <span className="font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="h-8 w-full bg-white border-3 border-black rounded-md overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}
                ></div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="domain1" value={activeDomain} onValueChange={setActiveDomain} className="w-full">
            <TabsList className="w-full grid grid-cols-5 rounded-none border-b-4 border-black bg-gray-100 h-16">
              {domains.map((domain, index) => {
                let bgColor = "bg-blue-400";
                
                if (domain.id === "domain1") bgColor = "bg-red-400";
                else if (domain.id === "domain2") bgColor = "bg-blue-400";
                else if (domain.id === "domain3") bgColor = "bg-green-400";
                else if (domain.id === "domain4") bgColor = "bg-purple-400";
                else if (domain.id === "domain5") bgColor = "bg-orange-400";
                
                return (
                  <TabsTrigger 
                    key={domain.id} 
                    value={domain.id}
                    className={`w-full text-sm sm:text-base font-bold data-[state=active]:${bgColor} data-[state=active]:border-4 data-[state=active]:border-black data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] data-[state=active]:text-black`}
                  >
                    {domain.name.split(' ')[0]}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {domains.map((domain, domainIndex) => (
              <TabsContent key={domain.id} value={domain.id} className="p-0">
                <div className="p-5 border-b-4 border-black bg-gray-100">
                  <h2 className={`text-xl font-black mb-2 inline-block px-3 py-1 ${
                    ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400'][domainIndex]
                  } -rotate-1 border-2 border-black`}>
                    {domain.name}
                  </h2>
                  <p className="text-sm font-medium">{domain.description}</p>
                </div>
                
                <div className="p-5 space-y-5">
                  {domain.strands.map((strand, strandIndex) => (
                    <div 
                      key={strand.id} 
                      className={`rounded-md border-3 border-black p-4 ${
                        ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100'][strandIndex % 5]
                      } ${strandIndex % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg">{strand.name}</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center h-6 w-6 rounded-full bg-white border-2 border-black">
                                <HelpCircle className="h-4 w-4" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-xs bg-black text-white font-medium p-3 border-2 border-black">
                              <p>Difficulty: {strand.difficulty.toFixed(2)} logits</p>
                              <p className="mt-1">Higher values indicate more challenging competencies to master.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <p className="text-sm mb-4 font-medium">{strand.indicator}</p>
                      
                      <RadioGroup 
                        value={answers[strand.id]?.toString() || ""} 
                        onValueChange={(value) => handleRadioChange(strand.id, value)}
                        className="space-y-1 bg-white border-2 border-black p-3 rounded-md"
                      >
                        <div className="grid grid-cols-1 gap-2">
                          {ratingOptions.map((option, idx) => (
                            <div key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
                              <RadioGroupItem 
                                value={option.value} 
                                id={`${strand.id}-${option.value}`} 
                                className="h-5 w-5 border-2 border-black"
                              />
                              <Label 
                                htmlFor={`${strand.id}-${option.value}`} 
                                className="text-sm font-medium cursor-pointer"
                              >
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  ))}
                </div>
                
                <div className="p-5 bg-gray-100 border-t-4 border-black flex justify-between">
                  {domain.id !== "domain1" && (
                    <Button 
                      variant="outline" 
                      className="font-bold border-3 border-black flex items-center gap-2 bg-white hover:bg-gray-100"
                      onClick={() => {
                        const currentIndex = domains.findIndex(d => d.id === domain.id);
                        setActiveDomain(domains[currentIndex - 1].id);
                      }}
                    >
                      <ChevronLeft className="h-5 w-5" />
                      Previous Domain
                    </Button>
                  )}
                  {domain.id !== "domain5" ? (
                    <Button 
                      className="font-bold border-3 border-black flex items-center gap-2 bg-blue-500 hover:bg-blue-600 ml-auto"
                      onClick={() => {
                        const currentIndex = domains.findIndex(d => d.id === domain.id);
                        setActiveDomain(domains[currentIndex + 1].id);
                      }}
                    >
                      Next Domain
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button 
                      className="font-bold border-3 border-black flex items-center gap-2 bg-green-500 hover:bg-green-600 ml-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-6"
                      onClick={calculateResults}
                      disabled={Object.keys(answers).length < totalQuestions}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      Submit Assessment
                    </Button>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  // Render results page
  const renderResultsPage = () => {
    if (!results || !raschMeasures || !reliabilityStats) return null;
    
    const recommendations = generateRecommendations();
    const careerStage = careerStageDescriptions[results.careerStage];
    
    // Prepare data for radar chart
    const radarData = results.domainResults.map(domain => ({
      domain: domain.domainName.split(' ').slice(0, 2).join(' '),
      logitScore: parseFloat(domain.logitMeasure.toFixed(2))
    }));
    
    // Prepare data for domain bar chart
    const domainBarData = results.domainResults.map(domain => ({
      name: domain.domainName.split(' ')[0],
      logitMeasure: parseFloat(domain.logitMeasure.toFixed(2)),
      standardError: parseFloat(domain.standardError.toFixed(2)),
      ciLower: parseFloat(domain.confidenceInterval.lower.toFixed(2)),
      ciUpper: parseFloat(domain.confidenceInterval.upper.toFixed(2))
    }));
    
    // Prepare Wright map data for scatter plot
    const wrightMapPersons = raschMeasures.wrightMapData.filter(d => d.type === 'person');
    const wrightMapItems = raschMeasures.wrightMapData.filter(d => d.type === 'item');
    
    const wrightMapPersonData = [{
      name: 'Your Ability',
      data: wrightMapPersons.map(p => ({ x: 0, y: parseFloat(p.y.toFixed(2)) }))
    }];
    
    const wrightMapItemData = domains.map(domain => ({
      name: domain.name.split(' ')[0],
      data: wrightMapItems
        .filter(item => item.id.startsWith(domain.id.replace('domain', 'strand')))
        .map(item => ({ 
          x: domains.findIndex(d => d.id === domain.id) + 1, 
          y: parseFloat(item.y.toFixed(2)),
          name: item.name
        }))
    }));
    
    return (
      <div className="flex flex-col items-center p-4 sm:p-6 mx-auto max-w-3xl">
        <Card className="w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
          <CardHeader className="bg-green-400 border-b-4 border-black p-5">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 border-3 border-black rounded-md rotate-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" strokeWidth={3} />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-black">Your PPSSH Results</CardTitle>
                <CardDescription className="text-black font-medium">
                  Based on Rasch measurement analysis across all five domains
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="p-5 border-b-4 border-black">
              <div className="bg-yellow-100 border-3 border-black p-4 rounded-md mb-5 rotate-1">
                <h2 className="text-xl font-black mb-2">{careerStage.title}</h2>
                <p className="text-sm font-medium mb-4">{careerStage.description}</p>
                
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white border-3 border-black p-3 rounded-md -rotate-2">
                    <p className="text-xs font-bold mb-1">Ability Measure:</p>
                    <p className="font-black text-lg">{results.overallLogitMeasure.toFixed(2)} logits</p>
                  </div>
                  <div className="bg-white border-3 border-black p-3 rounded-md rotate-2">
                    <p className="text-xs font-bold mb-1">Reliability:</p>
                    <p className="font-black text-lg">{(reliabilityStats.personReliability * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-white border-3 border-black p-3 rounded-md -rotate-1">
                    <p className="text-xs font-bold mb-1">Stage Probability:</p>
                    <p className="font-black text-lg">{(results.careerStageProb * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full grid grid-cols-3 rounded-none border-b-4 border-black bg-gray-100 h-16">
                <TabsTrigger 
                  value="overview" 
                  className="w-full text-sm sm:text-base font-bold data-[state=active]:border-3 data-[state=active]:border-black data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] data-[state=active]:bg-purple-400 flex items-center justify-center gap-2"
                >
                  <PieChart className="h-5 w-5 flex-shrink-0" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  className="w-full text-sm sm:text-base font-bold data-[state=active]:border-3 data-[state=active]:border-black data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] data-[state=active]:bg-blue-400 flex items-center justify-center gap-2"
                >
                  <BarChart3 className="h-5 w-5 flex-shrink-0" />
                  <span>Domain Details</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="rasch" 
                  className="w-full text-sm sm:text-base font-bold data-[state=active]:border-3 data-[state=active]:border-black data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] data-[state=active]:bg-green-400 flex items-center justify-center gap-2"
                >
                  <Info className="h-5 w-5 flex-shrink-0" />
                  <span>Advanced Analytics</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="p-5">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black mb-3 inline-block bg-purple-300 px-3 py-1 -rotate-1 border-2 border-black">Domain Performance</h3>
                    <div className="h-72 border-3 border-black bg-white p-2 rounded-md">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius="70%" data={radarData}>
                          <PolarGrid stroke="#000" strokeWidth={1} />
                          <PolarAngleAxis dataKey="domain" tick={{ fontSize: 12, fontWeight: 'bold' }} stroke="#000" />
                          <PolarRadiusAxis angle={90} domain={[-2, 3]} stroke="#000" />
                          <Radar
                            name="Your Ability Level"
                            dataKey="logitScore"
                            stroke="#000"
                            strokeWidth={2}
                            fill="#9333ea"
                            fillOpacity={0.6}
                          />
                          <RechartsTooltip contentStyle={{ border: '3px solid black', borderRadius: '4px', padding: '8px' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-black mb-3 inline-block bg-red-300 px-3 py-1 rotate-1 border-2 border-black">Recommendations</h3>
                  <div className="space-y-5">
                    {recommendations.map((rec, index) => (
                      <div 
                        key={index} 
                        className={`border-3 border-black p-4 rounded-md ${index % 2 === 0 ? 'rotate-1 bg-blue-100' : '-rotate-1 bg-green-100'}`}
                      >
                        <h4 className="font-black text-base border-b-2 border-black pb-2 mb-3">
                          {rec.domainName} (Measure: {rec.domainMeasure} logits)
                        </h4>
                        <div className="space-y-4">
                          {rec.strands.map((strand, idx) => (
                            <div key={idx} className="bg-white border-2 border-black p-3 rounded-md">
                              <p className="font-bold text-sm">{strand.strandName}</p>
                              <div className="flex items-center gap-2 my-2">
                                <div className="h-3 w-full bg-gray-200 border border-black rounded-full overflow-hidden">
                                  <div 
                                    style={{ width: strand.probability + '%' }} 
                                    className="h-full bg-green-500"
                                  ></div>
                                </div>
                                <span className="font-bold text-xs">{strand.probability}%</span>
                              </div>
                              <p className="text-xs mt-2 font-medium">{strand.recommendation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="p-5">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black mb-3 inline-block bg-blue-300 px-3 py-1 -rotate-1 border-2 border-black">Domain Measures with Confidence Intervals</h3>
                    <div className="h-72 border-3 border-black bg-white p-2 rounded-md">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={domainBarData}
                          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 'bold' }} stroke="#000" />
                          <YAxis 
                            domain={[-2, 3]} 
                            label={{ 
                              value: 'Logit Measure', 
                              angle: -90, 
                              position: 'insideLeft', 
                              style: { 
                                fontSize: '12px',
                                fontWeight: 'bold',
                                textAnchor: 'middle'
                              } 
                            }} 
                            stroke="#000"
                          />
                          <RechartsTooltip 
                            formatter={(value, name) => [value, name]}
                            labelFormatter={(value) => `Domain: ${value}`}
                            contentStyle={{ border: '3px solid black', borderRadius: '4px', padding: '8px' }}
                          />
                          <Legend />
                          <Bar
                            dataKey="logitMeasure"
                            fill="#2563eb"
                            stroke="#000"
                            strokeWidth={2}
                            name="Logit Measure"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    {results.domainResults.map((domain, idx) => (
                      <div 
                        key={domain.domainId} 
                        className={`border-3 border-black p-4 rounded-md ${
                          ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100'][idx % 5]
                        } ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
                      >
                        <div className="flex justify-between items-center mb-3 border-b-2 border-black pb-2">
                          <h4 className="font-black text-base">{domain.domainName}</h4>
                          <span className="font-bold text-sm bg-white px-2 py-1 border-2 border-black rounded-md">
                            {domain.logitMeasure.toFixed(2)} ± {domain.standardError.toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="h-8 w-full bg-white border-2 border-black rounded-md overflow-hidden mb-2">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${((domain.logitMeasure + 2) / 5) * 100}%` }}
                          ></div>
                        </div>
                        
                        <p className="text-xs font-medium mb-4">
                          95% Confidence Interval: {domain.confidenceInterval.lower.toFixed(2)} to {domain.confidenceInterval.upper.toFixed(2)} logits
                        </p>
                        
                        <div className="space-y-3 mt-4 bg-white border-2 border-black p-3 rounded-md">
                          {domain.strandDetails.map((strand, strandIdx) => (
                            <div key={strandIdx} className={`border-b-2 border-black pb-2 ${strandIdx === domain.strandDetails.length - 1 ? 'border-b-0' : ''}`}>
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-bold">{strand.strandName}</span>
                                <div className="text-right">
                                  <span className="font-black text-sm">{strand.score}/5</span>
                                  <p className="text-xs font-medium">
                                    Expected: {strand.expectedScore.toFixed(1)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="w-full bg-gray-200 border border-black rounded-full h-4 mt-2 overflow-hidden">
                                <div 
                                  className="bg-blue-600 h-full" 
                                  style={{ width: `${strand.probability * 100}%` }}
                                ></div>
                              </div>
                              <p className="text-xs font-medium mt-1">
                                Probability: {(strand.probability * 100).toFixed(1)}%
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rasch" className="p-5">
                <div className="space-y-6">
                  <div className="bg-green-100 border-3 border-black p-4 rounded-md mb-4 rotate-1">
                    <h3 className="font-black text-lg mb-3">Psychometric Properties</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white border-2 border-black p-3 rounded-md -rotate-2">
                        <p className="text-xs font-bold">Consistency Score:</p>
                        <p className="font-black text-lg">{(reliabilityStats.personReliability * 100).toFixed(1)}%</p>
                      </div>
                      <div className="bg-white border-2 border-black p-3 rounded-md rotate-2">
                        <p className="text-xs font-bold">Differentiation Index:</p>
                        <p className="font-black text-lg">{reliabilityStats.separationIndex.toFixed(2)}</p>
                      </div>
                      <div className="bg-white border-2 border-black p-3 rounded-md rotate-1">
                        <p className="text-xs font-bold">Performance Variance:</p>
                        <p className="font-black text-lg">{reliabilityStats.personVariance.toFixed(3)}</p>
                      </div>
                      <div className="bg-white border-2 border-black p-3 rounded-md -rotate-1">
                        <p className="text-xs font-bold">Measurement Precision:</p>
                        <p className="font-black text-lg">{(1/reliabilityStats.errorVariance).toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                <h3 className="text-lg font-black mb-3 inline-block bg-yellow-300 px-3 py-1 rotate-1 border-2 border-black">Item-Person Map</h3>
                    <div className="h-80 border-3 border-black bg-white p-3 rounded-md">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            type="number" 
                            dataKey="x" 
                            name="Domain" 
                            domain={[-0.5, 5.5]}
                            stroke="#000"
                            tickFormatter={(value) => {
                              if (value === 0) return "You";
                              if (value >= 1 && value <= 5) return `D${value}`;
                              return "";
                            }}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="y" 
                            name="Logits" 
                            domain={[-2, 3]}
                            stroke="#000"
                            label={{ 
                              value: 'Difficulty/Ability (Logits)', 
                              angle: -90, 
                              position: 'insideLeft', 
                              style: { 
                                fontSize: '12px',
                                fontWeight: 'bold'
                              } 
                            }}
                          />
                          <ZAxis range={[60, 60]} />
                          <RechartsTooltip 
                            cursor={{ strokeDasharray: '3 3' }}
                            formatter={(value, name, props) => {
                              if (props.payload.name) {
                                return [props.payload.name, "Strand"];
                              }
                              return [value, name];
                            }}
                            contentStyle={{ border: '3px solid black', borderRadius: '4px', padding: '8px' }}
                          />
                          <Legend />
                          {wrightMapPersonData.map((entry, index) => (
                            <Scatter 
                              key={`person-${index}`}
                              name={entry.name} 
                              data={entry.data} 
                              fill="#000" 
                              shape="circle"
                              stroke="#000"
                              strokeWidth={2}
                            />
                          ))}
                          {wrightMapItemData.map((entry, index) => (
                            <Scatter 
                              key={`item-${index}`}
                              name={entry.name} 
                              data={entry.data} 
                              fill={`hsl(${index * 50}, 70%, 50%)`}
                              shape="diamond"
                              stroke="#000"
                              strokeWidth={1}
                            />
                          ))}
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="bg-black text-white p-4 border-3 border-white rounded-md -rotate-1 mt-4">
                    <p className="text-sm font-medium">
                      <span className="font-black">How to read this chart: </span>
                      The Item-Person Map shows your ability (blue circle) in relation to each strand (diamonds). 
                      Items at your ability level have 50% probability of success. Items lower are easier for you, higher are more challenging.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 p-5 bg-gray-100 border-t-4 border-black">
            <Button 
              onClick={() => {
                setAnswers({});
                setProgress(0);
                setResults(null);
                setRaschMeasures(null);
                setReliabilityStats(null);
                setCurrentPage("landing");
              }}
              className="font-bold border-3 border-black bg-blue-500 hover:bg-blue-600 text-white"
            >
              Back to Home
            </Button>
            <Button 
              variant="outline" 
              className="font-bold border-3 border-black bg-white hover:bg-gray-100"
              onClick={resetAssessment}
            >
              Retake Assessment
            </Button>
            <Button 
              onClick={() => window.print()} 
              className="font-bold border-3 border-black bg-blue-500 hover:bg-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white"
            >
              Print Results
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  // Main render based on current page
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {currentPage === "landing" && renderLandingPage()}
      {currentPage === "assessment" && renderAssessmentPage()}
      {currentPage === "results" && renderResultsPage()}
    </div>
  );
};

export default PPSSHRaschAssessment;