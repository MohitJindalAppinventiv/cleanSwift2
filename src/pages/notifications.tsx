// import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { AlertCircle, CheckCircle, Send, TestTube } from "lucide-react";
// import { useState } from "react";
// import {axiosInstance} from "@/api/axios/axiosInstance";

// const NotificationsPage = () => {
//   const [topicForm, setTopicForm] = useState({
//     topic: "",
//     title: "",
//     body: "",
//     imageUrl: "",
//     data: "{}"
//   });
  
//   const [testForm, setTestForm] = useState({
//     userId: "",
//     title: "",
//     body: "",
//     imageUrl: "",
//     data: "{}"
//   });
  
//   const [loading, setLoading] = useState({
//     topic: false,
//     test: false
//   });
  
//   const [responses, setResponses] = useState({
//     topic: null,
//     test: null
//   });

//   const getNotificationIcon = (type: string) => {
//     switch (type) {
//       case "order":
//         return <Send className="h-4 w-4" />;
//       case "payment":
//         return <CheckCircle className="h-4 w-4" />;
//       case "review":
//         return <TestTube className="h-4 w-4" />;
//       case "system":
//         return <AlertCircle className="h-4 w-4" />;
//       default:
//         return <Send className="h-4 w-4" />;
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "high":
//         return "bg-red-100 text-red-800";
//       case "medium":
//         return "bg-yellow-100 text-yellow-800";
//       case "low":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getFirebaseToken = async () => {
//     // Authentication is handled by axiosInstance interceptor
//     return true;
//   };

//   const sendTopicNotification = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(prev => ({ ...prev, topic: true }));
//     setResponses(prev => ({ ...prev, topic: null }));

//     try {
//       await getFirebaseToken();
      
//       let parsedData = {};
//       if (topicForm.data.trim()) {
//         try {
//           parsedData = JSON.parse(topicForm.data);
//         } catch {
//           throw new Error('Invalid JSON in data field');
//         }
//       }

//       const response = await axiosInstance.post('/sendTopicNotification', {
//         topic: topicForm.topic,
//         title: topicForm.title,
//         body: topicForm.body,
//         imageUrl: topicForm.imageUrl || undefined,
//         data: parsedData
//       });

//       const result = response.data;
//       setResponses(prev => ({ ...prev, topic: result }));
      
//       if (result.success) {
//         setTopicForm({
//           topic: "",
//           title: "",
//           body: "",
//           imageUrl: "",
//           data: "{}"
//         });
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
//       setResponses(prev => ({ 
//         ...prev, 
//         topic: { 
//           success: false, 
//           message: errorMessage,
//           errors: error.response?.data?.errors
//         } 
//       }));
//     } finally {
//       setLoading(prev => ({ ...prev, topic: false }));
//     }
//   };

//   const sendTestNotification = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(prev => ({ ...prev, test: true }));
//     setResponses(prev => ({ ...prev, test: null }));

//     try {
//       await getFirebaseToken();
      
//       let parsedData = {};
//       if (testForm.data.trim()) {
//         try {
//           parsedData = JSON.parse(testForm.data);
//         } catch {
//           throw new Error('Invalid JSON in data field');
//         }
//       }

//       const response = await axiosInstance.post('/sendTestNotification', {
//         userId: testForm.userId,
//         title: testForm.title || undefined,
//         body: testForm.body || undefined,
//         imageUrl: testForm.imageUrl || undefined,
//         data: parsedData
//       });

//       const result = response.data;
//       setResponses(prev => ({ ...prev, test: result }));
      
//       if (result.success) {
//         setTestForm({
//           userId: "",
//           title: "",
//           body: "",
//           imageUrl: "",
//           data: "{}"
//         });
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
//       setResponses(prev => ({ 
//         ...prev, 
//         test: { 
//           success: false, 
//           message: errorMessage,
//           error: error.response?.data?.error
//         } 
//       }));
//     } finally {
//       setLoading(prev => ({ ...prev, test: false }));
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-3xl font-bold tracking-tight">Send Notifications</h2>
//             <p className="text-muted-foreground">
//               Send push notifications to your users
//             </p>
//           </div>
//         </div>

