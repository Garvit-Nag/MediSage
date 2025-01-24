import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Activity, 
  ThumbsUp, 
  Stethoscope, 
  Heart, 
  Clock,
  Shield,
  BookOpen,
  Settings,
  Calendar,
  Printer,
  Eye,
  EyeOff
} from 'lucide-react';

// Keep your existing interfaces exactly as they are
interface BaseSymptomResponse {
  initial_assessment: {
    summary: string;
    primary_symptoms: string[];
    duration_analysis: string;
  };
  possible_conditions: {
    primary_possibilities: Array<{
      name: string;
      likelihood: string;
      description: string;
      typical_duration: string;
      complications: string[];
    }>;
    differential_diagnoses: string[];
  };
  severity_indicators: {
    current_level: string;
    explanation: string;
    warning_signs: string[];
    emergency_indicators: string[];
  };
  recommendations: {
    immediate_steps: string[];
    home_care: string[];
    medications: {
      over_the_counter: string[];
      precautions: string[];
    };
    lifestyle_changes: string[];
  };
  when_to_seek_care: {
    emergency_care: string[];
    urgent_care: string[];
    routine_care: string[];
  };
  prevention: {
    immediate_actions: string[];
    long_term_strategies: string[];
  };
  follow_up: {
    monitoring: string[];
    timeline: string;
    documentation: string[];
  };
  education: {
    condition_info: string[];
    myths_facts: string[];
    additional_resources: string[];
  };
  disclaimers: {
    medical_advice: string;
    limitations: string[];
    emergency_notice: string;
  };
}

interface BodySymptomResponse {
  symptom_analysis: {
    locations: Array<{
      area: string;
      involved_structures: string[];
      radiation_patterns: string[];
      specific_symptoms: string[];
    }>;
    characteristics: {
      primary_symptoms: string[];
      quality: string[];
      severity: string;
      pattern: string;
      aggravating_factors: string[];
      relieving_factors: string[];
    };
  };
  clinical_considerations: {
    possible_conditions: Array<{
      name: string;
      likelihood: string;
      description: string;
      typical_progression: string;
      affected_areas: string[];
    }>;
    risk_factors: string[];
    red_flags: string[];
  };
  diagnostic_approach: {
    key_questions: Array<{
      question: string;
      reason: string;
      significance: string;
    }>;
    physical_findings: string[];
    suggested_monitoring: string[];
  };
  management_recommendations: {
    immediate_care: {
      actions: string[];
      restrictions: string[];
      positioning: string;
    };
    pain_management: {
      medications: string[];
      physical_measures: string[];
      precautions: string[];
    };
    activity_modification: {
      restricted_activities: string[];
      permitted_activities: string[];
      gradual_progression: string;
    };
  };
  care_guidance: {
    self_care: string[];
    medical_care: {
      when_to_seek: string[];
      type_of_care: string;
      urgency: string;
    };
  };
  prevention_education: {
    recurrence_prevention: string[];
    lifestyle_modifications: string[];
    ergonomic_advice: string[];
  };
  prognosis: {
    expected_course: string;
    recovery_timeline: string;
    complications: string[];
  };
  disclaimers: {
    medical_advice: string;
    limitations: string[];
    emergency_notice: string;
  };
}

interface MedicalReportProps {
  data: BaseSymptomResponse | BodySymptomResponse;
  type: 'traditional' | 'body-based';
  loading?: boolean;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'warning' | 'gradient';
  collapsible?: boolean;
}

