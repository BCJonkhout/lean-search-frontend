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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        console.log("File submitted:", file.name);
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
            setFile(null);
        }, 5000);
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

                {file && (
                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
                        >
                            {t('newFile.submit')}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
