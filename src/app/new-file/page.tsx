"use client";

import React, { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Alert } from "@/components/ui-elements/alert";

export default function NewFilePage() {
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
                <h2 className="text-4xl font-bold text-dark">Upload New File</h2>

                <p className="text-lg text-gray-600">
                    You can upload a new file here. Once uploaded, it will be processed and made
                    available to the language model, allowing it to answer your questions based on
                    the file&#39;s content.
                </p>
            </div>

            <form onSubmit={handleSend} className="max-w-4xl mx-auto w-full space-y-6">
                <ShowcaseSection title="File upload" className="space-y-5.5 !p-6.5">
                    <InputGroup
                        type="file"
                        fileStyleVariant="style1"
                        label="Attach file"
                        placeholder="Attach file"
                        handleChange={handleFileChange}
                    />
                </ShowcaseSection>

                {showAlert && (
                    <div className="max-w-4xl mx-auto w-full">
                        <Alert
                            variant="success"
                            title="File Uploaded Successfully"
                            description={`"${file?.name}" has been received and will be processed shortly.`}
                        />
                    </div>
                )}

                {file && (
                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
                        >
                            Submit File
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
