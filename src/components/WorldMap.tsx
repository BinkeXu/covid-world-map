import React, { useMemo } from 'react';
import styled from 'styled-components';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { CovidData, CountryData } from '../types';

/**
 * WorldMap Component
 * 
 * Renders an interactive world map visualization of COVID-19 data using react-simple-maps.
 * Features include:
 * - Color-coded countries based on COVID-19 case density
 * - Interactive tooltips showing detailed statistics
 * - Click functionality to select countries
 * - Zoom and pan capabilities
 * - Legend showing case density ranges
 * 
 * @component
 * @param {WorldMapProps} props - Component props
 * @returns {JSX.Element} Interactive world map component
 */

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

/**
 * Main wrapper for the map component
 * Provides positioning context and dimensions
 */
const MapWrapper = styled.div`
  width: 100%;
  height: 600px;
  position: relative;
`;

/**
 * Container for the actual map visualization
 * Holds the ComposableMap and its children
 */
const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

/**
 * Legend component displaying color ranges for COVID-19 case density
 * Positioned at bottom-left of the map
 */
const Legend = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 10;
`;

/**
 * Title for the legend section
 */
const LegendTitle = styled.h4`
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
  font-weight: 600;
`;

/**
 * Individual legend item showing color and range
 */
const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 12px;
`;

/**
 * Color indicator for legend items
 */
const LegendColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background: ${props => props.color};
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

/**
 * Message displayed when no COVID-19 data is available
 */
const NoDataMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

/**
 * Interactive tooltip showing country COVID-19 statistics
 * Positioned to the left of the mouse cursor for better visibility
 * Uses fixed positioning to follow mouse movement across the entire viewport
 */
const Tooltip = styled.div<{ visible: boolean; x: number; y: number }>`
  position: fixed;
  left: ${props => props.x - 600}px; /* Position to the left of cursor */
  top: ${props => props.y - 200}px;  /* Position above cursor */
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
  z-index: 1000;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.15s ease;
  white-space: pre-line;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  line-height: 1.4;
  max-width: 200px;
`;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Props interface for the WorldMap component
 */
interface WorldMapProps {
  /** Array of COVID-19 data records */
  covidData: CovidData[];
  /** Callback function when a country is selected */
  onCountrySelect: (country: CountryData) => void;
  /** Currently selected country data */
  selectedCountry: CountryData | null;
}

/**
 * Interface for geography objects from react-simple-maps
 * Extends the basic properties to handle flexible GeoJSON data
 */
