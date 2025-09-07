import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, Search, Loader2, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useApiKeys } from '@/hooks/useApiKeys';

const styleOptions = [
  'None',
  'Minimalist',
  'Scandinavian',
  'Industrial',
  'Mid-Century Modern',
  'Bohemian',
  'Art Deco',
  'Coastal',
  'Farmhouse',
  'Contemporary',
  'Traditional',
  'Modern',
  'Rustic',
  'Eclectic',
];

const topStyles = ['Modern', 'Minimalist', 'Scandinavian', 'Industrial', 'Contemporary', 'Traditional'];

interface GenerationHistory {
  id: string;
  timestamp: string;
  currentImage: string;
  styleImage?: string;
  selectedStyle: string;
  customInstructions: string;
  resultImage: string;
}

export function StylizePage() {
  const { user } = useAuth();
  const { apiKeys, getActiveApiKey } = useApiKeys();
  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set([1]));
  const [hasApiKey, setHasApiKey] = useState(false);
  const [history, setHistory] = useState<GenerationHistory[]>([]);

  // Step 1: Base Images
  const [uploadMode, setUploadMode] = useState<'single' | 'dual'>('single');
  const [currentRoomImage, setCurrentRoomImage] = useState<string | null>(null);
  const [styleReferenceImage, setStyleReferenceImage] = useState<string | null>(null);

  // Step 2: Style & Notes
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [styleSearch, setStyleSearch] = useState('');
  const [templateChoice, setTemplateChoice] = useState<'single' | 'multiple' | ''>('');
  const [templateGlowOn, setTemplateGlowOn] = useState(true);

  // Step 3: Results
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Wizard navigation
  const openOnly = (step: number) => setOpenSteps(new Set([step]));
  const goTo = (step: number) => setOpenSteps(new Set([step]));

  // Get current step
  const getCurrentStep = () => {
    if (openSteps.has(3)) return 3;
    if (openSteps.has(2)) return 2;
    return 1;
  };

  // Progress timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating && !generatedImage) {
      setLoadingProgress(0);
      interval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 100 / 60, 100));
      }, 1000);
    } else if (!isGenerating) {
      setLoadingProgress(0);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isGenerating, generatedImage]);

  useEffect(() => {
    if (generatedImage && isGenerating) setLoadingProgress(100);
  }, [generatedImage, isGenerating]);

  const filteredStyles = styleOptions.filter(style =>
    style.toLowerCase().includes(styleSearch.toLowerCase())
  );

  useEffect(() => {
    const hasActiveKey = apiKeys.some(key => key.isActive && key.keyType === 'openai');
    setHasApiKey(hasActiveKey);
  }, [apiKeys]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'current' | 'style') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'current') {
          setCurrentRoomImage(result);
          // Auto-advance to step 2 only when all required images are uploaded
          if (uploadMode === 'single') {
            setTimeout(() => goTo(2), 300);
          } else if (uploadMode === 'dual' && styleReferenceImage) {
            setTimeout(() => goTo(2), 300);
          }
        } else {
          setStyleReferenceImage(result);
          // Auto-advance to step 2 if current room image is already uploaded in dual mode
          if (uploadMode === 'dual' && currentRoomImage) {
            setTimeout(() => goTo(2), 300);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const canProceedToStep2 = () => {
    if (uploadMode === 'single') return currentRoomImage !== null;
    return currentRoomImage !== null && styleReferenceImage !== null;
  };

  const canProceedToStep3 = () => {
    return (uploadMode === 'single' ? selectedStyle !== '' : true) || customInstructions.trim() !== '';
  };

  const dataUrlToFile = (dataUrl: string, filename: string) => {
    const [header, base64] = dataUrl.split(',');
    const mime = (header.match(/data:(.*);base64/) || [])[1] || 'image/png';
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new File([bytes], filename, { type: mime });
  };
  
  const templateTextMap: Record<'single' | 'multiple', string> = {
    single:
      'Change one item: Replace the [sofa / table / lighting] to match the style photo. Keep walls, windows, layout, and lighting the same.',
    multiple:
      'Change a few items: Update [sofa, rug, curtains] to match the style photo. Keep the room architecture, camera angle, and proportions.',
  };

  const handleTemplateChange = (v: 'single' | 'multiple') => {
    setTemplateChoice(v);
    setTemplateGlowOn(false);
    setCustomInstructions(prev => {
      const wasTemplate = Object.values(templateTextMap).some(t => prev.trim() === t);
      if (!prev.trim() || wasTemplate) return templateTextMap[v];
      return `${prev.trim()}\n${templateTextMap[v]}`;
    });
    setTimeout(() => {
      (document.querySelector('textarea[data-notes="true"]') as HTMLTextAreaElement)?.focus();
    }, 10);
  };

  const handleGenerate = async () => {
    console.log('🚀 Starting handleGenerate function');
    console.log('📊 Current state:', {
      hasApiKey,
      currentRoomImage: !!currentRoomImage,
      uploadMode,
      selectedStyle,
      customInstructions: customInstructions.trim(),
      styleReferenceImage: !!styleReferenceImage
    });

    if (!hasApiKey) {
      console.error('❌ No API key available');
      toast.error('Please add an OpenAI API key in Settings to use this feature');
      return;
    }
    if (!currentRoomImage) {
      console.error('❌ No room image available');
      toast.error('Please upload your room photo');
      return;
    }

    setIsGenerating(true);
    goTo(3);
    console.log('✅ Starting generation process');

    try {
      const apiKey = await getActiveApiKey('openai');
      console.log('🔑 API Key retrieved:', apiKey ? 'Found' : 'Not found');
      if (!apiKey) throw new Error('OpenAI API key not found');

      let prompt = '';
      if (uploadMode === 'dual' && styleReferenceImage) {
        prompt =
          `Use the FIRST image as the base photo. Copy furniture/finishes from the SECOND image while keeping the room architecture, camera angle, walls, floor, windows, lighting, and proportions. ` +
          (customInstructions?.trim() ? `Notes: ${customInstructions.trim()}` : '');
      } else {
        const styleText = selectedStyle && selectedStyle !== 'None' ? `${selectedStyle} style` : '';
        const custom = customInstructions.trim();
        const combined = [styleText, custom].filter(Boolean).join(' with ');
        prompt =
          `Restyle the base photo to ${combined || 'the chosen style'}. Keep layout/geometry, preserve windows, doors, floor, and lighting. Avoid adding extra furniture unless necessary.`;
      }
      console.log('📝 Generated prompt:', prompt);

      const form = new FormData();
      form.append('model', 'gpt-image-1');
      form.append('prompt', prompt);
      if (uploadMode === 'dual' && styleReferenceImage) {
        console.log('🖼️ Adding style reference image');
        form.append('image[]', dataUrlToFile(styleReferenceImage, 'reference.png'));
      }
      console.log('🖼️ Adding current room image');
      form.append('image[]', dataUrlToFile(currentRoomImage, 'base.png'));
      form.append('size', '1536x1024');
      form.append('n', '1');
      form.append('quality', 'medium');

      // Log FormData contents
      console.log('📦 FormData contents:');
      for (let [key, value] of form.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File (${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      console.log('🌐 Making API call to OpenAI...');
      const imageRes = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
      });

      console.log('📡 API Response:', {
        status: imageRes.status,
        statusText: imageRes.statusText,
        ok: imageRes.ok
      });

      if (!imageRes.ok) {
        const errText = await imageRes.text();
        console.error('❌ API Error Response:', errText);
        throw new Error(`Images Edits error ${imageRes.status}: ${errText}`);
      }

      const imageJson = await imageRes.json();
      console.log('📋 API Response JSON:', imageJson);
      const b64 = imageJson?.data?.[0]?.b64_json;
      if (!b64) throw new Error('No image returned');

      const generatedImageUrl = `data:image/png;base64,${b64}`;
      console.log('🎨 Generated image URL length:', generatedImageUrl.length);
      setGeneratedImage(generatedImageUrl);

      const newHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        currentImage: currentRoomImage!,
        styleImage: uploadMode === 'dual' ? styleReferenceImage! : undefined,
        selectedStyle,
        customInstructions,
        resultImage: generatedImageUrl,
      };
      setHistory(prev => [newHistoryItem, ...prev]);
      console.log('✅ Generation completed successfully');
      toast.success('Image generated successfully!');
    } catch (err: any) {
      console.error('💥 Generation failed:', err);
      console.error('💥 Full error object:', JSON.stringify(err, null, 2));
      toast.error(err?.message || 'Failed to generate image');
    } finally {
      console.log('🏁 Generation process finished');
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    openOnly(1);
    setCurrentRoomImage(null);
    setStyleReferenceImage(null);
    setSelectedStyle('');
    setCustomInstructions('');
    setGeneratedImage(null);
    setUploadMode('single');
    setTemplateChoice('');
    setTemplateGlowOn(true);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    try {
      const [header, base64] = generatedImage.split(',');
      const mime = header.match(/data:(.*);base64/)?.[1] || 'image/png';
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `roomify-styled-room-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download image');
    }
  };

  // Step 3 Navigation
  const canStartOver = generatedImage || !isGenerating;

  return (
    <div className="min-h-screen bg-background py-8 pb-24">
      <div className="container max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Stylize</h1>
          <p className="text-muted-foreground">
            Turn your room photo into a new look.
          </p>
        </div>

        {/* API Key Warning */}
        {user && !hasApiKey && (
          <Alert className="mb-6">
            <AlertDescription>
              To use AI features, please add your OpenAI API key in{' '}
              <a href="/settings" className="underline hover:text-primary">
                Settings
              </a>
              . Your keys are encrypted and stored securely.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Upload Your Room */}
            <AnimatePresence>
              {openSteps.has(1) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Step 1. Upload your room</h2>
                      </div>
                      <p className="text-muted-foreground mb-6">Add one photo of your room.</p>

                      {/* Segmented Control */}
                      <div className="mb-6">
                        <div className="inline-flex rounded-xl bg-muted p-1">
                          <Button
                            type="button"
                            variant={uploadMode === 'single' ? 'default' : 'ghost'}
                            className="h-9 px-3 rounded-lg"
                            onClick={() => setUploadMode('single')}
                          >
                            Gallery
                          </Button>
                          <Button
                            type="button"
                            variant={uploadMode === 'dual' ? 'default' : 'ghost'}
                            className="h-9 px-3 rounded-lg"
                            onClick={() => setUploadMode('dual')}
                          >
                            Upload inspiration
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Choose where the style comes from.
                        </p>
                      </div>

                      {/* Current Room Image Upload */}
                      <div className="rounded-xl bg-muted/40 border border-border/50 p-6 mb-4">
                        {currentRoomImage ? (
                          <div className="space-y-3">
                            <img
                              src={currentRoomImage}
                              alt="Current room"
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            <div className="flex gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'current')}
                                className="hidden"
                                id="current-room-upload"
                              />
                              <Button asChild variant="outline" size="sm">
                                <label htmlFor="current-room-upload" className="cursor-pointer">
                                  Replace photo
                                </label>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="mb-4 text-muted-foreground">Upload your room photo</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'current')}
                              className="hidden"
                              id="current-room-upload-new"
                            />
                            <Button asChild variant="outline">
                              <label htmlFor="current-room-upload-new" className="cursor-pointer">
                                <Upload className="h-4 w-4 mr-2" />
                                Browse…
                              </label>
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Style Reference Image Upload (only in dual mode) */}
                      {uploadMode === 'dual' && (
                        <div className="rounded-xl bg-muted/40 border border-border/50 p-6">
                          {styleReferenceImage ? (
                            <div className="space-y-3">
                              <img
                                src={styleReferenceImage}
                                alt="Style reference"
                                className="w-full h-40 object-cover rounded-lg"
                              />
                              <div className="flex gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, 'style')}
                                  className="hidden"
                                  id="style-ref-upload"
                                />
                                <Button asChild variant="outline" size="sm">
                                  <label htmlFor="style-ref-upload" className="cursor-pointer">
                                    Replace photo
                                  </label>
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <p className="mb-4 text-muted-foreground">Upload style photo (your inspiration)</p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'style')}
                                className="hidden"
                                id="style-ref-upload-new"
                              />
                              <Button asChild variant="outline">
                                <label htmlFor="style-ref-upload-new" className="cursor-pointer">
                                  <Upload className="h-4 w-4 mr-2" />
                                  Browse…
                                </label>
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step 1 Navigation */}
                      <div className="flex justify-between pt-6">
                        <div></div> {/* Spacer for alignment */}
                        {canProceedToStep2() ? (
                          <Button onClick={() => goTo(2)} className="h-11 px-8">
                            Continue to Style & Notes
                          </Button>
                        ) : (
                          <Button disabled className="h-11 px-8">
                            {uploadMode === 'dual' ? 'Upload both images to continue' : 'Upload room photo to continue'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 2: Style & Notes */}
            <AnimatePresence>
              {openSteps.has(2) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Step 2. Style & notes</h2>
                      </div>
                      <p className="text-muted-foreground mb-6">Pick a style or add a short note.</p>

                      {/* Style Selection (only for single mode) */}
                      {uploadMode === 'single' && (
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {topStyles.map(s => (
                              <Button
                                key={s}
                                size="sm"
                                variant={selectedStyle === s ? 'default' : 'outline'}
                                className="rounded-full h-8"
                                onClick={() => setSelectedStyle(s)}
                              >
                                {s}
                              </Button>
                            ))}

                            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                              <SelectTrigger className="h-8 rounded-full px-3 text-xs w-auto">
                                <SelectValue placeholder="More styles…" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="p-2">
                                  <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      placeholder="Search…"
                                      value={styleSearch}
                                      onChange={(e) => setStyleSearch(e.target.value)}
                                      className="pl-8"
                                    />
                                  </div>
                                </div>
                                {filteredStyles.map((style) => (
                                  <SelectItem key={style} value={style}>
                                    {style}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <p className="text-xs text-muted-foreground">Pick one style or write notes below.</p>
                        </div>
                      )}

                      {/* Notes */}
                      <div className="space-y-3">
                        <Textarea
                          data-notes="true"
                          placeholder="Keep floor • Brighter lighting • Swap sofa"
                          value={customInstructions}
                          onChange={(e) => setCustomInstructions(e.target.value)}
                          rows={3}
                          onFocus={() => setTemplateGlowOn(false)}
                          className="resize-none"
                        />
                        
                        {/* Template picker for dual mode */}
                        {uploadMode === 'dual' && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Quick template:</span>
                            <div className="relative inline-block">
                              {templateGlowOn && !templateChoice && (
                                <div
                                  aria-hidden
                                  className="
                                    pointer-events-none absolute -inset-1 rounded-lg z-0
                                    bg-blue-500 opacity-90 blur-2xl
                                    [mask-image:radial-gradient(120%_120%_at_50%_50%,white,transparent)]
                                    animate-pulse
                                  "
                                />
                              )}
                              <Select
                                value={templateChoice}
                                onValueChange={(v) => handleTemplateChange(v as 'single' | 'multiple')}
                              >
                                <SelectTrigger className="relative z-10 h-7 w-52 text-xs">
                                  <SelectValue placeholder="Choose a template…" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="single">Change one item</SelectItem>
                                  <SelectItem value="multiple">Change a few items</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground">Short notes work best.</p>
                      </div>

                      {/* Step 2 Navigation */}
                      <div className="flex justify-between pt-4">
                        <Button variant="ghost" onClick={() => goTo(1)}>
                          Back to Upload
                        </Button>
                        {canProceedToStep3() ? (
                          <Button onClick={() => goTo(3)} className="h-11 px-8">
                            Generate My Room
                          </Button>
                        ) : (
                          <Button disabled className="h-11 px-8">
                            {uploadMode === 'single' ? 'Pick a style or add notes' : 'Add notes to continue'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Results */}
            <AnimatePresence>
              {openSteps.has(3) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Step 3. See results</h2>
                      </div>
                      <p className="text-muted-foreground mb-6">Your new room will appear here in about a minute.</p>

                      {isGenerating ? (
                        <div className="space-y-4">
                          <div className="aspect-square relative rounded-lg overflow-hidden bg-muted/20">
                            {currentRoomImage && (
                              <img
                                src={currentRoomImage}
                                alt="Base room being processed"
                                className="w-full h-full object-cover filter blur-sm"
                              />
                            )}
                            <div className="absolute inset-0 bg-background/20 flex items-center justify-center">
                              <div className="text-center">
                                <div className="relative w-24 h-24 mb-4">
                                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted-foreground/20" />
                                    <circle
                                      cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent"
                                      strokeDasharray={`${2 * Math.PI * 45}`}
                                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - loadingProgress / 100)}`}
                                      className="text-primary transition-all duration-300 ease-out"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-foreground bg-background/80 rounded-full w-16 h-16 flex items-center justify-center">
                                      {Math.round(loadingProgress)}%
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-foreground font-medium bg-background/80 px-3 py-1 rounded-full">
                                  {loadingProgress >= 100 ? 'Finalizing…' : 'Generating your styled image…'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : generatedImage ? (
                        <div className="space-y-4">
                          <img src={generatedImage} alt="Generated styled room" className="w-full rounded-lg" />
                          <Button variant="outline" className="w-full" onClick={handleDownload}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Image
                          </Button>
                          <div className="flex justify-between pt-2">
                            <Button variant="ghost" onClick={() => goTo(2)}>
                              Back to Style
                            </Button>
                            {canStartOver && (
                              <Button variant="outline" onClick={resetForm}>
                                Start Over
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Complete the previous steps to generate your new room.
                          <div className="flex justify-center pt-4">
                            <Button variant="ghost" onClick={() => goTo(2)}>
                              Back to Style
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-5">
                <h3 className="text-base font-semibold mb-3">My Designs</h3>
                <div className="space-y-3">
                  {history.slice(0, 5).map((item) => (
                    <div key={item.id} className="border rounded-lg p-2 cursor-pointer hover:bg-muted/50">
                      <img
                        src={item.resultImage}
                        alt="Previous result"
                        className="w-full h-16 object-cover rounded mb-2"
                      />
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-sm font-medium">{item.selectedStyle || 'Custom Style'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sticky CTA */}
        {getCurrentStep() === 2 && canProceedToStep3() && (
          <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center">
            <div className="w-[min(92vw,520px)] rounded-xl bg-background/80 backdrop-blur border shadow-lg p-2">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={!hasApiKey || isGenerating}
                  className="flex-1 h-11"
                >
                  {isGenerating ? 'Generating…' : 'Generate My New Room'}
                </Button>
                <Button
                  variant="ghost"
                  className="h-11 text-muted-foreground"
                  onClick={() => goTo(1)}
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}