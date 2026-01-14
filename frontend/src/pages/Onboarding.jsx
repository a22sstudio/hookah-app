import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Splash, Feature } from '../components/onboarding';

const steps = [
  { type: 'splash' },
  {
    type: 'feature',
    title: 'Создавай уникальные миксы',
    subtitle: 'Комбинируй вкусы от лучших брендов и делись с друзьями',
    mockupType: 'mix-builder',
  },
  {
    type: 'feature',
    title: '15+ вкусов, 3 бренда',
    subtitle: 'Darkside, Tangiers, Fumari и другие премиум табаки',
    mockupType: 'brands',
  },
  {
    type: 'feature',
    title: 'Заказывай на столик',
    subtitle: 'Один клик — и твой микс уже готовят',
    mockupType: 'order',
  },
  {
    type: 'feature',
    title: 'Оценивай и сохраняй',
    subtitle: 'Лайкай миксы, следи за рейтингом и историей заказов',
    mockupType: 'social',
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleContinue = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save that user completed onboarding
      localStorage.setItem('onboarding_complete', 'true');
      navigate('/');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_complete', 'true');
    navigate('/');
  };

  const step = steps[currentStep];
  const featureSteps = steps.filter(s => s.type === 'feature');
  const currentFeatureIndex = steps.slice(0, currentStep + 1).filter(s => s.type === 'feature').length - 1;

  if (step.type === 'splash') {
    return <Splash onComplete={handleContinue} />;
  }

  return (
    <Feature
      title={step.title}
      subtitle={step.subtitle}
      mockupType={step.mockupType}
      currentStep={currentFeatureIndex}
      totalSteps={featureSteps.length}
      onContinue={handleContinue}
      onSkip={handleSkip}
    />
  );
}
