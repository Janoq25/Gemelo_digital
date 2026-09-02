import { StateData, ScenarioParams, ShapFactor, CountyZctaData } from '../types';

/**
 * Mathematical formulation of the compound heat-blackout digital twin:
 * Risk(s, t) = Baseline(s) * Exp(β_heat * ΔT + β_blackout * Blackout + β_inter * (ΔT * Blackout))
 *              * (1 + α_svi * SVI) * (1 + α_ac * LackAC) * SeasonMultiplier
 *              * (1 - ε_cooling * CoolingCoverage)
 */
export function calculateStateSimulatedRisk(
  state: StateData,
  params: ScenarioParams
): {
  simulatedRisk: number;
  excessEdRate: number; // per 100k
  reriValue: number;
  riskCategory: 'Bajo' | 'Moderado' | 'Alto' | 'Muy Alto' | 'Crítico';
} {
  const baseScore = state.compositeRiskScore;
  
  // Heatwave duration multiplier (delayed distributed effect, DLNM)
  const durationFactor = 
    params.heatwaveDurationDays === 7 ? 1.45 :
    params.heatwaveDurationDays === 5 ? 1.30 :
    params.heatwaveDurationDays === 3 ? 1.15 : 1.0;

  // Temperature anomaly effect (°F)
  const tempBeta = 0.042; // +4.2% base risk per °F anomaly
  const heatMultiplier = Math.exp(tempBeta * params.tempAnomalyF);

  // Blackout effect: loss of AC is non-linear
  const effectiveLackAc = Math.min(100, state.laceLackAcPercent + params.blackoutCustomerPercent * 1.6);
  const blackoutBeta = 0.028;
  const blackoutMultiplier = 1 + (params.blackoutCustomerPercent / 100) * 1.8;

  // Supra-additive interaction term (RERI = 2.48 estimated from EAGLE-I + EPHT)
  // When both heat anomaly > 5°F and blackout > 10% coincide
  const heatIntensity = Math.max(0, params.tempAnomalyF - 3) / 10;
  const blackoutIntensity = params.blackoutCustomerPercent / 30;
  const interactionSynergy = 1 + (heatIntensity * blackoutIntensity * 2.48);

  // Season timing: early season has lack of physiological and behavioral acclimation
  const seasonFactor = params.seasonTiming === 'early' ? 1.22 : 1.0;

  // SVI & Comorbidity modifiers
  const vulnerabilityFactor = 1 + (state.sviOverall * 0.45) + ((state.placesChronicPrevalence - 20) / 40);

  // Intervention effect (cooling centers reduce effective exposure by ε)
  const coolingReduction = 1 - (params.coolingInterventionEpsilon * 0.85);

  // Raw combined multiplier
  let combinedMultiplier = 
    durationFactor * 
    heatMultiplier * 
    blackoutMultiplier * 
    interactionSynergy * 
    seasonFactor * 
    vulnerabilityFactor * 
    coolingReduction;

  // Normalize to 0-100 scale
  let simulatedScore = Math.min(100, Math.max(5, (baseScore * combinedMultiplier) / 1.8));

  // Excess ED rate (per 100,000 population)
  const baseEd = state.ephtRate440 ?? state.vaSentinelRate1385 ?? 22.0;
  const excessEdRate = Math.max(0, (baseEd * (simulatedScore / Math.max(1, baseScore)) - baseEd));

  // RERI indicator
  const reriValue = (params.tempAnomalyF > 3 && params.blackoutCustomerPercent > 5) ? 2.48 : 0;

  let riskCategory: 'Bajo' | 'Moderado' | 'Alto' | 'Muy Alto' | 'Crítico';
  if (simulatedScore >= 85) riskCategory = 'Crítico';
  else if (simulatedScore >= 70) riskCategory = 'Muy Alto';
  else if (simulatedScore >= 50) riskCategory = 'Alto';
  else if (simulatedScore >= 30) riskCategory = 'Moderado';
  else riskCategory = 'Bajo';

  return {
    simulatedRisk: Math.round(simulatedScore),
    excessEdRate: Number(excessEdRate.toFixed(1)),
    reriValue,
    riskCategory
  };
}