const Section: React.FC<SectionProps> = ({ 
  title, 
  icon, 
  children, 
  variant = 'default',
  collapsible = false 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsWideScreen(window.innerWidth > 768);
    };

    // Check initial screen size
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const baseClasses = "p-4 md:p-6 rounded-lg shadow-lg transition-all duration-300";
  const shouldShowCollapseButton = collapsible && isWideScreen;
  const variantClasses = {
    default: "bg-white border border-[#14B8A6]/20 hover:border-[#14B8A6]/40",
    warning: "bg-red-50 border border-red-200 hover:bg-red-100",
    gradient: "bg-gradient-to-r from-[#14B8A6]/10 to-transparent"
  };

  const buttonId = `section-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const contentId = `content-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-[#14B8A6]">{icon}</span>
          <h2 className="text-xl font-bold text-[#1E293B]">{title}</h2>
        </div>
        {shouldShowCollapseButton && (
          <button
            id={buttonId}
            aria-expanded={!isCollapsed}
            aria-controls={contentId}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isCollapsed ? "Expand section" : "Collapse section"}
          >
            {isCollapsed ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        )}
      </div>
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        className={`transition-all duration-300 ${isCollapsed ? 'h-0 overflow-hidden' : 'h-auto'}`}
      >
        {children}
      </div>
    </div>
  );
};

const SeverityIndicator: React.FC<{ level: string }> = ({ level }) => {
  const colors = {
    Low: "bg-green-100 text-green-800",
    Moderate: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800",
    Severe: "bg-red-200 text-red-900"
  };

  const severityColor = colors[level as keyof typeof colors] || colors.Low;

  return (
    <div className={`px-4 py-2 rounded-full font-medium ${severityColor}`}>
      {level}
    </div>
  );
};

const SkeletonLoader: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
      <div className="h-8 bg-gray-200 rounded-lg w-5/6"></div>
      <div className="h-8 bg-gray-200 rounded-lg w-4/6"></div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-32 bg-gray-200 rounded-lg"></div>
      <div className="h-32 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="h-40 bg-gray-200 rounded-lg"></div>
  </div>
);

