"use client";

import React, { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Alert } from "@/components/ui-elements/alert";
import {useLanguage} from "@/contexts/LanguageContext";

export default function NewFilePage() {
    const { t } = useLanguage();

    const [file, setFile] = useState<File | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorAlert, setErrorAlert] = useState<{title: string, description: string} | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);

        try {
            const { documentService } = await import('@/services');
            
            const response = await documentService.uploadDocument({
                file,
                title: file.name.split('.').slice(0, -1).join('.'), // Remove extension for title
                is_global: false,
            });

            if (response.success) {
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                    setFile(null);
                    setLoading(false);
                }, 3000);
            }
        } catch (error: any) {
            setLoading(false);
            console.error('Upload error:', error);
            setErrorAlert({title: 'Upload Failed', description: error.message || 'Upload failed. Please try again.'});
        }
    };

    return (
        <div className="flex flex-col px-4 py-10 space-y-12">
            <div className="max-w-4xl mx-auto space-y-6 text-center">
                <h2 className="text-4xl font-bold text-dark">{t('newFile.title')}</h2>

                <p className="text-lg text-gray-600">
                    {t('newFile.text')}
                </p>
            </div>

            <form onSubmit={handleSend} className="max-w-4xl mx-auto w-full space-y-6">
                <ShowcaseSection title={t('newFile.fileUpload')} className="space-y-5.5 !p-6.5">
                    <InputGroup
                        type="file"
                        fileStyleVariant="style1"
                        label={t('newFile.attachFile')}
                        placeholder={t('newFile.attachFile')}
                        handleChange={handleFileChange}
                    />
                </ShowcaseSection>

                {showAlert && (
                    <div className="max-w-4xl mx-auto w-full">
                        <Alert
                            variant="success"
                            title={t('newFile.success')}
                            description={`"${file?.name}" ${t('newFile.received')}`}
                        />
                    </div>
                )}
                
                {errorAlert && (
                    <div className="max-w-4xl mx-auto w-full">
                        <Alert
                            variant="error"
                            title={errorAlert.title}
                            description={errorAlert.description}
                        />
                    </div>
                )}

                {file && (
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {t('newFile.submit')}
                            {loading && (
                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                            )}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
