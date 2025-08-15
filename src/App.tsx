import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import WorldMap from './components/WorldMap';
import DataPanel from './components/DataPanel';
import Header from './components/Header';
import { CovidData, CountryData } from './types';
import { parseCSV } from './utils/csvParser';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const MapContainer = styled.div`
  flex: 2;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
`;

const SidePanel = styled.div`
  flex: 1;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: auto;
  }
`;

function App() {
  const [covidData, setCovidData] = useState<CovidData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await parseCSV();
        setCovidData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load COVID-19 data. Please check if the CSV file is accessible.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCountrySelect = (countryData: CountryData) => {
    setSelectedCountry(countryData);
  };

  if (loading) {
    return (
      <AppContainer>
        <Header />
        <MainContent>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flex: 1,
            fontSize: '18px',
            color: 'white'
          }}>
            Loading COVID-19 data...
          </div>
        </MainContent>
      </AppContainer>
    );
  }

  if (error) {
    return (
      <AppContainer>
        <Header />
        <MainContent>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flex: 1,
            fontSize: '18px',
            color: 'white',
            textAlign: 'center',
            padding: '20px'
          }}>
            {error}
          </div>
        </MainContent>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Header />
      <MainContent>
        <MapContainer>
          <WorldMap 
            covidData={covidData} 
            onCountrySelect={handleCountrySelect}
            selectedCountry={selectedCountry}
          />
        </MapContainer>
        <SidePanel>
          <DataPanel 
            selectedCountry={selectedCountry}
            covidData={covidData}
          />
        </SidePanel>
      </MainContent>
    </AppContainer>
  );
}

export default App;
