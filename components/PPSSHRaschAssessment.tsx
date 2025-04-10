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
import { Info, HelpCircle } from "lucide-react";
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
  calculateSEM: (rawScore, maxScore) => {
    // Simple SEM estimation - in real Rasch analysis this would be more complex
    const p = rawScore / maxScore;
    return 1 / Math.sqrt(maxScore * p * (1 - p));
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
      
      // Calculate standard error of measurement
      const sem = raschUtils.calculateSEM(rawScore, maxPossibleScore);
      
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
    
    // Calculate reliability
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
    <div className="flex flex-col items-center justify-center p-4 md:p-8 bg-slate-50">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-xl md:text-3xl font-bold">Philippine Professional Standards for School Heads</CardTitle>
          <CardDescription className="text-white/90 text-sm md:text-lg">Leadership Assessment with Rasch Analysis</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-8">
          <div className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-2">Welcome to the Advanced PPSSH Assessment</h2>
              <p className="text-sm md:text-base text-slate-600 mb-4">
                This assessment tool applies Rasch measurement principles to evaluate your leadership competencies based on the Philippine Professional Standards for School Heads (PPSSH).
              </p>
              
              <Alert className="mb-6">
                <Info className="h-4 w-4 md:h-5 md:w-5" />
                <AlertTitle>Enhanced with Rasch Analysis</AlertTitle>
                <AlertDescription className="text-sm">
                  This assessment uses Rasch measurement to provide more precise estimates of your abilities across the PPSSH domains, with confidence intervals and probability-based feedback.
                </AlertDescription>
              </Alert>
              
              <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-2">The Five Domains of PPSSH:</h3>
              <ul className="space-y-2 mb-6">
                {domains.map(domain => (
                  <li key={domain.id} className="flex items-start">
                    <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 font-semibold text-xs md:text-sm">
                      {domain.id.replace('domain', '')}
                    </div>
                    <div>
                      <span className="font-medium text-sm md:text-base text-slate-800">{domain.name}</span>
                      <p className="text-xs md:text-sm text-slate-600">{domain.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-2">Benefits of This Assessment:</h3>
              <ul className="list-disc list-inside space-y-1 text-xs md:text-sm text-slate-600 mb-6">
                <li>More precise measurement of your leadership abilities</li>
                <li>Domain-specific analysis with confidence intervals</li>
                <li>Probabilistic estimates of your competencies</li>
                <li>Targeted recommendations based on item difficulties</li>
                <li>Visual representations of your standing relative to leadership standards</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-4 md:p-6 bg-slate-50">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-base md:text-lg px-6 md:px-8"
            onClick={() => setCurrentPage("assessment")}
          >
            Start Assessment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Render assessment page
  const renderAssessmentPage = () => (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-4xl mb-8">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">PPSSH Leadership Assessment</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Rate yourself on each indicator based on your current knowledge and practice
          </CardDescription>
          <div className="mt-2">
            <div className="flex justify-between text-xs md:text-sm text-slate-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="domain1" value={activeDomain} onValueChange={setActiveDomain}>
            <TabsList className="grid grid-cols-5 mb-4 md:mb-6">
              {domains.map(domain => (
                <TabsTrigger 
                  key={domain.id} 
                  value={domain.id}
                  className="text-xs px-1 md:px-3"
                >
                  Domain {domain.id.replace('domain', '')}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {domains.map(domain => (
              <TabsContent key={domain.id} value={domain.id} className="space-y-4 md:space-y-6">
                <div>
                  <h2 className="text-base md:text-xl font-semibold mb-1">{domain.name}</h2>
                  <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4">{domain.description}</p>
                </div>
                
                <Separator />
                
                {domain.strands.map(strand => (
                  <div key={strand.id} className="rounded-lg border p-3 md:p-4 mb-3 md:mb-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-sm md:text-lg mb-1">{strand.name}</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center mt-1">
                              <HelpCircle className="h-4 w-4 text-slate-400" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-xs">
                            <p>Difficulty: {strand.difficulty.toFixed(2)} logits</p>
                            <p className="mt-1">Higher values indicate more challenging competencies to master.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4">{strand.indicator}</p>
                    
                    <RadioGroup 
                      value={answers[strand.id]?.toString() || ""} 
                      onValueChange={(value) => handleRadioChange(strand.id, value)}
                      className="space-y-1 md:space-y-2"
                    >
                      <div className="grid grid-cols-1 gap-1 md:gap-2">
                        {ratingOptions.map(option => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`${strand.id}-${option.value}`} />
                            <Label htmlFor={`${strand.id}-${option.value}`} className="text-xs md:text-sm">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                ))}
                
                <div className="flex justify-between pt-4">
                  {domain.id !== "domain1" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs md:text-sm"
                      onClick={() => {
                        const currentIndex = domains.findIndex(d => d.id === domain.id);
                        setActiveDomain(domains[currentIndex - 1].id);
                      }}
                    >
                      Previous Domain
                    </Button>
                  )}
                  {domain.id !== "domain5" ? (
                    <Button 
                      className="ml-auto text-xs md:text-sm"
                      size="sm"
                      onClick={() => {
                        const currentIndex = domains.findIndex(d => d.id === domain.id);
                        setActiveDomain(domains[currentIndex + 1].id);
                      }}
                    >
                      Next Domain
                    </Button>
                  ) : (
                    <Button 
                      className="ml-auto bg-green-600 hover:bg-green-700 text-xs md:text-sm"
                      size="sm"
                      onClick={calculateResults}
                      disabled={Object.keys(answers).length < totalQuestions}
                    >
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
      <div className="flex flex-col items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-4xl mb-8">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-lg md:text-xl">Your PPSSH Assessment Results</CardTitle>
            <CardDescription className="text-white/90 text-xs md:text-sm">
              Based on Rasch measurement analysis across all five domains
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 md:p-6">
            <div className="mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-semibold mb-2">{careerStage.title}</h2>
              <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4">{careerStage.description}</p>
              
              <div className="bg-blue-50 p-3 md:p-4 rounded-lg mb-6">
                <h3 className="font-medium text-sm md:text-base mb-2">Overall Assessment</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs md:text-sm text-slate-600">Ability Measure:</p>
                    <p className="font-semibold text-sm md:text-lg">{results.overallLogitMeasure.toFixed(2)} logits</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-slate-600">Reliability:</p>
                    <p className="font-semibold text-sm md:text-lg">{(reliabilityStats.personReliability * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-slate-600">Probability of Stage:</p>
                    <p className="font-semibold text-sm md:text-lg">{(results.careerStageProb * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="overview" className="mb-6 md:mb-8">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="details" className="text-xs md:text-sm">Domain Details</TabsTrigger>
                <TabsTrigger value="rasch" className="text-xs md:text-sm">Rasch Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm md:text-base mb-2">Domain Performance</h3>
                  <div className="h-64 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius="75%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="domain" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[-2, 3]} />
                        <Radar
                          name="Your Ability Level"
                          dataKey="logitScore"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.5}
                        />
                        <RechartsTooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <h3 className="font-semibold text-sm md:text-base mb-2">Recommendations</h3>
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <Alert key={index} className="bg-blue-50">
                        <AlertTitle className="text-xs md:text-sm font-medium">
                          {rec.domainName} (Measure: {rec.domainMeasure} logits)
                        </AlertTitle>
                        <AlertDescription className="space-y-2">
                          {rec.strands.map((strand, idx) => (
                            <div key={idx} className="mt-2">
                              <p className="text-xs font-medium">{strand.strandName}</p>
                              <p className="text-xs text-slate-600 mb-1">
                                Probability of success: {strand.probability}% • Difficulty: {strand.difficulty} logits
                              </p>
                              <p className="text-xs">{strand.recommendation}</p>
                            </div>
                          ))}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm md:text-base mb-2">Domain Measures with Confidence Intervals</h3>
                  <div className="h-64 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={domainBarData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[-2, 3]} label={{ value: 'Logit Measure', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }} />
                        <RechartsTooltip 
                          formatter={(value, name) => [value, name]}
                          labelFormatter={(value) => `Domain: ${value}`}
                        />
                        <Legend />
                        <Bar
                          dataKey="logitMeasure"
                          fill="#3b82f6"
                          name="Logit Measure"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    {results.domainResults.map((domain) => (
                      <div key={domain.domainId} className="border rounded-lg p-3 md:p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-xs md:text-sm">{domain.domainName}</h4>
                          <span className="font-semibold text-xs md:text-sm">{domain.logitMeasure.toFixed(2)} ± {domain.standardError.toFixed(2)} logits</span>
                        </div>
                        <Progress 
                          value={((domain.logitMeasure + 2) / 5) * 100} 
                          className="h-2 mb-2" 
                        />
                        <p className="text-xs text-slate-600 mb-2">
                          95% Confidence Interval: {domain.confidenceInterval.lower.toFixed(2)} to {domain.confidenceInterval.upper.toFixed(2)} logits
                        </p>
                        
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {domain.strandDetails.map((strand, idx) => (
                            <div key={idx} className="border-t pt-2">
                              <div className="flex justify-between items-start">
                                <span className="text-xs text-slate-800">{strand.strandName}</span>
                                <div className="text-right">
                                  <span className="font-medium text-xs">{strand.score}/5</span>
                                  <p className="text-xs text-slate-500">
                                    Expected: {strand.expectedScore.toFixed(1)}
                                  </p>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full" 
                                  style={{ width: `${strand.probability * 100}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
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
              
              <TabsContent value="rasch">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 md:p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-sm mb-2">Psychometric Properties</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-slate-600">Person Reliability:</p>
                        <p className="font-medium">{(reliabilityStats.personReliability * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Separation Index:</p>
                        <p className="font-medium">{reliabilityStats.separationIndex.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Person Variance:</p>
                        <p className="font-medium">{reliabilityStats.personVariance.toFixed(3)}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Error Variance:</p>
                        <p className="font-medium">{reliabilityStats.errorVariance.toFixed(3)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-sm md:text-base mb-2">Wright Map (Person-Item Map)</h3>
                  <div className="h-80 md:h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid />
                        <XAxis 
                          type="number" 
                          dataKey="x" 
                          name="Domain" 
                          domain={[-0.5, 5.5]}
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
                          label={{ value: 'Logit Scale (Difficulty/Ability)', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
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
                        />
                        <Legend />
                        {wrightMapPersonData.map((entry, index) => (
                          <Scatter 
                            key={`person-${index}`}
                            name={entry.name} 
                            data={entry.data} 
                            fill="#3b82f6" 
                            shape="circle"
                          />
                        ))}
                        {wrightMapItemData.map((entry, index) => (
                          <Scatter 
                            key={`item-${index}`}
                            name={entry.name} 
                            data={entry.data} 
                            fill={`hsl(${index * 50}, 70%, 50%)`}
                            shape="diamond"
                          />
                        ))}
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="bg-slate-100 p-3 rounded-lg mt-4">
                    <p className="text-xs text-slate-700">
                      <span className="font-medium">How to read this chart: </span>
                      The Wright Map shows your overall ability (blue circle) in relation to the difficulty of each strand (diamonds). 
                      Items at the same level as your ability have a 50% probability of success. 
                      Items lower than your ability are easier for you, while those higher are more challenging.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-2 md:gap-4 p-4 md:p-6 bg-slate-50">
            <Button variant="outline" size="sm" className="text-xs md:text-sm" onClick={resetAssessment}>
              Retake Assessment
            </Button>
            <Button 
              onClick={() => window.print()} 
              className="bg-blue-600 hover:bg-blue-700 text-xs md:text-sm"
              size="sm"
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
    <div className="min-h-screen bg-slate-50">
      {currentPage === "landing" && renderLandingPage()}
      {currentPage === "assessment" && renderAssessmentPage()}
      {currentPage === "results" && renderResultsPage()}
    </div>
  );
};

export default PPSSHRaschAssessment;