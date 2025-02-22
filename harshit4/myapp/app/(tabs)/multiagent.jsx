import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';

const ComposioMultiAgent = () => {
  const [userInput, setUserInput] = useState(
    "I need to create a meeting agenda, share it with the team via email, check for any calendar conflicts next week, and pull the latest sales data from our dashboard."
  );

  // Simulated extracted tasks from user input
  const tasks = [
    {
      id: 1,
      description: "Create meeting agenda document",
      agent: "Google Docs",
      status: "completed",
      result: "Created 'Team Meeting Agenda - Q1 Review.docx'",
      agentIcon: "📄"
    },
    {
      id: 2,
      description: "Send email with agenda to team",
      agent: "Gmail",
      status: "awaiting_confirmation",
      recipients: ["sarah@company.com", "john@company.com", "+3 more"],
      subject: "Team Meeting Agenda - Please Review",
      agentIcon: "📧"
    },
    {
      id: 3,
      description: "Check calendar for conflicts next week",
      agent: "Google Calendar",
      status: "in_progress",
      agentIcon: "📅"
    },
    {
      id: 4,
      description: "Pull latest sales data from dashboard",
      agent: "Analytics",
      status: "completed",
      result: "Downloaded 'Q1_Sales_Report.csv' (245KB)",
      agentIcon: "📊"
    },
    {
      id: 5,
      description: "Check for team responses on WhatsApp",
      agent: "WhatsApp",
      status: "pending",
      agentIcon: "💬"
    }
  ];

  const suggestions = [
    "Add sales report to meeting agenda",
    "Schedule follow-up meeting for next Wednesday",
    "Notify marketing team via Slack",
    "Create action items spreadsheet",
    "Set reminders for team members"
  ];

  const StatusBadge = ({ status }) => {
    const getStatusConfig = () => {
      switch (status) {
        case 'in_progress':
          return {
            containerStyle: styles.statusBadgeBlue,
            textStyle: styles.statusTextBlue,
            icon: (
              <Animated.View style={[styles.spinner, styles.spinnerBlue]} />
            ),
            label: 'Processing'
          };
        case 'completed':
          return {
            containerStyle: styles.statusBadgeGreen,
            textStyle: styles.statusTextGreen,
            icon: null,
            label: 'Completed'
          };
        case 'awaiting_confirmation':
          return {
            containerStyle: styles.statusBadgeYellow,
            textStyle: styles.statusTextYellow,
            icon: null,
            label: 'Awaiting Confirmation'
          };
        case 'pending':
          return {
            containerStyle: styles.statusBadgeGray,
            textStyle: styles.statusTextGray,
            icon: null,
            label: 'Pending'
          };
        default:
          return null;
      }
    };

    const config = getStatusConfig();
    if (!config) return null;

    return (
      <View style={[styles.statusBadge, config.containerStyle]}>
        {config.icon}
        <Text style={[styles.statusText, config.textStyle]}>{config.label}</Text>
      </View>
    );
  };

  const renderTaskItem = ({ item: task }) => (
    <View key={task.id} style={styles.taskItem}>
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleContainer}>
          <Text style={styles.taskIcon}>{task.agentIcon}</Text>
          <View style={styles.taskDetails}>
            <View style={styles.taskTitleRow}>
              <Text style={styles.taskTitle}>{task.description}</Text>
              <View style={styles.agentBadge}>
                <Text style={styles.agentText}>{task.agent}</Text>
              </View>
            </View>

            {task.status === 'completed' && task.result && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultText}>{task.result}</Text>
              </View>
            )}

            {task.status === 'awaiting_confirmation' && (
              <View style={styles.confirmationContainer}>
                <Text style={styles.recipientsText}>
                  To: {task.recipients.join(', ')}
                </Text>
                <Text style={styles.subjectText}>
                  Subject: {task.subject}
                </Text>
                <View style={styles.confirmationButtons}>
                  <TouchableOpacity style={styles.approveButton}>
                    <Text style={styles.approveButtonText}>
                      Approve & Send
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit First</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
        <StatusBadge status={task.status} />
      </View>
    </View>
  );

  const renderSuggestionItem = ({ item: suggestion }) => (
    <TouchableOpacity key={suggestion} style={styles.suggestionButton}>
      <Text style={styles.suggestionText}>{suggestion}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTaskItem}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Composio Multi-Agent Hub</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity style={styles.settingsButton}>
                  <Text style={styles.settingsButtonText}>Agent Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.newRequestButton}>
                  <Text style={styles.newRequestButtonText}>New Request</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                multiline
                value={userInput}
                onChangeText={setUserInput}
                placeholder="Enter your request..."
              />
              <TouchableOpacity style={styles.processButton}>
                <Text style={styles.processButtonText}>Process</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.taskHubHeader}>
              <Text style={styles.taskHubTitle}>Task Execution Hub</Text>
              <Text style={styles.taskCount}>{tasks.length} tasks identified</Text>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={styles.suggestionsContainer}>
            <View style={styles.suggestionsHeader}>
              <Text style={styles.suggestionsTitle}>Suggested Next Actions</Text>
            </View>
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSuggestionItem}
              horizontal
              contentContainerStyle={styles.suggestionsContent}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  settingsButton: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  settingsButtonText: {
    color: '#4F46E5',
  },
  newRequestButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  newRequestButtonText: {
    color: '#fff',
  },
  inputContainer: {
    padding: 16,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  processButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  processButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  taskHubHeader: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  taskHubTitle: {
    fontWeight: '500',
  },
  taskCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskTitleContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  taskIcon: {
    fontSize: 20,
    marginTop: 4,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  taskTitle: {
    fontWeight: '500',
  },
  agentBadge: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  agentText: {
    fontSize: 12,
  },
  resultContainer: {
    marginTop: 8,
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  resultText: {
    fontSize: 14,
  },
  confirmationContainer: {
    marginTop: 8,
    backgroundColor: '#FEFCE8',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  recipientsText: {
    fontSize: 14,
  },
  subjectText: {
    fontSize: 14,
    marginBottom: 8,
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#374151',
    fontSize: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
  },
  statusBadgeBlue: {
    backgroundColor: '#EFF6FF',
  },
  statusTextBlue: {
    color: '#1D4ED8',
  },
  statusBadgeGreen: {
    backgroundColor: '#F0FDF4',
  },
  statusTextGreen: {
    color: '#16A34A',
  },
  statusBadgeYellow: {
    backgroundColor: '#FEFCE8',
  },
  statusTextYellow: {
    color: '#CA8A04',
  },
  statusBadgeGray: {
    backgroundColor: '#F3F4F6',
  },
  statusTextGray: {
    color: '#374151',
  },
  spinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderTopColor: '#1D4ED8',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  suggestionsHeader: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  suggestionsTitle: {
    fontWeight: '500',
  },
  suggestionsContent: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  suggestionText: {
    color: '#4F46E5',
    fontSize: 14,
  },
});

export default ComposioMultiAgent;