//         {/* Send Notifications Section */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Send Notifications</CardTitle>
//             <CardDescription>
//               Send push notifications to your users
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Tabs defaultValue="topic" className="w-full">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="topic">Topic Notification</TabsTrigger>
//                 <TabsTrigger value="test">Test Notification</TabsTrigger>
//               </TabsList>
              
//               <TabsContent value="topic" className="space-y-4">
//                 <form onSubmit={sendTopicNotification} className="space-y-4">
//                   <div className="grid gap-4 md:grid-cols-2">
//                     <div className="space-y-2">
//                       <Label htmlFor="topic">Topic *</Label>
//                       <Select
//                         value={topicForm.topic}
//                         onValueChange={(value) => setTopicForm(prev => ({ ...prev, topic: value }))}
//                         required
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a topic" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="offers">Offers</SelectItem>
//                           <SelectItem value="news">News</SelectItem>
//                           <SelectItem value="app-updates">App Updates</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="title">Title *</Label>
//                       <Input
//                         id="title"
//                         placeholder="Notification title (max 100 chars)"
//                         maxLength={100}
//                         value={topicForm.title}
//                         onChange={(e) => setTopicForm(prev => ({ ...prev, title: e.target.value }))}
//                         required
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="body">Message *</Label>
//                     <Textarea
//                       id="body"
//                       placeholder="Notification message (max 250 chars)"
//                       maxLength={250}
//                       value={topicForm.body}
//                       onChange={(e) => setTopicForm(prev => ({ ...prev, body: e.target.value }))}
//                       required
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="imageUrl">Image URL (Optional)</Label>
//                     <Input
//                       id="imageUrl"
//                       type="url"
//                       placeholder="https://example.com/image.jpg (max 500 chars)"
//                       maxLength={500}
//                       value={topicForm.imageUrl}
//                       onChange={(e) => setTopicForm(prev => ({ ...prev, imageUrl: e.target.value }))}
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="data">Data Payload (Optional JSON)</Label>
//                     <Textarea
//                       id="data"
//                       placeholder='{"key": "value"}'
//                       value={topicForm.data}
//                       onChange={(e) => setTopicForm(prev => ({ ...prev, data: e.target.value }))}
//                     />
//                   </div>
                  
//                   <Button type="submit" disabled={loading.topic} className="w-full">
//                     <Send className="w-4 h-4 mr-2" />
//                     {loading.topic ? "Sending..." : "Send Topic Notification"}
//                   </Button>
//                 </form>
                
//                 {responses.topic && (
//                   <div className={`p-4 rounded-lg ${responses.topic.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
//                     <div className="flex items-center">
//                       {responses.topic.success ? <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> : <AlertCircle className="w-4 h-4 mr-2 text-red-600" />}
//                       <span className={responses.topic.success ? 'text-green-800' : 'text-red-800'}>
//                         {responses.topic.message}
//                       </span>
//                     </div>
//                     {responses.topic.success && responses.topic.sentCount !== undefined && (
//                       <p className="text-sm text-green-600 mt-1">
//                         Sent: {responses.topic.sentCount}, Errors: {responses.topic.errorCount || 0}
//                       </p>
//                     )}
//                     {responses.topic.errors && responses.topic.errors.length > 0 && (
//                       <div className="mt-2">
//                         <p className="text-sm text-red-600">Errors:</p>
//                         <ul className="text-xs text-red-500 list-disc list-inside">
//                           {responses.topic.errors.map((error, index) => (
//                             <li key={index}>{error}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </TabsContent>
              
//               <TabsContent value="test" className="space-y-4">
//                 <form onSubmit={sendTestNotification} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="userId">User ID *</Label>
//                     <Input
//                       id="userId"
//                       placeholder="User ID to send test notification to"
//                       value={testForm.userId}
//                       onChange={(e) => setTestForm(prev => ({ ...prev, userId: e.target.value }))}
//                       required
//                     />
//                   </div>
                  
