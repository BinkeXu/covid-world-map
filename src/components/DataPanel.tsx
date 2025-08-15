import React from 'react';
import styled from 'styled-components';
import { CountryData, CovidData } from '../types';

/**
 * DataPanel Component
 * 
 * Displays detailed COVID-19 statistics for a selected country in a modern, card-based layout.
 * Features include:
 * - Summary statistics in grid layout
 * - Per-million metrics for population-adjusted comparisons
 * - Vaccination progress with visual progress bar
 * - Population impact calculations
 * - Geographic information display
 * 
 * @component
 * @param {DataPanelProps} props - Component props
 * @returns {JSX.Element} Data panel component or selection prompt
 */

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

/**
 * Main container for the data panel
 * Features glassmorphism design with backdrop blur and transparency
 */
const PanelContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 25px;
  height: fit-content;
`;

/**
 * Header section containing country name and subtitle
 * Centered layout with prominent title display
 */
const PanelHeader = styled.div`
  text-align: center;
  margin-bottom: 25px;
`;

/**
 * Main title displaying the selected country name
 * Large, bold text for clear identification
 */
const PanelTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 5px 0;
`;

/**
 * Subtitle providing context about the displayed data
 * Smaller, muted text below the main title
 */
const PanelSubtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
`;

/**
 * Message displayed when no country is selected
 * Provides user guidance and visual feedback
 */
const NoSelectionMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

/**
 * Icon displayed in the no-selection state
 * Large, decorative element to draw attention
 */
const NoSelectionIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.5;
`;

/**
 * Grid layout for displaying summary statistics
 * 2x2 grid arrangement for balanced visual presentation
 */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
`;

/**
 * Individual statistic card with gradient background
 * Displays a single metric with value, label, and unit
 */
const StatCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

/**
 * Large, prominent display of the statistic value
 * Uses accent color for visual emphasis
 */
const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 5px;
`;

/**
 * Label describing what the statistic represents
 * Uppercase text with letter spacing for readability
 */
const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
`;

/**
 * Unit or context information for the statistic
 * Small, muted text providing additional context
 */
const StatUnit = styled.div`
  font-size: 0.8rem;
  color: #999;
  margin-top: 2px;
`;

/**
 * Section container for grouped related information
 * Provides consistent spacing and organization
 */
const DetailSection = styled.div`
  margin-bottom: 25px;
`;

/**
 * Section title with icon and consistent styling
 * Uses flexbox for icon and text alignment
 */
const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

/**
 * Grid layout for detail items within a section
 * 2-column layout for efficient space utilization
 */
const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

/**
 * Individual detail item with label-value pair
 * Subtle background with rounded corners for visual separation
 */
const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

/**
 * Label text for detail items
 * Muted color with medium font weight
 */
const DetailLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

/**
 * Value text for detail items
 * Darker color with semibold weight for emphasis
 */
const DetailValue = styled.span`
  font-size: 0.9rem;
  color: #333;
  font-weight: 600;
`;

/**
 * Progress bar container for vaccination rate visualization
 * Provides visual feedback on vaccination progress
 */
const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
`;

/**
 * Progress bar fill with dynamic width and color
 * Color changes based on vaccination rate thresholds
 */
const ProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => props.color};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Formats large numbers with appropriate suffixes (K, M)
 * Handles null/undefined values safely with fallbacks
 * 
 * @param {any} num - Number to format (can be string, number, or null)
 * @returns {string} Formatted number string with appropriate suffix
 */
const formatNumber = (num: any): string => {
  // Debug logging for troubleshooting
  console.log('formatNumber called with:', num, 'type:', typeof num);
  
  // Convert to number and validate
  const number = Number(num);
  if (num === null || num === undefined || isNaN(number) || typeof num === 'string' && num.trim() === '') {
    console.log('formatNumber returning fallback for invalid value:', num);
    return '0';
  }
  console.log('formatNumber processing valid number:', number);
  
  // Apply appropriate formatting based on magnitude
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return number.toLocaleString();
};

/**
 * Formats numbers as percentages with one decimal place
 * Handles null/undefined values safely with fallbacks
 * 
 * @param {any} num - Number to format as percentage
 * @returns {string} Formatted percentage string
 */