const MedicalReport: React.FC<MedicalReportProps> = ({ data, type, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const totalPages = type === 'traditional' ? 4 : 3;

  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-[210mm] mx-auto bg-white rounded-xl shadow-xl p-8">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  const renderTraditionalContent = (pageNum: number) => {
    const traditionalData = data as BaseSymptomResponse;
    
    if (pageNum === 1) {
      return (
        <div className="space-y-6">
          {/* Emergency Warning Banner - Always visible on first page */}
          {traditionalData.severity_indicators.emergency_indicators.length > 0 && (
            <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg animate-pulse print:bg-red-600 !print:bg-red-600 print:text-white print:animate-none">
                <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-6 w-6 flex-shrink-0" />
                <h2 className="text-lg font-bold">Emergency Warning Signs</h2>
                </div>
                <ul className="list-disc pl-6">
                {traditionalData.severity_indicators.emergency_indicators.map((indicator, idx) => (
                    <li key={idx}>{indicator}</li>
                ))}
                </ul>
            </div>
            )}

<Section 
  title="Initial Assessment" 
  icon={<Stethoscope className="h-6 w-6" />}
  variant="gradient"
  collapsible
>
  <p className="text-gray-700 mb-4">{traditionalData.initial_assessment.summary}</p>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="min-w-0">
      <h3 className="font-medium text-[#1E293B] mb-2">Primary Symptoms</h3>
      <ul className="space-y-2">
        {traditionalData.initial_assessment.primary_symptoms.map((symptom, idx) => (
          <li key={idx} className="flex items-center gap-2 text-gray-600">
            <Activity className="h-4 w-4 text-[#14B8A6] flex-shrink-0" />
            <span className="min-w-0 break-words">{symptom}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="min-w-0">
      <h3 className="font-medium text-[#1E293B] mb-2">Duration Analysis</h3>
      <div className="flex items-center gap-2 text-gray-600">
        <Clock className="h-4 w-4 text-[#14B8A6] flex-shrink-0" />
        <span className="min-w-0 break-words">{traditionalData.initial_assessment.duration_analysis}</span>
      </div>
    </div>
  </div>
</Section>

          <Section 
            title="Severity Assessment"
            icon={<AlertTriangle className="h-6 w-6 flex-shrink-0" />}
            variant="default"
            collapsible
          >
            <div className="mb-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-sm font-medium text-gray-600">Current Level:</span>
                <SeverityIndicator level={traditionalData.severity_indicators.current_level} />
              </div>
              <p className="text-gray-600">{traditionalData.severity_indicators.explanation}</p>
            </div>
            
            {/* Severity Meter */}
<div className="mt-6 p-4 bg-gray-50 rounded-lg">
  <div className="space-y-3">
    <div className="flex justify-between text-sm text-gray-600 px-1">
      <span>Low</span>
      <span>Moderate</span>
      <span>High</span>
      <span>Severe</span>
    </div>
    <div className="relative h-2 bg-gray-200 rounded-full">
      {/* Bar Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 rounded-full opacity-20" />
      {/* Active Progress Bar */}
      <div 
        className="absolute h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full transition-all duration-300"
        style={{
          width: (() => {
            const level = traditionalData.severity_indicators.current_level.toLowerCase();
            if (level.includes('mild') && level.includes('moderate')) {
              return '35%';  // Position between Low and Moderate
            } else {
              switch(level) {
                case 'low': return '25%';
                case 'moderate': return '50%';
                case 'high': return '75%';
                case 'severe': return '100%';
                default: return '35%';  // Default for "Mild to Moderate"
              }
            }
          })()
        }}
      />
      {/* Current Position Marker */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-teal-600 rounded-full shadow-md transition-all duration-300"
        style={{
          left: (() => {
            const level = traditionalData.severity_indicators.current_level.toLowerCase();
            if (level.includes('mild') && level.includes('moderate')) {
              return 'calc(35% - 6px)';  // Center the marker on the current position
            } else {
              switch(level) {
                case 'low': return 'calc(25% - 6px)';
                case 'moderate': return 'calc(50% - 6px)';
                case 'high': return 'calc(75% - 6px)';
                case 'severe': return 'calc(100% - 6px)';
                default: return 'calc(35% - 6px)';  // Default for "Mild to Moderate"
              }
            }
          })()
        }}
      />
    </div>
    <div className="flex justify-end">
      <span className="text-sm font-medium text-gray-700">
        Current Level: {traditionalData.severity_indicators.current_level}
      </span>
    </div>
  </div>
</div>
          </Section>
        </div>
      );
    }

    if (pageNum === 2) {
        return (
          <div className="space-y-6">
            <Section 
              title="Possible Conditions" 
              icon={<Activity className="h-6 w-6" />}
              variant="default"
              collapsible
            >
              <div className="space-y-4">
                {traditionalData.possible_conditions.primary_possibilities.map((condition, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors shadow-md"
                    tabIndex={0}
                    role="article"
                    aria-label={`Condition: ${condition.name}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-[#1E293B] break-words hyphens-auto">{condition.name}</h3>
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-medium bg-[#14B8A6]/10 text-[#14B8A6]"
                        role="status"
                        aria-label={`Likelihood: ${condition.likelihood}`}
                      >
                        {condition.likelihood}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{condition.description}</p>
                    <div className="text-sm">
                      <span className="font-medium text-[#1E293B]">Typical Duration: </span>
                      <span className="text-gray-600">{condition.typical_duration}</span>
                    </div>
                    
                    {/* Complications Section */}
                    {condition.complications.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-[#1E293B] mb-2">Potential Complications:</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {condition.complications.map((complication, idx) => (
                            <li 
                              key={idx}
                              className="flex items-center gap-2 text-gray-600 text-sm"
                            >
                              <AlertTriangle className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                              {complication}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* Differential Diagnoses */}
              {traditionalData.possible_conditions.differential_diagnoses.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
                  <h3 className="font-medium text-[#1E293B] mb-3">Other Considerations</h3>
                  <div className="flex flex-wrap gap-2">
                    {traditionalData.possible_conditions.differential_diagnoses.map((diagnosis, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm"
                      >
                        {diagnosis}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Section>
          </div>
        );
      }
      
      if (pageNum === 3) {
        return (
          <div className="space-y-6">
            <Section 
  title="Recommendations" 
  icon={<Heart className="h-6 w-6 flex-shrink-0" />}
  variant="default"
  collapsible
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="min-w-0">
      <h3 className="font-medium text-[#1E293B] mb-2">Immediate Steps</h3>
      <ul className="space-y-2">
        {traditionalData.recommendations.immediate_steps.map((step, idx) => (
          <li 
            key={idx} 
            className="flex items-center gap-2 text-gray-600 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ThumbsUp className="h-4 w-4 text-[#14B8A6] flex-shrink-0" />
            <span className="min-w-0 break-words">{step}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="min-w-0">
      <h3 className="font-medium text-[#1E293B] mb-2">Home Care</h3>
      <ul className="space-y-2">
        {traditionalData.recommendations.home_care.map((care, idx) => (
          <li 
            key={idx} 
            className="flex items-center gap-2 text-gray-600 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Heart className="h-4 w-4 text-[#14B8A6] flex-shrink-0" />
            <span className="min-w-0 break-words">{care}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
              

              {/* Medications Section */}
            {traditionalData.recommendations.medications.over_the_counter.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
                <h3 className="font-medium text-[#1E293B] mb-3">Medications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="min-w-0">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Over the Counter</h4>
                    <ul className="space-y-2">
                    {traditionalData.recommendations.medications.over_the_counter.map((med, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <Shield className="h-4 w-4 text-[#14B8A6] flex-shrink-0" />
                        <span className="min-w-0 break-words">{med}</span>
                        </li>
                    ))}
                    </ul>
                </div>
                <div className="min-w-0">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Precautions</h4>
                    <ul className="space-y-2">
                    {traditionalData.recommendations.medications.precautions.map((precaution, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        <span className="min-w-0 break-words">{precaution}</span>
                        </li>
                    ))}
                    </ul>
                </div>
                </div>
            </div>
            )}
            </Section>
  
            <Section 
              title="Warning Signs" 
              icon={<AlertTriangle className="h-6 w-6 flex-shrink-0" />}
              variant="warning"
            >
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {traditionalData.severity_indicators.warning_signs.map((sign, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-center gap-2 text-red-600 p-2 bg-white/50 rounded-lg shadow-sm"
                  >
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    {sign}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        );
      }
      
      if (pageNum === 4) {
        return (
          <div className="space-y-6">
            <Section 
                title="Follow-up Plan" 
                icon={<Calendar className="h-6 w-6" />}
                variant="default"
                collapsible
                >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="min-w-0">
                    <h3 className="font-medium text-[#1E293B] mb-2">Monitoring</h3>
                    <ul className="space-y-2">
                        {traditionalData.follow_up.monitoring.map((item, idx) => (
                        <li 
                            key={idx} 
                            className="flex items-center gap-2 text-gray-600 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Activity className="h-4 w-4 text-[#14B8A6] flex-shrink-0" />
                            <span className="min-w-0 break-words">{item}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                    <div className="min-w-0">
                    <h3 className="font-medium text-[#1E293B] mb-2">Documentation</h3>
                    <ul className="space-y-2">
                        {traditionalData.follow_up.documentation.map((doc, idx) => (
                        <li 
                            key={idx} 
                            className="flex items-center gap-2 text-gray-600 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <BookOpen className="h-4 w-4 text-[#14B8A6] flex-shrink-0" />
                            <span className="min-w-0 break-words">{doc}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{traditionalData.follow_up.timeline}</p>
                </div>
                </Section>
  
            <Section 
              title="Disclaimers" 
              icon={<Shield className="h-6 w-6 flex-shrink-0" />}
              variant="default"
            >
              <p className="text-gray-700 mb-4">{traditionalData.disclaimers.medical_advice}</p>
              <ul className="space-y-2">
                {traditionalData.disclaimers.limitations.map((limitation, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-center gap-2 text-gray-600 p-2 bg-gray-50 rounded-lg"
                  >
                    <Settings className="h-4 w-4 text-[#14B8A6] flex-shrink-0" />
                    {limitation}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        );
      }
    };

    const renderBodyBasedContent = (pageNum: number) => {
        const bodyData = data as BodySymptomResponse;
        
        if (pageNum === 1) {
          return (
            <div className="space-y-6">
              <Section 
                title="Location Analysis" 
                icon={<Stethoscope className="h-6 w-6" />}
                variant="gradient"
                collapsible
              >
                {bodyData.symptom_analysis.locations.map((location, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="mt-4 p-4 rounded-lg border border-[#14B8A6]/20 hover:border-[#14B8A6]/40 transition-all shadow-md"
                    role="region"
                    aria-label={`${location.area} Analysis`}
                  >
                    <h3 className="text-lg font-semibold text-[#1E293B] mb-3">{location.area}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-medium text-[#1E293B] mb-2">Involved Structures</h4>
                        <ul className="space-y-1">
                        {location.involved_structures.map((structure, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 p-1 rounded-md">
                            <Activity className="h-4 w-4 text-[#14B8A6]" />
                            {structure}
                            </li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-[#1E293B] mb-2">Specific Symptoms</h4>
                        <ul className="space-y-1">
                        {location.specific_symptoms.map((symptom, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 p-1 rounded-md">
                            <AlertTriangle className="h-4 w-4 text-[#14B8A6] flex-shrink-0" />
                            {symptom}
                            </li>
                        ))}
                        </ul>
                    </div>
                    </div>
                  </motion.div>
                ))}
              </Section>
    
              <Section 
                title="Symptom Characteristics" 
                icon={<Activity className="h-6 w-6" />}
                variant="default"
                collapsible
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-[#1E293B] mb-2">Primary Symptoms</h3>
                    <ul className="space-y-2">
                      {bodyData.symptom_analysis.characteristics.primary_symptoms.map((symptom, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                          <Activity className="h-4 w-4 text-[#14B8A6]" />
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1E293B] mb-2">Severity & Pattern</h3>
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-50 rounded-lg shadow-inner">
                        <div className="flex items-center gap-2 text-gray-600">
                          <AlertTriangle className="h-4 w-4 text-[#14B8A6] flex-shrink-0" />
                          <span className="font-medium">Severity:</span>
                          <SeverityIndicator level={bodyData.symptom_analysis.characteristics.severity} />
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg shadow-inner">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4 text-[#14B8A6] flex-shrink-0" />
                          <span className="font-medium">Pattern:</span>
                          {bodyData.symptom_analysis.characteristics.pattern}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            </div>
          );
        }
    
        if (pageNum === 2) {
          return (
            <div className="space-y-6">
              <Section 
                title="Clinical Considerations" 
                icon={<Heart className="h-6 w-6 flex-shrink-0" />}
                variant="default"
                collapsible
              >
                {bodyData.clinical_considerations.possible_conditions.map((condition, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="mt-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors shadow-md"
                    role="article"
                    aria-label={`Condition: ${condition.name}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-[#1E293B] break-words hyphens-auto">{condition.name}</h3>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#14B8A6]/10 text-[#14B8A6]">
                        {condition.likelihood}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{condition.description}</p>
                    <div className="text-sm">
                      <div className="font-medium text-[#1E293B]">Affected Areas:</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {condition.affected_areas.map((area, i) => (
                          <span key={i} className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs shadow-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </Section>
    
              <Section 
                title="Red Flags" 
                icon={<AlertTriangle className="h-6 w-6 flex-shrink-0" />}
                variant="warning"
              >
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bodyData.clinical_considerations.red_flags.map((flag, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-red-600 p-3 bg-white/50 rounded-lg shadow-sm hover:bg-white/70 transition-colors">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      {flag}
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
          );
        }
    
        if (pageNum === 3) {
          return (
            <div className="space-y-6">
              <Section 
                title="Management Recommendations" 
                icon={<Settings className="h-6 w-6 flex-shrink-0" />}
                variant="default"
                collapsible
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-medium text-[#1E293B] mb-2">Immediate Care</h3>
                    <ul className="space-y-2">
                    {bodyData.management_recommendations.immediate_care.actions.map((action, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                        <ThumbsUp className="h-4 w-4 text-[#14B8A6] flex-shrink-0" />
                        {action}
                        </li>
                    ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-medium text-[#1E293B] mb-2">Pain Management</h3>
                    <ul className="space-y-2">
                    {bodyData.management_recommendations.pain_management.medications.map((med, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                        <Heart className="h-4 w-4 text-[#14B8A6] flex-shrink-0" />
                        {med}
                        </li>
                    ))}
                    </ul>
                </div>
                </div>
              </Section>
    
              <Section 
                title="Prognosis & Prevention" 
                icon={<BookOpen className="h-6 w-6 flex-shrink-0" />}
                variant="default"
                collapsible
              >
                <div className="mb-4">
                  <h3 className="font-medium text-[#1E293B] mb-2">Expected Course</h3>
                  <p className="text-gray-700 p-3 bg-gray-50 rounded-lg shadow-inner">
                    {bodyData.prognosis.expected_course}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-[#1E293B] mb-2">Prevention Strategies</h3>
                  <ul className="space-y-2">
                    {bodyData.prevention_education.recurrence_prevention.map((strategy, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                        <Shield className="h-4 w-4 text-[#14B8A6] flex-shrink-0" />
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>
            </div>
          );
        }
      };
    
      const renderPagination = () => (
        <div className="border-t border-gray-200 p-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4" role="navigation" aria-label="Page navigation">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all focus:ring-2 focus:ring-[#14B8A6] focus:outline-none ${
                  currentPage === page 
                    ? 'bg-[#14B8A6] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-[#14B8A6]/10'
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </div>
          <div className="flex w-full justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-[#14B8A6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-[#14B8A6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      );
    
      return (
        <div className={`min-h-screen bg-gray-100 p-8 ${isPrintMode ? 'print:bg-white print:p-0' : ''}`}>
    <motion.div 
      className="medical-report-container max-w-[210mm] mx-auto bg-white rounded-xl shadow-xl print:shadow-none print:mx-0 print:w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
        <div className="p-8 border-b border-gray-200">
  <div className="flex justify-between items-center">
    {/* Left side with title */}
    <div className="flex items-center gap-4">
      <Stethoscope className="h-12 w-12 text-[#14B8A6]" />
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]" role="heading" aria-level={1}>
          Medical Report
        </h1>
        <p className="text-gray-500">{formattedDate}</p>
      </div>
    </div>

    {/* Print stamp - aligned with title */}
    <div className="hidden print:block">
      <div className="relative w-40 h-40">
        <Image 
          src="/stamp.png" 
          alt="Official stamp" 
          fill
          priority
          className="object-contain"
          sizes="160px"
        />
      </div>
    </div>

    {/* Print button */}
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14B8A6] text-white hover:bg-[#14B8A6]/90 transition-colors print:hidden"
      aria-label="Print report"
    >
      <Printer className="h-5 w-5" />
      Print Report
    </button>
  </div>
</div>

        {/* Render content based on print mode */}
        {isPrintMode ? (
          // Print mode: render all pages
          <div className="p-8 space-y-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <div key={pageNum} className={pageNum > 1 ? 'page-break-before' : ''}>
                {type === 'traditional' 
                  ? renderTraditionalContent(pageNum)
                  : renderBodyBasedContent(pageNum)}
              </div>
            ))}
          </div>
        ) : (
          // Normal mode: render current page only
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="focus:outline-none"
                tabIndex={0}
                role="region"
                aria-label={`Page ${currentPage} content`}
              >
                {type === 'traditional' 
                  ? renderTraditionalContent(currentPage)
                  : renderBodyBasedContent(currentPage)}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Only show pagination in normal mode */}
        {!isPrintMode && renderPagination()}
      </motion.div>

      {/* Add print-specific styles */}
      <style jsx global>{`
  @media print {
    .medical-report-container {
      transform: none !important;
    }
    
    .medical-report-container > div {
      padding: 0 !important;
      margin: 0 !important;
    }
    
    .print-hide {
      display: none !important;
    }
    
    @page {
      size: A4;
      margin: 20mm;
    }

    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    /* Ensure images are visible in print */
    span[style*="box-sizing: border-box"] > img {
      display: block !important;
      break-inside: avoid;
    }
  }
`}</style>
  </div>
  );
};

export default MedicalReport;