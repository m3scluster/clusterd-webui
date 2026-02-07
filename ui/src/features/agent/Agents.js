import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import AgentsTable from './AgentsTable.js';
import { useAuth } from "../../Home"

export default function Data(props: DataProps) {
  const [loading, setLoading] = useState(false);  
  const [agents, setAgents] = useState([]);
	const { authHeader } = useAuth();

  // Function to get Apache Mesos Agents
  const getMesosAgents = async () => {
    setLoading(true);

    const response = await fetch("https://172.30.96.0:5050/slaves",
      {
        method: "GET",
        headers: {
          Authorization: authHeader, // <- hier den globalen Header nutzen
        },
      }
    );
    const data = await response.json();
    setAgents(data.slaves);
    setLoading(false);
  };  

  useEffect(() => {
    getMesosAgents();
  }, []); 

  return (
    <Box style={{ textAlign: 'center', marginBottom: '20px' }}>
      <Box>
        <div className="tasks">
        {loading ? (<h4>Loading...</h4>) :
          <div>
            <p></p>
            <AgentsTable agents={agents}/>
          </div>
        }    
        </div>    
      </Box>
    </Box>
  );
}