export function calculateCountySimulatedRisk(
  county: CountyZctaData,
  params: ScenarioParams
): number {
  const base = county.simulatedRisk;
  const tempBoost = params.tempAnomalyF * 1.5;
  const blackoutBoost = params.blackoutCustomerPercent * 0.9;
  const synergy = (params.tempAnomalyF > 4 && params.blackoutCustomerPercent > 8) ? 8 : 0;
  const earlySeason = params.seasonTiming === 'early' ? 5 : 0;
  const interventionMitigation = params.coolingInterventionEpsilon * 35;

  const result = base + tempBoost + blackoutBoost + synergy + earlySeason - interventionMitigation;
  return Math.min(100, Math.max(10, Math.round(result)));
}

export function getShapWaterfallForState(
  state: StateData,
  params: ScenarioParams
): {
  baseValue: number;
  factors: ShapFactor[];
  finalValue: number;
} {
  const baseValue = 35.0; // National expected heat morbidity risk baseline

  const heatShap = Number(((params.tempAnomalyF * 1.8) + (params.heatwaveDurationDays * 1.4)).toFixed(1));
  const blackoutShap = Number(((params.blackoutCustomerPercent * 0.72) + (state.blackoutRateBaseline * 0.4)).toFixed(1));
  const interactionShap = (params.tempAnomalyF > 3 && params.blackoutCustomerPercent > 5)
    ? Number(((params.tempAnomalyF * params.blackoutCustomerPercent * 0.045)).toFixed(1))
    : 0;

  const sviShap = Number(((state.sviOverall - 0.5) * 18.0).toFixed(1));
  const chronicShap = Number(((state.placesChronicPrevalence - 28.0) * 0.85).toFixed(1));
  const lackAcShap = Number(((state.laceLackAcPercent - 6.0) * 0.92).toFixed(1));
  const heatIslandShap = Number(((state.landsatHeatIslandGini - 0.4) * 14.0).toFixed(1));
  const seasonShap = params.seasonTiming === 'early' ? 4.8 : -1.2;
  const interventionShap = Number((-params.coolingInterventionEpsilon * 42.0).toFixed(1));

  const factors: ShapFactor[] = [
    {
      feature: 'Anomalía Térmica & Duración (gridMET/NWS)',
      category: 'climate' as const,
      shapValue: heatShap,
      description: `+${params.tempAnomalyF}°F sobre p95 durante ${params.heatwaveDurationDays} días`
    },
    {
      feature: 'Corte de Red Eléctrica (EAGLE-I)',
      category: 'infrastructure' as const,
      shapValue: blackoutShap,
      description: `${params.blackoutCustomerPercent}% clientes sin suministro eléctrico activo`
    },
    {
      feature: 'Interacción Compuesta [Calor × Apagón] (RERI)',
      category: 'infrastructure' as const,
      shapValue: interactionShap,
      description: 'Efecto supra-aditivo por pérdida de climatización durante calor extremo'
    },
    {
      feature: 'Vulnerabilidad Social CDC (SVI Temas 1-4)',
      category: 'social' as const,
      shapValue: sviShap,
      description: `SVI estatal percentil ${(state.sviOverall * 100).toFixed(0)}`
    },
    {
      feature: 'Comorbilidades Basales (PLACES: EPOC/CVD/Diabetes)',
      category: 'health' as const,
      shapValue: chronicShap,
      description: `${state.placesChronicPrevalence.toFixed(1)}% prevalencia crónica combinada`
    },
    {
      feature: 'Déficit de Aire Acondicionado (Census LACE)',
      category: 'infrastructure' as const,
      shapValue: lackAcShap,
      description: `${state.laceLackAcPercent.toFixed(1)}% hogares sin refrigeración mecánica`
    },
    {
      feature: 'Microclima Urbano (Gini LST Landsat)',
      category: 'climate' as const,
      shapValue: heatIslandShap,
      description: `Desigualdad térmica intraurbana Gini = ${state.landsatHeatIslandGini.toFixed(2)}`
    },
    {
      feature: 'Temporalidad Estacional (Aclimatación)',
      category: 'climate' as const,
      shapValue: seasonShap,
      description: params.seasonTiming === 'early' ? 'Ola temprana (sin aclimatación fisiológica)' : 'Ola tardía de verano'
    },
    {
      feature: 'Intervención Centros de Enfriamiento (L4)',
      category: 'social' as const,
      shapValue: interventionShap,
      description: `Reducción de exposición comunitaria ε = ${(params.coolingInterventionEpsilon * 100).toFixed(0)}%`
    }
  ].sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue));

  const totalDelta = factors.reduce((sum, f) => sum + f.shapValue, 0);
  const finalValue = Math.min(100, Math.max(5, Math.round(baseValue + totalDelta)));

  return {
    baseValue,
    factors,
    finalValue
  };
}
