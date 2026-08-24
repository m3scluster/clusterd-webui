/**
 * Tests for master utility functions
 */
import { 
  isLeader, 
  getMasterStatus, 
  extractMasters,
  formatClusterInfo,
  masterHttpEndpoint
} from './masterUtils';

// Mock data to work with
const mockMasterA = {
  id: 'master-a-id',
  hostname: 'master-a.example.com',
  pid: '12345',
  version: '1.8.0',
  start_time: 1609459200,
  elected_time: 1609459250
};

const mockMasterB = {
  id: 'master-b-id', 
  hostname: 'master-b.example.com',
  pid: '12346',
  version: '1.8.0',
  start_time: 1609459205,
  elected_time: 1609459255
};

const mockStateData = {
  id: 'master-a-id',
  hostname: 'master-a.example.com',
  pid: '12345',
  version: '1.8.0',
  start_time: 1609459200,
  elected_time: 1609459250,
  leader_info: {
    id: 'master-a-id'
  },
  cluster: 'test-cluster'
};

describe('Master Utility Functions', () => {
  test('isLeader correctly identifies the leader', () => {
    expect(isLeader(mockMasterA, 'master-a-id')).toBe(true);
    expect(isLeader(mockMasterB, 'master-a-id')).toBe(false);
  });

  test('getMasterStatus creates proper status object', () => {
    const status = getMasterStatus(mockMasterA, 'master-a-id');
    expect(status.id).toBe('master-a-id');
    expect(status.hostname).toBe('master-a.example.com');
    expect(status.isLeader).toBe(true);
    expect(status.isOnline).toBe(true);
  });

  test('extractMasters returns proper master data', () => {
    const masters = extractMasters(mockStateData);
    expect(masters.length).toBe(1);
    expect(masters[0].id).toBe('master-a-id');
  });

  test('formatClusterInfo returns formatted cluster info', () => {
    const clusterInfo = formatClusterInfo(mockStateData);
    expect(clusterInfo.cluster).toBe('test-cluster');
    expect(clusterInfo.version).toBe('1.8.0');
    expect(clusterInfo.masterCount).toBe(1);
    expect(clusterInfo.isLeader).toBe(true);
  });

  test('builds a safe master metrics endpoint from hostname and pid port', () => {
    expect(masterHttpEndpoint({ hostname: 'master-a.example.com', pid: 'master@master-a.example.com:5050' }, '/metrics/snapshot', 'development'))
      .toBe('/master-api/master-a.example.com/5050/metrics/snapshot');
    expect(masterHttpEndpoint({ hostname: 'bad/host', pid: 'master@bad/host:5050' }, '/metrics/snapshot', 'development')).toBeNull();
  });
});