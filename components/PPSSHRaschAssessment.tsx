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
  ZAxis,
  ComposedChart,
  Line,
  ReferenceLine,
  ReferenceArea,
  ErrorBar,
  Cell
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

/**
 * Enhanced Rasch Measurement Utilities for Polytomous Data (Rating Scale Model)
 * Implements proper psychometric calculations for 1-5 rating scale data
 */
const enhancedRaschUtils = {
  /**
   * Estimates person ability using Joint Maximum Likelihood Estimation (JMLE) approach
   * This is a simplified implementation that converges to a more accurate ability estimate
   * @param {Array} responses - Array of responses (1-5) for each item
   * @param {Array} itemDifficulties - Array of item difficulties in logits
   * @param {Number} maxIterations - Maximum number of iterations for convergence
   * @param {Number} convergenceCriterion - Difference threshold for convergence
   * @returns {Number} - Estimated person ability in logits
   */
  estimatePersonAbility: (responses, itemDifficulties, maxIterations = 30, convergenceCriterion = 0.001) => {
    // Initial ability estimate (use mean of item difficulties as starting point)
    let abilityEstimate = 0;
    let previousEstimate = 0;

    // Adjustment factor to avoid extreme values
    const adjustment = 0.3;

    // Calculate raw score and adjust for extremes (all min or all max)
    const rawScore = responses.reduce((sum, resp) => sum + resp, 0);
    const maxPossibleScore = responses.length * 5;

    // Check for extreme scores and apply adjustments
    if (rawScore === responses.length) { // All minimum scores
      return -4.0; // Return a very low ability estimate
    } else if (rawScore === maxPossibleScore) { // All maximum scores
      return 4.0; // Return a very high ability estimate
    }

    // Iterative estimation process
    for (let iter = 0; iter < maxIterations; iter++) {
      let numerator = 0;
      let denominator = 0;

      // Calculate expected score for each item based on current ability estimate
      for (let i = 0; i < responses.length; i++) {
        const observed = responses[i];
        const difficulty = itemDifficulties[i];

        // Calculate expected score using Rating Scale Model
        const expected = enhancedRaschUtils.calculateExpectedScore(abilityEstimate, difficulty);

        // Update numerator and denominator for Newton-Raphson iteration
        numerator += (observed - expected);

        // Calculate information (second derivative) for this item
        const itemInfo = enhancedRaschUtils.calculateItemInformation(abilityEstimate, difficulty);
        denominator += itemInfo;
      }

      // Apply Newton-Raphson update
      if (denominator !== 0) {
        previousEstimate = abilityEstimate;
        abilityEstimate += numerator / denominator;

        // Check for convergence
        if (Math.abs(abilityEstimate - previousEstimate) < convergenceCriterion) {
          break;
        }
      }
    }

    return abilityEstimate;
  },

  /**
   * Calculate probability of each category (1-5) using Rating Scale Model
   * @param {Number} personAbility - Person ability in logits
   * @param {Number} itemDifficulty - Item difficulty in logits
   * @returns {Array} - Array of probabilities for each category (0-4 index, representing 1-5 rating)
   */
  calculateCategoryProbabilities: (personAbility, itemDifficulty) => {
    // Thresholds between categories (in logits)
    // These would ideally come from proper calibration rather than being hardcoded
    const thresholds = [-2, -0.5, 0.5, 2]; // Thresholds between categories 1-2, 2-3, 3-4, 4-5

    // Calculate category measures
    const categoryMeasures = [];
    for (let k = 0; k < 5; k++) {
      let sum = 0;
      for (let j = 0; j < k; j++) {
        sum += (j < thresholds.length) ? thresholds[j] : 0;
      }
      categoryMeasures.push(sum);
    }

    // Calculate numerators for each category
    const numerators = [];
    for (let k = 0; k < 5; k++) {
      numerators.push(Math.exp(k * personAbility - itemDifficulty - categoryMeasures[k]));
    }

    // Calculate denominator (sum of all numerators)
    const denominator = numerators.reduce((sum, num) => sum + num, 0);

    // Calculate probabilities
    return numerators.map(num => num / denominator);
  },

  /**
   * Calculate expected score using Rating Scale Model
   * @param {Number} personAbility - Person ability in logits
   * @param {Number} itemDifficulty - Item difficulty in logits
   * @returns {Number} - Expected score (1-5 scale)
   */
  calculateExpectedScore: (personAbility, itemDifficulty) => {
    const probs = enhancedRaschUtils.calculateCategoryProbabilities(personAbility, itemDifficulty);

    // Calculate expected score by multiplying each category (1-5) by its probability
    let expectedScore = 0;
    for (let k = 0; k < probs.length; k++) {
      expectedScore += (k + 1) * probs[k];
    }

    return expectedScore;
  },

  /**
   * Calculate information function for Rating Scale Model
   * This measures precision at different ability levels
   * @param {Number} personAbility - Person ability in logits
   * @param {Number} itemDifficulty - Item difficulty in logits
   * @returns {Number} - Information value at this ability level for this item
   */
  calculateItemInformation: (personAbility, itemDifficulty) => {
    const probs = enhancedRaschUtils.calculateCategoryProbabilities(personAbility, itemDifficulty);

    // Calculate expected score
    let expectedScore = 0;
    for (let k = 0; k < probs.length; k++) {
      expectedScore += (k + 1) * probs[k];
    }

    // Calculate expected squared score
    let expectedSquaredScore = 0;
    for (let k = 0; k < probs.length; k++) {
      expectedSquaredScore += Math.pow(k + 1, 2) * probs[k];
    }

    // Information is variance of the conditional distribution
    return expectedSquaredScore - Math.pow(expectedScore, 2);
  },

  /**
   * Calculate Standard Error of Measurement (SEM) for polytomous data
   * @param {Number} personAbility - Person ability in logits
   * @param {Array} itemDifficulties - Array of item difficulties in logits
   * @returns {Number} - Standard error of measurement
   */
  calculateSEM: (personAbility, itemDifficulties) => {
    let totalInformation = 0;

    // Sum information across all items
    for (const difficulty of itemDifficulties) {
      totalInformation += enhancedRaschUtils.calculateItemInformation(personAbility, difficulty);
    }

    // SEM = 1/sqrt(Information)
    return totalInformation > 0 ? 1 / Math.sqrt(totalInformation) : 1;
  },

  /**
   * Calculate profile consistency index
   * This measures consistency of a person's responses across different domains
   * @param {Array} domainMeasures - Array of ability measures for each domain
   * @param {Array} domainSEMs - Array of SEMs for each domain measure
   * @returns {Number} - Profile consistency index (0-1)
   */
  calculateProfileConsistency: (domainMeasures, domainSEMs) => {
    if (domainMeasures.length < 2) {
      return 0;
    }

    // Calculate variance of domain measures for this person
    const meanMeasure = domainMeasures.reduce((sum, m) => sum + m, 0) / domainMeasures.length;
    const profileVariance = domainMeasures.reduce((sum, m) => sum + Math.pow(m - meanMeasure, 2), 0) / domainMeasures.length;

    // Calculate mean squared SEM across domains
    const meanErrorVariance = domainSEMs.reduce((sum, sem) => sum + Math.pow(sem, 2), 0) / domainSEMs.length;

    // Calculate profile reliability (similar formula to person reliability)
    // But interpretation is different - measures consistency of profile shape
    // Values near 0 suggest a flat profile (differences are just measurement error)
    // Values near 1 suggest a reliable pattern of strengths and weaknesses
    const reliability = Math.max(0, (profileVariance - meanErrorVariance) / profileVariance);

    // Handle cases where profileVariance is very small
    return isNaN(reliability) ? 0 : reliability;
  },

  /**
   * Determine career stage based on ability measure
   * @param {Number} abilityMeasure - Person ability in logits
   * @param {Object} stageThresholds - Object containing min/max thresholds for each stage
   * @returns {String} - Career stage identifier
   */
  determineCareerStage: (abilityMeasure, stageThresholds) => {
    let careerStage = "stage1";
    if (abilityMeasure >= stageThresholds.stage4.min) {
      careerStage = "stage4";
    } else if (abilityMeasure >= stageThresholds.stage3.min) {
      careerStage = "stage3";
    } else if (abilityMeasure >= stageThresholds.stage2.min) {
      careerStage = "stage2";
    }
    return careerStage;
  },

  /**
   * Calculate probability of being in a particular career stage
   * @param {Number} abilityMeasure - Person ability in logits
   * @param {Number} sem - Standard error of measurement
   * @param {Object} stageThresholds - Object with thresholds for each stage
   * @param {String} stage - Career stage to calculate probability for
   * @returns {Number} - Probability (0-1) of being in this career stage
   */
  calculateCareerStageProb: (abilityMeasure, sem, stageThresholds, stage) => {
    const normalCDF = (x) => {
      const t = 1 / (1 + 0.2316419 * Math.abs(x));
      const d = 0.3989423 * Math.exp(-x * x / 2);
      const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
      return x > 0 ? 1 - p : p;
    };

    // Calculate boundaries for this stage
    const lowerBound = stageThresholds[stage].min;
    let upperBound;

    if (stage === "stage1") {
      upperBound = stageThresholds.stage2.min;
    } else if (stage === "stage2") {
      upperBound = stageThresholds.stage3.min;
    } else if (stage === "stage3") {
      upperBound = stageThresholds.stage4.min;
    } else {
      // For stage4, upperBound is effectively infinity
      upperBound = 10; // A sufficiently large number
    }

    // Calculate probability using normal distribution with mean=abilityMeasure and sd=sem
    const lowerProb = normalCDF((lowerBound - abilityMeasure) / sem);
    const upperProb = normalCDF((upperBound - abilityMeasure) / sem);

    // Probability is the area between lower and upper bounds
    return upperProb - lowerProb;
  },

  /**
   * Generate Wright Map data for visualization
   * @param {Array} personMeasures - Array of person ability measures
   * @param {Array} itemDifficulties - Array of objects with item properties
   * @returns {Array} - Data points for Wright Map
   */
  generateWrightMapData: (personMeasures, itemDifficulties) => {
    // Format person data points
    const personData = personMeasures.map((measure, index) => ({
      id: `person${index}`,
      x: 0,
      y: measure,
      type: 'person'
    }));

    // Format item data points
    const itemData = itemDifficulties.map((item, index) => ({
      id: item.id,
      x: 1,
      y: item.difficulty,
      name: item.name,
      domain: item.domain,
      type: 'item'
    }));

    return [...personData, ...itemData];
  },

  /**
   * Generate probability curves data for visualization
   * @param {Number} itemDifficulty - Item difficulty in logits
   * @returns {Array} - Data points for category probability curves
   */
  generateProbabilityCurvesData: (itemDifficulty) => {
    const data = [];
    // Create an array of ability points from -3 to +3 logits
    for (let ability = -3; ability <= 3; ability += 0.2) {
      const point = {
        ability: parseFloat(ability.toFixed(1)),
        item: itemDifficulty
      };

      // Calculate probabilities for each category at this ability level
      const probs = enhancedRaschUtils.calculateCategoryProbabilities(ability, itemDifficulty);

      // Add category probabilities to the data point
      probs.forEach((prob, index) => {
        point[`cat${index + 1}`] = parseFloat(prob.toFixed(3));
      });

      data.push(point);
    }
    return data;
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
  const [activeResultTab, setActiveResultTab] = useState("overview");
  const [selectedStrand, setSelectedStrand] = useState(null);

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

  // Calculate results using enhanced Rasch model
  const calculateResults = () => {
    // Calculate results for each domain using the enhanced Rasch utilities
    const domainResults = domains.map(domain => {
      // Get responses for this domain's strands
      const strandResponses = domain.strands.map(strand =>
        answers[strand.id] || 0
      );

      // Get strand difficulties for this domain
      const strandDifficulties = domain.strands.map(strand => strand.difficulty);

      // Calculate person ability using enhanced estimation (JMLE)
      const logitMeasure = enhancedRaschUtils.estimatePersonAbility(
        strandResponses,
        strandDifficulties
      );

      // Calculate SEM with proper information function for polytomous data
      const sem = enhancedRaschUtils.calculateSEM(
        logitMeasure,
        strandDifficulties
      );

      // Calculate confidence interval (95%)
      const confidenceInterval = {
        lower: logitMeasure - 1.96 * sem,
        upper: logitMeasure + 1.96 * sem
      };

      // Calculate individual strand measures and probabilities using proper RSM
      const strandDetails = domain.strands.map((strand, index) => {
        const score = strandResponses[index];

        // Calculate expected score using proper Rating Scale Model
        const expectedScore = enhancedRaschUtils.calculateExpectedScore(
          logitMeasure,
          strand.difficulty
        );

        // Calculate category probabilities
        const categoryProbs = enhancedRaschUtils.calculateCategoryProbabilities(
          logitMeasure,
          strand.difficulty
        );

        // Calculate probability of success (observed score or higher)
        const probOfSuccess = categoryProbs
          .slice(Math.max(0, score - 1))
          .reduce((sum, p) => sum + p, 0);

        return {
          strandId: strand.id,
          strandName: strand.name,
          score: score,
          difficulty: strand.difficulty,
          probability: probOfSuccess,
          expectedScore: expectedScore,
          categoryProbabilities: categoryProbs
        };
      });

      // Calculate raw score (for user-friendly display)
      const rawScore = strandResponses.reduce((a, b) => a + b, 0);
      const maxPossibleScore = domain.strands.length * 5;

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

    // Extract domain measures and SEMs for reliability calculations
    const domainMeasures = domainResults.map(d => d.logitMeasure);
    const domainSEMs = domainResults.map(d => d.standardError);

    // Calculate overall person ability (average of domain measures)
    const overallLogitMeasure = domainMeasures.reduce((acc, m) => acc + m, 0) / domainMeasures.length;

    // Calculate overall SEM using proper formula for all items collectively
    const overallSEM = enhancedRaschUtils.calculateSEM(
      overallLogitMeasure,
      domains.flatMap(domain => domain.strands.map(strand => strand.difficulty))
    );

    // Calculate profile consistency index (renamed from previous "reliability")
    const profileConsistency = enhancedRaschUtils.calculateProfileConsistency(
      domainMeasures,
      domainSEMs
    );

    // Determine career stage based on overall logit measure
    const careerStage = enhancedRaschUtils.determineCareerStage(
      overallLogitMeasure,
      stageThresholds
    );

    // Calculate probability of being in this career stage
    const careerStageProb = enhancedRaschUtils.calculateCareerStageProb(
      overallLogitMeasure,
      overallSEM,
      stageThresholds,
      careerStage
    );

    // Prepare Wright Map data for visualization
    const allStrands = domains.flatMap(domain =>
      domain.strands.map(strand => ({
        id: strand.id,
        name: strand.name,
        difficulty: strand.difficulty,
        domain: domain.name
      }))
    );

    const wrightMapData = enhancedRaschUtils.generateWrightMapData(
      [overallLogitMeasure],
      allStrands
    );

    // Set results
    setResults({
      domainResults,
      overallLogitMeasure,
      overallSEM,
      careerStage,
      careerStageProb
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
      profileConsistency: profileConsistency,
      personVariance: domainMeasures.reduce((sum, m) => {
        const mean = domainMeasures.reduce((a, b) => a + b, 0) / domainMeasures.length;
        return sum + Math.pow(m - mean, 2);
      }, 0) / domainMeasures.length,
      errorVariance: domainSEMs.reduce((sum, sem) => sum + Math.pow(sem, 2), 0) / domainSEMs.length,
      separationIndex: Math.sqrt(profileConsistency / (1 - profileConsistency)),
      overallSEM: overallSEM
    });

    setCurrentPage("results");
  };

  // Generate recommendations based on enhanced Rasch analysis
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
          difficulty: strand.difficulty.toFixed(2),
          expectedScore: strand.expectedScore.toFixed(2),
          actualScore: strand.score
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
    setActiveResultTab("overview");
    setSelectedStrand(null);
    setCurrentPage("assessment");
  };

  // Render landing page
  const renderLandingPage = () => (
    <div className="flex flex-col items-center p-4 sm:p-6 mx-auto max-w-3xl">
      <Card className="w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <CardHeader className="bg-yellow-400 text-black border-b-4 border-black p-6">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-2xl sm:text-3xl font-black leading-tight">Philippine Professional Standards for School Heads (PPSSH)</CardTitle>
            <CardDescription className="text-black font-medium text-base">Leadership Assessment Tool for Aspiring School Heads</CardDescription>
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
                This assessment tool applies rigorous Rating Scale Model (RSM) psychometrics to evaluate your leadership competencies based on the Philippine Professional Standards for School Heads (PPSSH).
              </p>
            </div>

            <div className="border-4 border-black bg-pink-300 p-4 rounded-md mb-6">
              <div className="flex gap-3 items-start">
                <Info className="h-6 w-6 flex-shrink-0 mt-1" strokeWidth={2.5} />
                <div>
                  <h3 className="text-lg font-black mb-1 text-black">Enhanced with Advanced Psychometrics</h3>
                  <p className="text-black font-medium">
                    This assessment uses sophisticated psychometric algorithms based on the Rating Scale Model to provide precise estimates of your abilities across the PPSSH domains, with confidence intervals and probability-based feedback.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black mb-3 inline-block bg-green-300 px-3 py-1 -rotate-1 border-2 border-black">The Five Domains of PPSSH:</h3>
              <ul className="space-y-4 mb-6">
                {domains.map((domain, index) => (
                  <li key={domain.id} className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-md border-2 border-black flex items-center justify-center text-lg font-black ${['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400'][index]
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
                  <span>Polytomous Rasch measurement</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                  <span>Targeted recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                  <span>Advanced psychometric visualizations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                  <span>Enhanced statistical precision</span>
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
              Rate yourself on each indicator based on your current knowledge and practice. Be honest and reflective. Your responses will help identify your strengths and areas for growth.
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
                  <h2 className={`text-xl font-black mb-2 inline-block px-3 py-1 ${['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400'][domainIndex]
                    } -rotate-1 border-2 border-black`}>
                    {domain.name}
                  </h2>
                  <p className="text-sm font-medium">{domain.description}</p>
                </div>

                <div className="p-5 space-y-5">
                  {domain.strands.map((strand, strandIndex) => (
                    <div
                      key={strand.id}
                      className={`rounded-md border-3 border-black p-4 ${['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100'][strandIndex % 5]
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

  // Render category probability curves
  const renderCategoryProbabilityCurves = (strandId, strandName, difficulty) => {
    // Generate probability data across ability range
    const data = enhancedRaschUtils.generateProbabilityCurvesData(difficulty);

    // Colors for each category
    const categoryColors = ['#FF5252', '#FFAB40', '#FFEB3B', '#66BB6A', '#1E88E5'];

    return (
      <Card className="border-3 border-black p-4 rounded-md bg-white">
        <CardHeader className="p-3">
          <CardTitle className="text-base font-bold">{strandName} Probability Curves</CardTitle>
          <CardDescription className="text-xs">
            Difficulty: {difficulty.toFixed(2)} logits
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="ability"
                  label={{
                    value: 'Ability (logits)',
                    position: 'bottom',
                    style: { fontSize: '10px' }
                  }}
                />
                <YAxis
                  label={{
                    value: 'Probability',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: '10px' }
                  }}
                />
                <RechartsTooltip
                  formatter={(value, name) => {
                    if (name.startsWith('cat')) {
                      return [`${(value * 100).toFixed(1)}%`, `Rating ${name.replace('cat', '')}`];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                {[1, 2, 3, 4, 5].map(cat => (
                  <Line
                    key={`cat${cat}`}
                    type="monotone"
                    dataKey={`cat${cat}`}
                    name={`Rating ${cat}`}
                    stroke={categoryColors[cat - 1]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
                {/* Reference line at item difficulty */}
                <ReferenceLine y={0.5} label="50% probability" stroke="gray" strokeDasharray="3 3" />
                <ReferenceLine x={difficulty} label={`Item Difficulty (${difficulty.toFixed(2)})`} stroke="black" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs font-medium">
            <p>These curves show the probability of each rating (1-5) at different ability levels.</p>
            <p className="mt-1">The curves cross near the item difficulty, where adjacent categories are equally likely.</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render enhanced Wright Map
  const renderEnhancedWrightMap = () => {
    if (!raschMeasures || !results) return null;

    const personMeasure = results.overallLogitMeasure;
    const domainItems = domains.flatMap(domain =>
      domain.strands.map(strand => ({
        id: strand.id,
        name: strand.name,
        difficulty: strand.difficulty,
        domain: domain.name.split(' ')[0]
      }))
    );

    // Format data for scatterplot
    const personPoint = {
      id: 'person',
      x: 0,
      y: personMeasure,
      name: 'Your Ability',
      type: 'person'
    };

    // Domain points (group items by domain)
    const domainPoints = domainItems.map((item, index) => ({
      id: item.id,
      x: Math.floor(index / 5) + 1, // Position each domain in a separate column
      y: item.difficulty,
      name: item.name,
      domain: item.domain,
      type: 'item'
    }));

    const data = [personPoint, ...domainPoints];

    // Separate person and item data for different scatter series
    const personData = [personPoint];
    const itemData = domainPoints;

    // Group items by domain for color-coding
    const uniqueDomains = [...new Set(itemData.map(item => item.domain))];
    const domainColors = ['#f44336', '#2196f3', '#4caf50', '#9c27b0', '#ff9800'];

    // Career stage boundary data
    const stageAreas = [
      { name: 'Stage 1', y1: stageThresholds.stage1.min, y2: stageThresholds.stage2.min, fill: '#FFCDD2' },
      { name: 'Stage 2', y1: stageThresholds.stage2.min, y2: stageThresholds.stage3.min, fill: '#C8E6C9' },
      { name: 'Stage 3', y1: stageThresholds.stage3.min, y2: stageThresholds.stage4.min, fill: '#BBDEFB' },
      { name: 'Stage 4', y1: stageThresholds.stage4.min, y2: 3, fill: '#D1C4E9' },
    ];

    return (
      <Card className="border-3 border-black p-4 rounded-md bg-white">
        <CardHeader className="p-3">
          <CardTitle className="text-base font-bold">Enhanced Wright Map</CardTitle>
          <CardDescription className="text-xs">
            Person ability and item difficulties on the same scale
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
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
                  domain={[-3, 3]}
                  label={{
                    value: 'Ability/Difficulty (Logits)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: '12px' }
                  }}
                />

                {/* Career stage background areas */}
                {stageAreas.map((stage, index) => (
                  <ReferenceArea
                    key={`stage-${index}`}
                    y1={stage.y1}
                    y2={stage.y2}
                    fill={stage.fill}
                    fillOpacity={0.3}
                    label={{
                      value: stage.name,
                      position: 'insideRight',
                      fontSize: 10,
                      fill: '#333'
                    }}
                  />
                ))}

                <ZAxis range={[60, 60]} />
                <RechartsTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name, props) => {
                    if (props.payload.name) {
                      return [props.payload.name, props.payload.domain || "Your Ability"];
                    }
                    return [value, name];
                  }}
                />
                <Legend />

                {/* Person scatter */}
                <Scatter
                  name="Your Ability"
                  data={personData}
                  fill="#000"
                  shape="circle"
                  legendType="circle"
                >
                  {personData.map((entry, index) => (
                    <Cell
                      key={`person-${index}`}
                      fill="#000"
                      stroke="#000"
                      strokeWidth={2}
                    />
                  ))}
                </Scatter>

                {/* Domain-specific scatters */}
                {uniqueDomains.map((domain, domainIndex) => {
                  const domainData = itemData.filter(item => item.domain === domain);
                  return (
                    <Scatter
                      key={`domain-${domainIndex}`}
                      name={domain}
                      data={domainData}
                      shape="diamond"
                      legendType="diamond"
                    >
                      {domainData.map((entry, index) => (
                        <Cell
                          key={`item-${domainIndex}-${index}`}
                          fill={domainColors[domainIndex % domainColors.length]}
                          stroke="#000"
                          strokeWidth={1}
                        />
                      ))}
                    </Scatter>
                  );
                })}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs font-medium">
            <p>This Wright Map shows your ability (black circle) compared to strand difficulties (colored diamonds).</p>
            <p className="mt-1">When your ability equals an item's difficulty, you have a 50% probability of scoring above the middle category on that item.</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render domain measures with error bars - completely rewritten to avoid ErrorBar component
  const renderDomainMeasuresWithErrors = () => {
    if (!raschMeasures || !results) return null;

    // Format data to explicitly include confidence intervals as separate data points
    const domainNames = raschMeasures.domainMeasures.map(domain => domain.name.split(' ')[0]);

    // Create a separate data structure for the bar chart
    const barData = raschMeasures.domainMeasures.map((domain, index) => ({
      name: domain.name.split(' ')[0],
      logit: parseFloat(domain.logit.toFixed(2))
    }));

    // Create separate data arrays for the error bars to avoid key conflicts
    const errorLineData = [];
    const errorCapData = [];

    raschMeasures.domainMeasures.forEach((domain, index) => {
      // Vertical error line (from lower to upper CI)
      errorLineData.push({
        id: `error-line-${index}`,
        dataKey: "errorLine",
        data: [
          { x: index, y: parseFloat(domain.ciLower.toFixed(2)) },
          { x: index, y: parseFloat(domain.ciUpper.toFixed(2)) }
        ]
      });

      // Top cap of error bar
      errorCapData.push({
        id: `error-cap-top-${index}`,
        dataKey: "errorCapTop",
        data: [
          { x: index - 0.15, y: parseFloat(domain.ciUpper.toFixed(2)) },
          { x: index + 0.15, y: parseFloat(domain.ciUpper.toFixed(2)) }
        ]
      });

      // Bottom cap of error bar
      errorCapData.push({
        id: `error-cap-bottom-${index}`,
        dataKey: "errorCapBottom",
        data: [
          { x: index - 0.15, y: parseFloat(domain.ciLower.toFixed(2)) },
          { x: index + 0.15, y: parseFloat(domain.ciLower.toFixed(2)) }
        ]
      });
    });

    return (
      <Card className="border-3 border-black p-4 rounded-md bg-white">
        <CardHeader className="p-3">
          <CardTitle className="text-base font-bold">Domain Measures with Confidence Intervals</CardTitle>
          <CardDescription className="text-xs">
            95% confidence intervals show measurement precision
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={barData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  type="category"
                  interval={0}
                />
                <YAxis
                  domain={[-3, 3]}
                  label={{
                    value: 'Logit Measure',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: '12px' }
                  }}
                />
                <RechartsTooltip
                  formatter={(value, name, props) => {
                    if (name === 'logit') return [`${value} logits`, 'Measure'];
                    return [value, name];
                  }}
                />
                <Legend />

                {/* Bar chart for logit measures */}
                <Bar
                  dataKey="logit"
                  fill="#2563eb"
                  name="Domain Measure"
                  stroke="#000"
                  strokeWidth={1}
                />

                {/* Custom error lines (vertical part of error bars) */}
                {errorLineData.map((lineData, index) => (
                  <Line
                    key={`line-${lineData.id}`}
                    data={lineData.data}
                    type="linear"
                    dataKey="y"
                    xAxis={<XAxis type="number" dataKey="x" />}
                    yAxis={<YAxis type="number" dataKey="y" />}
                    dot={false}
                    activeDot={false}
                    stroke="#000"
                    strokeWidth={2}
                    isAnimationActive={false}
                    legendType="none"
                  />
                ))}

                {/* Custom error caps (horizontal parts at top and bottom of error bars) */}
                {errorCapData.map((capData, index) => (
                  <Line
                    key={`cap-${capData.id}`}
                    data={capData.data}
                    type="linear"
                    dataKey="y"
                    xAxis={<XAxis type="number" dataKey="x" />}
                    yAxis={<YAxis type="number" dataKey="y" />}
                    dot={false}
                    activeDot={false}
                    stroke="#000"
                    strokeWidth={2}
                    isAnimationActive={false}
                    legendType="none"
                  />
                ))}

                {/* Reference line for overall ability */}
                <ReferenceLine
                  y={results.overallLogitMeasure}
                  label={`Overall (${results.overallLogitMeasure.toFixed(2)})`}
                  stroke="#ff0000"
                  strokeDasharray="3 3"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs font-medium">
            <p>Error bars show 95% confidence intervals for each domain measure.</p>
            <p className="mt-1">Overlapping intervals indicate domains that may not be statistically different.</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render strand-level expected vs observed scores
  const renderStrandPerformanceAnalysis = (domainResult) => {
    if (!domainResult) return null;

    // Prepare data for visualization
    const data = domainResult.strandDetails.map(strand => ({
      name: strand.strandName.split(' ')[0],
      observed: strand.score,
      expected: parseFloat(strand.expectedScore.toFixed(2)),
      difficulty: parseFloat(strand.difficulty.toFixed(2))
    }));

    // Sort by difficulty for better visualization
    data.sort((a, b) => a.difficulty - b.difficulty);

    return (
      <Card className="border-3 border-black p-4 rounded-md bg-white">
        <CardHeader className="p-3">
          <CardTitle className="text-base font-bold">{domainResult.domainName}: Expected vs Observed</CardTitle>
          <CardDescription className="text-xs">
            Comparison of your ratings with model predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={50}
                  interval={0}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                />
                <RechartsTooltip
                  formatter={(value, name, props) => {
                    if (name === 'observed') return [value, 'Your Rating'];
                    if (name === 'expected') return [value.toFixed(2), 'Expected Rating'];
                    if (name === 'difficulty') return [value, 'Difficulty (logits)'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar
                  dataKey="observed"
                  fill="#8884d8"
                  name="Observed Score"
                />
                <Line
                  type="monotone"
                  dataKey="expected"
                  stroke="#ff7300"
                  name="Expected Score"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs font-medium">
            <p>This chart compares your actual ratings (bars) with ratings predicted by the Rasch model (line).</p>
            <p className="mt-1">Large differences may indicate unexpected response patterns or misfit.</p>
          </div>
        </CardContent>
      </Card>
    );
  };

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
                  Based on Rating Scale Model analysis across all five domains
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
                    <p className="text-xs font-bold mb-1">Profile Consistency:</p>
                    <p className="font-black text-lg">{(reliabilityStats.profileConsistency * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-white border-3 border-black p-3 rounded-md -rotate-1">
                    <p className="text-xs font-bold mb-1">Stage Probability:</p>
                    <p className="font-black text-lg">{(results.careerStageProb * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" value={activeResultTab} onValueChange={setActiveResultTab} className="w-full">
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
                  value="advanced"
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
                              <div className="flex items-center justify-between text-xs mb-2">
                                <span>Your Rating: <strong>{strand.actualScore}</strong></span>
                                <span>Expected: <strong>{strand.expectedScore}</strong></span>
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
                    {renderDomainMeasuresWithErrors()}
                  </div>

                  <div className="space-y-4 mt-6">
                    {results.domainResults.map((domain, idx) => (
                      <div
                        key={domain.domainId}
                        className={`border-3 border-black p-4 rounded-md ${['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100'][idx % 5]
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
                            style={{ width: `${((domain.logitMeasure + 3) / 6) * 100}%` }}
                          ></div>
                        </div>

                        <p className="text-xs font-medium mb-4">
                          95% Confidence Interval: {domain.confidenceInterval.lower.toFixed(2)} to {domain.confidenceInterval.upper.toFixed(2)} logits
                        </p>

                        {/* Strand performance analysis for this domain */}
                        {renderStrandPerformanceAnalysis(domain)}

                        <div className="space-y-3 mt-4 bg-white border-2 border-black p-3 rounded-md">
                          {domain.strandDetails.map((strand, strandIdx) => (
                            <div key={strandIdx} className={`border-b-2 border-black pb-2 ${strandIdx === domain.strandDetails.length - 1 ? 'border-b-0' : ''}`}>
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-bold cursor-pointer hover:text-blue-600"
                                  onClick={() => setSelectedStrand({
                                    id: strand.strandId,
                                    name: strand.strandName,
                                    difficulty: strand.difficulty
                                  })}>
                                  {strand.strandName}
                                </span>
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

              <TabsContent value="advanced" className="p-5">
                <div className="space-y-6">
                  <div className="bg-green-100 border-3 border-black p-4 rounded-md mb-4 rotate-1">
                    <h3 className="font-black text-lg mb-3">Psychometric Properties</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white border-2 border-black p-3 rounded-md -rotate-2">
                        <p className="text-xs font-bold">Profile Consistency:</p>
                        <p className="font-black text-lg">{(reliabilityStats.profileConsistency * 100).toFixed(1)}%</p>
                        <p className="text-xs mt-1">Measures how reliably your profile of strengths and weaknesses can be distinguished from measurement error.</p>
                      </div>
                      <div className="bg-white border-2 border-black p-3 rounded-md rotate-2">
                        <p className="text-xs font-bold">Separation Index:</p>
                        <p className="font-black text-lg">{reliabilityStats.separationIndex.toFixed(2)}</p>
                        <p className="text-xs mt-1">Number of statistically distinct ability levels that can be distinguished in your profile.</p>
                      </div>
                      <div className="bg-white border-2 border-black p-3 rounded-md rotate-1">
                        <p className="text-xs font-bold">Overall SEM:</p>
                        <p className="font-black text-lg">{results.overallSEM.toFixed(3)}</p>
                        <p className="text-xs mt-1">Standard Error of Measurement for your overall ability estimate.</p>
                      </div>
                      <div className="bg-white border-2 border-black p-3 rounded-md -rotate-1">
                        <p className="text-xs font-bold">Rating Scale Model:</p>
                        <p className="font-black text-lg">Polytomous RSM</p>
                        <p className="text-xs mt-1">Advanced psychometric model used for the 1-5 rating scale analysis.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black mb-3 inline-block bg-yellow-300 px-3 py-1 rotate-1 border-2 border-black">Item-Person Map</h3>
                    {renderEnhancedWrightMap()}
                  </div>

                  <div>
                    <h3 className="text-lg font-black mb-3 inline-block bg-blue-300 px-3 py-1 -rotate-1 border-2 border-black">
                      {selectedStrand ? `${selectedStrand.name} - Category Probabilities` : 'Select a strand to view category probabilities'}
                    </h3>
                    {selectedStrand ? (
                      renderCategoryProbabilityCurves(selectedStrand.id, selectedStrand.name, selectedStrand.difficulty)
                    ) : (
                      <div className="bg-gray-100 border-3 border-black p-4 rounded-md">
                        <p className="text-sm font-medium text-center">Click on any strand name in the "Domain Details" tab to view its category probability curves.</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-black text-white p-4 border-3 border-white rounded-md -rotate-1 mt-4">
                    <p className="text-sm font-medium">
                      <span className="font-black">About Rating Scale Model: </span>
                      This assessment uses the polytomous Rasch Rating Scale Model (RSM) to analyze your 1-5 ratings. This advanced psychometric model places both your ability and item difficulties on the same scale (logits), allowing for precise measurement and fair comparison across all domains.
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
                setActiveResultTab("overview");
                setSelectedStrand(null);
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