
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, User, Phone, Mail, DollarSign, Wifi, WashingMachine, Fingerprint, AirVent, Dumbbell, Battery, Droplet, ParkingMeter, Bath, Image, FileImage, FileVideo } from "lucide-react";

type SharingType = {
  [key: string]: number | null;
}

type AmenitiesType = {
  wifi: boolean;
  washingMachine: boolean;
  biometric: boolean;
  ac: boolean;
  gym: boolean;
  powerBackup: boolean;
  geyser: boolean;
  roWater: boolean;
  parking: boolean;
  housekeeping: boolean;
}

interface FormData {
  pgName: string;
  address: string;
  googleMapsLink: string;
  pgType: string;
  preferredTenants: string;
  ownerName: string;
  primaryMobile: string;
  secondaryMobile: string;
  whatsappNumber: string;
  email: string;
  sharingPrices: SharingType;
  deposit: string;
  refundPolicy: string;
  noticePeriod: string;
  amenities: AmenitiesType;
  bathroomType: string;
  otherAmenities: string;
  images: FileList | null;
  videoLink: string;
}

const PGListingForm: React.FC = () => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    pgName: '',
    address: '',
    googleMapsLink: '',
    pgType: 'co-living',
    preferredTenants: 'anyone',
    ownerName: '',
    primaryMobile: '',
    secondaryMobile: '',
    whatsappNumber: '',
    email: '',
    sharingPrices: {
      '1': null,
      '2': null,
      '3': null,
      '4': null,
      '5': null,
    },
    deposit: '',
    refundPolicy: '',
    noticePeriod: '',
    amenities: {
      wifi: false,
      washingMachine: false,
      biometric: false,
      ac: false,
      gym: false,
      powerBackup: false,
      geyser: false,
      roWater: false,
      parking: false,
      housekeeping: false,
    },
    bathroomType: 'attached',
    otherAmenities: '',
    images: null,
    videoLink: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [name]: !prev.amenities[name as keyof AmenitiesType]
      }
    }));
  };

  const handleSharingPriceChange = (key: string, value: string) => {
    const numValue = value === '' ? null : Number(value);
    setFormData((prev) => ({
      ...prev,
      sharingPrices: {
        ...prev.sharingPrices,
        [key]: numValue
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && e.target.files.length <= 10) {
      setFormData((prev) => ({ ...prev, images: e.target.files }));
    } else {
      toast({
        title: "Image Upload Error",
        description: "Please select between 1 and 10 images.",
        variant: "destructive",
      });
    }
  };

  const validateForm = (): boolean => {
    // Required fields
    const requiredFields = ['pgName', 'address', 'ownerName', 'primaryMobile', 'email'];
    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        toast({
          title: "Validation Error",
          description: `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate mobile number format
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.primaryMobile)) {
      toast({
        title: "Validation Error",
        description: "Primary mobile number must be 10 digits",
        variant: "destructive",
      });
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    // Validate at least one sharing price is entered
    const hasPrice = Object.values(formData.sharingPrices).some(price => price !== null && price > 0);
    if (!hasPrice) {
      toast({
        title: "Validation Error",
        description: "Enter at least one sharing option price",
        variant: "destructive",
      });
      return false;
    }

    // Check that at least one image is uploaded
    if (!formData.images || formData.images.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPreview(true);
      window.scrollTo(0, 0);
    }
  };

  const handlePost = () => {
    toast({
      title: "Success!",
      description: "Your PG listing has been posted successfully.",
    });
    // Here you would typically submit the form data to your backend
    console.log("Form data submitted:", formData);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {!showPreview ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create PG Listing</h2>
              <p className="text-gray-500 mb-4">Fill in the details to list your PG accommodation</p>
            </div>

            {/* Basic Info Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium flex items-center mb-4 text-gray-900">
                <MapPin className="mr-2 h-5 w-5 text-purple-500" />
                Basic Information
              </h3>
              <Separator className="mb-6" />
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pgName">PG Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="pgName"
                    name="pgName"
                    value={formData.pgName}
                    onChange={handleInputChange}
                    placeholder="e.g., Comfort Stay PG"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Full address with landmark"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="googleMapsLink">Google Maps Link</Label>
                  <Input
                    id="googleMapsLink"
                    name="googleMapsLink"
                    value={formData.googleMapsLink}
                    onChange={handleInputChange}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>PG Type</Label>
                  <RadioGroup
                    defaultValue={formData.pgType}
                    onValueChange={(value) => handleRadioChange('pgType', value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ladies" id="ladies" />
                      <Label htmlFor="ladies">Ladies</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gents" id="gents" />
                      <Label htmlFor="gents">Gents</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="co-living" id="co-living" />
                      <Label htmlFor="co-living">Co-living</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-3">
                  <Label>Preferred Tenants</Label>
                  <RadioGroup
                    defaultValue={formData.preferredTenants}
                    onValueChange={(value) => handleRadioChange('preferredTenants', value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="students" id="students" />
                      <Label htmlFor="students">Students</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="professionals" id="professionals" />
                      <Label htmlFor="professionals">Professionals</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="anyone" id="anyone" />
                      <Label htmlFor="anyone">Anyone</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Owner Details Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium flex items-center mb-4 text-gray-900">
                <User className="mr-2 h-5 w-5 text-purple-500" />
                Owner Details
              </h3>
              <Separator className="mb-6" />
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    placeholder="Full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primaryMobile">Primary Mobile <span className="text-red-500">*</span></Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      +91
                    </span>
                    <Input
                      id="primaryMobile"
                      name="primaryMobile"
                      value={formData.primaryMobile}
                      onChange={handleInputChange}
                      className="rounded-l-none"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      pattern="\d{10}"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryMobile">Secondary Mobile</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      +91
                    </span>
                    <Input
                      id="secondaryMobile"
                      name="secondaryMobile"
                      value={formData.secondaryMobile}
                      onChange={handleInputChange}
                      className="rounded-l-none"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      pattern="\d{10}"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      +91
                    </span>
                    <Input
                      id="whatsappNumber"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      className="rounded-l-none"
                      placeholder="WhatsApp number"
                      maxLength={10}
                      pattern="\d{10}"
                    />
                  </div>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Room & Pricing Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium flex items-center mb-4 text-gray-900">
                <DollarSign className="mr-2 h-5 w-5 text-purple-500" />
                Room & Pricing
              </h3>
              <Separator className="mb-6" />
              
              <p className="text-sm text-gray-500 mb-4">Enter the monthly rent based on sharing type (fill only applicable options)</p>
              
              <div className="grid grid-cols-2 gap-6 md:grid-cols-5 mb-6">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="space-y-2">
                    <Label htmlFor={`sharing${num}`}>{num === 1 ? 'Single' : `${num} Sharing`}</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        ₹
                      </span>
                      <Input
                        id={`sharing${num}`}
                        type="number"
                        min="0"
                        value={formData.sharingPrices[num.toString()] === null ? '' : formData.sharingPrices[num.toString()]}
                        onChange={(e) => handleSharingPriceChange(num.toString(), e.target.value)}
                        className="rounded-l-none"
                        placeholder="Amount"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="deposit">Security Deposit</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      ₹
                    </span>
                    <Input
                      id="deposit"
                      name="deposit"
                      type="number"
                      min="0"
                      value={formData.deposit}
                      onChange={handleInputChange}
                      className="rounded-l-none"
                      placeholder="Amount"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refundPolicy">Refund Policy</Label>
                  <Input
                    id="refundPolicy"
                    name="refundPolicy"
                    value={formData.refundPolicy}
                    onChange={handleInputChange}
                    placeholder="e.g., Fully refundable after deductions"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="noticePeriod">Notice Period</Label>
                  <Input
                    id="noticePeriod"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleInputChange}
                    placeholder="e.g., 1 month"
                  />
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium mb-4 text-gray-900">Amenities</h3>
              <Separator className="mb-6" />
              
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5 mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="wifi" 
                    checked={formData.amenities.wifi}
                    onCheckedChange={() => handleCheckboxChange('wifi')}
                  />
                  <Label htmlFor="wifi" className="flex items-center">
                    <Wifi className="mr-1.5 h-4 w-4 text-purple-500" />
                    Wi-Fi
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="washingMachine" 
                    checked={formData.amenities.washingMachine}
                    onCheckedChange={() => handleCheckboxChange('washingMachine')}
                  />
                  <Label htmlFor="washingMachine" className="flex items-center">
                    <WashingMachine className="mr-1.5 h-4 w-4 text-purple-500" />
                    Washing Machine
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="biometric" 
                    checked={formData.amenities.biometric}
                    onCheckedChange={() => handleCheckboxChange('biometric')}
                  />
                  <Label htmlFor="biometric" className="flex items-center">
                    <Fingerprint className="mr-1.5 h-4 w-4 text-purple-500" />
                    Biometric
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ac" 
                    checked={formData.amenities.ac}
                    onCheckedChange={() => handleCheckboxChange('ac')}
                  />
                  <Label htmlFor="ac" className="flex items-center">
                    <AirVent className="mr-1.5 h-4 w-4 text-purple-500" />
                    AC
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="gym" 
                    checked={formData.amenities.gym}
                    onCheckedChange={() => handleCheckboxChange('gym')}
                  />
                  <Label htmlFor="gym" className="flex items-center">
                    <Dumbbell className="mr-1.5 h-4 w-4 text-purple-500" />
                    Gym
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="powerBackup" 
                    checked={formData.amenities.powerBackup}
                    onCheckedChange={() => handleCheckboxChange('powerBackup')}
                  />
                  <Label htmlFor="powerBackup" className="flex items-center">
                    <Battery className="mr-1.5 h-4 w-4 text-purple-500" />
                    Power Backup
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="geyser" 
                    checked={formData.amenities.geyser}
                    onCheckedChange={() => handleCheckboxChange('geyser')}
                  />
                  <Label htmlFor="geyser" className="flex items-center">
                    <Droplet className="mr-1.5 h-4 w-4 text-purple-500" />
                    Geyser
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="roWater" 
                    checked={formData.amenities.roWater}
                    onCheckedChange={() => handleCheckboxChange('roWater')}
                  />
                  <Label htmlFor="roWater" className="flex items-center">
                    <Droplet className="mr-1.5 h-4 w-4 text-purple-500" />
                    RO Water
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="parking" 
                    checked={formData.amenities.parking}
                    onCheckedChange={() => handleCheckboxChange('parking')}
                  />
                  <Label htmlFor="parking" className="flex items-center">
                    <ParkingMeter className="mr-1.5 h-4 w-4 text-purple-500" />
                    Parking
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="housekeeping" 
                    checked={formData.amenities.housekeeping}
                    onCheckedChange={() => handleCheckboxChange('housekeeping')}
                  />
                  <Label htmlFor="housekeeping">Housekeeping</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label>Bathroom Type</Label>
                  <RadioGroup
                    defaultValue={formData.bathroomType}
                    onValueChange={(value) => handleRadioChange('bathroomType', value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="attached" id="attached" />
                      <Label htmlFor="attached">Attached</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="common" id="common" />
                      <Label htmlFor="common">Common</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both" />
                      <Label htmlFor="both">Both</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otherAmenities">Other Amenities</Label>
                  <Textarea
                    id="otherAmenities"
                    name="otherAmenities"
                    value={formData.otherAmenities}
                    onChange={handleInputChange}
                    placeholder="Describe any additional amenities..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            {/* Media Uploads Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium flex items-center mb-4 text-gray-900">
                <Image className="mr-2 h-5 w-5 text-purple-500" />
                Media Uploads
              </h3>
              <Separator className="mb-6" />
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="images">Upload Images (1-10) <span className="text-red-500">*</span></Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload high-quality images of rooms, amenities, and common areas. Maximum 10 images.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="videoLink">Video Link (Optional)</Label>
                  <Input
                    id="videoLink"
                    name="videoLink"
                    value={formData.videoLink}
                    onChange={handleInputChange}
                    placeholder="YouTube or other video link"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Add a link to a walkthrough video of your PG accommodation
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Preview Listing
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-8 transition-all duration-500">
          {/* Preview Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Preview PG Listing</h2>
              <Button 
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Edit Listing
              </Button>
            </div>
            
            <div className="space-y-8">
              {/* Basic Info Preview */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-purple-500" />
                  Basic Information
                </h3>
                <Separator className="mb-4" />
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">PG Name</p>
                    <p className="text-base">{formData.pgName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-base">{formData.address}</p>
                  </div>
                  
                  {formData.googleMapsLink && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Google Maps Link</p>
                      <a 
                        href={formData.googleMapsLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {formData.googleMapsLink}
                      </a>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">PG Type</p>
                    <p className="text-base capitalize">{formData.pgType}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Preferred Tenants</p>
                    <p className="text-base capitalize">{formData.preferredTenants}</p>
                  </div>
                </div>
              </div>
              
              {/* Owner Details Preview */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="mr-2 h-5 w-5 text-purple-500" />
                  Owner Details
                </h3>
                <Separator className="mb-4" />
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Owner Name</p>
                    <p className="text-base">{formData.ownerName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Primary Contact</p>
                    <p className="text-base">+91 {formData.primaryMobile}</p>
                  </div>
                  
                  {formData.secondaryMobile && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Secondary Contact</p>
                      <p className="text-base">+91 {formData.secondaryMobile}</p>
                    </div>
                  )}
                  
                  {formData.whatsappNumber && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">WhatsApp</p>
                      <p className="text-base">+91 {formData.whatsappNumber}</p>
                    </div>
                  )}
                  
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base">{formData.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Room & Pricing Preview */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-purple-500" />
                  Room & Pricing
                </h3>
                <Separator className="mb-4" />
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Monthly Rent</p>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    {Object.entries(formData.sharingPrices).map(([key, value]) => {
                      if (value !== null && value > 0) {
                        return (
                          <div key={key} className="bg-purple-50 p-3 rounded-md">
                            <p className="text-sm text-gray-500">{key === '1' ? 'Single' : `${key} Sharing`}</p>
                            <p className="text-lg font-semibold text-purple-700">₹{value}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {formData.deposit && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Security Deposit</p>
                      <p className="text-base">₹{formData.deposit}</p>
                    </div>
                  )}
                  
                  {formData.refundPolicy && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Refund Policy</p>
                      <p className="text-base">{formData.refundPolicy}</p>
                    </div>
                  )}
                  
                  {formData.noticePeriod && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Notice Period</p>
                      <p className="text-base">{formData.noticePeriod}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Amenities Preview */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Amenities</h3>
                <Separator className="mb-4" />
                
                <div className="grid grid-cols-2 gap-2 mb-4 md:grid-cols-4">
                  {Object.entries(formData.amenities).map(([key, value]) => {
                    if (value) {
                      const label = key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase());
                      
                      return (
                        <div key={key} className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                          <p>{label}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bathroom Type</p>
                    <p className="text-base capitalize">{formData.bathroomType}</p>
                  </div>
                  
                  {formData.otherAmenities && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Other Amenities</p>
                      <p className="text-base">{formData.otherAmenities}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Media Preview */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Image className="mr-2 h-5 w-5 text-purple-500" />
                  Media
                </h3>
                <Separator className="mb-4" />
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Images</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {formData.images && Array.from(formData.images).slice(0, 10).map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`PG image ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {formData.videoLink && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Video Link</p>
                    <a 
                      href={formData.videoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {formData.videoLink}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Button onClick={handlePost} className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg">
                Post PG Listing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PGListingForm;