const formatPercentage = (num: any): string => {
  // Debug logging for troubleshooting
  console.log('formatPercentage called with:', num, 'type:', typeof num);
  
  // Convert to number and validate
  const number = Number(num);
  if (num === null || num === undefined || isNaN(number) || typeof num === 'string' && num.trim() === '') {
    console.log('formatPercentage returning fallback for invalid value:', num);
    return '0.0%';
  }
  console.log('formatPercentage processing valid number:', number);
  return number.toFixed(1) + '%';
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Props interface for the DataPanel component
 */
interface DataPanelProps {
  /** Currently selected country data to display */
  selectedCountry: CountryData | null;
  /** Array of all COVID-19 data for reference */
  covidData: CovidData[];
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * DataPanel component implementation
 * Renders detailed COVID-19 statistics for a selected country
 */
const DataPanel: React.FC<DataPanelProps> = ({ selectedCountry, covidData }) => {
  // ========================================================================
  // EARLY RETURN - NO SELECTION
  // ========================================================================
  
  /**
   * Display message when no country is selected
   * Provides user guidance and maintains visual consistency
   */
  if (!selectedCountry) {
    return (
      <PanelContainer>
        <NoSelectionMessage>
          <NoSelectionIcon>🌍</NoSelectionIcon>
          <h3>Select a Country</h3>
          <p>Click on any country on the map to view detailed COVID-19 statistics</p>
        </NoSelectionMessage>
      </PanelContainer>
    );
  }

  // ========================================================================
  // DATA EXTRACTION AND VALIDATION
  // ========================================================================
  
  /**
   * Destructure country data for easier access
   * All values come from the selectedCountry object
   */
  const { 
    location, 
    totalCases, 
    totalDeaths, 
    totalVaccinations, 
    population,
    casesPerMillion,
    deathsPerMillion,
    vaccinationRate
  } = selectedCountry;

  // Debug logging for troubleshooting data issues
  console.log('DataPanel - selectedCountry:', selectedCountry);
  console.log('DataPanel - raw values:', { totalCases, totalDeaths, totalVaccinations, population, casesPerMillion, deathsPerMillion, vaccinationRate });

  /**
   * Ensure all values are numbers and provide safe fallbacks
   * This prevents runtime errors when data contains null/undefined values
   * Number() conversion handles both string and number inputs safely
   */
  const safeTotalCases = Number(totalCases) || 0;
  const safeTotalDeaths = Number(totalDeaths) || 0;
  const safeTotalVaccinations = Number(totalVaccinations) || 0;
  const safePopulation = Number(population) || 0;
  const safeCasesPerMillion = Number(casesPerMillion) || 0;
  const safeDeathsPerMillion = Number(deathsPerMillion) || 0;
  const safeVaccinationRate = Number(vaccinationRate) || 0;

  console.log('DataPanel - safe values:', { safeTotalCases, safeTotalDeaths, safeTotalVaccinations, safePopulation, safeCasesPerMillion, safeDeathsPerMillion, safeVaccinationRate });

  // ========================================================================
  // CALCULATED VALUES
  // ========================================================================
  
  /**
   * Calculate death rate as percentage of population
   * Only calculate when both population and deaths are valid positive numbers
   */
  const deathRate = (safePopulation > 0 && safeTotalDeaths > 0) ? (safeTotalDeaths / safePopulation) * 100 : 0;
  
  /**
   * Calculate case rate as percentage of population
   * Only calculate when both population and cases are valid positive numbers
   */
  const caseRate = (safePopulation > 0 && safeTotalCases > 0) ? (safeTotalCases / safePopulation) * 100 : 0;

  // ========================================================================
  // RENDER METHOD
  // ========================================================================
  
  /**
   * Main render method displaying all country statistics
   * Organized in logical sections for easy comprehension
   */
  return (
    <PanelContainer>
      {/* Header section with country name and context */}
      <PanelHeader>
        <PanelTitle>{location}</PanelTitle>
        <PanelSubtitle>COVID-19 Statistics</PanelSubtitle>
      </PanelHeader>

      {/* Summary statistics in 2x2 grid layout */}
      <StatsGrid>
        <StatCard>
          <StatValue>{formatNumber(safeTotalCases)}</StatValue>
          <StatLabel>Total Cases</StatLabel>
          <StatUnit>All Time</StatUnit>
        </StatCard>
        <StatCard>
          <StatValue>{formatNumber(safeTotalDeaths)}</StatValue>
          <StatLabel>Total Deaths</StatLabel>
          <StatUnit>All Time</StatUnit>
        </StatCard>
        <StatCard>
          <StatValue>{formatNumber(safeTotalVaccinations)}</StatValue>
          <StatLabel>Vaccinations</StatLabel>
          <StatUnit>Total Doses</StatUnit>
        </StatCard>
        <StatCard>
          <StatValue>{formatNumber(safePopulation)}</StatValue>
          <StatLabel>Population</StatLabel>
          <StatUnit>Total</StatUnit>
        </StatCard>
      </StatsGrid>

      {/* Per-million metrics for population-adjusted comparisons */}
      <DetailSection>
        <SectionTitle>📊 Per Million Metrics</SectionTitle>
        <DetailGrid>
          <DetailItem>
            <DetailLabel>Cases per Million</DetailLabel>
            <DetailValue>{formatNumber(safeCasesPerMillion)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Deaths per Million</DetailLabel>
            <DetailValue>{formatNumber(safeDeathsPerMillion)}</DetailValue>
          </DetailItem>
        </DetailGrid>
      </DetailSection>

      {/* Vaccination progress with visual progress bar */}
      <DetailSection>
        <SectionTitle>💉 Vaccination Progress</SectionTitle>
        <DetailItem>
          <DetailLabel>Vaccination Rate</DetailLabel>
          <DetailValue>{formatPercentage(safeVaccinationRate)}</DetailValue>
        </DetailItem>
        <ProgressBar>
          <ProgressFill 
            percentage={Math.max(0, Math.min(100, isNaN(safeVaccinationRate) || safeVaccinationRate === null || safeVaccinationRate === undefined ? 0 : safeVaccinationRate))} 
            color={safeVaccinationRate > 70 ? '#4caf50' : safeVaccinationRate > 40 ? '#ff9800' : '#f44336'}
          />
        </ProgressBar>
      </DetailSection>

      {/* Population impact calculations */}
      <DetailSection>
        <SectionTitle>📈 Population Impact</SectionTitle>
        <DetailGrid>
          <DetailItem>
            <DetailLabel>Case Rate</DetailLabel>
            <DetailValue>{formatPercentage(caseRate)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Death Rate</DetailLabel>
            <DetailValue>{formatPercentage(deathRate)}</DetailValue>
          </DetailItem>
        </DetailGrid>
      </DetailSection>

      {/* Geographic and identification information */}
      <DetailSection>
        <SectionTitle>🌍 Geographic Info</SectionTitle>
        <DetailGrid>
          <DetailItem>
            <DetailLabel>Continent</DetailLabel>
            <DetailValue>{selectedCountry.continent}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>ISO Code</DetailLabel>
            <DetailValue>{selectedCountry.iso_code}</DetailValue>
          </DetailItem>
        </DetailGrid>
      </DetailSection>
    </PanelContainer>
  );
};

export default DataPanel;
