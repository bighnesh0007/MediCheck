import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Model {
  id: string
  name: string
  endpoint: string
}

interface ModelSelectorProps {
  models: Model[]
  selectedModel: string
  onModelSelect: (modelId: string) => void
}

export function ModelSelector({ models, selectedModel, onModelSelect }: ModelSelectorProps) {
  return (
    <Select value={selectedModel} onValueChange={onModelSelect}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}