//                   <div className="grid gap-4 md:grid-cols-2">
//                     <div className="space-y-2">
//                       <Label htmlFor="testTitle">Title (Optional)</Label>
//                       <Input
//                         id="testTitle"
//                         placeholder="Test notification title"
//                         value={testForm.title}
//                         onChange={(e) => setTestForm(prev => ({ ...prev, title: e.target.value }))}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="testImageUrl">Image URL (Optional)</Label>
//                       <Input
//                         id="testImageUrl"
//                         type="url"
//                         placeholder="https://example.com/image.jpg"
//                         value={testForm.imageUrl}
//                         onChange={(e) => setTestForm(prev => ({ ...prev, imageUrl: e.target.value }))}
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="testBody">Message (Optional)</Label>
//                     <Textarea
//                       id="testBody"
//                       placeholder="Test notification message"
//                       value={testForm.body}
//                       onChange={(e) => setTestForm(prev => ({ ...prev, body: e.target.value }))}
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="testData">Data Payload (Optional JSON)</Label>
//                     <Textarea
//                       id="testData"
//                       placeholder='{"key": "value"}'
//                       value={testForm.data}
//                       onChange={(e) => setTestForm(prev => ({ ...prev, data: e.target.value }))}
//                     />
//                   </div>
                  
//                   <Button type="submit" disabled={loading.test} className="w-full">
//                     <TestTube className="w-4 h-4 mr-2" />
//                     {loading.test ? "Sending..." : "Send Test Notification"}
//                   </Button>
//                 </form>
                
//                 {responses.test && (
//                   <div className={`p-4 rounded-lg ${responses.test.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
//                     <div className="flex items-center">
//                       {responses.test.success ? <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> : <AlertCircle className="w-4 h-4 mr-2 text-red-600" />}
//                       <span className={responses.test.success ? 'text-green-800' : 'text-red-800'}>
//                         {responses.test.message}
//                       </span>
//                     </div>
//                     {responses.test.success && responses.test.messageId && (
//                       <p className="text-sm text-green-600 mt-1">
//                         Message ID: {responses.test.messageId}
//                       </p>
//                     )}
//                     {responses.test.error && (
//                       <p className="text-sm text-red-500 mt-1">
//                         Error: {responses.test.error}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default NotificationsPage;



import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Send, TestTube } from "lucide-react";
import { useState } from "react";
import { axiosInstance } from "@/api/axios/axiosInstance";

