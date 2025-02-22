import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';

const AgentLearningDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAgent, setSelectedAgent] = useState('all');
  
  // Sample agent performance data
  const agentPerformance = {
    'docs': { accuracy: 89, improvement: 5.2, corrections: 18, total: 145 },
    'email': { accuracy: 93, improvement: 3.8, corrections: 12, total: 187 },
    'calendar': { accuracy: 96, improvement: 1.2, corrections: 8, total: 203 },
    'whatsapp': { accuracy: 82, improvement: 8.5, corrections: 24, total: 132 },
    'analytics': { accuracy: 91, improvement: 4.1, corrections: 15, total: 167 }
  };
  
  // Sample learning logs
  const learningLogs = [
    {
      id: '1',
      timestamp: "2025-02-20 23:45:12",
      agent: "email",
      originalAction: "Sent email with subject 'Project Update' to entire team",
      userCorrection: "Send only to project managers, not entire team",
      learningOutcome: "Refined audience selection based on email context",
      improvement: "+4.6%"
    },
    {
      id: '2',
      timestamp: "2025-02-20 23:52:38",
      agent: "docs",
      originalAction: "Created standard meeting notes template",
      userCorrection: "Added action items section and owner assignment",
      learningOutcome: "Enhanced document templates with accountability features",
      improvement: "+3.2%"
    },
    {
      id: '3',
      timestamp: "2025-02-21 00:17:05",
      agent: "whatsapp",
      originalAction: "Sent reminder to all team members",
      userCorrection: "Only send to those who haven't responded yet",
      learningOutcome: "Improved follow-up targeting logic",
      improvement: "+5.7%"
    },
    {
      id: '4',
      timestamp: "2025-02-21 01:03:22",
      agent: "calendar",
      originalAction: "Scheduled meeting for 1 hour",
      userCorrection: "Schedule for 30 minutes with 5 min buffer",
      learningOutcome: "Adopted user's meeting duration preferences",
      improvement: "+2.1%"
    }
  ];
  
  // Sample model performance data for chart
  const modelProgressData = {
    labels: ['Feb 15', 'Feb 16', 'Feb 17', 'Feb 18', 'Feb 19', 'Feb 20', 'Feb 21'],
    datasets: [
      {
        data: [78, 79, 82, 83, 86, 89, 91],
        color: () => `rgba(102, 126, 234, 1)`,
        strokeWidth: 2
      }
    ],
  };
  
  // Helper to filter logs by selected agent
  const filteredLogs = selectedAgent === 'all' 
    ? learningLogs 
    : learningLogs.filter(log => log.agent === selectedAgent);
  
  // Render header with agent selector
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Agent Learning Dashboard</Text>
      <View style={styles.headerControls}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedAgent}
            onValueChange={(itemValue) => setSelectedAgent(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All Agents" value="all" />
            <Picker.Item label="Docs Agent" value="docs" />
            <Picker.Item label="Email Agent" value="email" />
            <Picker.Item label="Calendar Agent" value="calendar" />
            <Picker.Item label="WhatsApp Agent" value="whatsapp" />
            <Picker.Item label="Analytics Agent" value="analytics" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // Render tabs
  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
        onPress={() => setActiveTab('overview')}
      >
        <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
          Learning Overview
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'logs' && styles.activeTab]}
        onPress={() => setActiveTab('logs')}
      >
        <Text style={[styles.tabText, activeTab === 'logs' && styles.activeTabText]}>
          Correction Logs
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'insights' && styles.activeTab]}
        onPress={() => setActiveTab('insights')}
      >
        <Text style={[styles.tabText, activeTab === 'insights' && styles.activeTabText]}>
          Learning Insights
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render training card
  const renderTrainingCard = () => {
    const currentAccuracy = selectedAgent === 'all' 
      ? 91 
      : agentPerformance[selectedAgent]?.accuracy;
    
    const improvement = selectedAgent === 'all' 
      ? 4.3
      : agentPerformance[selectedAgent]?.improvement;
    
    const previousAccuracy = currentAccuracy - improvement;
    
    return (
      <View style={styles.trainingCard}>
        <View style={styles.trainingCardHeader}>
          <View>
            <Text style={styles.trainingCardLabel}>Last Reinforcement Learning Cycle</Text>
            <Text style={styles.trainingCardDate}>February 21, 2025 · 02:15 AM</Text>
            <Text style={styles.trainingCardSubtext}>
              {selectedAgent === 'all' 
                ? 'All agents improved by 4.3% on average'
                : `${selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1)} agent improved by ${improvement}%`
              }
            </Text>
          </View>
          <View style={styles.accuracyBadge}>
            <Text style={styles.accuracyValue}>{currentAccuracy}%</Text>
            <Text style={styles.accuracyLabel}>Current Accuracy</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Previous State</Text>
            <Text style={styles.progressLabel}>Current State</Text>
          </View>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressPrevious, 
                {width: `${previousAccuracy}%`}
              ]} 
            />
            <View 
              style={[
                styles.progressCurrent, 
                {width: `${currentAccuracy}%`}
              ]} 
            />
          </View>
        </View>
      </View>
    );
  };
  
  // Render overview screen
  const renderOverview = () => {
    const totalCorrections = selectedAgent === 'all' 
      ? Object.values(agentPerformance).reduce((sum, agent) => sum + agent.corrections, 0)
      : agentPerformance[selectedAgent]?.corrections;
    
    return (
      <View style={styles.overviewContainer}>
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Total Corrections</Text>
            <Text style={styles.statsValue}>{totalCorrections}</Text>
            <Text style={styles.statsSubtext}>Driving improvement</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Learning Rate</Text>
            <Text style={styles.statsValue}>0.021</Text>
            <Text style={styles.statsSubtext}>Auto-optimized</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Reward Function</Text>
            <Text style={styles.statsValue}>Multi</Text>
            <Text style={styles.statsSubtext}>Balanced approach</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Training Episodes</Text>
            <Text style={styles.statsValue}>134</Text>
            <Text style={styles.statsSubtext}>Since initialization</Text>
          </View>
        </View>
        
        {/* Learning Progress Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Learning Progress Over Time</Text>
          <LineChart
            data={modelProgressData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#6366F1',
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
        
        {/* Advanced Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Advanced RL Metrics</Text>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Q-Learning Convergence</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, {width: '92%', backgroundColor: '#10B981'}]} />
            </View>
            <View style={styles.metricValues}>
              <Text style={styles.metricValue}>92%</Text>
              <Text style={styles.metricStatus}>Stable</Text>
            </View>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Exploration vs Exploitation</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, {width: '23%', backgroundColor: '#3B82F6'}]} />
            </View>
            <View style={styles.metricValues}>
              <Text style={styles.metricValue}>23% exploration</Text>
              <Text style={styles.metricStatus}>Optimized</Text>
            </View>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Reward Variance</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, {width: '17%', backgroundColor: '#F59E0B'}]} />
            </View>
            <View style={styles.metricValues}>
              <Text style={styles.metricValue}>17%</Text>
              <Text style={styles.metricStatus}>Low variance</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  
  // Render logs screen
  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <View style={styles.agentBadge}>
          <Text style={styles.agentBadgeText}>{item.agent}</Text>
        </View>
        <Text style={styles.logImprovement}>{item.improvement} improvement</Text>
      </View>
      
      <View style={styles.logContent}>
        <Text style={styles.logLabel}>Original Action:</Text>
        <Text style={styles.logText}>{item.originalAction}</Text>
        
        <Text style={styles.logLabel}>User Correction:</Text>
        <Text style={styles.logCorrectionText}>{item.userCorrection}</Text>
        
        <Text style={styles.logLabel}>Learning Outcome:</Text>
        <Text style={styles.logText}>{item.learningOutcome}</Text>
      </View>
    </View>
  );
  
  const renderLogs = () => (
    <FlatList
      data={filteredLogs}
      renderItem={renderLogItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.logsList}
    />
  );
  
  // Render insights screen
  const renderInsights = () => (
    <View style={styles.insightsContainer}>
      {/* Pattern Recognition */}
      <View style={styles.insightSection}>
        <Text style={styles.sectionTitle}>Pattern Recognition Insights</Text>
        
        <View style={styles.insightCard}>
          <View style={[styles.insightIcon, {backgroundColor: '#EEF2FF'}]}>
            <Text style={{color: '#6366F1'}}>📈</Text>
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Email Audience Selection</Text>
            <Text style={styles.insightText}>
              Model has identified that you prefer selective targeting based on content relevance
              rather than broad distribution. Accuracy improved 15% for recipient selection.
            </Text>
          </View>
        </View>
        
        <View style={styles.insightCard}>
          <View style={[styles.insightIcon, {backgroundColor: '#ECFDF5'}]}>
            <Text style={{color: '#10B981'}}>⏱️</Text>
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Meeting Duration Preferences</Text>
            <Text style={styles.insightText}>
              Learned optimal meeting durations based on meeting type and attendees. 
              Now scheduling 22% shorter meetings with buffer time added automatically.
            </Text>
          </View>
        </View>
      </View>
      
      {/* Neural Network Visualization */}
      <View style={styles.insightSection}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Neural Network Visualization</Text>
          <View style={styles.updatedBadge}>
            <Text style={styles.updatedBadgeText}>Last updated: 2:15 AM</Text>
          </View>
        </View>
        
        <View style={styles.networkVisualization}>
          <Text style={styles.networkText}>
            Neural network visualization showing enhanced connections between context analysis nodes
            and action selection pathways. Stronger weights observed in decision boundaries.
          </Text>
        </View>
      </View>
      
      {/* Recommended Actions */}
      <View style={styles.insightSection}>
        <Text style={styles.sectionTitle}>AI-Recommended Workflow Improvements</Text>
        
        <View style={styles.recommendationCards}>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>Create Email Templates Library</Text>
            <Text style={styles.recommendationText}>
              Based on correction patterns, creating templates would improve efficiency by 34%
            </Text>
            <TouchableOpacity style={styles.implementButton}>
              <Text style={styles.implementButtonText}>Implement Suggestion</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>Automate Calendar Buffer Times</Text>
            <Text style={styles.recommendationText}>
              Learning detected consistent pattern of adding 5-10 minute buffers
            </Text>
            <TouchableOpacity style={styles.implementButton}>
              <Text style={styles.implementButtonText}>Implement Suggestion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
  
  // Main render
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      <ScrollView style={styles.content}>
        {renderTrainingCard()}
        
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'logs' && renderLogs()}
        {activeTab === 'insights' && renderInsights()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginRight: 8,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
  },
  downloadButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366F1',
  },
  tabText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#6366F1',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  trainingCard: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  trainingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  trainingCardLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  trainingCardDate: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trainingCardSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
  },
  accuracyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  accuracyValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  accuracyLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
  },
  progressTrack: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  progressPrevious: {
    position: 'absolute',
    height: 12,
    left: 0,
    backgroundColor: '#86EFAC',
    borderRadius: 6,
  },
  progressCurrent: {
    position: 'absolute',
    height: 12,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  overviewContainer: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statsLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsSubtext: {
    color: '#10B981',
    fontSize: 11,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  metricsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metricItem: {
    marginBottom: 16,
  },
  metricLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  metricValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricValue: {
    fontSize: 11,
    color: '#6B7280',
  },
  metricStatus: {
    fontSize: 11,
    color: '#10B981',
  },
  logsList: {
    paddingBottom: 16,
  },
  logItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  agentBadge: {
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  agentBadgeText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '500',
  },
  logImprovement: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '500',
  },
  logContent: {
    padding: 12,
  },
  logLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 2,
    marginTop: 8,
  },
  logText: {
    fontSize: 14,
    color: '#1F2937',
  },
  logCorrectionText: {
    fontSize: 14,
    color: '#047857',
  },
  insightsContainer: {
    marginBottom: 16,
  },
  insightSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1F2937',
  },
  insightText: {
    fontSize: 12,
    color: '#4B5563',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  updatedBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  updatedBadgeText: {
    color: '#6B7280',
    fontSize: 10,
  },
  networkVisualization: {
    height: 180,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
  },
  networkText: {
    textAlign: 'center',
    color: '#4F46E5',
    fontSize: 14,
  },
  recommendationCards: {
    marginBottom: 8,
  },
  recommendationCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 12,
    color: '#047857',
    marginBottom: 12,
  },
  implementButton: {
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  implementButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AgentLearningDashboard;
