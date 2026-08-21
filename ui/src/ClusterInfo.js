import { Box } from '@mui/material';
import { useCallback, useState, useEffect } from 'react';
import { useAuth } from "./auth/AuthContext";

export default function ClusterInfo() {
  const [loading, setLoading] = useState(false);  
  const [stateData, setStateData] = useState([]);
	const { request } = useAuth();

  const detailStyle = {
    marginTop: '1em',
    marginLeft: '1.75em',
    width: '90%',
    fontSize: '15px',
    textAlign: 'left'
  };

  // Function to get Apache Mesos Tasks
  const getMesosState = useCallback(async () => {
    setLoading(true);

    const data = await request("/state");
    setStateData(data);
    setLoading(false);
  }, [request]);

  useEffect(() => {
    getMesosState();
  }, [getMesosState]);

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