const NotificationsPage = () => {
  const [topicForm, setTopicForm] = useState({
    topic: "",
    title: "",
    body: "",
    data: "{}"
  });
  
  const [testForm, setTestForm] = useState({
    userId: "",
    title: "",
    body: "",
    data: "{}"
  });
  
  const [loading, setLoading] = useState({
    topic: false,
    test: false
  });
  
  const [responses, setResponses] = useState({
    topic: null,
    test: null
  });

  const getFirebaseToken = async () => {
    // Authentication is handled by axiosInstance interceptor
    return true;
  };

  const sendTopicNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, topic: true }));
    setResponses(prev => ({ ...prev, topic: null }));

    try {
      await getFirebaseToken();
      
      let parsedData = {};
      if (topicForm.data.trim()) {
        try {
          parsedData = JSON.parse(topicForm.data);
        } catch {
          throw new Error('Invalid JSON in data field');
        }
      }

      const response = await axiosInstance.post('/sendTopicNotification', {
        topic: topicForm.topic,
        title: topicForm.title,
        body: topicForm.body,
        data: parsedData
      });

      const result = response.data;
      setResponses(prev => ({ ...prev, topic: result }));
      
      if (result.success) {
        setTopicForm({
          topic: "",
          title: "",
          body: "",
          data: "{}"
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      setResponses(prev => ({ 
        ...prev, 
        topic: { 
          success: false, 
          message: errorMessage,
          errors: error.response?.data?.errors
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, topic: false }));
    }
  };

  const sendTestNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, test: true }));
    setResponses(prev => ({ ...prev, test: null }));

    try {
      await getFirebaseToken();
      
      let parsedData = {};
      if (testForm.data.trim()) {
        try {
          parsedData = JSON.parse(testForm.data);
        } catch {
          throw new Error('Invalid JSON in data field');
        }
      }

      const response = await axiosInstance.post('/sendTestNotification', {
        userId: testForm.userId,
        title: testForm.title || undefined,
        body: testForm.body || undefined,
        data: parsedData
      });

      const result = response.data;
      setResponses(prev => ({ ...prev, test: result }));
      
      if (result.success) {
        setTestForm({
          userId: "",
          title: "",
          body: "",
          data: "{}"
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      setResponses(prev => ({ 
        ...prev, 
        test: { 
          success: false, 
          message: errorMessage,
          error: error.response?.data?.error
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, test: false }));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Send Notifications</h2>
            <p className="text-muted-foreground">
              Send push notifications to your users
            </p>
          </div>
        </div>

        {/* Send Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Send Notifications</CardTitle>
            <CardDescription>
              Send push notifications to your users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="topic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="topic">Topic Notification</TabsTrigger>
                <TabsTrigger value="test">Test Notification</TabsTrigger>
              </TabsList>
              
              {/* Topic Notification Form */}
              <TabsContent value="topic" className="space-y-4">
                <form onSubmit={sendTopicNotification} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic *</Label>
                      <Select
                        value={topicForm.topic}
                        onValueChange={(value) => setTopicForm(prev => ({ ...prev, topic: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="offers">Offers</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="app-updates">App Updates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Notification title (max 100 chars)"
                        maxLength={100}
                        value={topicForm.title}
                        onChange={(e) => setTopicForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="body">Message *</Label>
                    <Textarea
                      id="body"
                      placeholder="Notification message (max 250 chars)"
                      maxLength={250}
                      value={topicForm.body}
                      onChange={(e) => setTopicForm(prev => ({ ...prev, body: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="data">Data Payload (Optional JSON)</Label>
                    <Textarea
                      id="data"
                      placeholder='{"key": "value"}'
                      value={topicForm.data}
                      onChange={(e) => setTopicForm(prev => ({ ...prev, data: e.target.value }))}
                    />
                  </div>
                  
                  <Button type="submit" disabled={loading.topic} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    {loading.topic ? "Sending..." : "Send Topic Notification"}
                  </Button>
                </form>
                
                {responses.topic && (
                  <div className={`p-4 rounded-lg ${responses.topic.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center">
                      {responses.topic.success ? <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> : <AlertCircle className="w-4 h-4 mr-2 text-red-600" />}
                      <span className={responses.topic.success ? 'text-green-800' : 'text-red-800'}>
                        {responses.topic.message}
                      </span>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              {/* Test Notification Form */}
              <TabsContent value="test" className="space-y-4">
                <form onSubmit={sendTestNotification} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userId">User ID *</Label>
                    <Input
                      id="userId"
                      placeholder="User ID to send test notification to"
                      value={testForm.userId}
                      onChange={(e) => setTestForm(prev => ({ ...prev, userId: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="testTitle">Title (Optional)</Label>
                      <Input
                        id="testTitle"
                        placeholder="Test notification title"
                        value={testForm.title}
                        onChange={(e) => setTestForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="testBody">Message (Optional)</Label>
                    <Textarea
                      id="testBody"
                      placeholder="Test notification message"
                      value={testForm.body}
                      onChange={(e) => setTestForm(prev => ({ ...prev, body: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="testData">Data Payload (Optional JSON)</Label>
                    <Textarea
                      id="testData"
                      placeholder='{"key": "value"}'
                      value={testForm.data}
                      onChange={(e) => setTestForm(prev => ({ ...prev, data: e.target.value }))}
                    />
                  </div>
                  
                  <Button type="submit" disabled={loading.test} className="w-full">
                    <TestTube className="w-4 h-4 mr-2" />
                    {loading.test ? "Sending..." : "Send Test Notification"}
                  </Button>
                </form>
                
                {responses.test && (
                  <div className={`p-4 rounded-lg ${responses.test.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center">
                      {responses.test.success ? <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> : <AlertCircle className="w-4 h-4 mr-2 text-red-600" />}
                      <span className={responses.test.success ? 'text-green-800' : 'text-red-800'}>
                        {responses.test.message}
                      </span>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
