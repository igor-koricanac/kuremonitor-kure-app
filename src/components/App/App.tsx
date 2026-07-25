import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { AppRootProps } from '@grafana/data';
import { useStyles2, Input, Button, Card, Icon, IconButton, Field, Tab, TabsBar, TabContent, Spinner } from '@grafana/ui';
import { css } from '@emotion/css';
import { config } from '@grafana/runtime';

const API_BASE_URL = '/api/plugin-proxy/kuremonitor-kure-app/proxy';
const SERVICE_TOKEN = 's5Wsb8fuRooCKC6PLNmXsW3Ku36nQ4V-8Svtc8kaA-4=';

const cleanText = (text: string) => {
  if (!text) return '';
  // Strip <think>...</think> blocks added by reasoning models
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
};

interface PodIssue {
  pod_name: string;
  namespace: string;
  status: string;
  reason: string;
}

interface Advice {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}


export default function App(props: AppRootProps) {
  const styles = useStyles2(getStyles);
  
  // Left Pane State
  const [activeTab, setActiveTab] = useState<'failures' | 'history'>('failures');
  const [failures, setFailures] = useState<PodIssue[]>([]);
  const [loading, setLoading] = useState(false);

  // Right Pane State
  const [selectedPod, setSelectedPod] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<Record<string, { role: 'user' | 'bot', text: string }[]>>({});
  const [sessionMeta, setSessionMeta] = useState<Record<string, { count: number, namespace: string }>>({});
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentChatHistory = selectedPod && chatSessions[selectedPod] ? chatSessions[selectedPod] : [];
  const isPodActive = selectedPod ? failures.some(f => f.pod_name === selectedPod) : false;
  const isChatDisabled = !selectedPod || !isPodActive;
  
  let placeholderText = "Select a pod from the left pane...";
  if (selectedPod) {
    placeholderText = isPodActive ? "Ask a question..." : "Pod resolved/deleted (Chat disabled)";
  }

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChatHistory]);

  const fetchInsights = async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    try {
      const headers = { 'X-Service-Token': SERVICE_TOKEN };
      
      // Attempt to fetch from real endpoints, fallback to mock data on error
      const fetchWithMock = async (endpoint: string, mockData: any) => {
        try {
          const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers, credentials: 'include' });
          if (res.ok) return await res.json();
          throw new Error('Failed to fetch');
        } catch (e) {
          return mockData;
        }
      };

      const rawFailures = await fetchWithMock('/api/pods/failed', []);
      const failuresData = rawFailures && rawFailures.length > 0 ? rawFailures : [
        { pod_name: 'frontend-7c8589-abcd', namespace: 'default', status: 'CrashLoopBackOff', failure_reason: 'OOMKilled' },
        { pod_name: 'backend-worker-1234', namespace: 'production', status: 'Pending', failure_reason: 'Insufficient CPU' }
      ];
      setFailures(failuresData);

      const sessionsRes = await fetchWithMock(`/api/chat/sessions?user_id=${encodeURIComponent(config.bootData.user.login)}`, []);
      if (sessionsRes && sessionsRes.length > 0) {
        setSessionMeta(prev => {
           const next = { ...prev };
           for (const session of sessionsRes) {
               next[session.pod_name] = { count: session.message_count, namespace: session.namespace };
           }
           return next;
        });
      }




    } catch (error) {
      console.error('Error fetching insights', error);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedPod) return;

    // If chatSessions is already defined AND not an empty array when sessionMeta says count > 0, return
    const currentSessions = chatSessions[selectedPod];
    const metaCount = sessionMeta[selectedPod]?.count || 0;
    if (currentSessions !== undefined && !(currentSessions.length === 0 && metaCount > 0)) {
      return;
    }

    // Find namespace from failures or fallback to sessionMeta
    const selectedPodObj = failures.find(f => f.pod_name === selectedPod);
    const sessionObj = sessionMeta[selectedPod];

    // If we don't know the namespace yet from either source, wait until metadata loads
    if (!selectedPodObj && !sessionObj) return;

    const namespace = selectedPodObj ? selectedPodObj.namespace : sessionObj.namespace;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/chat/history?pod_name=${selectedPod}&namespace=${namespace}&user_id=${encodeURIComponent(config.bootData.user.login)}`, {
          headers: { 'X-Service-Token': SERVICE_TOKEN },
          credentials: 'include'
        });
        if (res.ok) {
          const history = await res.json();
          // Avoid caching empty array permanently if sessionMeta says messages exist
          if (history.length > 0 || metaCount === 0) {
            setChatSessions(prev => ({ ...prev, [selectedPod]: history }));
          }
        }
      } catch (e) {
        console.error('Failed to fetch chat history', e);
      }
    };
    
    fetchHistory();
  }, [selectedPod, failures, sessionMeta, chatSessions]);

  const handleSelectPod = (pod: string) => {
    setSelectedPod(pod);
    const metaCount = sessionMeta[pod]?.count || 0;
    if (metaCount > 0 && (!chatSessions[pod] || chatSessions[pod].length === 0)) {
      setChatSessions(prev => {
        const next = { ...prev };
        delete next[pod];
        return next;
      });
    }
  };

  useEffect(() => {
    fetchInsights();
    const interval = setInterval(() => {
      fetchInsights(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendChat = async () => {
    if (!chatInput.trim() || !selectedPod) return;
    
    const newHistory = [...currentChatHistory, { role: 'user' as const, text: chatInput }];
    setChatSessions(prev => ({ ...prev, [selectedPod]: newHistory }));
    setChatInput('');
    setChatLoading(true);

    try {
        const selectedPodObj = failures.find(f => f.pod_name === selectedPod);
        const namespace = selectedPodObj ? selectedPodObj.namespace : (sessionMeta[selectedPod]?.namespace || 'default');

        const response = await fetch(`${API_BASE_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Service-Token': SERVICE_TOKEN
          },
          credentials: 'include',
          body: JSON.stringify({ 
            prompt: chatInput, 
            pod_name: selectedPod, 
            namespace: namespace,
            user_id: config.bootData.user.login 
          })
        });

      if (response.ok) {
        const data = await response.json();
        setChatSessions(prev => ({
          ...prev,
          [selectedPod]: [...newHistory, { role: 'bot' as const, text: data.response }]
        }));
        setSessionMeta(prev => ({
          ...prev,
          [selectedPod]: {
            count: (prev[selectedPod]?.count || 0) + 2,
            namespace: namespace
          }
        }));
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Chat API failed');
      }
    } catch (e: any) {
      setChatSessions(prev => ({
        ...prev,
        [selectedPod]: [...newHistory, { role: 'bot' as const, text: `Error: ${e.message || 'The backend failed to process this request. You may have hit an LLM API rate limit!'}` }]
      }));
    } finally {
      setChatLoading(false);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, pod: string) => {
    e.stopPropagation();
    
    // Find namespace
    const selectedPodObj = failures.find(f => f.pod_name === pod);
    const namespace = selectedPodObj ? selectedPodObj.namespace : (sessionMeta[pod]?.namespace || 'default');

    try {
      await fetch(`${API_BASE_URL}/api/chat/history?pod_name=${pod}&namespace=${namespace}&user_id=${encodeURIComponent(config.bootData.user.login)}`, {
        method: 'DELETE',
        headers: { 'X-Service-Token': SERVICE_TOKEN },
        credentials: 'include'
      });
      
      setChatSessions(prev => {
        const next = { ...prev };
        delete next[pod];
        return next;
      });
      setSessionMeta(prev => {
        const next = { ...prev };
        delete next[pod];
        return next;
      });
      if (selectedPod === pod) setSelectedPod(null);
    } catch (e) {
      console.error('Failed to delete chat history', e);
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Pane - Dashboard */}
      <div className={styles.leftPane}>
        <h2>Kure Insights</h2>
        {loading ? <Spinner /> : (
          <>
            <TabsBar>
              <Tab label="Failure Feed" active={activeTab === 'failures'} onChangeTab={() => setActiveTab('failures')} />
              <Tab label="Chat History" active={activeTab === 'history'} onChangeTab={() => setActiveTab('history')} />
            </TabsBar>
            
            <TabContent className={styles.tabContent}>
              {activeTab === 'failures' && (
                <div className={styles.listContainer}>
                  {failures.map((f, i) => (
                    <Card key={i} onClick={() => handleSelectPod(f.pod_name)} className={selectedPod === f.pod_name ? styles.selectedCard : ''}>
                      <Card.Heading>{f.pod_name}</Card.Heading>
                      <Card.Description>
                        Namespace: {f.namespace} | Status: <strong>{f.status}</strong> | Reason: {f.reason || f.failure_reason}
                      </Card.Description>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'history' && (
                <div className={styles.listContainer}>
                  {Object.keys(sessionMeta).length === 0 ? (
                    <div style={{ color: '#888' }}>No chat history yet.</div>
                  ) : (
                    Object.keys(sessionMeta).map(pod => (
                      <Card key={pod} onClick={() => handleSelectPod(pod)} className={selectedPod === pod ? styles.selectedCard : ''}>
                        <Card.Heading>{pod}</Card.Heading>
                        <Card.Description>
                          {sessionMeta[pod]?.count || chatSessions[pod]?.length || 0} messages
                        </Card.Description>
                        <Card.Actions>
                          <IconButton name="trash-alt" onClick={(e) => handleDeleteChat(e, pod)} tooltip="Delete Chat" />
                        </Card.Actions>
                      </Card>
                    ))
                  )}
                </div>
              )}


            </TabContent>
          </>
        )}
      </div>

      {/* Right Pane - Chatbot */}
      <div className={styles.rightPane}>
        <h2>Chatbot {selectedPod && `(${selectedPod})`}</h2>
        <div className={styles.chatHistory}>
          {currentChatHistory.length === 0 ? (
            <div style={{ color: '#888' }}>{selectedPod ? `Ask a question about ${selectedPod}...` : 'Select a pod from the left pane to start chatting.'}</div>
          ) : (
            currentChatHistory.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? styles.chatMsgUser : styles.chatMsgBot}>
                <strong>{msg.role === 'user' ? 'You' : 'KureBot'}:</strong>
                <div className={styles.markdownWrapper}>
                  {msg.role === 'user' ? msg.text : <ReactMarkdown>{cleanText(msg.text)}</ReactMarkdown>}
                </div>
              </div>
            ))
          )}
          {chatLoading && (
            <div className={styles.chatMsgBot}>
              <strong>KureBot:</strong> <Spinner inline={true} /> <em style={{ marginLeft: '8px' }}>Thinking...</em>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className={styles.chatInputContainer}>
          <Input 
            value={chatInput} 
            onChange={(e) => setChatInput(e.currentTarget.value)} 
            onKeyDown={(e) => { if (e.key === 'Enter' && !isChatDisabled) handleSendChat(); }}
            placeholder={placeholderText}
            css=""
            disabled={isChatDisabled}
          />
          <Button onClick={handleSendChat} icon="message" disabled={isChatDisabled}>Send</Button>
        </div>
      </div>
    </div>
  );
}

const getStyles = () => {
  return {
    container: css`
      display: flex;
      height: calc(100vh - 65px);
      gap: 16px;
      padding: 16px;
      box-sizing: border-box;
      overflow: hidden;
    `,
    leftPane: css`
      flex: 1;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #ccc;
      padding-right: 16px;
      overflow: hidden;
    `,
    rightPane: css`
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `,
    tabContent: css`
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `,
    listContainer: css`
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
      flex: 1;
    `,
    selectedCard: css`
      border: 2px solid #3274d9;
    `,
    chatHistory: css`
      flex: 1;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 16px;
      overflow-y: auto;
      margin-bottom: 16px;
      background: #f9f9f9;
      color: #333;
    `,
    chatMsgUser: css`
      text-align: right;
      margin-bottom: 8px;
      background: #e1f5fe;
      padding: 8px;
      border-radius: 4px;
    `,
    chatMsgBot: css`
      text-align: left;
      margin-bottom: 8px;
      background: #eee;
      padding: 8px;
      border-radius: 4px;
    `,
    chatInputContainer: css`
      display: flex;
      gap: 8px;
    `,
    markdownWrapper: css`
      margin-top: 8px;
      line-height: 1.5;
      pre {
        background: #f4f5f5;
        color: #333;
        padding: 8px;
        border-radius: 4px;
        overflow-x: auto;
      }
      pre code {
        font-weight: normal;
        background: transparent;
        color: inherit;
        padding: 0;
      }
      code {
        font-family: monospace;
        background: #f4f5f5;
        color: #000;
        font-weight: bold;
        padding: 2px 4px;
        border-radius: 4px;
      }
      p {
        margin-bottom: 8px;
      }
      ul, ol {
        margin-left: 20px;
        margin-bottom: 8px;
      }
    `
  };
};
