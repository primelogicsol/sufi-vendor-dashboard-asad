"use client";

import React, { useState } from "react";
import { ApiClient } from "@/lib/utils/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ZipCodeRange {
  from: string;
  to: string;
}

interface ShippingRate {
  carrier: string;
  method: string;
  rateType: "FLAT_RATE" | "WEIGHT_BASED" | "PER_ITEM";
  baseRate?: number;
  perKgRate?: number;
  perItemRate?: number;
  freeShippingThreshold?: number;
  maxWeight?: number;
  estimatedDays?: number;
  isActive: boolean;
  description?: string;
}

interface ZoneFormData {
  zoneName: string;
  country: string;
  state?: string;
  zipCodeRanges: ZipCodeRange[];
  isActive: boolean;
  description?: string;
  shippingRates: ShippingRate[];
}

export default function ZoneRatesPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<ZoneFormData>({
    zoneName: "",
    country: "US",
    state: "",
    zipCodeRanges: [{ from: "", to: "" }],
    isActive: true,
    description: "",
    shippingRates: [],
  });

  // Zip Code Range Functions
  const addZipCodeRange = () => {
    setFormData((prev) => ({
      ...prev,
      zipCodeRanges: [...prev.zipCodeRanges, { from: "", to: "" }],
    }));
  };

  const removeZipCodeRange = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      zipCodeRanges: prev.zipCodeRanges.filter((_, i) => i !== index),
    }));
  };

  const updateZipCodeRange = (
    index: number,
    field: "from" | "to",
    value: string
  ) => {
    setFormData((prev) => {
      const newRanges = [...prev.zipCodeRanges];
      newRanges[index][field] = value;
      return { ...prev, zipCodeRanges: newRanges };
    });
  };

  // Shipping Rate Functions
  const addShippingRate = () => {
    setFormData((prev) => ({
      ...prev,
      shippingRates: [
        ...prev.shippingRates,
        {
          carrier: "FEDEX",
          method: "GROUND",
          rateType: "FLAT_RATE",
          baseRate: 0,
          perKgRate: 0,
          estimatedDays: 5,
          isActive: true,
          description: "",
        },
      ],
    }));
  };

  const removeShippingRate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      shippingRates: prev.shippingRates.filter((_, i) => i !== index),
    }));
  };

  const updateShippingRate = <K extends keyof ShippingRate>(
    index: number,
    field: K,
    value: ShippingRate[K]
  ) => {
    setFormData((prev) => {
      const newRates = [...prev.shippingRates];
      newRates[index] = { ...newRates[index], [field]: value };
      return { ...prev, shippingRates: newRates };
    });
  };

  // Submit Function using ApiClient
  //   const handleSubmit = async () => {
  //     setError(null);
  //     setSuccess(null);

  //     // Validation
  //     if (!formData.zoneName.trim()) {
  //       setError("Zone name is required");
  //       return;
  //     }
  //     if (!formData.country.trim()) {
  //       setError("Country is required");
  //       return;
  //     }
  //     if (formData.zipCodeRanges.length === 0) {
  //       setError("At least one zip code range is required");
  //       return;
  //     }
  //     if (formData.shippingRates.length === 0) {
  //       setError("At least one shipping rate is required");
  //       return;
  //     }

  //     setLoading(true);

  //     try {
  //       const response = await ApiClient.postJson<{
  //         status: number;
  //         message: string;
  //         data: {
  //           zone: any;
  //           rates: any[];
  //           totalRates: number;
  //         };
  //       }>("/vendor/shipping/zones-with-rates", formData);

  //       if (response.status === 200 || response.status === 201) {
  //         setSuccess(response.message || "Operation successful!");
  //       } else {
  //         setError(response.message || "Failed to create shipping zone");
  //       }

  //       // Reset form
  //       setFormData({
  //         zoneName: "",
  //         country: "US",
  //         state: "",
  //         zipCodeRanges: [{ from: "", to: "" }],
  //         isActive: true,
  //         description: "",
  //         shippingRates: [],
  //       });

  //       // Scroll to top to show success message
  //       window.scrollTo({ top: 0, behavior: "smooth" });
  //     } catch (e) {
  //       setError(
  //         e instanceof Error ? e.message : "Failed to create shipping zone"
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  // Submit Function using ApiClient
  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.zoneName.trim()) {
      setError("Zone name is required");
      return;
    }
    if (!formData.country.trim()) {
      setError("Country is required");
      return;
    }
    if (formData.zipCodeRanges.length === 0) {
      setError("At least one zip code range is required");
      return;
    }
    if (formData.shippingRates.length === 0) {
      setError("At least one shipping rate is required");
      return;
    }

    setLoading(true);

    // ✅ Define proper response type (no 'any')
    interface ZoneApiResponse {
      status: number;
      message: string;
      data: {
        zone: Record<string, unknown>;
        rates: Record<string, unknown>[];
        totalRates: number;
      };
    }

    try {
      const response = await ApiClient.postJson<ZoneApiResponse>(
        "/vendor/shipping/zones-with-rates",
        formData
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess(response.message || "Operation successful!");
      } else {
        setError(response.message || "Failed to create shipping zone");
      }

      // Reset form after success
      setFormData({
        zoneName: "",
        country: "US",
        state: "",
        zipCodeRanges: [{ from: "", to: "" }],
        isActive: true,
        description: "",
        shippingRates: [],
      });

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to create shipping zone"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
        {/* <h1 className="text-2xl font-bold text-center">Create Shipping Zone with Rates</h1> */}
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <AlertCircle
                className="text-red-600 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <CheckCircle2
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <p className="text-sm font-medium text-green-800">Success</p>
                <p className="text-sm text-green-600">{success}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Zone Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Zone Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Zone Name *
              </label>
              <Input
                placeholder="e.g., California Zone"
                value={formData.zoneName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, zoneName: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Country *
              </label>
              <Input
                placeholder="e.g., US"
                value={formData.country}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, country: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                State (Optional)
              </label>
              <Input
                placeholder="e.g., CA"
                value={formData.state}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, state: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Description (Optional)
              </label>
              <Input
                placeholder="Brief description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: Boolean(checked) }))
              }
            />
            <label className="text-sm font-medium">Zone is Active</label>
          </div>
        </CardContent>
      </Card>

      {/* Zip Code Ranges */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Zip Code Ranges</CardTitle>
            <Button size="sm" onClick={addZipCodeRange}>
              <Plus size={16} className="mr-1" />
              Add Range
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.zipCodeRanges.map((range, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="From (e.g., 90001)"
                value={range.from}
                onChange={(e) =>
                  updateZipCodeRange(index, "from", e.target.value)
                }
              />
              <Input
                placeholder="To (e.g., 96162)"
                value={range.to}
                onChange={(e) =>
                  updateZipCodeRange(index, "to", e.target.value)
                }
              />
              {formData.zipCodeRanges.length > 1 && (
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => removeZipCodeRange(index)}
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Shipping Rates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Shipping Rates</CardTitle>
            <Button size="sm" onClick={addShippingRate}>
              <Plus size={16} className="mr-1" />
              Add Rate
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.shippingRates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No shipping rates added yet.</p>
              <p className="text-sm">
                Click &apos;Add Rate&apos; to create your first shipping rate.
              </p>
            </div>
          )}
          {formData.shippingRates.map((rate, index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Rate #{index + 1}</h4>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeShippingRate(index)}
                  >
                    <Trash2 size={14} className="mr-1" />
                    Remove
                  </Button>
                </div>
                <Separator className="mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Carrier *
                    </label>
                    <Input
                      placeholder="e.g., FEDEX, UPS, USPS"
                      value={rate.carrier}
                      onChange={(e) =>
                        updateShippingRate(
                          index,
                          "carrier",
                          e.target.value.toUpperCase()
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Method *
                    </label>
                    <Input
                      placeholder="e.g., GROUND, EXPRESS"
                      value={rate.method}
                      onChange={(e) =>
                        updateShippingRate(
                          index,
                          "method",
                          e.target.value.toUpperCase()
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Rate Type *
                    </label>
                    <Select
                      value={rate.rateType}
                      onValueChange={(v) =>
                        updateShippingRate(
                          index,
                          "rateType",
                          v as ShippingRate["rateType"]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FLAT_RATE">Flat Rate</SelectItem>
                        <SelectItem value="WEIGHT_BASED">
                          Weight Based
                        </SelectItem>
                        <SelectItem value="PER_ITEM">Per Item</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Base Rate ($)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={rate.baseRate || ""}
                      onChange={(e) =>
                        updateShippingRate(
                          index,
                          "baseRate",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Per Kg Rate ($)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={rate.perKgRate || ""}
                      onChange={(e) =>
                        updateShippingRate(
                          index,
                          "perKgRate",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Per Item Rate ($)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={rate.perItemRate || ""}
                      onChange={(e) =>
                        updateShippingRate(
                          index,
                          "perItemRate",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Free Shipping Threshold ($)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={rate.freeShippingThreshold || ""}
                      onChange={(e) =>
                        updateShippingRate(
                          index,
                          "freeShippingThreshold",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Max Weight (kg)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={rate.maxWeight || ""}
                      onChange={(e) =>
                        updateShippingRate(
                          index,
                          "maxWeight",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Estimated Days
                    </label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={rate.estimatedDays || ""}
                      onChange={(e) =>
                        updateShippingRate(
                          index,
                          "estimatedDays",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-xs font-medium mb-1 block">
                    Description (Optional)
                  </label>
                  <Input
                    placeholder="Additional details about this rate"
                    value={rate.description}
                    onChange={(e) =>
                      updateShippingRate(index, "description", e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Checkbox
                    checked={rate.isActive}
                    onCheckedChange={(checked) =>
                      updateShippingRate(index, "isActive", Boolean(checked))
                    }
                  />
                  <label className="text-sm">Rate is Active</label>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              "Creating..."
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Create Shipping Zone with Rates
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
