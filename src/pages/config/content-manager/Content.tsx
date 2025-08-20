import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { axiosInstance } from "@/api/axios/axiosInstance";

// Define interfaces for API responses
interface FAQ {
  id: string;
  type: string;
  question: string;
  answer: string;
  order: number;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

interface Policy {
  id: string;
  type: "privacy" | "terms";
  title: string;
  content: string;
  version: string;
  effectiveDate: string;
  isPublished: boolean;
  previousVersions?: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface AboutSection {
  id?: string;
  title: string;
  content: string;
  order: number;
}

interface About {
  id: string;
  type: string;
  title: string;
  content: string;
  sections: AboutSection[];
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState("faqs");
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [policies, setPolicies] = useState<{ privacy?: Policy; terms?: Policy }>({});
  const [about, setAbout] = useState<About | null>(null);
  const [isLoading, setIsLoading] = useState({
    faqs: false,
    policies: false,
    about: false
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteFaq, setConfirmDeleteFaq] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  // FAQ states
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    order: 0,
  });

  // Policy states
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [editingPolicyType, setEditingPolicyType] = useState<"privacy" | "terms" | null>(null);
  const [policyForm, setPolicyForm] = useState({
    title: "",
    content: "",
    version: "",
    effectiveDate: "",
    isPublished: false,
  });

  // About states
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [aboutForm, setAboutForm] = useState<{
    title: string;
    content: string;
    sections: AboutSection[];
    isPublished: boolean;
  }>({
    title: "",
    content: "",
    sections: [],
    isPublished: false,
  });
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [sectionForm, setSectionForm] = useState({
    title: "",
    content: "",
    order: 0,
  });