interface GeographyProps {
  /** Unique key for the geography element */
  rsmKey: string;
  /** Properties containing country information */
  properties: {
    /** Country name */
    name: string;
    /** Additional flexible properties */
    [key: string]: any;
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * WorldMap component implementation
 * Handles data processing, country selection, and map rendering
 */
const WorldMap: React.FC<WorldMapProps> = ({ 
  covidData, 
  onCountrySelect, 
  selectedCountry 
}) => {
  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================
  
  /**
   * Tooltip state for displaying country information on hover
   */
  const [tooltip, setTooltip] = React.useState({
    visible: false,
    content: '',
    x: 0,
    y: 0
  });

  /**
   * Reference to timeout for tooltip display delay
   * Prevents tooltip flickering during rapid mouse movement
   */
  const tooltipTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // ========================================================================
  // EFFECTS AND CLEANUP
  // ========================================================================
  
  /**
   * Cleanup effect to clear any remaining timeouts on component unmount
   * Prevents memory leaks and ensures proper cleanup
   */
  React.useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // ========================================================================
  // DATA PROCESSING
  // ========================================================================
  
  /**
   * Memoized map of country data for efficient lookups
   * Processes raw COVID-19 data into aggregated country statistics
   * 
   * @returns {Map<string, CountryData>} Map of country names to processed data
   */
  const countryDataMap = useMemo(() => {
    const map = new Map<string, CountryData>();
    
    // Group data by country and get latest stats
    const countryGroups = new Map<string, CovidData[]>();
    
    // First pass: group records by country location
    covidData.forEach(record => {
      if (record.location && record.iso_code) {
        if (!countryGroups.has(record.location)) {
          countryGroups.set(record.location, []);
        }
        countryGroups.get(record.location)!.push(record);
      }
    });
    
    // Second pass: process each country's data
    countryGroups.forEach((records, location) => {
      if (records.length === 0) return;
      
      // Sort records by date to get the most recent data
      const sortedRecords = records.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      const latestRecord = sortedRecords[0];
      
      // Calculate maximum values across all records for this country
      // This handles cases where data might have been reset or corrected
      const totalCases = Math.max(...records.map(r => Number(r.total_cases) || 0));
      const totalDeaths = Math.max(...records.map(r => Number(r.total_deaths) || 0));
      const totalVaccinations = Math.max(...records.map(r => Number(r.total_vaccinations) || 0));
      
      // Create aggregated country data object
      map.set(location, {
        location,
        iso_code: latestRecord.iso_code,
        continent: latestRecord.continent,
        latestData: latestRecord,
        totalCases: Number(totalCases) || 0,
        totalDeaths: Number(totalDeaths) || 0,
        totalVaccinations: Number(totalVaccinations) || 0,
        population: Number(latestRecord.population) || 0,
        casesPerMillion: Number(latestRecord.total_cases_per_million) || 0,
        deathsPerMillion: Number(latestRecord.total_deaths_per_million) || 0,
        vaccinationRate: Number(latestRecord.total_vaccinations_per_hundred) || 0,
      });
    });
    
    return map;
  }, [covidData]);

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================
  
  /**
   * Determines the color for a country based on its COVID-19 case density
   * Uses a color gradient from light green (low cases) to red (high cases)
   * 
   * @param {string} countryName - Name of the country to color
   * @returns {string} CSS color value representing case density
   */
  const getCountryColor = (countryName: string) => {
    const countryData = countryDataMap.get(countryName);
    
    // Return light gray for countries with no data or invalid data
    if (!countryData || !countryData.casesPerMillion || countryData.casesPerMillion === 0 || isNaN(countryData.casesPerMillion)) {
      return '#f0f0f0'; // Light gray for no data
    }
    
    const casesPerMillion = countryData.casesPerMillion;
    
    // Color scale based on cases per million:
    // Green spectrum: Low case density (good)
    // Orange spectrum: Medium case density (moderate)
    // Red spectrum: High case density (concerning)
    if (casesPerMillion < 1000) return '#e8f5e8';      // Very light green: < 1K
    if (casesPerMillion < 10000) return '#c8e6c9';     // Light green: 1K - 10K
    if (casesPerMillion < 50000) return '#81c784';     // Green: 10K - 50K
    if (casesPerMillion < 100000) return '#4caf50';    // Medium green: 50K - 100K
    if (casesPerMillion < 200000) return '#388e3c';    // Dark green: 100K - 200K
    if (casesPerMillion < 500000) return '#ff9800';    // Orange: 200K - 500K
    if (casesPerMillion < 1000000) return '#f57c00';   // Dark orange: 500K - 1M
    return '#d32f2f';                                   // Red: > 1M
  };

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================
  
  /**
   * Handles country selection when a country is clicked
   * Triggers the onCountrySelect callback with the selected country's data
   * 
   * @param {string} countryName - Name of the clicked country
   */
  const handleCountryClick = (countryName: string) => {
    const countryData = countryDataMap.get(countryName);
    if (countryData) {
      onCountrySelect(countryData);
    }
  };

  /**
   * Handles mouse movement over a country
   * Shows tooltip with COVID-19 statistics after a brief delay
   * Includes timeout management to prevent tooltip flickering
   * 
   * @param {React.MouseEvent} event - Mouse move event
   * @param {string} countryName - Name of the country being hovered
   */
  const handleMouseMove = (event: React.MouseEvent, countryName: string) => {
    const countryData = countryDataMap.get(countryName);
    
    // Only show tooltip for countries with valid COVID-19 data
    if (countryData && countryData.totalCases && Number(countryData.totalCases) > 0) {
      const safeTotalCases = Number(countryData.totalCases);
      const safeTotalDeaths = Number(countryData.totalDeaths) || 0;
      const safeCasesPerMillion = Number(countryData.casesPerMillion) || 0;
      
      // Clear any existing timeout to prevent multiple tooltips
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      
      // Set a small delay before showing tooltip to prevent flickering
      // This creates a smoother user experience during rapid mouse movement
      tooltipTimeoutRef.current = setTimeout(() => {
        setTooltip({
          visible: true,
          content: `${countryName}
Cases: ${safeTotalCases.toLocaleString()}
Deaths: ${safeTotalDeaths.toLocaleString()}
Per Million: ${safeCasesPerMillion.toLocaleString()}`,
          x: event.clientX,
          y: event.clientY
        });
      }, 150); // 150ms delay for optimal user experience
    }
  };

  /**
   * Handles mouse leaving a country
   * Clears any pending tooltip timeouts and hides the tooltip
   * Ensures proper cleanup of tooltip state
   */
  const handleMouseLeave = () => {
    // Clear timeout and hide tooltip
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  // ========================================================================
  // RENDER LOGIC
  // ========================================================================
  
  /**
   * Early return when no COVID-19 data is available
   * Shows helpful message to guide users
   */
  if (covidData.length === 0) {
    return (
      <MapWrapper>
        <NoDataMessage>
          <h3>No COVID-19 data available</h3>
          <p>Please ensure the CSV file is properly loaded.</p>
        </NoDataMessage>
      </MapWrapper>
    );
  }

  /**
   * Main render method for the world map
   * Renders the interactive map with all countries and supporting UI elements
   */
  return (
    <MapWrapper>
      <MapContainer>
        {/* Main map container using Mercator projection for familiar world view */}
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 100,      // Zoom level - adjust for different map sizes
            center: [0, 30]  // Center point [longitude, latitude] - focuses on equator
          }}
        >
          {/* Zoomable group allows users to zoom and pan the map */}
          <ZoomableGroup>
            {/* Load and render geographic data from the map.json file */}
            <Geographies geography="/map.json">
              {({ geographies }: { geographies: GeographyProps[] }) =>
                geographies.map((geo: GeographyProps) => {
                  const countryName = geo.properties.name;
                  const isSelected = selectedCountry?.location === countryName;
                  const color = getCountryColor(countryName);
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={color}
                      stroke={isSelected ? "#667eea" : "#ffffff"}
                      strokeWidth={isSelected ? 2 : 0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { 
                          fill: isSelected ? color : '#667eea',
                          outline: 'none',
                          stroke: '#667eea',
                          strokeWidth: 1.5,
                          cursor: 'pointer'
                        },
                        pressed: { outline: 'none' }
                      }}
                      onClick={() => handleCountryClick(countryName)}
                      onMouseMove={(e) => handleMouseMove(e, countryName)}
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </MapContainer>
      
      {/* Interactive tooltip showing country statistics on hover */}
      <Tooltip 
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
      >
        {tooltip.content}
      </Tooltip>
      
      {/* Legend explaining the color coding system */}
      <Legend>
        <LegendTitle>COVID-19 Cases per Million</LegendTitle>
        <LegendItem>
          <LegendColor color="#e8f5e8" />
          <span>&lt; 1K</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#c8e6c9" />
          <span>1K - 10K</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#81c784" />
          <span>10K - 50K</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#4caf50" />
          <span>50K - 100K</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#388e3c" />
          <span>100K - 200K</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#ff9800" />
          <span>200K - 500K</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#f57c00" />
          <span>500K - 1M</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#d32f2f" />
          <span>&gt; 1M</span>
        </LegendItem>
      </Legend>
    </MapWrapper>
  );
};

export default WorldMap;
