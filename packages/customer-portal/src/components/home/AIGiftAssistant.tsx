import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common/Button';

interface AIAssistantProps {
  onComplete?: (preferences: GiftPreferences) => void;
}

interface GiftPreferences {
  recipient: string;
  budget: string;
  occasion: string;
  deliveryDate: string;
}

type Step = 'closed' | 'recipient' | 'budget' | 'occasion' | 'date' | 'processing' | 'complete';

export const AIGiftAssistant: React.FC<AIAssistantProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('closed');
  const [preferences, setPreferences] = useState<GiftPreferences>({
    recipient: '',
    budget: '',
    occasion: '',
    deliveryDate: '',
  });

  const recipients = ['Girlfriend', 'Wife', 'Mother', 'Friend', 'Corporate Client', 'Sister', 'Colleague'];
  const budgets = ['₹500 - ₹1000', '₹1000 - ₹2000', '₹2000 - ₹5000', '₹5000+'];
  const occasions = ['Birthday', 'Anniversary', 'Festival', 'Thank You', 'Apology', 'Celebration'];

  const handleRecipientSelect = (recipient: string) => {
    setPreferences({ ...preferences, recipient });
    setStep('budget');
  };

  const handleBudgetSelect = (budget: string) => {
    setPreferences({ ...preferences, budget });
    setStep('occasion');
  };

  const handleOccasionSelect = (occasion: string) => {
    setPreferences({ ...preferences, occasion });
    setStep('date');
  };

  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({ ...preferences, deliveryDate: e.target.value });
  };

  const handleComplete = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('complete');
      if (onComplete) onComplete(preferences);
      setTimeout(() => setStep('closed'), 3000);
    }, 1500);
  };

  const steps_content = {
    recipient: {
      title: 'Who is the gift for?',
      options: recipients,
      selected: preferences.recipient,
      onSelect: handleRecipientSelect,
    },
    budget: {
      title: 'What\'s your budget?',
      options: budgets,
      selected: preferences.budget,
      onSelect: handleBudgetSelect,
    },
    occasion: {
      title: 'What\'s the occasion?',
      options: occasions,
      selected: preferences.occasion,
      onSelect: handleOccasionSelect,
    },
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setStep(step === 'closed' ? 'recipient' : 'closed')}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-accent-950 text-white shadow-2xl flex items-center justify-center hover:shadow-2xl transition-all duration-normal"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {step === 'closed' ? (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        ) : (
          <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </motion.button>

      {/* Modal Panel */}
      <AnimatePresence>
        {step !== 'closed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setStep('closed')}
          />
        )}

        {(step === 'recipient' || step === 'budget' || step === 'occasion' || step === 'date' || step === 'processing' || step === 'complete') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl p-6 max-w-sm md:max-w-md"
          >
            {/* Processing State */}
            {step === 'processing' && (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 rounded-full border-4 border-secondary-200 border-t-accent-950 mb-4"
                />
                <p className="text-secondary-600">Finding perfect matches...</p>
              </div>
            )}

            {/* Complete State */}
            {step === 'complete' && (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{ scale: [0, 1, 0.8, 1] }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl mb-4"
                >
                  🎁
                </motion.div>
                <p className="text-center text-secondary-900 font-semibold">Perfect! We found some amazing options for you.</p>
                <p className="text-center text-secondary-600 text-sm mt-2">Scroll down to see recommendations</p>
              </div>
            )}

            {/* Other Steps */}
            {(step === 'recipient' || step === 'budget' || step === 'occasion' || step === 'date') && (
              <>
                {/* Progress Bar */}
                <div className="flex gap-1 mb-6">
                  {['recipient', 'budget', 'occasion', 'date'].map((s, i) => (
                    <div
                      key={s}
                      className={`h-1 flex-1 rounded-full transition-all duration-normal ${
                        ['recipient', 'budget', 'occasion', 'date'].indexOf(step) >= i
                          ? 'bg-accent-950'
                          : 'bg-secondary-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Title */}
                {step === 'date' ? (
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-4">When do you need it?</h3>
                    <input
                      type="date"
                      value={preferences.deliveryDate}
                      onChange={handleDateSelect}
                      className="input mb-4"
                    />
                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setStep('occasion')}
                      >
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={handleComplete}
                        disabled={!preferences.deliveryDate}
                      >
                        Get Recommendations
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-heading font-semibold mb-4">
                      {steps_content[step]?.title}
                    </h3>

                    {/* Options Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {steps_content[step]?.options.map((option) => (
                        <motion.button
                          key={option}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => steps_content[step].onSelect(option)}
                          className={`px-4 py-3 rounded-xl font-medium transition-all duration-normal ${
                            steps_content[step].selected === option
                              ? 'bg-accent-950 text-white shadow-lg'
                              : 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200'
                          }`}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3">
                      {(step === 'budget' || step === 'occasion') && (
                        <Button
                          variant="secondary"
                          className="flex-1"
                          onClick={() => setStep(step === 'budget' ? 'recipient' : 'budget')}
                        >
                          Back
                        </Button>
                      )}
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={() =>
                          step === 'recipient'
                            ? handleRecipientSelect(preferences.recipient)
                            : step === 'budget'
                            ? handleBudgetSelect(preferences.budget)
                            : handleOccasionSelect(preferences.occasion)
                        }
                        disabled={!steps_content[step]?.selected}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
