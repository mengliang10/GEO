/* ─── GEO Score Calculator Engine v0.1.0 ────────────────────────────────── */
/* Implements γ(d) = α₁·ED(d) + α₂·SD(d) + α₃·FC(d) + α₄·TC(d) + α₅·FR(d)  */

(function() {
  'use strict';

  // ─── Weights (α) ────────────────────────────────────────────────────────
  // Current best-estimate from internal validation (N=1,200 documents, 5 engines)
  const WEIGHTS = {
    entityDensity: 0.25,
    structuredData: 0.20,
    factualConsistency: 0.20,
    topologicalCentrality: 0.20,
    freshness: 0.15
  };

  // ─── DOM References ─────────────────────────────────────────────────────
  const params = {
    entityDensity: document.getElementById('entityDensity'),
    structuredData: document.getElementById('structuredData'),
    factualConsistency: document.getElementById('factualConsistency'),
    topologicalCentrality: document.getElementById('topoCentrality'),
    freshness: document.getElementById('freshness')
  };

  const displays = {
    entityDensity: document.getElementById('entityDensityVal'),
    structuredData: document.getElementById('structuredDataVal'),
    factualConsistency: document.getElementById('factualConsistencyVal'),
    topologicalCentrality: document.getElementById('topoCentralityVal'),
    freshness: document.getElementById('freshnessVal')
  };

  const bars = {
    entityDensity: { bar: document.getElementById('edBar'), score: document.getElementById('edScore') },
    structuredData: { bar: document.getElementById('sdBar'), score: document.getElementById('sdScore') },
    factualConsistency: { bar: document.getElementById('fcBar'), score: document.getElementById('fcScore') },
    topologicalCentrality: { bar: document.getElementById('tcBar'), score: document.getElementById('tcScore') },
    freshness: { bar: document.getElementById('frBar'), score: document.getElementById('frScore') }
  };

  const scoreDisplay = document.getElementById('geoScoreDisplay');
  const scoreCircle = document.getElementById('scoreCircle');
  const geoBadge = document.getElementById('geoBadge');
  const citationProbDisplay = document.getElementById('citationProbDisplay');
  const citationMeter = document.getElementById('citationMeter');

  // ─── Constants ──────────────────────────────────────────────────────────
  const CIRCUMFERENCE = 2 * Math.PI * 85; // ~534

  // ─── Score Computation ──────────────────────────────────────────────────
  function computeGeoScore(values) {
    return (
      WEIGHTS.entityDensity * values.entityDensity +
      WEIGHTS.structuredData * values.structuredData +
      WEIGHTS.factualConsistency * values.factualConsistency +
      WEIGHTS.topologicalCentrality * values.topologicalCentrality +
      WEIGHTS.freshness * values.freshness
    );
  }

  function getValues() {
    return {
      entityDensity: parseFloat(params.entityDensity.value),
      structuredData: parseFloat(params.structuredData.value),
      factualConsistency: parseFloat(params.factualConsistency.value),
      topologicalCentrality: parseFloat(params.topologicalCentrality.value),
      freshness: parseFloat(params.freshness.value)
    };
  }

  // ─── Citation Probability Estimate ──────────────────────────────────────
  // Logistic function mapping GEO Score to citation probability
  // P(citation | γ) = 1 / (1 + e^(-10·(γ - 0.5)))
  function estimateCitationProbability(geoScore) {
    return 1 / (1 + Math.exp(-10 * (geoScore - 0.5)));
  }

  // ─── Label Generation ───────────────────────────────────────────────────
  function getGeoBadge(score) {
    if (score >= 0.80) return { text: 'EXCELLENT', class: 'excellent' };
    if (score >= 0.65) return { text: 'GOOD', class: 'good' };
    if (score >= 0.50) return { text: 'FAIR', class: 'fair' };
    return { text: 'NEEDS WORK', class: 'poor' };
  }

  function getCitationLabel(prob) {
    if (prob >= 0.80) return 'Very High';
    if (prob >= 0.65) return 'High';
    if (prob >= 0.50) return 'Moderate';
    if (prob >= 0.35) return 'Low';
    return 'Very Low';
  }

  // ─── Update Functions ───────────────────────────────────────────────────
  function updateScoreCircle(geoScore) {
    const offset = CIRCUMFERENCE * (1 - geoScore);
    scoreCircle.style.strokeDashoffset = offset;
  }

  function updateGaugeNumerical(geoScore) {
    scoreDisplay.textContent = geoScore.toFixed(2);
  }

  function updateBadge(geoScore) {
    const badge = getGeoBadge(geoScore);
    geoBadge.textContent = badge.text;
    geoBadge.className = 'geo-badge ' + badge.class;
  }

  function updateCitationMeter(prob) {
    const activeCount = Math.round(prob * 10);
    const segments = citationMeter.querySelectorAll('span');
    segments.forEach(function(seg, i) {
      seg.classList.toggle('active', i < activeCount);
    });
  }

  function updateCitationLabel(prob) {
    citationProbDisplay.textContent = getCitationLabel(prob) + ' (' + (prob * 100).toFixed(0) + '%)';
  }

  function updateDimensionBars(values) {
    var dims = [
      { key: 'entityDensity', color: 'linear-gradient(90deg, #00bcd4, #7c4dff)' },
      { key: 'structuredData', color: 'linear-gradient(90deg, #7c4dff, #00e676)' },
      { key: 'factualConsistency', color: 'linear-gradient(90deg, #00e676, #ffd740)' },
      { key: 'topologicalCentrality', color: 'linear-gradient(90deg, #ffd740, #ff5252)' },
      { key: 'freshness', color: 'linear-gradient(90deg, #00bcd4, #00e676)' }
    ];

    dims.forEach(function(dim) {
      var v = values[dim.key];
      var ref = bars[dim.key];
      if (ref && ref.bar) {
        ref.bar.style.width = (v * 100) + '%';
        ref.bar.style.background = dim.color;
      }
      if (ref && ref.score) {
        ref.score.textContent = v.toFixed(2);
      }
    });
  }

  function updateSliderDisplays(values) {
    Object.keys(displays).forEach(function(key) {
      if (displays[key]) {
        displays[key].textContent = values[key].toFixed(2);
      }
    });
  }

  // ─── Main Update ────────────────────────────────────────────────────────
  function updateAll() {
    var values = getValues();
    var geoScore = computeGeoScore(values);
    var citationProb = estimateCitationProbability(geoScore);

    // Update sliders display
    updateSliderDisplays(values);

    // Update dimension bars
    updateDimensionBars(values);

    // Update gauge
    updateScoreCircle(geoScore);
    updateGaugeNumerical(geoScore);
    updateBadge(geoScore);

    // Update citation probability
    updateCitationMeter(citationProb);
    updateCitationLabel(citationProb);
  }

  // ─── Bind Events ────────────────────────────────────────────────────────
  function init() {
    // Only initialize if the calculator exists on this page
    if (!params.entityDensity) return;

    Object.keys(params).forEach(function(key) {
      params[key].addEventListener('input', updateAll);
    });

    // Initial render
    updateAll();

    console.log('GEO Score Calculator v0.1.0 initialized');
  }

  // ─── Fire on DOM Ready ──────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
