import React, { useEffect, useRef, useState } from 'react';
import { fetchStations } from '../api';


const styles = `
  .station-option:hover {
    background-color: #f5f5f5 !important;
  }
`;


const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


interface Station {
  name: string;  
  code: string;   
}

// Props for our StationSelect component
interface StationSelectProps {
  selected: Station | null;           
  onSelect: (station: Station | null) => void;  // Called when user picks a station
  placeholder?: string;               // Placeholder text for the input
}


const StationSelect: React.FC<StationSelectProps> = ({ selected, onSelect, placeholder }) => {
 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
 
  const [userInput, setUserInput] = useState(selected ? `${selected.name} (${selected.code})` : '');
  const [searchQuery, setSearchQuery] = useState('');


  const [stationsList, setStationsList] = useState<Station[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  const componentRef = useRef<HTMLDivElement>(null);
  const searchDelayTimer = useRef<number | null>(null);

 
  useEffect(() => {
    setUserInput(selected ? `${selected.name} (${selected.code})` : '');
  }, [selected]);

  
  useEffect(() => {
  
    if (searchDelayTimer.current) {
      window.clearTimeout(searchDelayTimer.current);
    }

  
    searchDelayTimer.current = window.setTimeout(() => {
      setSearchQuery(userInput);    // Update search query
      setCurrentPage(1);           // Reset to first page
      setHasMoreResults(true);     // Reset "load more" state
      setStationsList([]);         // Clear previous results
    }, 300); // Wait 300ms after last keystroke

    // Cleanup: clear timer if component unmounts or input changes again
    return () => {
      if (searchDelayTimer.current) {
        window.clearTimeout(searchDelayTimer.current);
      }
    };
  }, [userInput]);

  // Load stations when search query or page changes
  useEffect(() => {
    let isRequestCancelled = false;

    async function loadStations() {
  
      if (!hasMoreResults) return;

      setIsLoading(true);

      try {
        // Get stations from the API
        const response = await fetchStations(searchQuery, currentPage, 50);

        // Stop if component unmounted
        if (isRequestCancelled) return;

       
        const newStations = Array.isArray(response.items) ? response.items : [];

        // Add new stations to list (or replace if it's page 1)
        setStationsList(prev => currentPage === 1 ? newStations : [...prev, ...newStations]);

        // Check if we can load more
        const totalStations = response.total || 0;
        setHasMoreResults((currentPage * 50) < totalStations);

      } catch (error) {
        
        console.log('Failed to load stations:', error);
      } finally {
        if (!isRequestCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadStations();

    
    return () => { isRequestCancelled = true; };
  }, [searchQuery, currentPage]);

  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close dropdown if click was outside our component
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    // Listen for clicks on the whole document
    document.addEventListener('mousedown', handleClickOutside);

   
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When user scrolls near bottom, load more results
  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    
    // Check if we're near the bottom (40px or less from bottom)
    const isNearBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 40;
    
    // Load more if we're near bottom,  and have more to load
    if (isNearBottom && !isLoading && hasMoreResults) {
      setCurrentPage(page => page + 1);
    }
  }

  // When user picks a station from the list
  function handleStationSelect(station: Station) {
    onSelect(station);  
    setUserInput(`${station.name} (${station.code})`);  // Update input
    setIsDropdownOpen(false);  // Close dropdown
  }

  // The component's appearance
  return (
    <div style={{ position: 'relative' }} ref={componentRef}>
     
      <input
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)}
        placeholder={placeholder}
        style={{ width: '100%', padding: '8px' }}
      />

     
      {isDropdownOpen && (
        <div
          onScroll={handleScroll}
          style={{
            position: 'absolute',
            zIndex: 40,
            background: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            width: '100%',
            maxHeight: 220,
            overflowY: 'auto',
            marginTop: 6,
            borderRadius: 6,
          }}
        >
         
          {stationsList.length === 0 && !isLoading && (
            <div style={{ padding: 12, color: '#666' }}>
              No stations found
            </div>
          )}

         
          {stationsList.map((station, index) => (
            <div
              key={index}
              onClick={() => handleStationSelect(station)}
              className="station-option"
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: 'white'
              }}
            >
              <div style={{ fontSize: 14 }}>{station.name}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{station.code}</div>
            </div>
          ))}

         
          {isLoading && (
            <div style={{ padding: 12, textAlign: 'center', color: '#666' }}>
              Loading more stations...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StationSelect;