"use client";

import { getPropertyUseCase } from "@/domain/di";
import { PropertyEntity } from "@/domain/entities";
import { useCallback, useState } from "react";

export interface SearchState {
  properties: PropertyEntity[];
  totalCount: number;
  fetchProperties: () => Promise<void>;
  setProperties: (properties: PropertyEntity[]) => void;
  setTotalCount: (totalCount: number) => void;
}

export function useSearch(): SearchState {
  const [properties, setProperties] = useState<PropertyEntity[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const propertyUseCase = getPropertyUseCase();

  const fetchProperties = useCallback(async () => {
    const properties = await propertyUseCase.getProperties();
    setProperties(properties);
    setTotalCount(properties.length);
  }, [propertyUseCase]);

  return {
    properties,
    totalCount,
    fetchProperties,
    setProperties,
    setTotalCount,
  };
}
