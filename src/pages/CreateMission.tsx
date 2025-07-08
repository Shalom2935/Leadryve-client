import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Target,
  Globe,
  Users,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const CreateMission = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    missionName: '',
    targetIndustry: '',
    targetLocation: '',
    clientType: 'b2b',
    contactChannels: {
      email: true,
      linkedin: false,
      phone: false,
    },
    leadTarget: 100,
    additionalNotes: '',
  });

  const totalSteps = 4;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (channel: 'email' | 'linkedin' | 'phone') => {
    setFormData((prev) => ({
      ...prev,
      contactChannels: {
        ...prev.contactChannels,
        [channel]: !prev.contactChannels[channel],
      },
    }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mission created successfully!");
    navigate('/');
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          return (
            <div
              key={stepNum}
              className={`flex items-center justify-center h-8 w-8 rounded-full transition-all 
                ${stepNum === step
                  ? 'step-active'
                  : stepNum < step
                  ? 'step-completed'
                  : 'bg-slate-100'
                }`}
            >
              {stepNum < step ? <Check size={16} /> : stepNum}
            </div>
          );
        })}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-center">Basic Information</CardTitle>
              <CardDescription className="text-center">
                Let's start with the basics of your mission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="missionName">Mission Name</Label>
                <Input
                  id="missionName"
                  name="missionName"
                  placeholder="e.g. Tech SaaS in California"
                  value={formData.missionName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetIndustry">Target Industry</Label>
                <Select
                  value={formData.targetIndustry}
                  onValueChange={(value) => handleSelectChange('targetIndustry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </>
        );
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-center">Target Location</CardTitle>
              <CardDescription className="text-center">
                Define the geographic focus of your mission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="targetLocation">Location</Label>
                <Input
                  id="targetLocation"
                  name="targetLocation"
                  placeholder="City, Region, or Country"
                  value={formData.targetLocation}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Client Type</Label>
                <RadioGroup 
                  value={formData.clientType}
                  onValueChange={(value) => handleSelectChange('clientType', value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="b2b" id="b2b" />
                    <Label htmlFor="b2b">B2B</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="b2c" id="b2c" />
                    <Label htmlFor="b2c">B2C</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both">Both</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </>
        );
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-center">Contact Methods</CardTitle>
              <CardDescription className="text-center">
                Choose how you want to reach out to your prospects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Authorized Contact Channels</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="email" 
                      checked={formData.contactChannels.email}
                      onCheckedChange={() => handleCheckboxChange('email')}
                    />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="linkedin" 
                      checked={formData.contactChannels.linkedin}
                      onCheckedChange={() => handleCheckboxChange('linkedin')}
                    />
                    <Label htmlFor="linkedin">LinkedIn</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="phone" 
                      checked={formData.contactChannels.phone}
                      onCheckedChange={() => handleCheckboxChange('phone')}
                    />
                    <Label htmlFor="phone">Phone</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leadTarget">Lead Target</Label>
                <Input
                  id="leadTarget"
                  name="leadTarget"
                  type="number"
                  placeholder="100"
                  value={formData.leadTarget}
                  onChange={handleChange}
                />
                <p className="text-xs text-slate-500">
                  Recommended: 100-200 leads for optimal results
                </p>
              </div>
            </CardContent>
          </>
        );
      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-center">Review & Launch</CardTitle>
              <CardDescription className="text-center">
                Confirm your mission details before launching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-start gap-2">
                    <Target size={18} className="text-leadryve-purple mt-0.5" />
                    <div>
                      <p className="font-medium">Mission Name</p>
                      <p className="text-sm">{formData.missionName || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users size={18} className="text-leadryve-purple mt-0.5" />
                    <div>
                      <p className="font-medium">Target</p>
                      <p className="text-sm">
                        {formData.targetIndustry || "Any industry"} • {formData.clientType.toUpperCase()} • 
                        {formData.leadTarget} leads
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe size={18} className="text-leadryve-purple mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm">{formData.targetLocation || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageSquare size={18} className="text-leadryve-purple mt-0.5" />
                    <div>
                      <p className="font-medium">Contact Methods</p>
                      <p className="text-sm">
                        {Object.entries(formData.contactChannels)
                          .filter(([_, enabled]) => enabled)
                          .map(([channel]) => channel.charAt(0).toUpperCase() + channel.slice(1))
                          .join(", ") || "None selected"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    placeholder="Any specific requirements or preferences..."
                    value={formData.additionalNotes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Create a Mission</h1>
          <p className="text-muted-foreground">Set up your new prospecting campaign.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-slate-200 shadow-sm">
            {renderStepIndicator()}
            {renderStepContent()}
            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-1 h-4 w-4" /> Back
                </Button>
              ) : (
                <Button type="button" variant="outline" asChild>
                  <Link to="/">Cancel</Link>
                </Button>
              )}
              {step < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="bg-leadryve-purple hover:bg-leadryve-purple/90">
                  <CheckCircle className="mr-1 h-4 w-4" /> Launch Mission
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
};

export default CreateMission;
