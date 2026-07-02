"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield, ExternalLink } from "lucide-react";

const apiKeySchema = z.object({
  apiKey: z
    .string()
    .min(1, "API key is required")
    .refine((key) => {
      const trimmedKey = key.trim();

      // Check if it's a Gemini API key (starts with AIza and is around 39 characters)
      if (trimmedKey.startsWith("AIza")) {
        return (
          trimmedKey.length >= 35 &&
          trimmedKey.length <= 45 &&
          /^[A-Za-z0-9\-_]+$/.test(trimmedKey)
        );
      }

      // For other API keys, check general format
      return (
        trimmedKey.length >= 20 &&
        trimmedKey.length <= 100 &&
        /^[A-Za-z0-9\-_.]+$/.test(trimmedKey)
      );
    }, "Please enter a valid API key. Gemini keys start with 'AIza' and are typically 39 characters long."),
});

type ApiKeyForm = z.infer<typeof apiKeySchema>;

interface ApiKeySetupProps {
  onApiKeySubmit: (apiKey: string) => void;
  currentApiKey: string;
}

export function ApiKeySetup({
  onApiKeySubmit,
  currentApiKey,
}: ApiKeySetupProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<ApiKeyForm>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      apiKey: currentApiKey || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (isMounted && currentApiKey) {
      setValue("apiKey", currentApiKey);
      trigger("apiKey"); // Trigger validation after setting value
    }
  }, [isMounted, currentApiKey, setValue, trigger]);

  const apiKeyValue = watch("apiKey");
  // console.log("API key value:", apiKeyValue);

  const onSubmit = (data: ApiKeyForm) => {
    onApiKeySubmit(data.apiKey.trim());
  };

  const isValidFormat =
    isMounted && apiKeyValue && apiKeyValue.trim().length > 0 && !errors.apiKey;

  if (!isMounted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            Privacy Promise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your API key is stored locally in your browser and never sent to
              our servers. This is a temporary chat - no data is saved on our
              end. You have complete control over your privacy.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enter Your Gemini API Key</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Gemini API Key</Label>
              <div className="relative">
                {/* <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  placeholder="AIzaSyD... (39 characters)"
                  {...register("apiKey")}
                  className="pr-10"
                /> */}
                <input
                  {...register("apiKey")}
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  placeholder="AIzaSyD... (39 characters)"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.apiKey && (
                <p className="text-sm text-destructive">
                  {errors.apiKey.message}
                </p>
              )}
              {isValidFormat && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <span className="text-green-500">✓</span> API key format looks
                  good
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save API Key"}
            </Button>
          </form>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Don't have a Gemini API key?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Get your free API key from Google AI Studio. It's free to use with
              generous limits.
            </p>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Get API Key <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              API Key Format
            </h5>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Gemini API keys typically start with "AIza" and are 39 characters
              long. Other API key formats are also supported as long as they
              contain valid characters.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
