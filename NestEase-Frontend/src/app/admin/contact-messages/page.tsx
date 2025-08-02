'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  FaEnvelope, 
  FaReply, 
  FaUser, 
  FaCalendarAlt,
  FaSpinner
} from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied' | 'closed';
  adminReply?: string;
  repliedBy?: string;
  repliedAt?: string;
  createdAt: string;
}

export default function ContactMessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    // Wait for authentication to complete before checking user role
    console.log('ContactMessages useEffect triggered');
    console.log('Loading state:', loading);
    console.log('User state:', user);
    console.log('Token in localStorage:', localStorage.getItem('token'));
    
    if (loading) {
      console.log('Still loading authentication, waiting...');
      return;
    }
    
    if (!user) {
      console.log('No user found, redirecting to login');
      router.push('/auth/login');
      return;
    }
    
    if (user.role.toLowerCase() !== 'admin') {
      console.log('User is not admin. Role:', user.role, 'User:', user);
      router.push('/auth/login');
      return;
    }
    
    console.log('User authenticated as admin, fetching messages...');
    fetchMessages();
  }, [user, loading, router]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/contact-messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setReplying(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/contact-messages/${selectedMessage.id}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply: replyText.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reply');
      }

      toast.success('Reply sent successfully');
      setShowReplyDialog(false);
      setReplyText('');
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      toast.error('Failed to send reply');
      console.error('Error sending reply:', error);
    } finally {
      setReplying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || loadingMessages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact Messages</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage and respond to customer inquiries</p>
      </div>

      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={getStatusColor(message.status)}>
                        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaUser />
                        <span>{message.name}</span>
                        <FaEnvelope />
                        <span>{message.email}</span>
                        <FaCalendarAlt />
                        <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {message.subject}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {message.message}
                    </p>

                    {message.adminReply && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaReply className="text-blue-600" />
                          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Admin Reply
                          </span>
                        </div>
                        <p className="text-blue-800 dark:text-blue-200">{message.adminReply}</p>
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                          Replied by {message.repliedBy} on {new Date(message.repliedAt!).toLocaleDateString()}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {message.status !== 'replied' && message.status !== 'closed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedMessage(message);
                            setShowReplyDialog(true);
                          }}
                          className="flex items-center gap-1"
                        >
                          <FaReply />
                          Reply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <FaEnvelope className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No messages found</h3>
            <p className="text-gray-600 dark:text-gray-400">No contact messages yet.</p>
          </div>
        )}
      </div>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
            <DialogDescription>
              Send a reply to the customer's inquiry. Your response will be sent via email.
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Original Message</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
                  <p><strong>Subject:</strong> {selectedMessage.subject}</p>
                  <p><strong>Message:</strong></p>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded border">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Your Reply</label>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={6}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReplyDialog(false);
                    setReplyText('');
                    setSelectedMessage(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReply}
                  disabled={replying || !replyText.trim()}
                  className="flex items-center gap-1"
                >
                  {replying ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaReply />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
