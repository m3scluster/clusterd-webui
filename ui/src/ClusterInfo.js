import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from "./Home"

export default function ClusterInfo() {
  const [loading, setLoading] = useState(false);  
  const [stateData, setStateData] = useState([]);
	const { authHeader } = useAuth();

  const detailStyle = {
    marginTop: '1em',
    marginLeft: '1.75em',
    width: '90%',
    fontSize: '15px',
    textAlign: 'left'
  };

  // Function to get Apache Mesos Tasks
  const getMesosState = async () => {
    setLoading(true);

    const response = await fetch("https://172.30.96.0:5050/state",
      {
        method: "GET",
        headers: {
          Authorization: authHeader, // <- hier den globalen Header nutzen
        },
      }
    );
    const data = await response.json();
    setStateData(data);
    setLoading(false);
  };  

  useEffect(() => {
    getMesosState();
  }, []); 

  return (
    <Box style={{ textAlign: 'center', marginBottom: '20px' }}>
      {loading ? (<h4>Loading...</h4>) :
        <div className='details' style={detailStyle}>
          <Box><b>Server:</b> {stateData.hostname}</Box>
          <Box><b>Leader:</b> {stateData.leader}</Box>
          <Box><b>Version:</b> Apache Mesos {stateData.version}</Box>
        </div>
      }    
    </Box>
  );
}