  // Fetch data when tab changes
  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab]);

  const fetchTabData = async (tab: string) => {
    switch (tab) {
      case "faqs":
        if (faqs.length === 0) {
          setIsLoading(prev => ({ ...prev, faqs: true }));
          await fetchFAQs();
          setIsLoading(prev => ({ ...prev, faqs: false }));
        }
        break;
      case "policies":
        if (!policies.privacy && !policies.terms) {
          setIsLoading(prev => ({ ...prev, policies: true }));
          await fetchPolicies();
          setIsLoading(prev => ({ ...prev, policies: false }));
        }
        break;
      case "about":
        if (!about) {
          setIsLoading(prev => ({ ...prev, about: true }));
          await fetchAbout();
          setIsLoading(prev => ({ ...prev, about: false }));
        }
        break;
    }
  };

  const fetchFAQs = async () => {
    try {
      const faqRes = await axiosInstance.get("/getAllFAQs");
      const faqData = faqRes.data?.data && Array.isArray(faqRes.data.data) ? faqRes.data.data : [];
      setFaqs(faqData);
      if (faqData.length === 0) {
        toast({
          title: "Info",
          description: "No FAQs found. You can create one.",
          variant: "default",
        });
      }
    } catch (err: any) {
      console.error("FAQ Fetch Error:", err);
      setFaqs([]);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to fetch FAQs. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchPolicies = async () => {
    try {
      // Fetch Privacy Policy
      try {
        const privacyRes = await axiosInstance.get("/getPolicy?type=privacy");
        if (privacyRes.data?.data) {
          setPolicies(prev => ({ ...prev, privacy: privacyRes.data.data }));
        }
      } catch (err: any) {
        console.error("Privacy Policy Fetch Error:", err);
      }

      // Fetch Terms Policy
      try {
        const termsRes = await axiosInstance.get("/getPolicy?type=terms");
        if (termsRes.data?.data) {
          setPolicies(prev => ({ ...prev, terms: termsRes.data.data }));
        }
      } catch (err: any) {
        console.error("Terms Policy Fetch Error:", err);
      }
    } catch (error) {
      console.error("General Policy Fetch Error:", error);
    }
  };

  const fetchAbout = async () => {
    try {
      const aboutRes = await axiosInstance.get("/getAbout");
      if (aboutRes.data?.data) {
        setAbout(aboutRes.data.data);
      }
    } catch (err: any) {
      console.error("About Fetch Error:", err);
      setAbout(null);
    }
  };

  const handleError = (error: any, fallbackMessage: string) => {
    let message = fallbackMessage;
    let details: string[] = [];
    if (error.response?.data) {
      const { error: errMsg, details: errDetails } = error.response.data;
      message = errMsg || message;
      details = errDetails || [];
    } else if (error.message) {
      message = error.message;
    }
    toast({
      title: "Error",
      description: details.length > 0 ? details.join(", ") : message,
      variant: "destructive",
    });
  };

  // FAQ Functions
  const openFaqModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setFaqForm({
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
      });
    } else {
      setEditingFaq(null);
      setFaqForm({
        question: "",
        answer: "",
        order: 0,
      });
    }
    setFaqModalOpen(true);
  };

  const handleSaveFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast({
        title: "Validation Error",
        description: "Question and answer are required and must be non-empty strings",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingId(editingFaq ? editingFaq.id : "new-faq");
      if (editingFaq) {
        const res = await axiosInstance.put(`/updateFAQ?id=${editingFaq.id}`, faqForm);
        if (res.data?.data) {
          setFaqs(prev => prev.map(f => (f.id === editingFaq.id ? { ...f, ...res.data.data } : f)));
          toast({ title: "Success", description: "FAQ item updated successfully" });
        }
      } else {
        const res = await axiosInstance.post("/createFAQ", faqForm);
        if (res.data?.data) {
          setFaqs(prev => [...prev, res.data.data]);
          toast({ title: "Success", description: "FAQ item created successfully" });
        }
      }
      setFaqModalOpen(false);
      setEditingFaq(null);
    } catch (error) {
      handleError(error, "Failed to save FAQ");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      setDeletingId(id);
      await axiosInstance.delete(`/deleteFAQ?id=${id}`);
      setFaqs(prev => prev.filter(f => f.id !== id));
      toast({ title: "Success", description: "FAQ item deleted successfully" });
      setConfirmDeleteFaq({ open: false, id: null });
    } catch (error) {
      handleError(error, "Failed to delete FAQ");
    } finally {
      setDeletingId(null);
    }
  };

  // Policy Functions
  const openPolicyModal = (type: "privacy" | "terms", policy?: Policy) => {
    setEditingPolicyType(type);
    if (policy) {
      setPolicyForm({
        title: policy.title || "",
        content: policy.content,
        version: policy.version,
        effectiveDate: policy.effectiveDate,
        isPublished: policy.isPublished,
      });
    } else {
      setPolicyForm({
        title: "",
        content: "",
        version: "",
        effectiveDate: "",
        isPublished: false,
      });
    }
    setPolicyModalOpen(true);
  };

  const handleSavePolicy = async () => {
    if (!policyForm.content.trim() || !policyForm.version.trim() || !policyForm.effectiveDate.trim()) {
      toast({
        title: "Validation Error",
        description: "Content, version, and effective date are required and must be non-empty",
        variant: "destructive",
      });
      return;
    }

    if (!editingPolicyType) {
      toast({
        title: "Validation Error",
        description: "Policy type is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingId(`policy-${editingPolicyType}`);
      const payload = { ...policyForm, type: editingPolicyType };
      const res = await axiosInstance.post("/createOrUpdatePolicy", payload);
      if (res.data?.data) {
        setPolicies(prev => ({ ...prev, [editingPolicyType]: res.data.data }));
        toast({ title: "Success", description: "Policy updated successfully" });
      }
      setPolicyModalOpen(false);
      setEditingPolicyType(null);
    } catch (error) {
      handleError(error, "Failed to save policy");
    } finally {
      setUpdatingId(null);
    }
  };

  // About Functions
  const openAboutModal = (aboutData?: About) => {
    if (aboutData) {
      setAboutForm({
        title: aboutData.title || "",
        content: aboutData.content,
        sections: aboutData.sections.map(sec => ({ ...sec })),
        isPublished: aboutData.isPublished,
      });
    } else {
      setAboutForm({
        title: "",
        content: "",
        sections: [],
        isPublished: false,
      });
    }
    setAboutModalOpen(true);
  };

  const handleSaveAbout = async () => {
    if (!aboutForm.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Main content is required and must be non-empty",
        variant: "destructive",
      });
      return;
    }
    if (aboutForm.sections.some(sec => !sec.title.trim() || !sec.content.trim())) {
      toast({
        title: "Validation Error",
        description: "All sections must have non-empty title and content",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingId("about");
      const res = await axiosInstance.post("/createOrUpdateAbout", aboutForm);
      if (res.data?.data) {
        setAbout(res.data.data);
        toast({ title: "Success", description: "About content updated successfully" });
      }
      setAboutModalOpen(false);
    } catch (error) {
      handleError(error, "Failed to save about content");
    } finally {
      setUpdatingId(null);
    }
  };

  const openSectionModal = (index?: number) => {
    if (index !== undefined) {
      const section = aboutForm.sections[index];
      setSectionForm({
        title: section.title,
        content: section.content,
        order: section.order,
      });
      setEditingSectionIndex(index);
    } else {
      setSectionForm({
        title: "",
        content: "",
        order: aboutForm.sections.length + 1,
      });
      setEditingSectionIndex(null);
    }
    setSectionModalOpen(true);
  };

  const handleSaveSection = () => {
    if (!sectionForm.title.trim() || !sectionForm.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Section title and content are required and must be non-empty",
        variant: "destructive",
      });
      return;
    }

    const newSections = [...aboutForm.sections];
    if (editingSectionIndex !== null) {
      newSections[editingSectionIndex] = { ...sectionForm };
    } else {
      newSections.push({
        ...sectionForm,
        id: `section_${Date.now()}_${newSections.length}`,
      });
    }
    setAboutForm({ ...aboutForm, sections: newSections });
    setSectionModalOpen(false);
    setEditingSectionIndex(null);
  };

  const handleDeleteSection = (index: number) => {
    const newSections = aboutForm.sections.filter((_, i) => i !== index);
    setAboutForm({ ...aboutForm, sections: newSections });
  };

  const isSavingFaq = updatingId?.startsWith("new-faq") || (editingFaq && updatingId === editingFaq.id);
  const isSavingPolicy = updatingId?.startsWith("policy-");
  const isSavingAbout = updatingId === "about";

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Content Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage FAQs, Policies, and About content for your application
          </p>
        </div>
        <div className="rounded-md border p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faqs" className="space-y-4">
              <Button
                onClick={() => openFaqModal()}
                className="flex items-center gap-2"
                disabled={isSavingFaq || !!deletingId}
              >
                <Plus className="h-4 w-4" />
                {isSavingFaq ? "Saving..." : "Add New FAQ"}
              </Button>
              
              {isLoading.faqs ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex items-center justify-end gap-1">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : faqs.length === 0 ? (
                <p className="text-gray-500">No FAQs found. Create one to get started.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-2"
                    >
                      <h3 className="font-semibold truncate">{faq.question}</h3>
                      <p className="text-sm text-gray-600 line-clamp-3">{faq.answer}</p>
                      <div className="text-xs text-gray-500">Order: {faq.order}</div>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openFaqModal(faq)}
                          disabled={updatingId === faq.id || deletingId === faq.id}
                          aria-label={`Edit FAQ: ${faq.question}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmDeleteFaq({ open: true, id: faq.id })}
                          disabled={updatingId === faq.id || deletingId === faq.id}
                          aria-label={`Delete FAQ: ${faq.question}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Dialog open={faqModalOpen} onOpenChange={(open) => !open && setFaqModalOpen(false)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingFaq ? "Edit FAQ" : "Create FAQ"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="faq-question">Question (required)</Label>
                      <Input
                        id="faq-question"
                        value={faqForm.question}
                        onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                        placeholder="Enter question"
                      />
                    </div>
                    <div>
                      <Label htmlFor="faq-answer">Answer (required)</Label>
                      <Textarea
                        id="faq-answer"
                        value={faqForm.answer}
                        onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                        placeholder="Enter answer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="faq-order">Order (optional)</Label>
                      <Input
                        id="faq-order"
                        type="number"
                        value={faqForm.order}
                        onChange={(e) => setFaqForm({ ...faqForm, order: parseInt(e.target.value) || 0 })}
                        placeholder="Enter order"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSaveFaq} disabled={isSavingFaq}>
                      {isSavingFaq ? "Saving..." : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog
                open={confirmDeleteFaq.open}
                onOpenChange={(open) => setConfirmDeleteFaq({ open, id: open ? confirmDeleteFaq.id : null })}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete FAQ</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this FAQ item? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setConfirmDeleteFaq({ open: false, id: null })}
                      disabled={!!deletingId}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => confirmDeleteFaq.id && handleDeleteFaq(confirmDeleteFaq.id)}
                      disabled={deletingId === confirmDeleteFaq.id}
                    >
                      {deletingId === confirmDeleteFaq.id ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="policies" className="space-y-8">
              {isLoading.policies ? (
                <div className="space-y-8">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-9 w-20" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                (["privacy", "terms"] as const).map((type) => {
                  const policy = policies[type];
                  return (
                    <div key={type} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">
                          {type.charAt(0).toUpperCase() + type.slice(1)} Policy
                        </h3>
                        <Button
                          onClick={() => openPolicyModal(type, policy)}
                          disabled={isSavingPolicy || !!deletingId}
                        >
                          {isSavingPolicy && updatingId === `policy-${type}` 
                            ? "Saving..." 
                            : policy ? "Edit" : "Create"
                          }
                        </Button>
                      </div>
                      {policy ? (
                        <div className="space-y-2">
                          <p>
                            <strong>Title:</strong> {policy.title || "Untitled"}
                          </p>
                          <p>
                            <strong>Version:</strong> {policy.version}
                          </p>
                          <p>
                            <strong>Effective Date:</strong> {policy.effectiveDate}
                          </p>
                          <p>
                            <strong>Published:</strong> {policy.isPublished ? "Yes" : "No"}
                          </p>
                          <div>
                            <strong>Content Preview:</strong>
                            <p className="text-sm text-gray-600 line-clamp-3">{policy.content}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          No {type} policy found. Click "Create" to add one.
                        </p>
                      )}
                    </div>
                  );
                })
              )}
              
              <Dialog open={policyModalOpen} onOpenChange={(open) => !open && setPolicyModalOpen(false)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPolicyType && policies[editingPolicyType] ? "Update" : "Create"}{" "}
                      {editingPolicyType?.charAt(0).toUpperCase() + editingPolicyType?.slice(1)} Policy
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="policy-title">Title (optional)</Label>
                      <Input
                        id="policy-title"
                        value={policyForm.title}
                        onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
                        placeholder="Enter title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="policy-content">Content (required)</Label>
                      <Textarea
                        id="policy-content"
                        value={policyForm.content}
                        onChange={(e) => setPolicyForm({ ...policyForm, content: e.target.value })}
                        placeholder="Enter policy content"
                        rows={8}
                      />
                    </div>
                    <div>
                      <Label htmlFor="policy-version">Version (required)</Label>
                      <Input
                        id="policy-version"
                        value={policyForm.version}
                        onChange={(e) => setPolicyForm({ ...policyForm, version: e.target.value })}
                        placeholder="e.g., 1.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="policy-effectiveDate">Effective Date (required)</Label>
                      <Input
                        id="policy-effectiveDate"
                        type="date"
                        value={policyForm.effectiveDate}
                        onChange={(e) => setPolicyForm({ ...policyForm, effectiveDate: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="policy-isPublished">Published</Label>
                      <Switch
                        id="policy-isPublished"
                        checked={policyForm.isPublished}
                        onCheckedChange={(checked) => setPolicyForm({ ...policyForm, isPublished: checked })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleSavePolicy} 
                      disabled={isSavingPolicy}
                    >
                      {isSavingPolicy ? "Saving..." : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="about" className="space-y-4">
              <Button
                onClick={() => openAboutModal(about)}
                disabled={isSavingAbout || !!deletingId}
              >
                {isSavingAbout ? "Saving..." : about ? "Edit About Content" : "Create About Content"}
              </Button>
              
              {isLoading.about ? (
                <div className="border p-4 rounded-lg space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ) : about ? (
                <div className="border p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">{about.title || "About Us"}</h3>
                  <p className="text-gray-600">{about.content}</p>
                  <div className="flex items-center gap-2">
                    <span>Published:</span> {about.isPublished ? "Yes" : "No"}
                  </div>
                  <h4 className="font-medium">Sections</h4>
                  {about.sections.length > 0 ? (
                    about.sections.map((sec) => (
                      <div key={sec.id || `${sec.title}-${sec.order}`} className="border-t pt-2">
                        <h5 className="font-semibold">{sec.title}</h5>
                        <p className="text-sm text-gray-600">{sec.content}</p>
                        <div className="text-xs">Order: {sec.order}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No sections added.</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No about content found. Click "Create" to add one.</p>
              )}
              
              <Dialog open={aboutModalOpen} onOpenChange={(open) => !open && setAboutModalOpen(false)}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{about ? "Update" : "Create"} About Content</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="about-title">Title (optional)</Label>
                      <Input
                        id="about-title"
                        value={aboutForm.title}
                        onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                        placeholder="Enter title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="about-content">Main Content (required)</Label>
                      <Textarea
                        id="about-content"
                        value={aboutForm.content}
                        onChange={(e) => setAboutForm({ ...aboutForm, content: e.target.value })}
                        placeholder="Enter main about content"
                        rows={6}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="about-isPublished">Published</Label>
                      <Switch
                        id="about-isPublished"
                        checked={aboutForm.isPublished}
                        onCheckedChange={(checked) => setAboutForm({ ...aboutForm, isPublished: checked })}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Sections</h4>
                        <Button
                          variant="outline"
                          onClick={() => openSectionModal()}
                          className="flex items-center gap-2"
                          disabled={isSavingAbout || !!deletingId}
                        >
                          <Plus className="h-4 w-4" /> Add Section
                        </Button>
                      </div>
                      {aboutForm.sections.length > 0 ? (
                        <div className="space-y-4">
                          {aboutForm.sections.map((sec, index) => (
                            <div
                              key={index}
                              className="border p-3 rounded-md flex justify-between items-start"
                            >
                              <div>
                                <h5 className="font-semibold">{sec.title}</h5>
                                <p className="text-sm text-gray-600 line-clamp-2">{sec.content}</p>
                                <div className="text-xs">Order: {sec.order}</div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openSectionModal(index)}
                                  disabled={isSavingAbout || !!deletingId}
                                  aria-label={`Edit section: ${sec.title}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteSection(index)}
                                  disabled={isSavingAbout || !!deletingId}
                                  aria-label={`Delete section: ${sec.title}`}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No sections added yet.</p>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button onClick={handleSaveAbout} disabled={isSavingAbout}>
                      {isSavingAbout ? "Saving..." : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={sectionModalOpen} onOpenChange={(open) => !open && setSectionModalOpen(false)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingSectionIndex !== null ? "Edit Section" : "Add Section"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="section-title">Title (required)</Label>
                      <Input
                        id="section-title"
                        value={sectionForm.title}
                        onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                        placeholder="Enter section title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="section-content">Content (required)</Label>
                      <Textarea
                        id="section-content"
                        value={sectionForm.content}
                        onChange={(e) => setSectionForm({ ...sectionForm, content: e.target.value })}
                        placeholder="Enter section content"
                      />
                    </div>
                    <div>
                      <Label htmlFor="section-order">Order (optional)</Label>
                      <Input
                        id="section-order"
                        type="number"
                        value={sectionForm.order}
                        onChange={(e) => setSectionForm({ ...sectionForm, order: parseInt(e.target.value) || 0 })}
                        placeholder="Enter order"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSaveSection} disabled={isSavingAbout || !!deletingId}>
                      Save Section
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}