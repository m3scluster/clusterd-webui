import { Box } from '@mui/material';
import { useCallback, useState, useEffect } from 'react';
import AgentsTable from './AgentsTable.js';
import { useAuth } from "../../auth/AuthContext";

export default function Data() {
  const [loading, setLoading] = useState(false);  
  const [agents, setAgents] = useState([]);
	const { request } = useAuth();

  // Function to get Apache Mesos Agents
  const getMesosAgents = useCallback(async () => {
    setLoading(true);

    const data = await request("/slaves");
    setAgents(data.slaves);
    setLoading(false);
  }, [request]);

  useEffect(() => {
    getMesosAgents();
  }, [getMesosAgents]);

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
