"use client";

import { useState, useEffect } from "react";
import {
  EmailIcon,
  PencilSquareIcon,
  UserIcon,
} from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert } from "@/components/ui-elements/alert";

export function PersonalInfoForm() {
  const { t } = useLanguage();
  
  const [userData, setUserData] = useState({
    first_name: '',
    surname: '',
    email: '',
    organisation: '',
    bio: '',
    system_prompt: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{variant: 'error' | 'success' | 'warning', title: string, description: string} | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const { authService } = await import('@/services');
      const response = await authService.getProfile();
      
      if (response.success && response.data) {
        const user = response.data.user;
        setUserData({
          first_name: user.first_name || '',
          surname: user.surname || '',
          email: user.email || '',
          organisation: user.organisation || '',
          bio: user.bio || '',
          system_prompt: user.system_prompt || '',
        });
      }
    } catch (error: any) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { authService } = await import('@/services');
      const response = await authService.updateProfile(userData);
      
      if (response.success) {
        setAlert({variant: 'success', title: t('settings.profileUpdated'), description: ''});
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setAlert({variant: 'error', title: error.message || t('settings.profileUpdateFailed'), description: ''});
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ShowcaseSection title={t('common.personalInfo')} className="!p-7">
        <div className="flex items-center justify-center py-8">
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
        </div>
      </ShowcaseSection>
    );
  }
  
  return (
    <>
      {alert && (
        <div className="mb-6">
          <Alert
            variant={alert.variant}
            title={alert.title}
            description={alert.description}
          />
        </div>
      )}
      <ShowcaseSection title={t('common.personalInfo')} className="!p-7">
      <form onSubmit={handleSubmit}>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="first_name"
            label={t('settings.firstName')}
            placeholder="John"
            value={userData.first_name}
            handleChange={(e) => handleInputChange('first_name', e.target.value)}
            icon={<UserIcon />}
            iconPosition="left"
            height="sm"
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="surname"
            label={t('settings.lastName')}
            placeholder="Doe"
            value={userData.surname}
            handleChange={(e) => handleInputChange('surname', e.target.value)}
            icon={<UserIcon />}
            iconPosition="left"
            height="sm"
          />
        </div>

        <InputGroup
          className="mb-5.5"
          type="email"
          name="email"
          label={t('auth.email')}
          placeholder="john@example.com"
          value={userData.email}
          handleChange={(e) => handleInputChange('email', e.target.value)}
          icon={<EmailIcon />}
          iconPosition="left"
          height="sm"
        />

        <InputGroup
          className="mb-5.5"
          type="text"
          name="organisation"
          label={t('settings.organisation')}
          placeholder="Your Company"
          value={userData.organisation}
          handleChange={(e) => handleInputChange('organisation', e.target.value)}
          icon={<UserIcon />}
          iconPosition="left"
          height="sm"
        />

        <TextAreaGroup
          className="mb-5.5"
          label={t('settings.bio')}
          name="bio"
          placeholder="Tell us about yourself"
          icon={<PencilSquareIcon />}
          value={userData.bio}
          handleChange={(e:any) => handleInputChange('bio', e.target.value)}
        />

        <TextAreaGroup
          className="mb-5.5"
          label={t('settings.systemPrompt')}
          name="system_prompt"
          placeholder="Customize how the AI assistant should behave (optional)"
          icon={<PencilSquareIcon />}
          value={userData.system_prompt}
          handleChange={(e) => handleInputChange('system_prompt', e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
            type="button"
            onClick={loadUserProfile}
            disabled={saving}
          >
            {t('settings.reset')}
          </button>

          <button
            className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
            type="submit"
            disabled={saving}
          >
            {t('settings.save')}
            {saving && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
            )}
          </button>
        </div>
      </form>
      </ShowcaseSection>
    </>
  );
}
