"use client";

import React, { useState } from 'react';
import Model, { IMuscleStats, IExerciseData, Muscle } from 'react-body-highlighter';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface BodyPartSelectorProps {
  onSelectBodyPart: (bodyParts: string[]) => void;
}

const BodyPartSelector = ({ onSelectBodyPart }: BodyPartSelectorProps) => {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [data, setData] = useState<IExerciseData[]>([]);

  const handleBodyPartClick = (exercise: IMuscleStats) => {
    const muscle = exercise.muscle;
    if (muscle) {
      const isPartSelected = selectedParts.includes(muscle);
      
      let newSelectedParts: string[];
      if (isPartSelected) {
        newSelectedParts = selectedParts.filter(part => part !== muscle);
      } else {
        newSelectedParts = [...selectedParts, muscle];
      }
      
      const newData: IExerciseData[] = newSelectedParts.map(part => ({
        name: part,
        muscles: [part as Muscle]
      }));
      
      setData(newData);
      setSelectedParts(newSelectedParts);
      onSelectBodyPart(newSelectedParts);
    }
  };

  const removeBodyPart = (partToRemove: string) => {
    const newSelectedParts = selectedParts.filter(part => part !== partToRemove);
    const newData: IExerciseData[] = newSelectedParts.map(part => ({
      name: part,
      muscles: [part as Muscle]
    }));
    
    setData(newData);
    setSelectedParts(newSelectedParts);
    onSelectBodyPart(newSelectedParts);
  };

  const formatBodyPart = (part: string) => {
    return part
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border-0">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="relative flex flex-col items-center">
            <div className="w-full max-w-[12rem] transform hover:scale-105 transition-transform duration-300">
              <Model
                onClick={handleBodyPartClick}
                data={data}
                style={{ width: '100%', height: 'auto' }}
                highlightedColors={['#3b82f6']}
                bodyColor="#e2e8f0"
              />
            </div>
            
            {selectedParts.length > 0 && (
              <div className="mt-4 w-full">
                <h3 className="text-center mb-2 text-gray-700 text-sm font-medium">Selected Body Parts:</h3>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {selectedParts.map((part, index) => (
                    <div
                      key={index}
                      className="flex items-center px-3 py-1 bg-blue-50 rounded-full border border-blue-200"
                    >
                      <span className="text-blue-800 text-sm font-medium">
                        {formatBodyPart(part)}
                      </span>
                      <button
                        onClick={() => removeBodyPart(part)}
                        className="ml-1.5 text-blue-400 hover:text-blue-600 focus:outline-none"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center text-gray-500 text-xs">
            Click on body parts to select/deselect them
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BodyPartSelector;